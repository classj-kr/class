// 중학교 2학년 1학기 4단원 연립일차방정식 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 8-1-4a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 미지수가 2개인 일차방정식이 되는 조건을 적힌 그대로의 계수에서 읽는다(ax + 2y = 4x − 1 에서 a ≠ 0). 모든 항을 좌변으로 옮겨 정리한 뒤의 계수를 보아야 한다.
//  - 기약분수로 나타낸 값이 3/7 이면 처음 분수의 분자가 3, 분모가 7이라고 여긴다. 알 수 있는 것은 분자와 분모의 비뿐이다.
//  - 걸린 시간을 걷고 달린 시간으로만 센다. 도중에 쉰 시간도 「집을 떠나 도착할 때까지」의 시간에 들어 있다.
//  - 「마지막 의자에 s명이 앉고 빈 의자가 e개 남는다」를 「b명씩 앉으면 모자란다」로 옮겨 bx − s 라 쓴다. b명씩 앉은 의자는 빈 의자와 마지막 의자를 뺀 개수이다.
//  - 기차가 다리를 건넌 거리를 다리의 길이로만 센다(기차의 길이를 더한다). 강을 거슬러 오를 때의 속력을 배의 속력 그대로 쓴다(강물의 속력을 뺀다).
//  - 방정식의 해를 그대로 답한다. 미지수로 놓은 것(작년 학생 수)과 묻는 것(올해 학생 수)이 다를 수 있다. 늘고 준 것은 「작년 수의 몇 %」이다.
//  - 잘못 보고 푼 해를 처음 연립방정식에 넣는다. 잘못 본 식은 버리고 바르게 본 식만 그 해를 참이 되게 한다. 바꾸어 놓고 푼 해는 「바꾼 식」의 해이다.
//
// 실력에는 ① 문제의 식·말·상황에 장치가 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제(잘못 본 수 되찾기, 바꾸어 놓고 푼 해에서
// 처음 해 구하기, 식을 다시 짝 지어 연립방정식을 두 번 풀기, 순환소수를 분수로 고쳐 풀기, 그림에서 두 식을 읽어 넓이 구하기, 속력의 비와 트랙)만 실었다.
// 기본 문서에 여러 번 나오는 꼴(한 식만 참이 되게 하는 순서쌍을 섞어 고르기, 자연수인 해의 개수, 자리의 숫자를 바꾼 수, 풀이 과정의 빈칸, 가위바위보)은 기본 묶음에 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C } = B.kit;
  const { MINUS, gcd, Q, tx, nb, tail, V, nz, pm, ansV, poly, rep } = B.kit.mid;
  const { STD, NAME, X, Y, va, vb, vk, iq, tg, tm, ts, sideH, eqH, eqT, I, solH, pairH, sysOf, sysL, wide, stdI, tame, stdJ, cramerJ, solJ, stdH, elimTold, told, xyAns, valsAns, pickSol, SOLVE } = B.kit.m814;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①22' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const vc = V('c');
  const big = (d, lim) => d.until(() => nz(d, -(lim || 6), lim || 6), (v) => Math.abs(v) > 1);
  const span = (min) => { const h = Math.floor(min / 60), m = min % 60; return { text: (h ? h + '시간' : '') + (h && m ? ' ' : '') + (m ? m + '분' : ''), js: h && m ? `(${h}*60+${m})` : h ? `(${h}*60)` : String(m) }; };
  // 정지한 물에서의 배의 속력, 강물의 속력, 거슬러 오르는 시간, 내려오는 시간이 모두 자연수인 경우들
  const BOATS = [];
  for (let boat = 6; boat <= 20; boat += 1) for (let river = 1; river <= 5; river += 1) for (let t2 = 2; t2 <= 6; t2 += 1) { const dist = (boat + river) * t2, t1 = dist / (boat - river); if (Number.isInteger(t1) && t1 <= 9 && dist <= 150) BOATS.push({ boat, river, t1, t2, dist }); }
  // 같은 타일을 두 줄로 붙여 만든 직사각형 ABCD. up: 세워 놓은 타일의 수, flat: 눕혀 놓은 타일의 수(up × 짧은 변 = flat × 긴 변), upOnTop: 세워 놓은 줄이 위에 있는가.
  // 수집본의 그림 둘(9장: 위에 5장을 세우고 아래에 4장을 눕힘 / 5장: 위에 2장을 눕히고 아래에 3장을 세움)을 그 배치대로 그린다. 길이는 적지 않는다.
  function tiles(up, flat, upOnTop) {
    const S = flat, L = up, u = Math.min(12 * 20 / (up * S), 30), W = up * S * u, hUp = L * u, hFlat = S * u, pad = 22, r1 = (v) => Math.round(v * 10) / 10;
    const yUp = upOnTop ? 0 : hFlat, yFlat = upOnTop ? hUp : 0, box = 'style="fill:#eef2d9;stroke:#1f2933;stroke-width:1.4"', word = 'style="font-size:14px;font-weight:600;fill:#1f2933"';
    let out = '';
    for (let i = 0; i < up; i += 1) out += `<rect x="${r1(pad + i * S * u)}" y="${r1(pad + yUp)}" width="${r1(S * u)}" height="${r1(hUp)}" ${box}/>`;
    for (let i = 0; i < flat; i += 1) out += `<rect x="${r1(pad + i * L * u)}" y="${r1(pad + yFlat)}" width="${r1(L * u)}" height="${r1(hFlat)}" ${box}/>`;
    const H2 = hUp + hFlat;
    out += `<text x="${pad - 6}" y="${pad + 3}" text-anchor="end" ${word}>A</text><text x="${pad - 6}" y="${r1(pad + H2 + 6)}" text-anchor="end" ${word}>B</text><text x="${r1(pad + W + 6)}" y="${r1(pad + H2 + 6)}" ${word}>C</text><text x="${r1(pad + W + 6)}" y="${pad + 3}" ${word}>D</text>`;
    const rowUp = `타일 ${up}장이 세로로 길게 나란히 놓여 있고`, rowFlat = `타일 ${flat}장이 가로로 길게 나란히 놓여 있다`;
    const said = `직사각형 ABCD: 모양과 크기가 같은 직사각형 타일 ${up + flat}장을 두 줄로 붙였다. ${upOnTop ? `위 줄에는 ${rowUp}, 아래 줄에는 ${rowFlat}` : `아래 줄에는 ${rowUp}, 위 줄에는 ${rowFlat}`}. 두 줄의 가로의 길이는 같다. 꼭짓점은 왼쪽 위가 A, 왼쪽 아래가 B, 오른쪽 아래가 C, 오른쪽 위가 D이다.`;
    return `<svg class="mb-geo" viewBox="0 0 ${r1(W + 2 * pad)} ${r1(H2 + 2 * pad)}" width="${Math.round(W + 2 * pad)}" role="img" aria-label="${said}">${out}</svg>`;
  }

  B.addGroup('8-1-4', {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      // ── ① 문제의 식·말·상황에 장치가 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-eq2-cond', '미지수가 2개인 일차방정식이 되기 위한 상수의 조건', '심3', (d) => {
        // 함정: 적힌 그대로 x의 계수만 보고 a ≠ 0 이라 하는 아이(0을 고른다), 우변의 항을 옮기며 부호를 놓치는 아이(부호가 반대인 수를 고른다),
        //  괄호 안의 a + k 가 0이 되는 수를 고르는 아이(−k 를 고른다).
        const sg = (v) => (v < 0 ? ` ${MINUS} ` : ' + ');
        if (d.bool()) {
          // ax + By + c = A(x − y) + e → (a − A)x + (B + A)y + (c − e) = 0
          const A = pm(d) * d.int(2, 6), Bc = d.until(() => nz(d, -5, 5), (v) => v + A !== 0), c = nz(d, -9, 9), e = d.until(() => nz(d, -9, 9), (v) => v !== c);
          const extra = d.pick([1, -1, 2, -2, 3, -3, 4, -4].filter((v) => Math.abs(v) !== Math.abs(A))), values = d.shuffle([A, -A, 0, extra]);
          const h = `${poly([[1, va + X], [Bc, Y], [c, '']])} = ${sideH([tg(A, ts([1, 'x'], [-1, 'y'])), tm(e, '')])}`, coef = `${va}${sg(-A)}${Math.abs(A)}`;
          return C(`다음 등식이 ${X}, ${Y}에 대한 미지수가 2개인 일차방정식일 때, 상수 ${va}의 값이 될 수 없는 것은?`, values.map(iq), values.indexOf(A), {
            figure: wide(h),
            explain: `우변의 괄호를 풀고 모든 항을 좌변으로 이항하여 정리하면 ${nb(`(${coef})${X}${sg(Bc + A)}${Math.abs(Bc + A) === 1 ? '' : Math.abs(Bc + A)}${Y}${sg(c - e)}${Math.abs(c - e)} = 0`)}이다. 미지수가 2개인 일차방정식이 되려면 ${X}의 계수 ${nb(coef)}${tail(Math.abs(A), '이/가')} 0이 아니어야 하므로 ${nb(`${va} ≠ ${iq(A)}`)}이다. ${nb(`${va} = 0`)}일 때는 ${X}의 계수가 ${iq(-A)}${tail(Math.abs(A), '이/가')} 되어 미지수가 2개인 일차방정식이다.`,
            facts: { pick: { expr: `(${A})`, options: values }, unseen: [0, 1] }
          });
        }
        // Ax − By = (a + k)x + Cy + e → (A − k − a)x − (B + C)y − e = 0
        const m = d.until(() => { const A = d.int(2, 7), k = nz(d, -5, 5), Bc = d.int(1, 5), Cc = d.until(() => nz(d, -5, 5), (v) => v + Bc !== 0), e = nz(d, -9, 9), bad = A - k; return { A, k, Bc, Cc, e, bad, others: [...new Set([0, -k, A, -bad])].filter((v) => v !== bad) }; }, (r) => r.bad !== 0 && r.others.length >= 3);
        const { A, k, Bc, Cc, e, bad } = m, values = d.shuffle([bad].concat(d.shuffle(m.others).slice(0, 3)));
        const h = `${poly([[A, X], [-Bc, Y]])} = (${va}${sg(k)}${Math.abs(k)})${X}${sg(Cc)}${Math.abs(Cc) === 1 ? '' : Math.abs(Cc)}${Y}${sg(e)}${Math.abs(e)}`, coef = `${A - k}${sg(-1)}${va}`;
        return C(`다음 등식이 ${X}, ${Y}에 대한 미지수가 2개인 일차방정식일 때, 상수 ${va}의 값이 될 수 없는 것은?`, values.map(iq), values.indexOf(bad), {
          figure: wide(h),
          explain: `우변의 모든 항을 좌변으로 이항하여 정리하면 ${nb(`(${coef})${X}${sg(-Bc - Cc)}${Math.abs(Bc + Cc) === 1 ? '' : Math.abs(Bc + Cc)}${Y}${sg(-e)}${Math.abs(e)} = 0`)}이다. 미지수가 2개인 일차방정식이 되려면 ${X}의 계수 ${nb(coef)}가 0이 아니어야 하므로 ${nb(`${va} ≠ ${iq(bad)}`)}이다. ${nb(`${va} = 0`)}이거나 ${nb(`${va} = ${iq(-k)}`)}일 때에도 ${X}의 계수는 0이 아니다.`,
          facts: { pick: { expr: `(${A})-(${k})`, options: values }, unseen: [0, 1] }
        });
      }),
      H('hard-fraction', '기약분수로 나타낸 값 둘로 처음 분수 구하기', '심47', (d) => {
        // 함정: 기약분수로 나타낸 값이 p/q 이므로 분자를 p, 분모를 q 로 놓는 아이. 알 수 있는 것은 (분자) : (분모) = p : q 뿐이다(qx = py).
        //  둘째 조건도 비로 옮긴다: v(x + s) = u(y − t). 답은 약분하지 않은 처음 분수의 분자와 분모이다.
        const m = d.until(() => {
          const [p, q] = d.pick([[3, 7], [2, 5], [3, 8], [2, 3], [3, 4], [4, 9], [5, 8], [3, 5], [2, 7], [4, 7]]), mm = d.int(2, 6), s = d.int(1, 9), t = d.int(1, 12), num = p * mm + s, den = q * mm - t, g = gcd(num, Math.abs(den));
          return { p, q, mm, s, t, num, den, g, u: num / g, v: den / g };
        }, (r) => r.den > r.num && r.g >= 2 && r.v <= 9 && r.u * r.q !== r.p * r.v);
        const { p, q, mm, s, t, u, v } = m, x0 = p * mm, y0 = q * mm, e1 = [ts([q, 'x']), ts([p, 'y'])], e2 = [[tg(v, ts([1, 'x'], [s, '']))], [tg(u, ts([1, 'y'], [-t, '']))]], top = `(${u}*${t}+${v}*${s})/(${q}*${u}-${p}*${v})`;
        return M(`어떤 분수를 기약분수로 나타내면 ${frac(p, q)}${tail(p, '이/가')} 되고, 이 분수의 분자에 ${s}${tail(s, '을/를')} 더하고 분모에서 ${t}${tail(t, '을/를')} 뺀 다음 기약분수로 나타내면 ${frac(u, v)}${tail(u, '이/가')} 된다. 처음 분수의 분자와 분모를 구하시오.`, [{ label: '분자', answer: x0 }, { label: '분모', answer: y0 }], {
          explain: `기약분수로 나타낸 값이 ${frac(p, q)}${tail(p, '이라고/라고')} 해서 처음 분수의 분자가 ${p}, 분모가 ${q}인 것은 아니다. 처음 분수의 분자를 ${X}, 분모를 ${Y}라 하면 ${nb(`${X} : ${Y} = ${p} : ${q}`)}이므로 ${eqT(e1)}이고, ${nb(`(${X} + ${s}) : (${Y} ${MINUS} ${t}) = ${u} : ${v}`)}이므로 ${eqT(e2)}이다. 이 연립방정식을 풀면 ${solH(x0, y0)}이다.`,
          facts: { calc: [[`${p}*${top}`, 0], [`${q}*${top}`, 1]] }
        });
      }),
      H('hard-rest', '도중에 쉰 시간이 있을 때 두 구간의 거리', '심53 / 기본 ①63', (d) => {
        // 함정: 걸린 시간을 걷고 달린 시간으로만 세는 아이. 쉰 시간도 집을 떠나 도착할 때까지의 시간에 들어 있으므로 빼야 한다.
        const m = d.until(() => { const u = d.pick([3, 4, 5]), w = d.pick([6, 8, 9, 10, 12]), x0 = d.int(1, 8), y0 = d.int(1, 9), rest = d.pick([5, 10, 15, 20, 30]); return { u, w, x0, y0, rest, move: 60 * x0 / u + 60 * y0 / w }; }, (r) => Number.isInteger(r.move) && r.move % 10 === 0 && r.move + r.rest <= 240 && r.x0 !== r.y0);
        const { u, w, x0, y0, rest, move } = m, dist = x0 + y0, t = span(move + rest), e1 = I(1, 1, dist), e2 = [ts([Q(1, u), 'x'], [Q(1, w), 'y']), ts([Q(move, 60), ''])], yJ = `((${t.js}-${rest})*${u}*${w}/60-${w}*${dist})/(${u}-${w})`;
        return M(`집에서 ${dist} km 떨어진 공원까지 가는데, 시속 ${u} km로 걷다가 도중에 ${rest}분 동안 쉬고, 그 뒤로는 시속 ${w} km로 달렸더니 집을 떠난 지 ${t.text} 만에 공원에 도착하였다. 걸은 거리와 달린 거리는 각각 ${nb('몇 km인가?')}`, [{ label: '걸은 거리', answer: x0, unit: 'km' }, { label: '달린 거리', answer: y0, unit: 'km' }], {
          explain: `쉰 ${rest}분도 ${t.text}에 들어 있으므로 걷고 달린 시간의 합은 ${move}분, 곧 ${tx(Q(move, 60))}시간이다. 걸은 거리를 ${nb(`${X} km`)}, 달린 거리를 ${nb(`${Y} km`)}라 하면 걸은 시간은 ${frac(X, u)}시간, 달린 시간은 ${frac(Y, w)}시간이다. 연립방정식을 세우면 ${eqT(e1)}, ${eqT(e2)}이고, 이것을 풀면 ${solH(x0, y0)}이다.`,
          facts: { calc: [[`${dist}-${yJ}`, 0], [yJ, 1]], unseen: [60] }
        });
      }),
      H('hard-seats', '마지막 의자가 덜 차고 빈 의자가 남는 긴 의자', '기본 ①59', (d) => {
        // 함정: 「마지막 의자에 s명이 앉고 빈 의자가 e개 남는다」를 by − s 로 옮기는 아이. b명씩 앉은 의자는 빈 의자 e개와 마지막 의자를 뺀 (y − e − 1)개이고, 거기에 s명을 더한다.
        const m = d.until(() => { const a = d.int(4, 6), b = a + d.int(1, 3), v = d.int(6, 16), s = d.int(1, b - 1), e = d.int(1, 2); return { a, b, v, s, e, r: (b - a) * v - b * (1 + e) + s }; }, (r) => r.r >= 1 && r.r <= 15 && r.r !== r.s);
        const { a, b, v, s, e, r } = m, students = a * v + r, e1 = [ts([1, 'x']), ts([a, 'y'], [r, ''])], e2 = [ts([1, 'x']), [tg(b, ts([1, 'y'], [-(1 + e), ''])), tm(s, '')]], cJ = `(${r}+${b}*(1+${e})-${s})/(${b}-${a})`;
        return M(`학생들이 긴 의자에 앉으려고 한다. 한 의자에 ${a}명씩 앉으면 ${r}명이 앉지 못하고, 한 의자에 ${b}명씩 앉으면 마지막 의자에는 ${s}명만 앉고 빈 의자가 ${e}개 남는다. 학생 수와 의자의 수를 구하시오.`, [{ label: '학생', answer: students, unit: '명' }, { label: '의자', answer: v, unit: '개' }], {
          explain: `학생 수를 ${X}, 의자의 수를 ${Y}라 하자. ${a}명씩 앉으면 ${r}명이 남으므로 ${eqT(e1)}이다. ${b}명씩 앉으면 빈 의자 ${e}개와 마지막 의자를 뺀 ${nb(`(${Y} ${MINUS} ${1 + e})`)}개의 의자에 ${b}명씩 앉고 마지막 의자에 ${s}명이 앉으므로 ${eqT(e2)}이다. 이 연립방정식을 풀면 ${solH(students, v)}이다.`,
          facts: { calc: [[`${a}*${cJ}+${r}`, 0], [cJ, 1]], unseen: [1] }
        });
      }),
      H('hard-train', '기차가 다리와 터널을 완전히 지나는 데 걸리는 시간', '심55 / 기본 ①65', (d) => {
        // 함정: 지나간 거리를 다리(터널)의 길이로만 세는 아이. 기차가 완전히 지나려면 다리의 길이에 기차의 길이를 더한 거리를 달려야 한다.
        const m = d.until(() => { const v = d.pick([20, 25, 30, 40]), j = d.int(8, 20), t1 = j + d.int(3, 8), k = d.int(2, 3); return { v, k, t1, t2: t1 + (k - 1) * j, bridge: v * j, len: v * (t1 - j) }; }, (r) => r.t2 <= 60 && r.len !== r.bridge);
        const { v, k, t1, t2, bridge, len } = m, e1 = [ts([1, 'x'], [len, '']), ts([t1, 'y'])], e2 = [ts([k, 'x'], [len, '']), ts([t2, 'y'])], xJ = `${len}*(${t2}-${t1})/(${k}*${t1}-${t2})`;
        return M(`길이가 ${len} m인 기차가 일정한 속력으로 달려 어떤 다리를 완전히 건너는 데 ${t1}초가 걸리고, 길이가 그 다리의 ${k}배인 터널을 완전히 통과하는 데 ${t2}초가 걸린다. 다리의 길이는 ${nb('몇 m이고,')} 기차의 속력은 초속 ${nb('몇 m인가?')}`, [{ label: '다리의 길이', answer: bridge, unit: 'm' }, { label: '속력', lead: '초속', answer: v, unit: 'm' }], {
          explain: `기차가 다리를 완전히 건너려면 다리의 길이에 기차의 길이를 더한 거리를 달려야 한다. 다리의 길이를 ${nb(`${X} m`)}, 기차의 속력을 초속 ${nb(`${Y} m`)}라 하면 터널의 길이는 ${nb(`${poly([[k, X]])} m`)}이므로 ${eqT(e1)}, ${eqT(e2)}이다. 이 연립방정식을 풀면 ${solH(bridge, v)}이다.`,
          facts: { calc: [[xJ, 0], [`(${xJ}+${len})/${t1}`, 1]] }
        });
      }),
      H('hard-boat', '강을 거슬러 오르고 내려오는 배의 속력', '기본 ②56 / 심54', (d) => {
        // 함정: 오를 때와 내려올 때의 속력을 배의 속력 그대로 쓰는 아이. 거슬러 오를 때는 강물의 속력만큼 느려지고, 내려올 때는 그만큼 빨라진다.
        const { boat, river, t1, t2, dist } = d.pick(BOATS), e1 = [[tg(t1, ts([1, 'x'], [-1, 'y']))], ts([dist, ''])], e2 = [[tg(t2, ts([1, 'x'], [1, 'y']))], ts([dist, ''])];
        return M(`배를 타고 길이가 ${dist} km인 강을 거슬러 올라가는 데 ${t1}시간, 같은 길을 내려오는 데 ${t2}시간이 걸렸다. 정지한 물에서의 배의 속력과 강물의 속력은 각각 시속 ${nb('몇 km인가?')} (단, 배와 강물의 속력은 각각 일정하다.)`, [{ label: '배', lead: '시속', answer: boat, unit: 'km' }, { label: '강물', lead: '시속', answer: river, unit: 'km' }], {
          explain: `정지한 물에서의 배의 속력을 시속 ${nb(`${X} km`)}, 강물의 속력을 시속 ${nb(`${Y} km`)}라 하면 거슬러 올라갈 때의 속력은 시속 ${nb(`(${X} ${MINUS} ${Y}) km`)}, 내려올 때의 속력은 시속 ${nb(`(${X} + ${Y}) km`)}이다. (거리) = (속력) × (시간)이므로 ${eqT(e1)}, ${eqT(e2)}이다. 두 식을 정리하면 ${nb(`${X} ${MINUS} ${Y} = ${dist / t1}`)}, ${nb(`${X} + ${Y} = ${dist / t2}`)}이고, 이것을 풀면 ${solH(boat, river)}이다.`,
          facts: { calc: [[`(${dist}/${t1}+${dist}/${t2})/2`, 0], [`(${dist}/${t2}-${dist}/${t1})/2`, 1]], unseen: [2] }
        });
      }),
      H('hard-percent', '작년보다 늘고 준 비율로 올해의 수 구하기', '기본 ①69·70 ②57 / 심50', (d) => {
        // 함정: 구한 해(작년 학생 수)를 그대로 답하는 아이, 늘고 준 수를 올해 수의 몇 %로 세는 아이. 식은 작년 수와 변한 수로 세우고, 답은 올해 수로 고쳐야 한다.
        const m = d.until(() => { const p = d.pick([2, 4, 5, 6, 8, 10]), q = d.pick([2, 4, 5, 6, 8, 10]), boys = 20 * d.int(8, 30), girls = 20 * d.int(8, 30), up = d.bool(); return { p, q, boys, girls, up, db: boys * p / 100, dg: girls * q / 100 }; },
          (r) => r.p !== r.q && Number.isInteger(r.db) && Number.isInteger(r.dg) && r.db !== r.dg && r.boys !== r.girls && Math.abs(r.db - r.dg) <= 30);
        const { p, q, boys, girls, up, db, dg } = m, total = boys + girls, change = up ? db - dg : dg - db, size = Math.abs(change), sb = up ? 1 : -1, s = sb * (change > 0 ? 1 : -1);
        const bJ = `(${q}*${total}${s > 0 ? '+' : '-'}100*${size})/(${p}+${q})`, nowB = boys + sb * db, nowG = girls - sb * dg;
        const second = `${up ? '' : MINUS}${frac(p, 100)}${X} ${up ? MINUS : '+'} ${frac(q, 100)}${Y} = ${iq(change)}`;
        return M(`어느 중학교의 작년 전체 학생은 ${total}명이었다. 올해는 작년에 비하여 남학생은 ${p} % ${up ? '늘고' : '줄고'} 여학생은 ${q} % ${up ? '줄어서' : '늘어서'} 전체 학생이 ${size}명 ${change > 0 ? '늘었다' : '줄었다'}. 올해 남학생과 여학생은 각각 몇 명인가?`, [{ label: '남학생', answer: nowB, unit: '명' }, { label: '여학생', answer: nowG, unit: '명' }], {
          explain: `작년 남학생을 ${X}명, 여학생을 ${Y}명이라 하면 ${nb(`${X} + ${Y} = ${total}`)}이다. ${up ? '늘어난' : '줄어든'} 남학생은 ${frac(p, 100)}${X}명, ${up ? '줄어든' : '늘어난'} 여학생은 ${frac(q, 100)}${Y}명이고 전체는 ${size}명 ${change > 0 ? '늘었으므로' : '줄었으므로'} ${nb(second)}이다. 이 연립방정식을 풀면 ${solH(boys, girls)}이다. 이것은 작년 학생 수이므로 올해 남학생은 ${nb(`${boys} ${up ? '+' : MINUS} ${db} = ${nowB}`)}(명), 여학생은 ${nb(`${girls} ${up ? MINUS : '+'} ${dg} = ${nowG}`)}(명)이다.`,
          facts: { calc: [[`${bJ}*(100${up ? '+' : '-'}${p})/100`, 0], [`(${total}-${bJ})*(100${up ? '-' : '+'}${q})/100`, 1]], unseen: [100] }
        });
      }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-misread-three', '잘못 보고 푼 해와 바르게 푼 해로 상수 셋 구하기', '심31', (d) => {
        // ㉡의 c 를 잘못 보았으므로 ㉠은 두 해를 모두 참이 되게 한다(a, b 에 대한 연립방정식). c 는 바르게 푼 해만으로 구한다.
        const m = d.until(() => { const a = nz(d, -4, 4), b = nz(d, -4, 4), c = big(d, 5), [p2, q2] = pickSol(d, 5), t = pm(d) * d.int(1, 2), p1 = p2 + b * t, q1 = q2 - a * t; return { a, b, c, p1, q1, p2, q2, C1: a * p2 + b * q2, C2: c * p2 - q2 }; },
          (r) => r.C1 !== 0 && r.p1 !== 0 && r.q1 !== 0 && r.p1 * r.q2 - r.p2 * r.q1 !== 0 && r.c * r.p1 - r.q1 !== r.C2 && Math.abs(r.C1) <= 30 && Math.abs(r.C2) <= 30 && Math.abs(r.p1) <= 9 && Math.abs(r.q1) <= 9);
        const { a, b, c, p1, q1, p2, q2, C1, C2 } = m, det = `((${p1})*(${q2})-(${p2})*(${q1}))`;
        const el = elimTold({ a: p1, b: q1, c: C1 }, { a: p2, b: q2, c: C1 }, '㉢', '㉣', ['a', 'b']);
        return valsAns(`연립방정식 ${sysOf([`${poly([[1, va + X], [1, vb + Y]])} = ${iq(C1)}`, `${poly([[1, vc + X], [-1, Y]])} = ${iq(C2)}`], NAME)}을 푸는데, ${vc}를 다른 수로 잘못 보고 풀어서 ${solH(p1, q1)}${tail(Math.abs(q1), '을/를')} 얻었다. 바르게 풀었을 때의 해가 ${solH(p2, q2)}일 때, 상수 ${va}, ${vb}, ${vc}의 값은?`, [['a', a], ['b', b], ['c', c]], {
          explain: `${vc}만 잘못 보았으므로 ㉠은 바르게 본 식이고, 잘못 보고 푼 해와 바르게 푼 해가 모두 ㉠을 참이 되게 한다. 두 해를 ㉠에 대입하면 ${nb(stdH({ a: p1, b: q1, c: C1 }, ['a', 'b']))} …… ㉢, ${nb(stdH({ a: p2, b: q2, c: C1 }, ['a', 'b']))} …… ㉣이다. ${el.text} ㉡은 바르게 푼 해 ${solH(p2, q2)}만 참이 되게 하므로 ${nb(`${poly([[p2, vc], [-q2, '']])} = ${iq(C2)}`)}에서 ${nb(`${vc} = ${iq(c)}`)}이다.`,
          facts: { calc: [[`(${C1})*((${q2})-(${q1}))/${det}`, 0], [`(${C1})*((${p1})-(${p2}))/${det}`, 1], [`((${C2})+(${q2}))/(${p2})`, 2]], unseen: [1, 0] }
        });
      }),
      H('hard-swap', '두 상수를 서로 바꾸어 놓고 푼 해에서 처음 연립방정식의 해 구하기', '기본 ①48 ②36 / 심32·33', (d) => {
        // 주어진 해는 「바꾼 연립방정식」의 해이다. 바꾼 식에 넣어 a, b 를 구한 다음 처음 연립방정식을 다시 푼다.
        const m = d.until(() => { const a = nz(d, -4, 4), b = nz(d, -4, 4), [p, q] = pickSol(d, 5), C1 = b * p + a * q, C2 = a * p - b * q, n2 = a * a + b * b; return { a, b, p, q, C1, C2, x0: (a * C1 + b * C2) / n2, y0: (b * C1 - a * C2) / n2 }; },
          (r) => Math.abs(r.a) !== Math.abs(r.b) && Number.isInteger(r.x0) && Number.isInteger(r.y0) && r.x0 !== 0 && r.y0 !== 0 && r.C1 !== 0 && r.C2 !== 0 && (r.x0 !== r.p || r.y0 !== r.q) && Math.abs(r.C1) <= 30 && Math.abs(r.C2) <= 30);
        const { a, b, p, q, C1, C2, x0, y0 } = m, n2 = `((${p})*(${p})+(${q})*(${q}))`, aJ = `(((${q})*(${C1})+(${p})*(${C2}))/${n2})`, bJ = `(((${p})*(${C1})-(${q})*(${C2}))/${n2})`, d2 = `(${aJ}*${aJ}+${bJ}*${bJ})`;
        const el = elimTold({ a: q, b: p, c: C1 }, { a: p, b: -q, c: C2 }, '㉢', '㉣', ['a', 'b']), orig = elimTold({ a, b, c: C1 }, { a: b, b: -a, c: C2 }, '㉤', '㉥');
        return xyAns(`연립방정식 ${sysOf([`${poly([[1, va + X], [1, vb + Y]])} = ${iq(C1)}`, `${poly([[1, vb + X], [-1, va + Y]])} = ${iq(C2)}`], NAME)}에서 ${va}와 ${vb}를 서로 바꾸어 놓고 풀었더니 해가 ${solH(p, q)}이었다. 처음 연립방정식의 해를 구하시오. (단, ${va}, ${vb}는 상수이다.)`, x0, y0, {
          explain: `${va}와 ${vb}를 바꾼 연립방정식은 ${nb(`${poly([[1, vb + X], [1, va + Y]])} = ${iq(C1)}`)}, ${nb(`${poly([[1, va + X], [-1, vb + Y]])} = ${iq(C2)}`)}이고, ${solH(p, q)}${tail(Math.abs(q), '은/는')} 이 연립방정식의 해이다. 대입하면 ${nb(stdH({ a: q, b: p, c: C1 }, ['a', 'b']))} …… ㉢, ${nb(stdH({ a: p, b: -q, c: C2 }, ['a', 'b']))} …… ㉣이다. ${el.text} 따라서 처음 연립방정식은 ${nb(stdH({ a, b, c: C1 }))} …… ㉤, ${nb(stdH({ a: b, b: -a, c: C2 }))} …… ㉥이다. ${orig.text}`,
          facts: { calc: [[`(${aJ}*(${C1})+${bJ}*(${C2}))/${d2}`, 0], [`(${bJ}*(${C1})-${aJ}*(${C2}))/${d2}`, 1]], unseen: [1, 0] }
        });
      }),
      H('hard-same-both', '해가 같은 두 연립방정식에서 두 상수가 한 식에 함께 있는 것', '기본 ①46 ②41 / 심19', (d) => {
        // 상수가 없는 두 식을 짝 지어 해를 구한 다음, 그 해를 나머지 두 식에 넣어 a, b 에 대한 연립방정식을 다시 푼다.
        const m = d.until(() => { const [x0, y0] = pickSol(d, 5), [a1, b1, a4, b4] = [nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5)], a = big(d, 5), b = big(d, 5); return { x0, y0, a1, b1, a4, b4, a, b, c1: a1 * x0 + b1 * y0, c4: a4 * x0 + b4 * y0, C2: a * x0 + b * y0, C3: a * x0 - b * y0 }; },
          (r) => r.a1 * r.b4 - r.a4 * r.b1 !== 0 && r.c1 !== 0 && r.c4 !== 0 && r.C2 !== 0 && r.C3 !== 0 && Math.abs(r.c1) <= 30 && Math.abs(r.c4) <= 30 && Math.abs(r.C2) <= 40 && Math.abs(r.C3) <= 40);
        const { x0, y0, a, b, C2, C3 } = m, e1 = I(m.a1, m.b1, m.c1), e4 = I(m.a4, m.b4, m.c4), j = solJ(e1, e4), r2 = `${poly([[1, va + X], [1, vb + Y]])} = ${iq(C2)}`, r3 = `${poly([[1, va + X], [-1, vb + Y]])} = ${iq(C3)}`;
        const el = elimTold({ a: x0, b: y0, c: C2 }, { a: x0, b: -y0, c: C3 }, '㉢', '㉣', ['a', 'b']);
        return valsAns(`두 연립방정식 ${sysOf([eqH(e1), r2])}, ${sysOf([r3, eqH(e4)])}의 해가 서로 같을 때, 상수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
          explain: `두 연립방정식의 해가 같으므로 그 해는 네 일차방정식을 모두 참이 되게 한다. ${va}, ${vb}가 없는 두 식 ${eqT(e1)} …… ㉠, ${eqT(e4)} …… ㉡을 짝 지어 푼다. ${told(e1, e4).text} ${solH(x0, y0)}${tail(Math.abs(y0), '을/를')} 나머지 두 식에 대입하면 ${nb(stdH({ a: x0, b: y0, c: C2 }, ['a', 'b']))} …… ㉢, ${nb(stdH({ a: x0, b: -y0, c: C3 }, ['a', 'b']))} …… ㉣이다. ${el.text}`,
          facts: { calc: [[`((${C2})+(${C3}))/(2*(${j.x}))`, 0], [`((${C2})-(${C3}))/(2*(${j.y}))`, 1]], unseen: j.unseen.concat([2]) }
        });
      }),
      H('hard-three-points', '세 순서쌍이 한 일차방정식의 해일 때 빈 값 구하기', '기본 ②37', (d) => {
        // 두 순서쌍으로 a, b 에 대한 연립방정식을 세워 풀고, 셋째 순서쌍을 넣어 빈 값을 구한다.
        const m = d.until(() => { const a = nz(d, -5, 5), b = nz(d, -5, 5), x0 = d.int(-3, 3), y0 = d.int(-3, 3), t = d.shuffle([-2, -1, 1, 2]), pts = [[x0, y0], [x0 + b * t[0], y0 - a * t[0]], [x0 + b * t[1], y0 - a * t[1]]]; return { a, b, c: a * x0 + b * y0, pts }; },
          (r) => r.c !== 0 && Math.abs(r.c) <= 30 && r.pts[0][0] * r.pts[1][1] - r.pts[1][0] * r.pts[0][1] !== 0 && r.pts.every(([x, y]) => x !== 0 && y !== 0 && Math.abs(x) <= 12 && Math.abs(y) <= 12));
        const { a, b, c, pts } = m, [[p1, q1], [p2, q2], [p3, k]] = pts, det = `((${p1})*(${q2})-(${p2})*(${q1}))`, aJ = `((${c})*((${q2})-(${q1}))/${det})`, bJ = `((${c})*((${p1})-(${p2}))/${det})`;
        const el = elimTold({ a: p1, b: q1, c }, { a: p2, b: q2, c }, '㉠', '㉡', ['a', 'b']);
        return ansV(`세 순서쌍 ${pairH(p1, q1)}, ${pairH(p2, q2)}, ${nb(`(${iq(p3)}, ${vk})`)}가 모두 일차방정식 ${nb(`${poly([[1, va + X], [1, vb + Y]])} = ${iq(c)}`)}의 해일 때, ${vk}의 값은? (단, ${va}, ${vb}는 상수이다.)`, Q(k), 'int', {
          explain: `앞의 두 순서쌍을 대입하면 ${nb(stdH({ a: p1, b: q1, c }, ['a', 'b']))} …… ㉠, ${nb(stdH({ a: p2, b: q2, c }, ['a', 'b']))} …… ㉡이다. ${el.text} 일차방정식 ${nb(stdH({ a, b, c }))}에 ${nb(`${X} = ${iq(p3)}`)}, ${nb(`${Y} = ${vk}`)}를 대입하면 ${nb(`${poly([[a * p3, ''], [b, vk]])} = ${iq(c)}`)}이므로 ${nb(`${vk} = ${iq(k)}`)}이다.`,
          facts: { value: `((${c})-${aJ}*(${p3}))/${bJ}`, unseen: [1, 0] }
        });
      }),
      H('hard-tiles', '같은 타일을 붙여 만든 직사각형의 넓이', '기본 ①62 ②53 / 심48', (d) => {
        // 그림에서 두 식을 읽는다: 마주 보는 두 변의 길이가 같다(세운 타일 up장의 짧은 변 = 눕힌 타일 flat장의 긴 변), 둘레의 길이. 구한 두 변의 길이로 넓이를 구한다.
        const [up, flat, upOnTop, k] = d.bool() ? [5, 4, true, d.int(1, 3)] : [3, 2, false, d.int(2, 5)], S = flat * k, L = up * k, per = 2 * (up * S + S + L), area = up * S * (S + L);
        const e1 = [ts([up, 'x']), ts([flat, 'y'])], e2 = [[tg(2, ts([up + 1, 'x'], [1, 'y']))], ts([per, ''])], den = `(2*(${up}*${flat}+${up}+${flat}))`, sJ = `(${per}*${flat}/${den})`, lJ = `(${per}*${up}/${den})`;
        return N(`그림과 같이 모양과 크기가 같은 직사각형 모양의 타일 ${up + flat}장을 빈틈없이 붙여서 둘레의 길이가 ${per} cm인 직사각형 ABCD를 만들었다. 직사각형 ABCD의 넓이는 ${nb('몇 cm²인가?')}`, area, {
          unit: 'cm²', figure: tiles(up, flat, upOnTop),
          explain: `타일의 짧은 변의 길이를 ${nb(`${X} cm`)}, 긴 변의 길이를 ${nb(`${Y} cm`)}라 하자. 직사각형 ABCD에서 마주 보는 두 변의 길이는 같으므로 ${eqT(e1)}이다. 직사각형 ABCD의 가로의 길이는 ${nb(`${poly([[up, X]])} cm`)}, 세로의 길이는 ${nb(`(${X} + ${Y}) cm`)}이므로 둘레의 길이에서 ${eqT(e2)}이다. 이 연립방정식을 풀면 ${solH(S, L)}이다. 따라서 가로의 길이는 ${up * S} cm, 세로의 길이는 ${S + L} cm이고 넓이는 ${nb(`${up * S} × ${S + L} = ${area}`)}(cm²)이다.`,
          facts: { value: `${up}*${sJ}*(${sJ}+${lJ})`, unseen: [2] }
        });
      }),
      H('hard-track', '속력의 비를 알 때 트랙을 반대 방향으로 돌아 만나기', '기본 ①64', (d) => {
        // 같은 시간 동안 간 거리의 비가 속력의 비이다. 반대 방향으로 돌아 처음 만날 때까지 두 사람이 간 거리의 합은 트랙의 둘레의 길이와 같다.
        const m = d.until(() => { const [a0, b0] = d.pick([[2, 3], [3, 4], [3, 5], [4, 5], [2, 5]]), g = 10 * d.int(2, 5), t = d.int(4, 15); return { a0, b0, g, t, per: t * g * (a0 + b0) }; }, (r) => r.per % 100 === 0 && r.per <= 3000);
        const { a0, b0, g, t, per } = m, da = 100 * a0, db = 100 * b0, e1 = [ts([b0, 'x']), ts([a0, 'y'])], e2 = [[tg(t, ts([1, 'x'], [1, 'y']))], ts([per, ''])];
        return M(`둘레의 길이가 ${per} m인 트랙이 있다. 동생이 ${da} m를 걷는 동안 형은 ${db} m를 걷는다. 두 사람이 트랙의 같은 지점에서 동시에 출발하여 서로 반대 방향으로 걸었더니 ${t}분 후에 처음으로 만났다. 동생과 형의 속력은 각각 분속 ${nb('몇 m인가?')} (단, 두 사람의 속력은 각각 일정하다.)`, [{ label: '동생', lead: '분속', answer: a0 * g, unit: 'm' }, { label: '형', lead: '분속', answer: b0 * g, unit: 'm' }], {
          explain: `동생의 속력을 분속 ${nb(`${X} m`)}, 형의 속력을 분속 ${nb(`${Y} m`)}라 하자. 같은 시간 동안 간 거리의 비가 속력의 비이므로 ${nb(`${X} : ${Y} = ${da} : ${db}`)}, 곧 ${eqT(e1)}이다. 반대 방향으로 걸어 처음 만날 때까지 두 사람이 걸은 거리의 합은 트랙의 둘레의 길이와 같으므로 ${eqT(e2)}이다. 이 연립방정식을 풀면 ${solH(a0 * g, b0 * g)}이다.`,
          facts: { calc: [[`${per}*${da}/(${t}*(${da}+${db}))`, 0], [`${per}*${db}/(${t}*(${da}+${db}))`, 1]] }
        });
      })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('8-1-4', 'param', [
    TB('param-misread', '계수나 상수항을 잘못 보고 풀었을 때 잘못 본 수 구하기', '기본 ①47 ②44 / 심30', (d) => {
      // ㉡의 한 수를 잘못 보았으므로 ㉠은 바르게 본 식이다. 얻은 값을 ㉠에 넣어 다른 미지수의 값을 구하고, 두 값을 잘못 본 식에 넣는다.
      const m = d.until(() => {
        const [xw, yw] = pickSol(d, 5), [A1, B1, A2] = [nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5)], seeX = d.bool(), isConst = d.bool(), C1 = A1 * xw + B1 * yw;
        if (isConst) { const B2 = nz(d, -6, 6), wrong = A2 * xw + B2 * yw; return { xw, yw, A1, B1, A2, B2, C1, C2: wrong + pm(d) * d.int(1, 9), seeX, isConst, wrong }; }
        const wrong = big(d, 6), C2 = A2 * xw + wrong * yw; return { xw, yw, A1, B1, A2, B2: wrong + pm(d) * d.int(1, 4), C1, C2, seeX, isConst, wrong };
      }, (r) => r.B2 !== 0 && r.A1 * r.B2 - r.A2 * r.B1 !== 0 && r.C1 !== 0 && r.C2 !== 0 && r.wrong !== 0 && Math.abs(r.C1) <= 30 && Math.abs(r.C2) <= 40 && Math.abs(r.wrong) <= 40);
      const { xw, yw, A1, B1, A2, B2, C1, C2, seeX, isConst, wrong } = m, e1 = I(A1, B1, C1), e2 = I(A2, B2, C2), orig = isConst ? C2 : B2, what = isConst ? '상수항' : `${Y}의 계수`;
      const seen = seeX ? nb(`${X} = ${iq(xw)}`) : nb(`${Y} = ${iq(yw)}`), other = seeX ? nb(`${Y} = ${iq(yw)}`) : nb(`${X} = ${iq(xw)}`);
      const xJ = seeX ? `(${xw})` : `(((${C1})-(${B1})*(${yw}))/(${A1}))`, yJ = seeX ? `(((${C1})-(${A1})*(${xw}))/(${B1}))` : `(${yw})`;
      const put1 = seeX ? poly([[A1 * xw, ''], [B1, Y]]) : poly([[A1, X], [B1 * yw, '']]);
      return ansV(`연립방정식 ${sysL(e1, e2)}을 푸는데, ㉡의 ${what} ${iq(orig)}${tail(Math.abs(orig), '을/를')} 다른 수로 잘못 보고 풀어서 ${seen}${tail(Math.abs(seeX ? xw : yw), '을/를')} 얻었다. ${what} ${iq(orig)}${tail(Math.abs(orig), '을/를')} 어떤 수로 잘못 보았는가?`, Q(wrong), 'int', {
        explain: `㉠은 바르게 보았으므로 ${seen}${tail(Math.abs(seeX ? xw : yw), '을/를')} ㉠에 대입하면 ${nb(`${put1} = ${iq(C1)}`)}에서 ${other}이다. 잘못 본 수를 ${vk}라 하면 잘못 보고 푼 식은 ${isConst ? nb(`${poly([[A2, X], [B2, Y]])} = ${vk}`) : nb(`${poly([[A2, X], [1, vk + Y]])} = ${iq(C2)}`)}이고, ${solH(xw, yw)}${tail(Math.abs(yw), '이/가')} 이 식의 해이다. 대입하면 ${isConst ? nb(`${vk} = ${iq(A2 * xw)} ${B2 * yw < 0 ? MINUS : '+'} ${Math.abs(B2 * yw)} = ${iq(wrong)}`) : nb(`${poly([[A2 * xw, ''], [yw, vk]])} = ${iq(C2)}`)}이므로 ${nb(`${vk} = ${iq(wrong)}`)}이다.`,
        facts: { value: isConst ? `(${A2})*${xJ}+(${B2})*${yJ}` : `((${C2})-(${A2})*${xJ})/${yJ}`, unseen: [1, 0] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
