// 4학년 2학기 1단원 분수의 덧셈과 뺄셈 — 단원 틀과 계산 문항(진분수·대분수의 덧셈과 뺄셈, (자연수)−(분수)).
// 수집해 둔 교과서 8종의 평가 자료(단원평가·형성평가·수학익힘·수행평가)에서 뽑은 문제 꼴 목록(기본꼴 1~3: 76·104·86꼴, 심화꼴 77꼴)을
// 처음부터 끝까지 대조하여, 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 따져서 실었다.
// (계산 결과 비교·조건에 맞는 수·□가 있는 식·문장제와 실력 문항은 4-2-1b.js에 있다. 꼴마다의 대조표는 references/textbooks/수학/_분석/4-2-1/싣기_대조표.md)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 싣는 기준
//  - 분모가 같은 분수만 다룬다. 4학년은 약분을 배우지 않았으므로 답은 약분하지 않은 그대로이다(2/8 + 4/8 = 6/8).
//    그래서 답은 분모가 적힌 빈칸 틀을 보여 주고 분자(와 자연수 부분)를 수로 받는다. 합이 1보다 큰 덧셈은 대분수로 답하는지 가분수로 답하는지 물음이나 틀로 밝힌다.
//  - 하는 일이 다르면 다른 문제다. 계산은 구조마다 따로 싣고 facts.rule 에 그 이름을 단다(이름대로 되게 수를 뽑는다):
//    진분수끼리(합이 1보다 작다·1이다·1보다 크다), 진분수의 뺄셈, 1−(진분수), 대분수+대분수(받아올림 없음·있음·합이 자연수), 대분수+진분수, 대분수+가분수,
//    대분수−대분수(받아내림 없음·있음, 차가 진분수·자연수), 대분수−진분수, (자연수)−(진분수·대분수·가분수), 가분수가 낀 뺄셈, 세 분수의 계산.
//  - 나타내는 방법이 다르면 따로 싣는다: 색칠한 그림, ×표 하여 덜어 낸 그림, 수직선, 단위분수가 몇 개인지 세는 문장, 분자끼리 계산하는 과정,
//    자연수끼리·분수끼리 계산하는 과정, 가분수로 바꾸어 계산하는 과정, 자연수에서 1만큼을 받아내림하는 과정, 잘못 계산한 것 바로잡기.
//  - 숫자만 다르거나 상황만 다른 것은 한 번만 싣는다(빈 곳에 두 수의 합·차 써넣기, 화살표 상자, 한 수에 여러 수를 따로 계산하는 표, 섞어 계산하는 놀이판은 계산 문항과 같은 문제).
//
// 뺀 것과 까닭
//  - 상위 학년: 같은 분수를 세 번 넘게 더하는 것·도형의 변의 길이의 합(①70·71 ②89 심76 — 분수의 곱셈·둘레, 5학년. 같은 양 두 번은 덧셈 한 번이라 b.js에 실음),
//    몇 번 덜어 낼 수 있는가(심64 — 분수의 나눗셈), 합과 차로 두 분수 구하기(①58 ②68 ③66 심43 — 방정식 꼴)
//  - 색칠하기·×표 하기·수직선에 나타내기(작도: ①18 ②3·23·51 ③8·25·30), 방법·까닭 쓰기와 문제 만들기(서술형: ②99·100·101 ③86 심13, ①17의 두 방법 모두 쓰기),
//    정해진 답이 없는 것(①4·56 ②73·94), 놀이·암호 풀기(③49), 3학년 되짚기(②104, 자연수와 진분수를 붙여 쓰기만 하는 ③4)
//  - 조건 풀이·경우 따지기가 어려움의 대부분인 것: 여러 칸에 수를 골라 넣어 식 완성하기(①55 ②66·75 ③62의 세 칸 채우기 ③64 심42·49·50), 분모 세 곳이 □(②67),
//    합이 정해진 두 진분수 찾기(②74), 어떤 수에 가장 가까운 합이 되는 두 장(심47), 가로·세로의 합이 같은 칸(②76), 수 카드 다섯 장으로 진분수와 대분수 만들기(심53),
//    세 장 넘게 겹쳐 이어 붙인 길이(심71 — 간격 세기), 바구니 셋의 무게(①73)
//  - 뜻 없는 셈: 빈칸에 들어갈 수끼리 더하기(②9 변형), 두 식의 계산 결과끼리 다시 빼기(심27). 약속한 기호로 계산하기(심30)는 다른 단원처럼 싣지 않는다.
//  - 어림(②102)은 어림하는 방법이 여럿이라 답이 하나로 정해지지 않는다.
//  - 그림이 필요해 미룬 것: 윗접시저울에 놓인 구슬로 수평 맞추기(심69 — 저울과 무게가 적힌 구슬 그림)
// 묻는 말: 수나 값은 "~은?/~는?", 양은 "몇 ~인가?".
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, mixed, pieces, lines, N, M, C } = B.kit;
  const STD = '4수01-15';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'];
  const labelled = (answers) => answers.map((answer, i) => ({ label: LAB[i], answer }));
  // 토씨: 분수와 대분수는 분자를 마지막에 읽는다(5분의 3, 2와 5분의 3).
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const SIGN = { '+': '+', '-': '−', '=': '=' };
  // 식 한 줄: 조각을 이어 적는다. '+', '-', '=' 은 기호로 바꾼다.
  const eq = (...parts) => '<span class="mb-expr">' + parts.map((p) => (SIGN[p] ? '<i>' + SIGN[p] + '</i>' : p)).join(' ') + '</span>';
  const inRow = (html) => '<div class="mb-lines"><div>' + html + '</div></div>';
  // 수 하나: 분자 top, 분모 den. imp 이면 가분수 그대로 적고, 아니면 자연수·진분수·대분수로 적는다.
  const Q = (top, den, imp) => ({ top, den, imp: Boolean(imp) });
  const MX = (w, n, den) => Q(w * den + n, den);
  const W = (q) => Math.floor(q.top / q.den), R = (q) => q.top % q.den;
  const kind = (q) => (q.imp || q.top < q.den ? 'f' : R(q) === 0 ? 'n' : 'm');
  const show = (q) => (kind(q) === 'f' ? frac(q.top, q.den) : kind(q) === 'n' ? String(W(q)) : mixed(W(q), R(q), q.den));
  // 검사가 분자를 다시 셈하는 식. 문제에 적힌 수로만 적는다: 대분수 2 3/7 은 (2*7+3), 자연수 5 는 5*7.
  const top = (q) => (kind(q) === 'f' ? String(q.top) : kind(q) === 'n' ? `${W(q)}*${q.den}` : `(${W(q)}*${q.den}+${R(q)})`);
  const sj = (q, pair) => show(q) + tail(kind(q) === 'f' ? q.top : kind(q) === 'n' ? W(q) : R(q), pair);
  const fj = (k, n, pair) => frac(k, n) + tail(k, pair);
  // 답 틀: 대분수 ㉠ ㉡/den (from 번째 이름표부터). 분자 식 e 의 값을 그 틀로 답할 때의 근거.
  const blank2 = (den, from) => mixed(box(LAB[from || 0]), box(LAB[(from || 0) + 1]), den);
  const calc2 = (e, den, from) => [[`((${e})-(${e})%${den})/${den}`, from || 0], [`(${e})%${den}`, (from || 0) + 1]];
  const two = (d, lo, hi, ok) => d.until(() => [d.int(lo, hi), d.int(lo, hi)], ([x, y]) => ok(x, y));

  // ── 풀이 글 ──
  function whyAdd(a, b) {
    const den = a.den, w = W(a) + W(b), s = R(a) + R(b);
    const head = W(a) && W(b) ? `자연수 부분끼리 더하면 ${W(a)} + ${W(b)} = ${w}이고, ` : '';
    const sum = `분수 부분끼리 더하면 ${frac(R(a), den)} + ${frac(R(b), den)} = ${frac(s, den)}`;
    if (s < den) return `${head}${sum}이다. 따라서 ${mixed(w, s, den)}이다.`;
    if (s === den) return `${head}${sum} = 1이다. ${w} + 1 = ${w + 1}`;
    return `${head}${sum} = ${mixed(1, s - den, den)}이다. ${w} + ${mixed(1, s - den, den)} = ${mixed(w + 1, s - den, den)}`;
  }
  function whySub(a, b) {
    const den = a.den, res = Q(a.top - b.top, den);
    if (R(a) >= R(b) && R(a) > 0) {
      const head = W(b) ? `자연수 부분끼리 빼면 ${W(a)} − ${W(b)} = ${W(a) - W(b)}이고, ` : '';
      return `${head}분수 부분끼리 빼면 ${frac(R(a), den)} − ${frac(R(b), den)} = ${R(a) === R(b) ? 0 : frac(R(a) - R(b), den)}이다. 따라서 ${show(res)}이다.`;
    }
    const moved = W(a) - 1 ? mixed(W(a) - 1, R(a) + den, den) : frac(R(a) + den, den);
    const first = R(a) === 0
      ? `${W(a)}에서 1만큼을 ${frac(den, den)}${tail(den, '으로/로')} 바꾸면 ${moved}이다.`
      : `${frac(R(a), den)}에서 ${fj(R(b), den, '을/를')} 뺄 수 없으므로 자연수에서 1만큼을 받아내림하여 ${sj(a, '을/를')} ${moved}${tail(R(a) + den, '으로/로')} 바꾼다.`;
    return `${first} ${moved} − ${show(b)} = ${show(res)}`;
  }
  const whyImproper = (a, op, b) => {
    const den = a.den, v = op === '+' ? a.top + b.top : a.top - b.top;
    return `가분수로 나타내어 계산한다. ${frac(a.top, den)} ${SIGN[op]} ${frac(b.top, den)} = ${frac(v, den)}` + (v >= den ? ` = ${show(Q(v, den))}` : '');
  };

  // 계산 문항. parts: 수와 '+', '-' 를 번갈아 적은 것. 답은 대분수 틀(mixed: ㉠ ㉡/den), 분자 틀(top: □/den), 자연수 틀(whole: □) 가운데 하나로 받는다.
  function calcItem(parts, frame, o) {
    const den = parts[0].den, shown = [];
    let value = 0, e = '', sign = '+';
    parts.forEach((p, i) => {
      if (typeof p === 'string') { sign = p; shown.push(p); return; }
      value += sign === '+' ? p.top : -p.top; e += (i ? sign : '') + top(p); shown.push(show(p));
    });
    if (frame === 'mixed') return M('계산 결과를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([Math.floor(value / den), value % den]), { figure: eq(...shown, '=', blank2(den)), explain: o.explain, facts: { calc: calc2(e, den), rule: o.rule } });
    if (frame === 'top') return N('□ 안에 알맞은 수는?', value, { figure: eq(...shown, '=', frac(box(), den)), explain: o.explain, facts: { calc: [[e, 0]], rule: o.rule } });
    return N('□ 안에 알맞은 수는?', value / den, { figure: eq(...shown, '=', box()), explain: o.explain, facts: { calc: [[`(${e})/${den}`, 0]], rule: o.rule } });
  }

  // ── 그림 ──
  // 한 띠를 den 칸으로 똑같이 나누어 앞의 a 칸은 파란색, 이어서 b 칸은 주황색으로 칠한다.
  function twoTone(den, a, b) {
    const w = Math.min(26, 252 / den), h = 34, width = den * w + 4;
    let out = '';
    for (let i = 0; i < den; i += 1) out += `<rect class="mb-piece${i < a ? ' is-on' : ''}"${i >= a && i < a + b ? ' style="fill:#fdba74"' : ''} x="${(2 + i * w).toFixed(1)}" y="2" width="${w.toFixed(1)}" height="${h}"/>`;
    return `<svg class="mb-pieces" viewBox="0 0 ${width.toFixed(1)} ${h + 4}" width="${Math.round(width)}" role="img" aria-label="띠를 똑같이 ${den}칸으로 나누어 ${a}칸은 파란색, ${b}칸은 주황색으로 색칠">${out}</svg>`;
  }
  // 띠 여러 개(각각 den 칸). 앞에서부터 shaded 칸을 색칠하고, 색칠한 칸 가운데 뒤쪽 cut 칸에 ×표 한다(덜어 낸 만큼).
  function crossed(den, shaded, cut) {
    const bars = Math.ceil(shaded / den), w = Math.min(26, 216 / den), h = 28, gap = 8, width = den * w + 4, height = bars * (h + gap) - gap + 4;
    let out = '';
    for (let k = 0; k < bars * den; k += 1) {
      const x = 2 + (k % den) * w, y = 2 + Math.floor(k / den) * (h + gap);
      out += `<rect class="mb-piece${k < shaded ? ' is-on' : ''}" x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}"/>`;
      if (k >= shaded - cut && k < shaded) out += `<path class="mb-strike" style="stroke-width:2" d="M${(x + 5).toFixed(1)} ${y + 6}L${(x + w - 5).toFixed(1)} ${y + h - 6}M${(x + w - 5).toFixed(1)} ${y + 6}L${(x + 5).toFixed(1)} ${y + h - 6}"/>`;
    }
    const said = bars === 1 ? `띠를 똑같이 ${den}칸으로 나누어 ${shaded}칸을 색칠하고, 그 가운데 ${cut}칸에 ×표` : `띠 ${bars}개를 각각 똑같이 ${den}칸으로 나누어 모두 ${shaded}칸을 색칠하고, 그 가운데 ${cut}칸에 ×표`;
    return `<svg class="mb-pieces" viewBox="0 0 ${width.toFixed(1)} ${height}" width="${Math.round(width)}" role="img" aria-label="${said}">${out}</svg>`;
  }
  // 0부터 spans 까지의 수직선(1을 parts 칸으로 똑같이 나눔). hops 의 칸 수만큼 0에서부터 차례로 뛴다(음수는 왼쪽으로 되돌아온다).
  function hopLine(spans, parts, hops) {
    const total = spans * parts, u = Math.min(24, 264 / total), x = (i) => 18 + i * u, y = 50, width = 36 + total * u;
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(total).toFixed(1)}" y2="${y}"/>`;
    for (let i = 0; i <= total; i += 1) out += `<line class="mb-axis" x1="${x(i).toFixed(1)}" y1="${y - (i % parts === 0 ? 6 : 3.5)}" x2="${x(i).toFixed(1)}" y2="${y + (i % parts === 0 ? 6 : 3.5)}"/>`;
    for (let i = 0; i <= spans; i += 1) out += `<text class="mb-km-label" x="${x(i * parts).toFixed(1)}" y="${y + 20}" text-anchor="middle">${i}</text>`;
    let at = 0;
    hops.forEach((hop, k) => {
      const x1 = x(at), x2 = x(at + hop), base = y - 8, cx = (x1 + x2) / 2, cy = base - (hop < 0 ? 22 : 40), color = k === 0 ? '#1d4ed8' : '#c2410c';
      // 화살촉은 곡선이 끝점으로 들어오는 쪽을 향한다.
      const dx = x2 - cx, dy = base - cy, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, bx = x2 - ux * 6, by = base - uy * 6;
      out += `<path d="M${x1.toFixed(1)} ${base}Q${cx.toFixed(1)} ${cy} ${x2.toFixed(1)} ${base}" style="fill:none;stroke:${color};stroke-width:1.7"/>`
        + `<path d="M${x2.toFixed(1)} ${base}L${(bx - uy * 3).toFixed(1)} ${(by + ux * 3).toFixed(1)}L${(bx + uy * 3).toFixed(1)} ${(by - ux * 3).toFixed(1)}Z" style="fill:${color}"/>`;
      at += hop;
    });
    const said = hops.map((hop, k) => (k === 0 ? `0에서 오른쪽으로 ${hop}칸 간` : `${hop < 0 ? '왼쪽' : '오른쪽'}으로 ${Math.abs(hop)}칸 간`)).join(' 다음 ').replace(/간$/, '갔다');
    return `<svg class="mb-numberline" viewBox="0 0 ${width.toFixed(1)} 76" width="${Math.round(width * 1.05)}" role="img" aria-label="수직선: 0부터 ${spans}까지, 1을 똑같이 ${parts}칸으로 나누었다. ${said}">${out}</svg>`;
  }
  // 색칠한 원: 모두 색칠한 원 w개와 den조각 중 n조각을 색칠한 원 하나
  const circlesOf = (w, n, den, scale) => Array.from({ length: w + 1 }, (_, i) => pieces('circle', den, { shaded: i < w ? den : n, scale })).join(' ');

  B.addUnit({
    id: '4-2-1', grade: 4, semester: 2, no: 1, title: '분수의 덧셈과 뺄셈', version: 2,
    groups: [
      {
        id: 'padd', title: '진분수의 덧셈', standard: STD,
        types: [
          T('padd-unit', '단위분수가 몇 개인지 세어 더하기', '①5 ②1', (d) => {
            const den = d.int(6, 12), [a, b] = two(d, 2, den - 3, (x, y) => x + y < den && x !== y), u = frac(1, den);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([a, b, a + b]), {
              figure: lines([`${fj(a, den, '은/는')} ${u}이 ${box(LAB[0])}개, ${fj(b, den, '은/는')} ${u}이 ${box(LAB[1])}개이므로`, `${eq(frac(a, den), '+', frac(b, den))}${tail(b, '은/는')} ${u}이 ${box(LAB[2])}개이다.`]),
              explain: `${fj(a, den, '은/는')} ${u}이 ${a}개, ${fj(b, den, '은/는')} ${u}이 ${b}개이다. ${a} + ${b} = ${a + b}이므로 합은 ${u}이 ${a + b}개인 ${frac(a + b, den)}이다.`,
              facts: { calc: [[String(a), 0], [String(b), 1], [`${a}+${b}`, 2]] }
            });
          }),
          T('padd-unit-over', '단위분수가 몇 개인지 세어 더하기(합이 1보다 크다)', '①5 ②1', (d) => {
            const den = d.int(5, 11), [a, b] = two(d, 2, den - 1, (x, y) => x + y > den && x !== y), u = frac(1, den), s = a + b;
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([s, 1, s - den]), {
              figure: lines([`${eq(frac(a, den), '+', frac(b, den))}${tail(b, '은/는')} ${u}이 ${box(LAB[0])}개이므로`, `대분수로 나타내면 ${blank2(den, 1)}이다.`]),
              explain: `${u}이 ${a} + ${b} = ${s}(개)이므로 ${frac(s, den)}이다. ${fj(s, den, '은/는')} ${fj(den, den, '과/와')} ${frac(s - den, den)}의 합이므로 ${mixed(1, s - den, den)}이다.`,
              facts: { calc: [[`${a}+${b}`, 0]].concat(calc2(`${a}+${b}`, den, 1)) }
            });
          }),
          T('padd-picture', '색칠한 그림을 보고 진분수의 덧셈하기', '①6 ②2 ③7 심3', (d) => {
            const den = d.int(5, 10), [a, b] = two(d, 1, den - 2, (x, y) => x + y < den && x !== y);
            return M('파란색으로 색칠한 부분과 주황색으로 색칠한 부분의 합을 구하는 식이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a, b, a + b]), {
              figure: twoTone(den, a, b) + eq(frac(box(LAB[0]), den), '+', frac(box(LAB[1]), den), '=', frac(box(LAB[2]), den)),
              explain: `한 칸은 전체의 ${frac(1, den)}이다. 파란색 부분은 ${a}칸, 주황색 부분은 ${b}칸이므로 ${frac(a, den)} + ${frac(b, den)} = ${frac(a + b, den)}이다.`,
              facts: { calc: [[String(a), 0], [String(b), 1], [`${a}+${b}`, 2]] }
            });
          }),
          T('padd-picture-over', '색칠한 그림을 보고 합이 1보다 큰 덧셈하기', '①6 ②2 ③7 심3', (d) => {
            const den = d.int(4, 8), [a, b] = two(d, 2, den - 1, (x, y) => x + y > den), s = a + b;
            return M('두 그림에서 색칠한 부분의 합을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([1, s - den]), {
              figure: inRow(pieces('circle', den, { shaded: a, scale: 1.2 }) + ' ' + pieces('circle', den, { shaded: b, scale: 1.2 })) + eq(blank2(den)),
              explain: `색칠한 부분은 각각 ${frac(a, den)}, ${frac(b, den)}이다. ${frac(a, den)} + ${frac(b, den)} = ${frac(s, den)} = ${mixed(1, s - den, den)}`,
              facts: { mixedPieces: 'mixed', calc: calc2(`${a}+${b}`, den) }
            });
          }),
          T('padd-line', '수직선을 보고 진분수의 덧셈하기', '①7 ②2 ③6 심3', (d) => {
            const den = d.int(4, 8), [a, b] = two(d, 2, den - 1, (x, y) => x + y > den && x !== y);
            return M('수직선을 보고 ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a, b, a + b]), {
              figure: hopLine(2, den, [a, b]) + eq(frac(box(LAB[0]), den), '+', frac(box(LAB[1]), den), '=', frac(box(LAB[2]), den)),
              explain: `작은 눈금 한 칸은 ${frac(1, den)}이다. 0에서 ${a}칸 간 다음 ${b}칸 더 갔으므로 ${frac(a, den)} + ${frac(b, den)} = ${frac(a + b, den)}이다.`,
              facts: { calc: [[String(a), 0], [String(b), 1], [`${a}+${b}`, 2]] }
            });
          }),
          T('padd-steps', '분자끼리 더하는 과정', '①6 ③5', (d) => {
            const den = d.int(6, 15), [a, b] = two(d, 1, den - 2, (x, y) => x + y < den && x !== y);
            return M('㉠, ㉡에 알맞은 수는?', labelled([b, a + b]), {
              figure: eq(frac(a, den), '+', frac(b, den), '=', frac(`${a} + ${box(LAB[0])}`, den), '=', frac(box(LAB[1]), den)),
              explain: `분모는 그대로 두고 분자끼리 더한다. ${a} + ${b} = ${a + b}이므로 ${frac(a + b, den)}이다.`,
              facts: { calc: [[String(b), 0], [`${a}+${b}`, 1]] }
            });
          }),
          T('padd-steps-over', '합을 가분수와 대분수로 나타내는 과정', '②4 ③6', (d) => {
            const den = d.int(5, 12), [a, b] = two(d, 2, den - 1, (x, y) => x + y > den && x !== y), s = a + b;
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([s, 1, s - den]), {
              figure: eq(frac(a, den), '+', frac(b, den), '=', frac(box(LAB[0]), den), '=', blank2(den, 1)),
              explain: `분모는 그대로 두고 분자끼리 더하면 ${frac(s, den)}이다. ${frac(s, den)} = ${frac(den, den)} + ${frac(s - den, den)} = ${mixed(1, s - den, den)}`,
              facts: { calc: [[`${a}+${b}`, 0]].concat(calc2(`${a}+${b}`, den, 1)) }
            });
          }),
          T('padd-calc', '(진분수)+(진분수): 합이 1보다 작다', '①19·37 ②5 ③1 심1·5', (d) => {
            const den = d.int(7, 19), [a, b] = two(d, 1, den - 2, (x, y) => x + y < den && x !== y);
            return calcItem([Q(a, den), '+', Q(b, den)], 'top', { rule: 'properSum', explain: `분모는 그대로 두고 분자끼리 더한다. ${a} + ${b} = ${a + b}이므로 ${frac(a + b, den)}이다.` });
          }),
          T('padd-over', '(진분수)+(진분수): 합이 1보다 크다', '①21 ②7 ③3 심2·5', (d) => {
            const den = d.int(5, 13), [a, b] = two(d, 2, den - 1, (x, y) => x + y > den && x !== y), s = a + b;
            return calcItem([Q(a, den), '+', Q(b, den)], 'mixed', { rule: 'properOver', explain: `분자끼리 더하면 ${frac(s, den)}이다. 가분수이므로 대분수로 나타내면 ${mixed(1, s - den, den)}이다.` });
          }),
          T('padd-one-pick', '합이 1인 덧셈 고르기', '①20 ②6 ③2', (d) => {
            // 틀린 보기: 분자의 합이 분모보다 1 작은 것, 1 큰 것
            const dens = d.shuffle([5, 6, 7, 8, 9, 10, 11, 12, 13]).slice(0, 3), gaps = d.shuffle([0, -1, 1]);
            const rows = dens.map((den, i) => { const s = den + gaps[i], a = d.int(Math.max(2, s - den + 1), Math.min(den - 1, s - 2)); return [a, s - a, den]; });
            return C('계산 결과가 1인 것은?', rows.map(([a, b, den]) => `${frac(a, den)} + ${frac(b, den)}`), gaps.indexOf(0), {
              explain: rows.map(([a, b, den]) => `${frac(a, den)} + ${frac(b, den)} = ${frac(a + b, den)}`).join(', ') + '이다. 분자와 분모가 같은 분수는 1과 같다.',
              facts: { choose: { exprs: rows.map(([a, b, den]) => `(${a}+${b})/${den}`), rule: 'equals', target: 1 } }
            });
          }),
          T('padd-one-pair', '1을 두 진분수의 합으로 나타내기', '①1·2 심4', (d) => {
            const den = d.int(5, 15), a = d.until(() => d.int(1, den - 1), (v) => v * 2 !== den);
            return N('□ 안에 알맞은 수는?', den - a, {
              figure: eq(1, '=', frac(a, den), '+', frac(box(), den)),
              explain: `1은 ${frac(den, den)}${tail(den, '과/와')} 같다. ${den} − ${a} = ${den - a}이므로 ${frac(a, den)} + ${frac(den - a, den)} = 1이다.`,
              facts: { calc: [[`${den}-${a}`, 0]] }
            });
          }),
          T('padd-one-cards', '합이 1이 되는 두 분수 찾기', '①3·53 ②70 심45', (d) => {
            // 합이 1인 짝은 하나뿐이고, 분자의 합이 분모보다 1 크거나 작은 짝이 섞여 있다.
            const den = d.int(9, 15), sums = (list) => [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]].map(([i, j]) => [i, j, list[i] + list[j]]);
            const tops = d.until(() => d.shuffle(Array.from({ length: den - 1 }, (_, i) => i + 1)).slice(0, 4), (list) => sums(list).filter((s) => s[2] === den).length === 1 && sums(list).some((s) => Math.abs(s[2] - den) === 1));
            const all = sums(tops), right = all.find((s) => s[2] === den), list = d.shuffle(d.shuffle(all.filter((s) => s !== right)).slice(0, 3).concat([right]));
            return C('합이 1이 되는 두 분수는?', list.map(([i, j]) => `${frac(tops[i], den)}, ${frac(tops[j], den)}`), list.indexOf(right), {
              figure: B.kit.numbers(tops.map((v) => frac(v, den))),
              explain: `분자의 합이 분모 ${josa(den, '과/와')} 같으면 합이 1이다. ${tops[right[0]]} + ${tops[right[1]]} = ${den}이므로 ${frac(tops[right[0]], den)} + ${frac(tops[right[1]], den)} = 1이다.`,
              facts: { choose: { exprs: list.map(([i, j]) => `(${tops[i]}+${tops[j]})/${den}`), rule: 'equals', target: 1 } }
            });
          }),
          T('padd-wrong-fix', '분모끼리도 더한 계산 바로잡기', '①46 ②96 ③9 심8', (d) => {
            const den = d.int(5, 9), [a, b] = two(d, 2, den - 1, (x, y) => x + y > den && x !== y), s = a + b;
            return M('다음은 잘못 계산한 것이다. 바르게 계산한 값을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([1, s - den]), {
              figure: lines([eq(frac(a, den), '+', frac(b, den), '=', frac(`${a} + ${b}`, `${den} + ${den}`), '=', frac(s, den * 2)), `바른 계산 결과: ${blank2(den)}`]),
              explain: `분모는 그대로 두고 분자끼리만 더해야 한다. ${frac(a, den)} + ${frac(b, den)} = ${frac(s, den)} = ${mixed(1, s - den, den)}`,
              facts: { calc: calc2(`${a}+${b}`, den) }
            });
          })
        ]
      },
      {
        id: 'psub', title: '진분수의 뺄셈과 1−(진분수)', standard: STD,
        types: [
          T('psub-unit', '단위분수가 몇 개인지 세어 빼기', '①5 ②16 ③13', (d) => {
            const den = d.int(6, 16), [a, b] = two(d, 1, den - 1, (x, y) => x > y + 1), u = frac(1, den);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([a, b, a - b]), {
              figure: lines([`${fj(a, den, '은/는')} ${u}이 ${box(LAB[0])}개, ${fj(b, den, '은/는')} ${u}이 ${box(LAB[1])}개이므로`, `${eq(frac(a, den), '-', frac(b, den))}${tail(b, '은/는')} ${u}이 ${box(LAB[2])}개이다.`]),
              explain: `${fj(a, den, '은/는')} ${u}이 ${a}개, ${fj(b, den, '은/는')} ${u}이 ${b}개이다. ${a} − ${b} = ${a - b}이므로 차는 ${u}이 ${a - b}개인 ${frac(a - b, den)}이다.`,
              facts: { calc: [[String(a), 0], [String(b), 1], [`${a}-${b}`, 2]] }
            });
          }),
          T('psub-picture', '×표 한 그림을 보고 진분수의 뺄셈하기', '①6 ②17 ③14 심3', (d) => {
            const den = d.int(5, 9), [a, b] = two(d, 1, den - 1, (x, y) => x > y && x - y !== y);
            return M('색칠한 부분에서 ×표 한 만큼을 덜어 내는 뺄셈식이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a, b, a - b]), {
              figure: crossed(den, a, b) + eq(frac(box(LAB[0]), den), '-', frac(box(LAB[1]), den), '=', frac(box(LAB[2]), den)),
              explain: `한 칸은 전체의 ${frac(1, den)}이다. 색칠한 ${a}칸 중에서 ${b}칸을 덜어 내면 ${a - b}칸이 남으므로 ${frac(a, den)} − ${frac(b, den)} = ${frac(a - b, den)}이다.`,
              facts: { calc: [[String(a), 0], [String(b), 1], [`${a}-${b}`, 2]] }
            });
          }),
          T('psub-line', '수직선을 보고 진분수의 뺄셈하기', '①7 ③15', (d) => {
            const den = d.int(6, 10), [a, b] = two(d, 2, den - 1, (x, y) => x > y + 1 && x - y !== y);
            return M('수직선을 보고 ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a, b, a - b]), {
              figure: hopLine(1, den, [a, -b]) + eq(frac(box(LAB[0]), den), '-', frac(box(LAB[1]), den), '=', frac(box(LAB[2]), den)),
              explain: `작은 눈금 한 칸은 ${frac(1, den)}이다. 0에서 ${a}칸 간 다음 ${b}칸 되돌아왔으므로 ${frac(a, den)} − ${frac(b, den)} = ${frac(a - b, den)}이다.`,
              facts: { calc: [[String(a), 0], [String(b), 1], [`${a}-${b}`, 2]] }
            });
          }),
          T('psub-steps', '분자끼리 빼는 과정', '①6 ②18 ③12', (d) => {
            const den = d.int(7, 20), [a, b] = two(d, 1, den - 1, (x, y) => x > y + 1);
            return M('㉠, ㉡에 알맞은 수는?', labelled([b, a - b]), {
              figure: eq(frac(a, den), '-', frac(b, den), '=', frac(`${a} − ${box(LAB[0])}`, den), '=', frac(box(LAB[1]), den)),
              explain: `분모는 그대로 두고 분자끼리 뺀다. ${a} − ${b} = ${a - b}이므로 ${frac(a - b, den)}이다.`,
              facts: { calc: [[String(b), 0], [`${a}-${b}`, 1]] }
            });
          }),
          T('psub-calc', '(진분수)−(진분수)', '①27·37 ②19 ③11 심1', (d) => {
            const den = d.int(7, 19), [a, b] = two(d, 1, den - 1, (x, y) => x > y + 1 && x - y !== y);
            return calcItem([Q(a, den), '-', Q(b, den)], 'top', { rule: 'properDiff', explain: `분모는 그대로 두고 분자끼리 뺀다. ${a} − ${b} = ${a - b}이므로 ${frac(a - b, den)}이다.` });
          }),
          T('psub-one-unit', '1−(진분수)를 단위분수의 개수로 알아보기', '①1·8 ②16', (d) => {
            const den = d.int(5, 12), b = d.until(() => d.int(2, den - 2), (v) => v * 2 !== den), u = frac(1, den);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([den, b, den - b]), {
              figure: lines([`1은 ${u}이 ${box(LAB[0])}개, ${fj(b, den, '은/는')} ${u}이 ${box(LAB[1])}개이므로`, `${eq(1, '-', frac(b, den))}${tail(b, '은/는')} ${u}이 ${box(LAB[2])}개이다.`]),
              explain: `1은 ${frac(den, den)}${tail(den, '과/와')} 같으므로 ${u}이 ${den}개이다. ${den} − ${b} = ${den - b}이므로 ${u}이 ${den - b}개인 ${frac(den - b, den)}이다.`,
              facts: { calc: [[String(den), 0], [String(b), 1], [`${den}-${b}`, 2]] }
            });
          }),
          T('psub-one-steps', '1을 가분수로 바꾸어 빼는 과정', '①8 ②20 ③16', (d) => {
            const den = d.int(5, 15), b = d.until(() => d.int(2, den - 2), (v) => v * 2 !== den);
            return M('㉠, ㉡에 알맞은 수는?', labelled([den, den - b]), {
              figure: eq(1, '-', frac(b, den), '=', frac(box(LAB[0]), den), '-', frac(b, den), '=', frac(box(LAB[1]), den)),
              explain: `1을 분모가 ${den}인 분수 ${frac(den, den)}${tail(den, '으로/로')} 바꾸어 분자끼리 뺀다. ${den} − ${b} = ${den - b}`,
              facts: { calc: [[String(den), 0], [`${den}-${b}`, 1]] }
            });
          }),
          T('psub-one-picture', '×표 한 그림을 보고 1−(진분수) 계산하기', '①8 ②20 ③16', (d) => {
            const den = d.int(5, 9), b = d.until(() => d.int(2, den - 2), (v) => v * 2 !== den);
            return M('전체에서 ×표 한 만큼을 덜어 내는 뺄셈식이다. ㉠, ㉡에 알맞은 수는?', labelled([b, den - b]), {
              figure: crossed(den, den, b) + eq(1, '-', frac(box(LAB[0]), den), '=', frac(box(LAB[1]), den)),
              explain: `전체 1은 ${frac(den, den)}이다. ${den}칸 중에서 ${b}칸을 덜어 내면 ${den - b}칸이 남으므로 1 − ${frac(b, den)} = ${frac(den - b, den)}이다.`,
              facts: { calc: [[String(b), 0], [`${den}-${b}`, 1]] }
            });
          }),
          T('psub-one-calc', '1−(진분수)', '①28·37 ②21·103 ③16', (d) => {
            const den = d.int(6, 19), b = d.until(() => d.int(2, den - 2), (v) => v * 2 !== den);
            return calcItem([Q(den, den), '-', Q(b, den)], 'top', { rule: 'oneMinus', explain: `1을 ${frac(den, den)}${tail(den, '으로/로')} 바꾸어 계산한다. ${frac(den, den)} − ${frac(b, den)} = ${frac(den - b, den)}` });
          }),
          T('psub-one-twice', '1에서 두 진분수를 차례로 빼기', '①36', (d) => {
            const den = d.int(7, 15), [a, b] = two(d, 1, den - 3, (x, y) => x + y < den - 1 && x !== y);
            return calcItem([Q(den, den), '-', Q(a, den), '-', Q(b, den)], 'top', { rule: 'oneMinusTwice', explain: `1을 ${frac(den, den)}${tail(den, '으로/로')} 바꾸어 앞에서부터 차례로 계산한다. ${frac(den, den)} − ${frac(a, den)} = ${frac(den - a, den)}, ${frac(den - a, den)} − ${frac(b, den)} = ${frac(den - a - b, den)}` });
          })
        ]
      },
      {
        id: 'madd', title: '대분수의 덧셈', standard: STD,
        types: [
          T('madd-picture', '색칠한 그림을 보고 대분수의 덧셈하기', '②8 ③21', (d) => {
            const den = d.int(4, 6), [w1, w2] = d.pick([[1, 1], [1, 2], [2, 1]]), [x, y] = two(d, 1, den - 1, (p, q) => p + q !== den && (w1 !== w2 || p !== q));
            // 검사가 다시 셈하는 식은 그림 설명에 적힌 수(조각 수와 색칠한 조각 수)로 적는다.
            const a = MX(w1, x, den), b = MX(w2, y, den), e = Array(w1).fill(den).concat([x], Array(w2).fill(den), [y]).join('+'), s = a.top + b.top;
            return M('두 그림이 나타내는 수의 합을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([Math.floor(s / den), s % den]), {
              figure: lines([circlesOf(w1, x, den, 0.95), circlesOf(w2, y, den, 0.95)]) + eq(blank2(den)),
              explain: `두 그림이 나타내는 수는 ${show(a)}, ${show(b)}이다. ${whyAdd(a, b)}`,
              facts: { mixedPieces: 'mixed', calc: calc2(e, den) }
            });
          }),
          T('madd-line', '수직선을 보고 대분수의 덧셈하기', '①11 ②8 ③24', (d) => {
            const den = d.int(3, 5), [x, y] = two(d, 1, den - 1, (p, q) => p + q !== den), w2 = den === 5 && x + y > den ? 1 : d.int(1, 2);
            const a = MX(1, x, den), b = MX(w2, y, den), s = a.top + b.top;
            return M('수직선에 나타낸 덧셈의 계산 결과를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([Math.floor(s / den), s % den]), {
              figure: hopLine(Math.ceil(s / den), den, [a.top, b.top]) + eq(blank2(den)),
              explain: `작은 눈금 한 칸은 ${frac(1, den)}이다. ${a.top}칸은 ${show(a)}, ${b.top}칸은 ${show(b)}이므로 ${show(a)} + ${show(b)} = ${frac(s, den)} = ${mixed(Math.floor(s / den), s % den, den)}이다.`,
              facts: { calc: calc2(`${a.top}+${b.top}`, den) }
            });
          }),
          T('madd-steps-split', '자연수끼리, 분수끼리 더하는 과정', '①9·17 ②9 ③21·59 심12', (d) => {
            const den = d.int(5, 12), [x, y] = two(d, 1, den - 2, (p, q) => p + q < den), [w1, w2] = two(d, 1, 6, (p, q) => p !== q);
            return M('㉠, ㉡에 알맞은 수는?', labelled([w1 + w2, x + y]), {
              figure: lines([eq(mixed(w1, x, den), '+', mixed(w2, y, den)), eq('=', `(${w1} + ${w2})`, '+', `(${frac(x, den)} + ${frac(y, den)})`), eq('=', box(LAB[0]), '+', frac(box(LAB[1]), den))]),
              explain: `자연수 부분끼리 더하면 ${w1} + ${w2} = ${w1 + w2}, 분수 부분끼리 더하면 ${frac(x, den)} + ${frac(y, den)} = ${frac(x + y, den)}이다.`,
              facts: { calc: [[`${w1}+${w2}`, 0], [`${x}+${y}`, 1]] }
            });
          }),
          T('madd-steps-carry', '분수 부분의 합이 가분수인 덧셈의 과정', '①10·16 ②41 ③21', (d) => {
            const den = d.int(5, 9), [x, y] = two(d, 2, den - 1, (p, q) => p + q > den), [w1, w2] = two(d, 1, 4, () => true);
            const a = MX(w1, x, den), b = MX(w2, y, den), e = `${top(a)}+${top(b)}`;
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([x + y, w1 + w2 + 1, x + y - den]), {
              figure: lines([eq(show(a), '+', show(b), '=', w1 + w2, '+', frac(box(LAB[0]), den)), eq('=', blank2(den, 1))]),
              explain: whyAdd(a, b),
              facts: { calc: [[`${x}+${y}`, 0]].concat(calc2(e, den, 1)) }
            });
          }),
          T('madd-steps-improper', '가분수로 바꾸어 더하는 과정', '①11·17 ②9·41 ③22·59 심12', (d) => {
            const den = d.int(4, 9), [x, y] = two(d, 1, den - 1, (p, q) => p + q !== den), [w1, w2] = two(d, 1, 3, () => true);
            const a = MX(w1, x, den), b = MX(w2, y, den), s = a.top + b.top;
            return M('가분수로 바꾸어 계산하였다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([b.top, s, Math.floor(s / den), s % den]), {
              figure: lines([eq(show(a), '+', show(b), '=', frac(a.top, den), '+', frac(box(LAB[0]), den)), eq('=', frac(box(LAB[1]), den), '=', blank2(den, 2))]),
              explain: `${sj(b, '을/를')} 가분수로 나타내면 ${w2} × ${den} + ${y} = ${b.top}이므로 ${frac(b.top, den)}이다. ${frac(a.top, den)} + ${frac(b.top, den)} = ${frac(s, den)} = ${mixed(Math.floor(s / den), s % den, den)}`,
              facts: { calc: [[`${w2}*${den}+${y}`, 0], [`${a.top}+${w2}*${den}+${y}`, 1]].concat(calc2(`${a.top}+${w2}*${den}+${y}`, den, 2)) }
            });
          }),
          T('madd-plain', '(대분수)+(대분수): 분수 부분의 합이 1보다 작다', '①22·37 ②10 ③17 심9', (d) => {
            const den = d.int(5, 15), [x, y] = two(d, 1, den - 2, (p, q) => p + q < den), [w1, w2] = two(d, 1, 9, () => true), a = MX(w1, x, den), b = MX(w2, y, den);
            return calcItem([a, '+', b], 'mixed', { rule: 'mixedSumPlain', explain: whyAdd(a, b) });
          }),
          T('madd-whole', '(대분수)+(대분수): 분수 부분의 합이 1이다', '①23 ②11·103 ③18 심10', (d) => {
            const den = d.int(5, 13), x = d.until(() => d.int(1, den - 1), (v) => v * 2 !== den), [w1, w2] = two(d, 1, 6, () => true), a = MX(w1, x, den), b = MX(w2, den - x, den);
            return calcItem([a, '+', b], 'whole', { rule: 'mixedSumWhole', explain: whyAdd(a, b) });
          }),
          T('madd-carry', '(대분수)+(대분수): 분수 부분의 합이 1보다 크다', '①24·37 ②12 ③19 심10', (d) => {
            const den = d.int(5, 13), [x, y] = two(d, 2, den - 1, (p, q) => p + q > den), [w1, w2] = two(d, 1, 9, () => true), a = MX(w1, x, den), b = MX(w2, y, den);
            return calcItem([a, '+', b], 'mixed', { rule: 'mixedSumCarry', explain: whyAdd(a, b) });
          }),
          T('madd-proper', '(대분수)+(진분수)', '①25 ②13 ③20 심11', (d, n) => {
            // 첫째 문항은 분수 부분의 합이 1보다 작고, 둘째 문항은 1보다 크다.
            const den = d.int(5, 13), w = d.int(1, 8), [x, y] = two(d, 1, den - 1, (p, q) => (n === 0 ? p + q < den : p + q > den)), a = MX(w, x, den), b = Q(y, den);
            return calcItem(n === 0 ? [a, '+', b] : [b, '+', a], 'mixed', { rule: n === 0 ? 'mixedPlusProperPlain' : 'properPlusMixedCarry', explain: n === 0 ? whyAdd(a, b) : whyAdd(b, a) });
          }, { count: 2 }),
          T('madd-improper', '(대분수)+(가분수)', '①26 ②14 ③3·20 심11', (d) => {
            const den = d.int(4, 11), w = d.int(1, 6), x = d.int(1, den - 1), t = d.until(() => d.int(den + 1, den * 3 - 1), (v) => v % den !== 0 && (x + v) % den !== 0);
            const a = MX(w, x, den), b = Q(t, den, true), m = Q(t, den);
            return calcItem([a, '+', b], 'mixed', { rule: 'mixedPlusImproper', explain: `${fj(t, den, '을/를')} 대분수로 나타내면 ${show(m)}이다. ${whyAdd(a, m)}` });
          }),
          T('madd-three', '세 분수의 덧셈', '①36 ②15 ③56', (d) => {
            const den = d.int(5, 9), tops = d.until(() => [d.int(1, den - 1), d.int(1, den - 1), d.int(1, den - 1)], ([p, q, r]) => (p + q + r) % den !== 0 && p + q > den), ws = [d.int(1, 3), d.int(1, 3), d.int(1, 2)];
            const [a, b, c] = tops.map((v, i) => MX(ws[i], v, den)), ab = Q(a.top + b.top, den), abc = Q(ab.top + c.top, den);
            return calcItem([a, '+', b, '+', c], 'mixed', { rule: 'threeSum', explain: `앞에서부터 차례로 계산한다. ${show(a)} + ${show(b)} = ${show(ab)}, ${show(ab)} + ${show(c)} = ${show(abc)}` });
          })
        ]
      },
      {
        id: 'msub', title: '대분수의 뺄셈(분수 부분끼리 뺄 수 있을 때)', standard: STD,
        types: [
          T('msub-picture', '×표 한 그림을 보고 대분수의 뺄셈하기', '①12 ②24', (d) => {
            const den = d.int(4, 6), [x, y] = two(d, 1, den - 1, (p, q) => p > q), [w1, w2] = d.pick([[2, 1], [3, 1], [3, 2]]);
            const a = MX(w1, x, den), b = MX(w2, y, den), rest = a.top - b.top;
            return M('색칠한 부분에서 ×표 한 만큼을 덜어 내는 뺄셈식이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([w2, y, Math.floor(rest / den), rest % den]), {
              figure: crossed(den, a.top, b.top) + eq(show(a), '-', blank2(den, 0), '=', blank2(den, 2)),
              explain: `띠 하나는 1이고 한 칸은 ${frac(1, den)}이다. ×표 한 ${b.top}칸은 ${show(b)}이다. ${whySub(a, b)}`,
              facts: { calc: calc2(String(b.top), den, 0).concat(calc2(`${a.top}-${b.top}`, den, 2)), rule: 'crossPlain' }
            });
          }),
          T('msub-pick-figure', '그림에 알맞은 뺄셈식 고르기', '②25', (d) => {
            // 틀린 식: 빼는 수와 남은 수를 바꾼 것(×표 하지 않은 칸을 뺐다고 본다), 색칠하지 않은 칸까지 세어 띠의 수를 빼어지는 수로 쓴 것
            const den = d.int(4, 6), [x, y] = two(d, 1, den - 1, (p, q) => p > q && p - q !== q), [w1, w2] = d.pick([[2, 1], [3, 1], [3, 2]].filter(([p, q]) => p - q !== q));
            const a = MX(w1, x, den), b = MX(w2, y, den), rest = Q(a.top - b.top, den), bars = Q((w1 + 1) * den, den);
            const said = (p, q) => `${show(p)} − ${show(q)} = ${show(Q(p.top - q.top, den))}`;
            const rows = d.shuffle([[said(a, b), true], [said(a, rest), false], [said(bars, b), false]]);
            return C('색칠한 부분에서 ×표 한 만큼을 덜어 낸 그림이다. 그림에 알맞은 뺄셈식은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: crossed(den, a.top, b.top),
              explain: `띠 하나는 1이고 한 칸은 ${frac(1, den)}이다. 색칠한 ${a.top}칸은 ${show(a)}, ×표 한 ${b.top}칸은 ${show(b)}이므로 ${said(a, b)}이다.`,
              facts: { truth: rows.map((row) => row[1]), want: true }
            });
          }),
          T('msub-steps-split', '자연수끼리, 분수끼리 빼는 과정', '①12·17 ②26 ③28·59', (d) => {
            const den = d.int(5, 12), [x, y] = two(d, 1, den - 1, (p, q) => p > q), [w1, w2] = two(d, 1, 9, (p, q) => p > q);
            return M('㉠, ㉡에 알맞은 수는?', labelled([w1 - w2, x - y]), {
              figure: lines([eq(mixed(w1, x, den), '-', mixed(w2, y, den)), eq('=', `(${w1} <i>−</i> ${w2})`, '+', `(${frac(x, den)} <i>−</i> ${frac(y, den)})`), eq('=', box(LAB[0]), '+', frac(box(LAB[1]), den))]),
              explain: `자연수 부분끼리 빼면 ${w1} − ${w2} = ${w1 - w2}, 분수 부분끼리 빼면 ${frac(x, den)} − ${frac(y, den)} = ${frac(x - y, den)}이다.`,
              facts: { calc: [[`${w1}-${w2}`, 0], [`${x}-${y}`, 1]] }
            });
          }),
          T('msub-line', '수직선을 보고 대분수의 뺄셈하기', '①14·74 ②24 ③29', (d) => {
            const den = d.int(3, 5), [x, y] = two(d, 1, den - 1, (p, q) => p > q), [w1, w2] = d.pick(den === 5 ? [[2, 1], [3, 1], [3, 2]] : [[2, 1], [3, 1], [3, 2], [4, 1], [4, 2]]);
            const a = MX(w1, x, den), b = MX(w2, y, den), rest = a.top - b.top;
            return M('수직선에 나타낸 뺄셈의 계산 결과를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([Math.floor(rest / den), rest % den]), {
              figure: hopLine(w1 + 1, den, [a.top, -b.top]) + eq(blank2(den)),
              explain: `작은 눈금 한 칸은 ${frac(1, den)}이다. ${a.top}칸은 ${show(a)}, 되돌아온 ${b.top}칸은 ${show(b)}이므로 ${show(a)} − ${show(b)} = ${frac(rest, den)} = ${show(Q(rest, den))}이다.`,
              facts: { calc: calc2(`${a.top}-${b.top}`, den) }
            });
          }),
          T('msub-calc', '(대분수)−(대분수): 분수 부분끼리 뺄 수 있다', '①29·37 ②27 ③26·58 심14', (d) => {
            const den = d.int(5, 15), [x, y] = two(d, 1, den - 1, (p, q) => p > q), [w1, w2] = two(d, 1, 9, (p, q) => p > q), a = MX(w1, x, den), b = MX(w2, y, den);
            return calcItem([a, '-', b], 'mixed', { rule: 'mixedDiffPlain', explain: whySub(a, b) });
          }),
          T('msub-zero', '자연수 부분이나 분수 부분이 같은 대분수의 뺄셈', '①29 ②28 ③27', (d, n) => {
            // 첫째 문항은 자연수 부분이 같아 차가 진분수이고, 둘째 문항은 분수 부분이 같아 차가 자연수이다.
            const den = d.int(5, 13);
            if (n === 0) {
              const w = d.int(2, 12), [x, y] = two(d, 1, den - 1, (p, q) => p > q);
              return calcItem([MX(w, x, den), '-', MX(w, y, den)], 'top', { rule: 'sameWhole', explain: `자연수 부분이 같으므로 분수 부분끼리만 빼면 된다. ${frac(x, den)} − ${frac(y, den)} = ${frac(x - y, den)}` });
            }
            const x = d.int(1, den - 1), [w1, w2] = two(d, 1, 9, (p, q) => p > q + 1);
            return calcItem([MX(w1, x, den), '-', MX(w2, x, den)], 'whole', { rule: 'sameFraction', explain: `분수 부분이 같으므로 분수 부분끼리 빼면 0이다. 자연수 부분끼리 빼면 ${w1} − ${w2} = ${w1 - w2}이다.` });
          }, { count: 2 }),
          T('msub-proper', '(대분수)−(진분수): 분수 부분끼리 뺄 수 있다', '①30 ②29', (d) => {
            const den = d.int(5, 15), [x, y] = two(d, 1, den - 1, (p, q) => p > q), a = MX(d.int(1, 9), x, den), b = Q(y, den);
            return calcItem([a, '-', b], 'mixed', { rule: 'mixedMinusProperPlain', explain: `자연수 부분은 그대로 두고 분수 부분끼리 뺀다. ${frac(x, den)} − ${frac(y, den)} = ${frac(x - y, den)}이므로 ${show(Q(a.top - y, den))}이다.` });
          })
        ]
      },
      {
        id: 'nsub', title: '(자연수)−(분수)', standard: STD,
        types: [
          T('nsub-picture', '×표 한 그림을 보고 (자연수)−(진분수) 계산하기', '②30 ③33', (d) => {
            const den = d.int(4, 8), n = d.int(2, 3), y = d.until(() => d.int(1, den - 1), (v) => v * 2 !== den), a = Q(n * den, den), b = Q(y, den);
            return M('색칠한 부분에서 ×표 한 만큼을 덜어 내는 뺄셈식이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([y, n - 1, den - y]), {
              figure: crossed(den, n * den, y) + eq(n, '-', frac(box(LAB[0]), den), '=', blank2(den, 1)),
              explain: `띠 하나는 1이고 한 칸은 ${frac(1, den)}이다. ×표 한 ${y}칸은 ${frac(y, den)}이다. ${whySub(a, b)}`,
              facts: { calc: [[String(y), 0]].concat(calc2(`${n * den}-${y}`, den, 1)) }
            });
          }),
          T('nsub-steps-one', '자연수에서 1만큼을 분수로 바꾸어 빼는 과정', '①15 ②31 ③33', (d) => {
            const den = d.int(4, 12), y = d.int(1, den - 1), [n, w] = two(d, 1, 9, (p, q) => p >= q + 2), a = Q(n * den, den), b = MX(w, y, den);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([den, n - 1 - w, den - y]), {
              figure: lines([eq(n, '-', show(b), '=', mixed(n - 1, box(LAB[0]), den), '-', show(b)), eq('=', blank2(den, 1))]),
              explain: whySub(a, b),
              facts: { calc: [[String(den), 0]].concat(calc2(`${top(a)}-${top(b)}`, den, 1)) }
            });
          }),
          T('nsub-steps-improper', '자연수와 대분수를 가분수로 바꾸어 빼는 과정', '①15 ②31·41 ③34 심19', (d) => {
            const den = d.int(4, 9), y = d.int(1, den - 1), [n, w] = two(d, 1, 6, (p, q) => p >= q + 1), b = MX(w, y, den);
            return M('가분수로 바꾸어 계산하였다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([n * den, b.top, n * den - b.top]), {
              figure: eq(n, '-', show(b), '=', frac(box(LAB[0]), den), '-', frac(box(LAB[1]), den), '=', frac(box(LAB[2]), den)),
              explain: `${josa(n, '은/는')} ${frac(1, den)}이 ${n} × ${den} = ${n * den}(개)이므로 ${frac(n * den, den)}이고, ${sj(b, '은/는')} ${frac(b.top, den)}이다. ${frac(n * den, den)} − ${frac(b.top, den)} = ${frac(n * den - b.top, den)}`,
              facts: { calc: [[`${n}*${den}`, 0], [`${w}*${den}+${y}`, 1], [`${n}*${den}-(${w}*${den}+${y})`, 2]] }
            });
          }),
          T('nsub-proper', '(자연수)−(진분수)', '①33·37 ②32·103 ③31 심17', (d) => {
            const den = d.int(5, 15), a = Q(d.int(2, 12) * den, den), b = Q(d.int(1, den - 1), den);
            return calcItem([a, '-', b], 'mixed', { rule: 'naturalMinusProper', explain: whySub(a, b) });
          }),
          T('nsub-mixed', '(자연수)−(대분수)', '①34·37 ②33 ③32 심17', (d) => {
            const den = d.int(5, 15), [n, w] = two(d, 1, 12, (p, q) => p >= q + 2), a = Q(n * den, den), b = MX(w, d.int(1, den - 1), den);
            return calcItem([a, '-', b], 'mixed', { rule: 'naturalMinusMixed', explain: whySub(a, b) });
          }),
          T('nsub-below-one', '(자연수)−(대분수): 차가 진분수이다', '①34 ②33 ③32', (d) => {
            const den = d.int(5, 15), w = d.int(1, 9), a = Q((w + 1) * den, den), b = MX(w, d.int(1, den - 1), den);
            return calcItem([a, '-', b], 'top', { rule: 'naturalMinusMixedBelowOne', explain: whySub(a, b) });
          }),
          T('nsub-improper', '(자연수)−(가분수)', '①35·38 ②34 심17', (d) => {
            const den = d.int(4, 11), t = d.until(() => d.int(den + 1, den * 3 - 1), (v) => v % den !== 0), n = Math.floor(t / den) + d.int(2, 4), a = Q(n * den, den), b = Q(t, den, true), m = Q(t, den);
            return calcItem([a, '-', b], 'mixed', { rule: 'naturalMinusImproper', explain: `${fj(t, den, '을/를')} 대분수로 나타내면 ${show(m)}이다. ${whySub(a, m)}` });
          }),
          T('nsub-wrong-fix', '자연수 부분을 줄이지 않은 계산 바로잡기', '①46 ②96 ③36 심8', (d) => {
            const den = d.int(4, 9), y = d.until(() => d.int(1, den - 1), (v) => v * 2 !== den), [n, w] = two(d, 1, 9, (p, q) => p >= q + 2), a = Q(n * den, den), b = MX(w, y, den), e = `${top(a)}-${top(b)}`;
            return M('다음은 잘못 계산한 것이다. 바르게 계산한 값을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([n - 1 - w, den - y]), {
              figure: lines([eq(n, '-', show(b), '=', mixed(n, den, den), '-', show(b), '=', mixed(n - w, den - y, den)), `바른 계산 결과: ${blank2(den)}`]),
              explain: `${n}에서 1만큼을 ${frac(den, den)}${tail(den, '으로/로')} 바꾸면 자연수 부분은 1 작아져 ${mixed(n - 1, den, den)}이다. ${mixed(n - 1, den, den)} − ${show(b)} = ${mixed(n - 1 - w, den - y, den)}`,
              facts: { calc: calc2(e, den) }
            });
          })
        ]
      },
      {
        id: 'bsub', title: '대분수의 뺄셈(분수 부분끼리 뺄 수 없을 때)', standard: STD,
        types: [
          T('bsub-picture', '×표 한 그림을 보고 받아내림이 있는 뺄셈하기', '①13 ②35 ③39', (d) => {
            const den = d.int(4, 6), [x, y] = two(d, 1, den - 1, (p, q) => p < q), [w1, w2] = d.pick([[3, 1], [4, 1], [4, 2]]);
            const a = MX(w1, x, den), b = MX(w2, y, den), rest = a.top - b.top;
            return M('색칠한 부분에서 ×표 한 만큼을 덜어 내는 뺄셈식이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([w2, y, Math.floor(rest / den), rest % den]), {
              figure: crossed(den, a.top, b.top) + eq(show(a), '-', blank2(den, 0), '=', blank2(den, 2)),
              explain: `띠 하나는 1이고 한 칸은 ${frac(1, den)}이다. ×표 한 ${b.top}칸은 ${show(b)}이다. 색칠한 ${a.top}칸 중에서 ${b.top}칸을 덜어 내면 ${rest}칸이 남으므로 ${show(Q(rest, den))}이다.`,
              facts: { calc: calc2(String(b.top), den, 0).concat(calc2(`${a.top}-${b.top}`, den, 2)), rule: 'crossBorrow' }
            });
          }),
          T('bsub-steps-borrow', '자연수에서 1만큼을 받아내림하여 빼는 과정', '①13·16·17 ②36·41 ③39·59', (d) => {
            const den = d.int(4, 12), [x, y] = two(d, 1, den - 1, (p, q) => p < q), [w1, w2] = two(d, 1, 9, (p, q) => p >= q + 2), a = MX(w1, x, den), b = MX(w2, y, den);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([x + den, w1 - 1 - w2, x + den - y]), {
              figure: lines([eq(show(a), '-', show(b), '=', mixed(w1 - 1, box(LAB[0]), den), '-', show(b)), eq('=', blank2(den, 1))]),
              explain: whySub(a, b),
              facts: { calc: [[`${x}+${den}`, 0]].concat(calc2(`${top(a)}-${top(b)}`, den, 1)) }
            });
          }),
          T('bsub-steps-improper', '가분수로 바꾸어 빼는 과정', '①14·16·17 ②26·36 ③29·40·59 심18', (d) => {
            const den = d.int(4, 9), [x, y] = two(d, 1, den - 1, (p, q) => p < q), [w1, w2] = two(d, 1, 4, (p, q) => p >= q + 2), a = MX(w1, x, den), b = MX(w2, y, den), v = a.top - b.top;
            return M('가분수로 바꾸어 계산하였다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([b.top, v, Math.floor(v / den), v % den]), {
              figure: lines([eq(show(a), '-', show(b), '=', frac(a.top, den), '-', frac(box(LAB[0]), den)), eq('=', frac(box(LAB[1]), den), '=', blank2(den, 2))]),
              explain: `${sj(b, '을/를')} 가분수로 나타내면 ${w2} × ${den} + ${y} = ${b.top}이므로 ${frac(b.top, den)}이다. ${frac(a.top, den)} − ${frac(b.top, den)} = ${frac(v, den)} = ${show(Q(v, den))}`,
              facts: { calc: [[`${w2}*${den}+${y}`, 0], [`${a.top}-(${w2}*${den}+${y})`, 1]].concat(calc2(`${a.top}-(${w2}*${den}+${y})`, den, 2)) }
            });
          }),
          T('bsub-unit', '대분수의 뺄셈을 단위분수의 개수로 알아보기', '②16', (d) => {
            const den = d.int(3, 7), [x, y] = two(d, 1, den - 1, (p, q) => p < q), [w1, w2] = two(d, 1, 4, (p, q) => p >= q + 1), a = MX(w1, x, den), b = MX(w2, y, den), u = frac(1, den);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([a.top, b.top, a.top - b.top]), {
              figure: lines([`${sj(a, '은/는')} ${u}이 ${box(LAB[0])}개, ${sj(b, '은/는')} ${u}이 ${box(LAB[1])}개이므로`, `${eq(show(a), '-', show(b))}${tail(y, '은/는')} ${u}이 ${box(LAB[2])}개이다.`]),
              explain: `${sj(a, '은/는')} ${u}이 ${w1} × ${den} + ${x} = ${a.top}(개), ${sj(b, '은/는')} ${u}이 ${w2} × ${den} + ${y} = ${b.top}(개)이다. ${a.top} − ${b.top} = ${a.top - b.top}`,
              facts: { calc: [[`${w1}*${den}+${x}`, 0], [`${w2}*${den}+${y}`, 1], [`${top(a)}-${top(b)}`, 2]] }
            });
          }),
          T('bsub-bound', '받아내림하면 자연수 부분이 어떻게 되는지 알기', '②97', (d) => {
            const den = d.int(4, 12), [x, y] = two(d, 1, den - 1, (p, q) => p < q), [w1, w2] = two(d, 1, 9, (p, q) => p >= q + 2), a = MX(w1, x, den), b = MX(w2, y, den);
            return N('□ 안에 알맞은 수는?', w1 - w2 - 1, {
              figure: lines([`${w1} − ${w2} = ${w1 - w2}이지만 ${fj(x, den, '이/가')} ${frac(y, den)}보다 작아 자연수에서 1만큼을 받아내림해야 하므로,`, `${eq(show(a), '-', show(b))}의 계산 결과의 자연수 부분은 ${box()}이다.`]),
              explain: whySub(a, b),
              facts: { calc: [[`${w1}-${w2}-1`, 0]] }
            });
          }),
          T('bsub-calc', '(대분수)−(대분수): 분수 부분끼리 뺄 수 없다', '①31·37 ②37·103 ③37·58 심15', (d) => {
            const den = d.int(5, 15), [x, y] = two(d, 1, den - 1, (p, q) => p < q), [w1, w2] = two(d, 1, 9, (p, q) => p >= q + 2), a = MX(w1, x, den), b = MX(w2, y, den);
            return calcItem([a, '-', b], 'mixed', { rule: 'mixedDiffBorrow', explain: whySub(a, b) });
          }),
          T('bsub-below-one', '받아내림하면 차가 진분수인 뺄셈', '①31 ②38 ③37', (d) => {
            const den = d.int(5, 13), [x, y] = two(d, 1, den - 1, (p, q) => p < q), w = d.int(1, 9), a = MX(w + 1, x, den), b = MX(w, y, den);
            return calcItem([a, '-', b], 'top', { rule: 'mixedDiffBorrowBelowOne', explain: whySub(a, b) });
          }),
          T('bsub-proper', '(대분수)−(진분수): 분수 부분끼리 뺄 수 없다', '①32 ②39 ③38 심15', (d) => {
            const den = d.int(5, 13), [x, y] = two(d, 1, den - 1, (p, q) => p < q), a = MX(d.int(2, 12), x, den), b = Q(y, den);
            return calcItem([a, '-', b], 'mixed', { rule: 'mixedMinusProperBorrow', explain: whySub(a, b) });
          }),
          T('bsub-improper', '가분수가 낀 뺄셈', '①35 ②22·40 ③51 심16', (d, n) => {
            // 차례로 (대분수)−(가분수), (가분수)−(대분수), (가분수)−(가분수). 차는 1보다 크고 자연수가 아니다.
            const den = d.int(4, 11);
            const [p, q] = d.until(() => [d.int(den * 3 + 1, den * 6 - 1), d.int(den + 1, den * 3 - 1)], ([s, t]) => s % den !== 0 && t % den !== 0 && s - t > den && (s - t) % den !== 0);
            const a = Q(p, den, n !== 0), b = Q(q, den, n !== 1);
            return calcItem([a, '-', b], 'mixed', { rule: ['mixedMinusImproper', 'improperMinusMixed', 'improperMinusImproper'][n], explain: whyImproper(a, '-', b) });
          }, { count: 3 }),
          T('bsub-three', '세 분수의 뺄셈', '①36 ③57', (d) => {
            const den = d.int(5, 9), [x, y, z] = d.until(() => [d.int(1, den - 1), d.int(1, den - 1), d.int(1, den - 1)], ([p, q, r]) => p < q && (p + den - q) % den !== r && (p - q - r + den * 3) % den !== 0);
            const w2 = d.int(1, 3), w3 = d.int(1, 2), a = MX(w2 + w3 + d.int(3, 4), x, den), b = MX(w2, y, den), c = MX(w3, z, den), ab = Q(a.top - b.top, den), abc = Q(ab.top - c.top, den);
            return calcItem([a, '-', b, '-', c], 'mixed', { rule: 'threeDiff', explain: `앞에서부터 차례로 계산한다. ${show(a)} − ${show(b)} = ${show(ab)}, ${show(ab)} − ${show(c)} = ${show(abc)}` });
          }),
          T('bsub-addsub', '덧셈과 뺄셈이 섞인 세 분수의 계산', '③57 심34', (d) => {
            const den = d.int(5, 9), [x, y, z] = d.until(() => [d.int(1, den - 1), d.int(1, den - 1), d.int(1, den - 1)], ([p, q, r]) => p + q > den && (p + q - r) % den !== 0 && (p + q) % den < r);
            const a = MX(d.int(1, 3), x, den), b = MX(d.int(1, 3), y, den), c = MX(1, z, den), ab = Q(a.top + b.top, den), abc = Q(ab.top - c.top, den);
            return calcItem([a, '+', b, '-', c], 'mixed', { rule: 'addThenSub', explain: `앞에서부터 차례로 계산한다. ${show(a)} + ${show(b)} = ${show(ab)}, ${show(ab)} − ${show(c)} = ${show(abc)}` });
          }),
          T('bsub-wrong-fix', '받아내림하고 자연수 부분을 줄이지 않은 계산 바로잡기', '①46 ③41', (d) => {
            const den = d.int(4, 9), [x, y] = two(d, 1, den - 1, (p, q) => p < q), [w1, w2] = two(d, 1, 9, (p, q) => p >= q + 2), a = MX(w1, x, den), b = MX(w2, y, den);
            return M('다음은 잘못 계산한 것이다. 바르게 계산한 값을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([w1 - 1 - w2, x + den - y]), {
              figure: lines([eq(show(a), '-', show(b), '=', mixed(w1, x + den, den), '-', show(b), '=', mixed(w1 - w2, x + den - y, den)), `바른 계산 결과: ${blank2(den)}`]),
              explain: `자연수에서 1만큼을 받아내림하면 자연수 부분은 1 작아져 ${mixed(w1 - 1, x + den, den)}이다. ${mixed(w1 - 1, x + den, den)} − ${show(b)} = ${mixed(w1 - 1 - w2, x + den - y, den)}`,
              facts: { calc: calc2(`${top(a)}-${top(b)}`, den) }
            });
          })
        ]
      },
      { id: 'comp', title: '계산 결과 비교하기', standard: STD, types: [] },
      { id: 'pick', title: '조건에 맞는 수의 합과 차', standard: STD, types: [] },
      { id: 'box', title: '□가 있는 식과 어떤 수', standard: STD, types: [] },
      { id: 'word', title: '분수의 덧셈과 뺄셈의 활용', standard: STD, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
