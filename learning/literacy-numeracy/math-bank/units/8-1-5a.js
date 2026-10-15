// 중학교 2학년 1학기 5단원 일차함수와 그 그래프 — 단원 틀·도구와 앞쪽 묶음(함수의 뜻, 함숫값, 일차함수의 뜻, 일차함수의 그래프와 평행이동, x절편과 y절편).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 73꼴, 기본꼴 2: 79꼴, 심화꼴: 65꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/8-1-5/싣기_대조표.md 에 있다.
// (기울기, 그래프의 성질, 평행과 일치, 식 구하기, 활용은 8-1-5b.js 에, 실력 문항은 8-1-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계. 성취기준은 9수02-14(함수의 개념을 이해하고, 함숫값을 구할 수 있다), 9수02-15(일차함수의 개념을 이해하고, 그 그래프를 그릴 수 있다),
// 9수02-16(일차함수의 그래프의 성질을 이해하고, 이를 활용하여 문제를 해결할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·문장·표·그래프·점·절편·기울기), 묻는 것(값·식의 수·좌표·사분면·고르기·개수)이 다르면 따로 싣는다. 수와 이름만 다른 것은 한 번만 싣는다.
//  - 중1(7-1-6 정비례와 반비례)에 실린 일은 다시 싣지 않는다: y = ax, y = a/x 꼴의 관계식 세우기, y = ax의 그래프의 성질, 정비례 관계의 표.
//    함숫값 문항에 섞인 y = a/x 꼴의 식은 2022 교과서 세 종에 모두 있어 실었다(그래프는 그리지 않는다).
//  - 답: 식 y = ax + b는 「y = [±][ ]x [±][ ]」 두 칸으로 받는다(a, b는 0이 아닌 정수이고 a는 ±1이 아니다). 기울기가 분수인 식은 고르기로 내거나 기울기·절편을 따로 묻는다.
//    함숫값·절편·기울기·좌표처럼 음수일 수 있는 수는 모두 부호 단추가 붙은 칸으로 받는다. 넓이·시간·길이·개수는 부호 단추 없이 받는다.
//    「a + b의 값」처럼 따로 구한 수를 더하거나 곱하는 꼴은 수를 하나하나 답하게 바꾸었다. 「모두 고르시오」는 「모두 고른 것」 고르기나 개수로 바꾸었다.
//  - 용어는 교육과정의 것만 쓴다: 함수, 함숫값, 일차함수, 기울기, x절편, y절편, 평행이동, f(x), y = f(x). 「정의역」「치역」「상수」「직선의 방정식」은 쓰지 않는다(정해진 수는 「수 a」로 적는다).
//  - 그림: 좌표평면은 공용 도구 plane 으로 그린다(이 파일의 pl 이 축 위의 수·원점 이름 자리·글씨 크기를 덧댄다). 그래프 넷을 보기로 늘어놓는 문항은 이 파일의 작은 좌표평면 mini 로 그린다.
//    그래프에서 절편·기울기·점을 읽는 문항은 직선이 모눈 점을 지나고, 읽을 점에 점을 찍거나(모눈 그림) 두 축에 점선을 내려 수를 적었다(눈금 없는 그림).
//    뽑은 글에는 그림이 없어 그래프의 생김새는 미래엔 2015 교과서, 2022 소단원 수준별 문제·대단원 평가 문제의 쪽 그림을 보고 지었다. 수와 상황은 모두 새로 정했다.
//  - 꼴 목록에 적힌 원문 답의 잘못은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(8-1-5b.js, 8-1-5c.js 의 것까지 여기에 모아 적는다)
//  - 다음 단원(8-1-6)의 일: 꼴 목록을 만들 때 이미 뺐다(일차방정식의 그래프, x = p·y = q, 교점과 연립방정식). 교점을 연립방정식으로 구해야 하는 넓이 등분(심55)도 뺐다(8-1-6에 실려 있다).
//  - 상위 학년의 일: 함수를 함수에 넣는 것(심10).
//  - 중1의 일: y = ax, y = a/x 꼴 관계식 세우기(①3·70의 대표 꼴), y = ax의 그래프에 대한 설명(①45), 넓이가 y = ax 꼴이 되는 움직이는 점(②79의 대표 꼴), 반비례 관계의 그래프와 엮은 것(심8).
//  - 작도·서술형: 그래프 그리기(①39 ②42·43·44·46·47 — 그래프 고르기와 그리는 차례의 빈칸으로 바꾸어 실었다), 변하는 두 양 쓰기(②5), 까닭 쓰기(①3·②2·②3·심2의 한 물음).
//  - 뜻 없는 셈: 따로 구한 수로 만든 새 식(심18·44), a + b·ab·a − b 로 묶어 묻기(여러 꼴 — 수를 하나하나 답하게 바꾸어 실었다).
//  - 그림을 끝내 알 수 없는 것: 이어 붙인 탁자(②12), 보기 그래프 다섯(②48), 세 그래프와 세 식 짝짓기(②54), 그림의 그래프와 평행한 것(②59), 높이가 다른 두 삼각형과 움직이는 점(①72), 직선 y + 1 = a(x + 1)과 선분(심58의 변형).
//  - 같은 일이어서 한 번만 실은 것은 대조표에 「겹침」으로 적었다.
//  - 처음 지을 때는 「지나치게 복잡한 활용」(①73 심64·65), 「경우 나누기·요령·조건 풀이」(①52·55 심15·20·30·34·36·38·39·46·54), 「실력에 한 유형만」(①44·②52의 변형, 심35·50·57), 「넓이를 나누는 직선」(심53·56)이라는 까닭으로도 뺐으나,
//    2026-10-13에 다시 보아 이 단원에서 배운 것만으로 풀리는 것은 모두 실력 묶음 끝에 덧붙였다(8-1-5c.js 의 hard-lap-ahead 부터 hard-letter-point-xint 까지. 까닭은 그 파일 머리에 적었다).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, N, M, C, inline } = B.kit;
  const { LAB, MINUS, GT, LT, gcd, Q, qadd, qsub, qmul, qdiv, qneg, qcmp, fl, mag, tx, nb, tail, lastOf, tj, js, V, sup, tag, f1, nz, pm, ansV, claimQ, asQ, mono, pointAns, plain, whereOnPlane, plane, graph } = B.kit.mid;
  const S14 = '9수02-14', S15 = '9수02-15', S16 = '9수02-16';
  // ref 에 기본꼴(①②)만 있으면 기본 자료, 심화꼴(심)만 있으면 심화 자료
  const sourceOf = (ref) => '수집본 ' + (/①|②/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), FN = V('f'), GN = V('g'), A = V('a'), BB = V('b'), K = V('k');
  const XA = X + '축', YA = Y + '축', XI = X + '절편', YI = Y + '절편';
  const TAG6 = ['㉠', '㉡', '㉢', '㉣', '㉤', '㉥'];
  const num = (v) => (typeof v === 'number' ? v : fl(v));
  const iq = (n) => tx(asQ(n));                                   // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const jn = (n) => (n < 0 ? '(-' + -n + ')' : String(n));        // 검사 식에 적는 정수
  const par = (n) => (num(n) < 0 ? `(${iq(n)})` : iq(n));         // 곱셈식에 적는 수(음수는 괄호)
  const sgn = (n) => `${n < 0 ? MINUS : '+'} ${Math.abs(n)}`;     // 「+ 3」「− 3」
  const nj = (n, pair) => tj(asQ(n), pair);                       // 수 뒤에 토씨
  // 항과 식: 수(유리수) 계수의 항 tm(계수, 문자 글), 문자 계수가 든 항 lt(글, 음수인가). 식은 항을 차례로 잇는다(계수가 0인 항은 적지 않는다).
  const tm = (c, v) => { const q = asQ(c); return q.p === 0 ? null : { neg: q.p < 0, h: mono(q, v || '') }; };
  const lt = (h, neg) => ({ neg: Boolean(neg), h });
  const ex = (...terms) => nb(terms.filter(Boolean).map((t, i) => (i === 0 ? (t.neg ? MINUS : '') : t.neg ? ` ${MINUS} ` : ' + ') + t.h).join('') || '0');
  const eqT = (...terms) => nb(`${Y} = ${ex(...terms)}`);          // y = (항들)
  const fxT = (...terms) => nb(`${FN}(${X}) = ${ex(...terms)}`);   // f(x) = (항들)
  const eq = (a, b) => eqT(tm(a, X), tm(b || 0));                  // y = ax + b
  const fx = (a, b) => fxT(tm(a, X), tm(b || 0));                  // f(x) = ax + b
  const eqI = (a) => nb(`${Y} = ${a < 0 ? MINUS : ''}${frac(Math.abs(a), X)}`);            // y = a/x
  const fxI = (a, name) => nb(`${name || FN}(${X}) = ${a < 0 ? MINUS : ''}${frac(Math.abs(a), X)}`);
  const fv = (v, name) => nb(`${name || FN}(${typeof v === 'string' ? v : iq(v)})`);       // f(−2), f(k)
  const eqAB = eqT(lt(A + X), lt(BB));                             // y = ax + b
  const is = (l, r) => nb(`${l} = ${typeof r === 'string' ? r : iq(r)}`);                   // x = 3
  const cmp = (l, sign, r) => nb(`${l} ${sign} ${r == null ? 0 : r}`);                     // a > 0
  // 점의 좌표. 좌표는 수·유리수이거나 이미 그린 글(문자, 빈칸의 이름)이다. 문자로 끝나는 좌표 뒤 토씨는 따로 적는다(a, b, k 는 받침 없이 읽는다).
  const cx = (v) => (typeof v === 'string' ? v : iq(v));
  const pt = (x, y) => nb(`(${cx(x)}, ${cx(y)})`);
  const ptj = (x, y, pair) => nb(`(${cx(x)}, ${cx(y)})${tail(lastOf(asQ(y)), pair)}`);
  // 검사 식: a·x, y ÷ a (a 는 유리수, x·y 는 식 글). 곱셈을 먼저 적어 정수끼리의 셈이 되게 한다.
  const mulA = (a, x) => (a.q === 1 ? `${jn(a.p)}*${x}` : `${jn(a.p)}*${x}/${a.q}`);
  const divA = (y, a) => (a.q === 1 ? `${y}/${jn(a.p)}` : `${y}*${a.q}/${jn(a.p)}`);
  // 답이 일차함수의 식 y = ax + b 인 문항: 「y = [±][ ]x [±][ ]」. a 는 ±1이 아닌 정수, b 는 0이 아닌 정수.
  function eqAns(text, a, b, o) {
    if (!Number.isInteger(a) || !Number.isInteger(b) || Math.abs(a) < 2 || b === 0) throw new Error('식 답: 기울기는 ±1이 아닌 정수, y절편은 0이 아닌 정수여야 한다');
    return inline(text, `${Y} = {0}${X} {1}`, [{ answer: a, signed: true }, { answer: b, signed: true }], Object.assign({}, o, { shown: eq(a, b) }));
  }
  // 답이 문자의 값 여럿인 문항: 「a = [±][ ]  b = [±][ ]」
  const vals = (text, pairs, o) => M(text, pairs.map(([lead, answer]) => ({ lead: lead + ' =', answer, signed: true })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => nb(`${lead} = ${iq(answer)}`)).join(', ') }));
  // 이름표를 붙인 식을 두 줄로 늘어놓는다(여섯 개까지). 긴 식은 한 줄에 하나씩 놓는다(rows1).
  const grid2 = (list, tags) => '<div class="mb-lines" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 10px">' + list.map((h, i) => '<div>' + tag((tags || TAG6)[i]) + h + '</div>').join('') + '</div>';
  const rows1 = (list, tags) => lines(list.map((h, i) => tag((tags || TAG6)[i]) + h));
  // 가로로 놓은 표: 첫 칸은 x, y, 나머지 칸은 값(글).
  const cell = (v) => (typeof v === 'number' ? iq(v) : v);
  const xyTable = (xs, ys, names) => '<div class="mb-table-wrap"><table class="mb-table"><tbody>' + [[(names || [X, Y])[0]].concat(xs.map(cell)), [(names || [X, Y])[1]].concat(ys.map(cell))].map((row) => '<tr>' + row.map((c) => '<td style="padding:5px 9px">' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  // 넷 가운데 조건에 맞는 둘을 「모두 고른 것」으로 묻는다(하나만 다른 것을 찾는 문항이 되지 않게). flags 는 참이 꼭 둘이어야 한다.
  // 보기: 맞는 둘, 나머지 둘, 맞는 것과 틀린 것을 하나씩 섞은 두 짝.
  function pairPick(d, text, list, flags, explain, figure) {
    const yes = [0, 1, 2, 3].filter((i) => flags[i]), no = [0, 1, 2, 3].filter((i) => !flags[i]), [p, q] = d.shuffle(no);
    const pairs = d.shuffle([yes, no, [yes[0], p], [yes[1], q]].map((pair) => pair.slice().sort((u, v) => u - v))), right = (pair) => pair.every((i) => flags[i]);
    return C(text, pairs.map((pair) => pair.map((i) => LAB[i]).join(', ')), pairs.findIndex(right), { figure: figure || grid2(list, LAB), explain, facts: { truth: pairs.map(right), want: true } });
  }

  // ── 일차함수 y = ax + b ──
  const QN = ['제1사분면', '제2사분면', '제3사분면', '제4사분면'];
  // a, b 의 부호로 정해지는, 그래프가 지나지 않는 사분면의 번호(0~3)
  const missQ = (a, b) => (num(a) > 0 ? (num(b) > 0 ? 3 : 1) : (num(b) > 0 ? 2 : 0));
  const xcut = (a, b) => qdiv(qneg(asQ(b)), asQ(a));   // x절편
  // 기울기로 쓰는 수: 정수(±2~±5)나 분수. ±1은 쓰지 않는다(식에 숫자가 드러나지 않아 검사가 읽을 수가 없다).
  const FRACS = [[1, 2], [3, 2], [1, 3], [2, 3], [4, 3], [1, 4], [3, 4], [2, 5], [3, 5]];
  const slope = (d, kind) => { if (kind === 'int') return Q(pm(d) * d.int(2, 5)); const [p, q] = d.pick(FRACS); return Q(pm(d) * p, q); };
  const quadText = (a, b) => { const miss = missQ(a, b); return QN.filter((_, i) => i !== miss).map((s) => s.replace('사분면', '')).join(', ') + '사분면'; };

  // ── 그림 ──
  const HALO = 'paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round';
  const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  const ink12 = (x, y, anchor, t) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}" style="font-size:12px;font-weight:600;fill:#1f2933;${HALO}">${t}</text>`;
  const bare = (t) => String(t).replace(/<[^>]+>/g, '');
  const wide = (t) => bare(t).length * 6.7;
  const toSeg = (x, y, [x1, y1, x2, y2]) => { const dx = x2 - x1, dy = y2 - y1, t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(x - x1 - t * dx, y - y1 - t * dy); };
  // 그림 속의 문자(기울인 글자)
  const it = (name) => `<tspan style="${ITALIC};font-size:1.12em;font-weight:400">${name}</tspan>`;
  // 직선 y = ax + b 가 상자 [xlo, xhi] × [ylo, yhi] 안에 드는 구간의 두 끝(왼쪽, 오른쪽)
  const clip = (a, b, xlo, xhi, ylo, yhi) => { const p = (ylo - b) / a, q = (yhi - b) / a; return [Math.max(xlo, Math.min(p, q)), Math.min(xhi, Math.max(p, q))]; };
  // 직선이 두 축과 만나는 곳에 적는 수. text 를 주면 수 대신 그 글(문자)을 적는다.
  const cutX = (a, b, text) => ({ v: xcut(a, b), text });
  const cutY = (a, b, text) => ({ v: b, text });
  // 축 위에 적는 수의 자리 고르기: 후보(앞의 것일수록 좋은 자리)를 차례로 놓아 보아 선·점과 3px, 다른 글과 2px 넘게 떨어진 첫 자리를 쓴다. 없으면 가장 넓은 자리.
  //  x축의 수: 축 아래(가운데, 오른쪽, 왼쪽), 축 위(가운데, 오른쪽, 왼쪽). y축의 수: 축 왼쪽(가운데, 위, 아래), 축 오른쪽(가운데, 위, 아래). m.dx·m.up, m.dy·m.right 를 주면 그 자리만 쓴다.
  // 글 상자(가운데 cx0·cy, 반 너비 w, 반 높이 5)와 두 축(x = ox 인 세로선, y = oy 인 가로선) 사이의 틈. 축에 걸치면 −1.
  const axisGap = (cx0, cy, w, ox, oy) => Math.min(cx0 - w < ox && ox < cx0 + w ? -1 : Math.min(Math.abs(cx0 - w - ox), Math.abs(cx0 + w - ox)), cy - 5 < oy && oy < cy + 5 ? -1 : Math.min(Math.abs(cy - 5 - oy), Math.abs(cy + 5 - oy)));
  function spotX(m, t, px, py, score) {
    const w = wide(t) / 2, shifts = m.dx != null ? [m.dx] : [0, w + 4, -w - 4], ups = m.up != null ? [m.up] : [false, true]; let best = null;
    for (const up of ups) for (const dx of shifts) { const x = px + dx, y = py + (up ? -5 : 14), s = score(x, y - 4, w); if (s >= 3) return { x, y, anchor: 'middle' }; if (!best || s > best.s) best = { s, x, y, anchor: 'middle' }; }
    return best;
  }
  function spotY(m, t, px, py, score) {
    const w = wide(t) / 2, shifts = m.dy != null ? [m.dy] : [0, -6, 7], sides = m.right != null ? [m.right] : [false, true]; let best = null;
    for (const right of sides) for (const dy of shifts) { const x = px + (right ? 5 : -5), y = py + 4 + dy, s = score(right ? x + w : x - w, y - 4, w); if (s >= 3) return { x, y, anchor: right ? 'start' : 'end' }; if (!best || s > best.s) best = { s, x, y, anchor: right ? 'start' : 'end' }; }
    return best;
  }
  // pl(o): 좌표평면. 공용 도구 plane 에 네 가지를 덧댄다(plane 의 o 를 그대로 받는다).
  //  ① 눈금 수는 이 함수가 12px 로 적는다(plane 에는 ticks: 'none' 을 넘긴다). 직선·선분·점과 닿는 눈금 수는 적지 않고, 흰 테를 둘러 맨 위에 적는다.
  //     o.ticks: 'all'(기본, 정수 눈금마다) · 'none' · 수의 배열(두 축에 적을 수). 축마다 눈금 수가 둘은 남아야 한다(plOk).
  //  ② 눈금 없는 그림에서 축 위에 적는 수: o.xnums [{ v, text, dx, up }](x축 위의 v인 곳 아래(up 이면 위)에 적는다), o.ynums [{ v, text, dy, right }](y축의 왼쪽(right 이면 오른쪽)에 적는다).
  //     그림 설명에는 「x축에 적힌 수」「y축에 적힌 수」로 적힌다.
  //  ③ 원점의 이름 O 를 직선·선분·점선·적은 수와 겹치지 않는 자리(축 아래 왼쪽이나 오른쪽)로 옮기고 흰 테를 둘러 맨 위에 적는다.
  //  ④ 글씨는 모두 12px 이상이다.
  // plOk(o): 적은 글(축 위의 수, 점·직선의 이름, O)이 직선·선분·점선·점이나 서로와 닿지 않고, 눈금 수가 축마다 둘은 남는가 — 수를 다시 고르는 데 쓴다. plWhy(o): 닿은 글의 목록(지을 때 본다).
  function build(o) {
    const [xlo, xhi] = o.x || [-5, 5], [ylo, yhi] = o.y || [-5, 5], u = Math.min(24, 260 / (xhi - xlo)), PX = (v) => 16 + (num(v) - xlo) * u, PY = (v) => 24 + (yhi - num(v)) * u;
    const segs = [], named = [];
    for (const l of o.lines || []) {
      if (l.x != null) { segs.push([PX(l.x), PY(ylo), PX(l.x), PY(yhi)]); continue; }
      const a = num(l.a), b = l.b == null ? 0 : num(l.b), [lo, hi] = a === 0 ? [xlo, xhi] : clip(a, b, xlo, xhi, ylo, yhi);
      segs.push([PX(lo), PY(a * lo + b), PX(hi), PY(a * hi + b)]);
      if (l.name) named.push({ x: PX(hi) + (a < 0 ? 4 : -4), y: PY(a * hi + b) + (a < 0 ? 13 : -5), anchor: a < 0 ? 'start' : 'end', t: l.name, own: segs.length - 1 });
    }
    for (const [x1, y1, x2, y2] of o.segs || []) segs.push([PX(x1), PY(y1), PX(x2), PY(y2)]);
    for (const p of o.points || []) if (p.guide) { segs.push([PX(p.x), PY(p.y), PX(p.x), PY(0)]); segs.push([PX(p.x), PY(p.y), PX(0), PY(p.y)]); }
    const dots = (o.points || []).map((p) => [PX(p.x), PY(p.y)]);
    // 화면의 한 곳에서 가장 가까운 선·점까지의 거리(px)
    const gap = (x, y, skip) => Math.min(segs.reduce((m, s, i) => (i === skip ? m : Math.min(m, toSeg(x, y, s))), 99), ...dots.map(([px, py]) => Math.hypot(x - px, y - py) - 3.2));
    // 글 상자(가운데 cx0·cy, 반 너비 w, 반 높이 5)의 둘레 여덟 곳과 가운데에서 선·점까지의 틈
    const room = (cx0, cy, w, skip) => { let m = 99; for (const sx of [-1, 0, 1]) for (const sy of [-1, 0, 1]) m = Math.min(m, gap(cx0 + sx * w, cy + sy * 5, skip)); return m; };
    // 이미 놓인 글 [가운데 x, 가운데 y, 반 너비]과의 가로 틈(같은 높이에 있는 것만 잰다). 처음에는 축의 이름 x, y 가 놓여 있다.
    const boxes = [[PX(xhi) + 21, PY(0), 5], [PX(0) + 9, PY(yhi) - 14, 5]];
    const apart = (cx0, cy, w) => boxes.reduce((m, [bx, by, bw]) => (Math.abs(by - cy) < 11 ? Math.min(m, Math.abs(bx - cx0) - bw - w) : m), 99);
    const mid = (x, anchor, w) => (anchor === 'middle' ? x : anchor === 'end' ? x - w : x + w);
    const why = []; let extra = '';
    // 글 하나를 놓아 본다. 선·점과 2.5px, 다른 글과 1px 넘게 떨어져야 한다.
    const place = (x, y, anchor, t, size, skip) => { const w = wide(t) * (size || 12) / 24, cx0 = mid(x, anchor, w), cy = y - 4, r = room(cx0, cy, w, skip), s = apart(cx0, cy, w); if (r < 2.5 || s < 1) why.push(bare(t) + ' 틈 ' + Math.min(r, s).toFixed(1)); boxes.push([cx0, cy, w]); };
    // 점의 이름과 직선의 이름(plane 이 적는다)
    for (const p of o.points || []) if (p.name) { const side = p.side || 'ur', dx = side[1] === 'r' ? 6 : -6, dy = side[0] === 'u' ? -6 : 14; place(PX(p.x) + dx, PY(p.y) + dy, dx > 0 ? 'start' : 'end', p.name, 13); }
    for (const n of named) { place(n.x, n.y, n.anchor, n.t, 12, n.own); if (Math.abs(n.y - 4 - PY(0)) < 7) why.push(bare(n.t) + ' x축'); }
    // 축 위에 적는 수
    const notes = [];
    const score = (cx0, cy, w) => Math.min(room(cx0, cy, w), apart(cx0, cy, w) + 1, axisGap(cx0, cy, w, PX(0), PY(0)) + 1.5);   // 축에 걸치거나 1.5px 안으로 붙는 자리는 쓰지 않는다
    for (const m of o.xnums || []) { const t = m.text == null ? plain(asQ(m.v)) : m.text, at = spotX(m, t, PX(m.v), PY(0), score); place(at.x, at.y, at.anchor, t); extra += ink12(at.x, at.y, at.anchor, t); }
    for (const m of o.ynums || []) { const t = m.text == null ? plain(asQ(m.v)) : m.text, at = spotY(m, t, PX(0), PY(m.v), score); place(at.x, at.y, at.anchor, t); extra += ink12(at.x, at.y, at.anchor, t); }
    if ((o.xnums || []).length) notes.push(`x축에 적힌 수: ${o.xnums.map((m) => (m.text == null ? plain(asQ(m.v)) : bare(m.text))).join(', ')}.`);
    if ((o.ynums || []).length) notes.push(`y축에 적힌 수: ${o.ynums.map((m) => (m.text == null ? plain(asQ(m.v)) : bare(m.text))).join(', ')}.`);
    // 눈금 수: 선·점·다른 글과 닿는 것은 적지 않는다.
    const ticks = o.ticks || 'all', wanted = (v) => v !== 0 && (ticks === 'all' || (Array.isArray(ticks) && ticks.includes(v))), kept = [0, 0];
    const tick = (x, y, anchor, t, axis) => { const w = wide(t) / 2, cx0 = mid(x, anchor, w); if (room(cx0, y - 4, w) < 2.5 || apart(cx0, y - 4, w) < 1) return; kept[axis] += 1; boxes.push([cx0, y - 4, w]); extra += ink12(x, y, anchor, t); };
    for (let v = xlo; v <= xhi; v += 1) if (wanted(v)) tick(PX(v), PY(0) + 13, 'middle', plain(Q(v)), 0);
    for (let v = ylo; v <= yhi; v += 1) if (wanted(v)) tick(PX(0) - 5, PY(v) + 4, 'end', plain(Q(v)), 1);
    if (ticks !== 'none' && (kept[0] < 2 || kept[1] < 2)) why.push('눈금 수 ' + kept.join('·'));
    // 원점의 이름
    let best = null;
    // 축 아래(왼쪽, 오른쪽)가 먼저이고, 거기가 막혔으면 축 위에 적는다. 틈이 4px 넘으면 더 넓은 자리를 찾지 않는다.
    // 다만 같은 줄의 수와 8px 안으로 붙는 자리는 한 점 깎는다(「−1 O」가 −10처럼 읽히지 않게 반대쪽이 비었으면 그쪽에 적는다).
    for (const side of o.oSide ? [o.oSide === 'r' ? 1 : -1] : [-1, 1]) for (const dx of [7, 9, 11]) for (const dy of [12, 14, -4, -6]) {
      const cx0 = PX(0) + side * dx, cy = PY(0) + dy - 4, near = apart(cx0, cy, 4.5), raw = Math.min(room(cx0, cy, 4.5), near + 2, 4) - 0.02 * (dx + Math.abs(dy)) - (side > 0 ? 0.03 : 0) - (dy < 0 ? 0.5 : 0), s = raw - (near < 8 ? 1 : 0);
      if (!best || s > best.pick) best = { pick: s, s: raw, x: cx0, y: PY(0) + dy };
    }
    if (best.s < 1.5) why.push('O 틈 ' + best.s.toFixed(1));
    let svg = plane(Object.assign({}, o, { ticks: 'none', say: [o.say].concat(notes).filter(Boolean).join(' ') }));
    svg = svg.replace(/<text x="[^"]*" y="[^"]*" text-anchor="middle" style="font-size:11px;fill:#1f2933;font-weight:600">O<\/text>/, '');
    return { svg: svg.replace('</svg>', extra + ink12(best.x, best.y, 'middle', 'O') + '</svg>'), ok: why.length === 0, why };
  }
  const pl = (o) => build(o).svg, plOk = (o) => build(o).ok, plWhy = (o) => build(o).why;
  // 모눈 좌표평면(−4~4, 눈금 수 −4, −2, 2, 4)에 그린 직선 하나. 읽을 점(marks)에는 점을 찍는다.
  const TICKS = [-4, -2, 2, 4];
  const gridOf = (a, b, marks, more) => Object.assign({ x: [-4, 4], y: [-4, 4], ticks: TICKS, lines: [{ a, b }], points: (marks || []).map(([x, y]) => ({ x, y })) }, more || {});
  // 눈금 없는 좌표평면에 그린 직선 하나와, 두 축과 만나는 곳의 수(nums: 'x'·'y'·'xy'·''). 범위는 절편이 들어가게 잡는다.
  function axesOf(a, b, nums, more) {
    const p = num(xcut(a, b)), q = num(b), xlo = Math.floor(Math.min(p, 0) - 1.6), xhi = Math.ceil(Math.max(p, 0) + 1.6), ylo = Math.floor(Math.min(q, 0) - 1.6), yhi = Math.ceil(Math.max(q, 0) + 1.6), has = nums == null ? 'xy' : nums;
    return Object.assign({ x: [xlo, xhi], y: [ylo, yhi], grid: false, ticks: 'none', lines: [{ a, b }], xnums: has.includes('x') ? [cutX(a, b)] : [], ynums: has.includes('y') ? [cutY(a, b)] : [] }, more || {});
  }

  // mini(o): 작은 좌표평면(고르는 그림). 모눈과 눈금 없이 직선과 축 위의 수만 그린다. 범위는 −R~R(o.R, 기본 4).
  //  o.lines [{ a, b, dash }](dash 는 점선), o.xnums [{ v, text, dx, up }], o.ynums [{ v, text, dy, right }], o.arrow [x1, y1, x2, y2](옮긴 방향), o.name 그림 설명 앞의 이름, o.say 그림 설명.
  function mini(o) {
    const R = o.R || 4, u = 52 / R, pL = 9, pR = 17, pT = 18, pB = 9, W = pL + pR + 2 * R * u, H = pT + pB + 2 * R * u, PX = (v) => pL + (num(v) + R) * u, PY = (v) => pT + (R - num(v)) * u;
    const ls = (o.lines || []).map((l) => ({ a: num(l.a), b: l.b == null ? 0 : num(l.b), dash: l.dash }));
    const segs = ls.map(({ a, b }) => { const [lo, hi] = clip(a, b, -R, R, -R, R); return [PX(lo), PY(a * lo + b), PX(hi), PY(a * hi + b)]; });
    const boxes = [];
    // 글 상자의 둘레 여덟 곳과 가운데에서 선까지의 틈, 다른 글과의 가로 틈 가운데 작은 것
    const fits = (cx0, cy, w) => { let m = 99; for (const s of segs) for (const sx of [-1, 0, 1]) for (const sy of [-1, 0, 1]) m = Math.min(m, toSeg(cx0 + sx * w, cy + sy * 5, s)); return Math.min(m, ...boxes.map(([bx, by, bw]) => (Math.abs(by - cy) < 11 ? Math.abs(bx - cx0) - bw - w + 1 : 99))); };
    let out = `<line class="mb-axis" x1="${f1(PX(-R) - 3)}" y1="${f1(PY(0))}" x2="${f1(PX(R) + 5)}" y2="${f1(PY(0))}"/><path d="M${f1(PX(R) + 11)} ${f1(PY(0))}l-6 -3v6z" style="fill:#1f2933"/>`
      + `<line class="mb-axis" x1="${f1(PX(0))}" y1="${f1(PY(-R) + 3)}" x2="${f1(PX(0))}" y2="${f1(PY(R) - 5)}"/><path d="M${f1(PX(0))} ${f1(PY(R) - 11)}l-3 6h6z" style="fill:#1f2933"/>`;
    ls.forEach((l, i) => { const s = segs[i].map(f1); out += `<line x1="${s[0]}" y1="${s[1]}" x2="${s[2]}" y2="${s[3]}" style="stroke:${l.dash ? '#5b6770' : '#1d4ed8'};stroke-width:${l.dash ? 1.3 : 1.9}${l.dash ? ';stroke-dasharray:4 3' : ''}"/>`; });
    if (o.arrow) {
      const [x1, y1, x2, y2] = o.arrow, ax = PX(x1), ay = PY(y1), bx = PX(x2), by = PY(y2), L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L;
      out += `<line x1="${f1(ax)}" y1="${f1(ay)}" x2="${f1(bx - ux * 5)}" y2="${f1(by - uy * 5)}" style="stroke:#b42318;stroke-width:1.7"/><path d="M${f1(bx)} ${f1(by)}L${f1(bx - ux * 7.5 - uy * 3.6)} ${f1(by - uy * 7.5 + ux * 3.6)}L${f1(bx - ux * 7.5 + uy * 3.6)} ${f1(by - uy * 7.5 - ux * 3.6)}Z" style="fill:#b42318"/>`;
      segs.push([ax, ay, bx, by]);
    }
    const word = (x, y, anchor, t) => { const w = wide(t) / 2; boxes.push([anchor === 'middle' ? x : anchor === 'end' ? x - w : x + w, y - 4, w]); return ink12(x, y, anchor, t); };
    let texts = '';
    // 축 위의 수는 직선뿐 아니라 두 축과도 닿지 않는 자리에 적는다(축에 걸치거나 1.5px 안으로 붙는 자리는 쓰지 않는다).
    const fitsAx = (cx0, cy, w) => Math.min(fits(cx0, cy, w), axisGap(cx0, cy, w, PX(0), PY(0)) + 1.5);
    for (const m of o.xnums || []) { const t = m.text == null ? plain(asQ(m.v)) : m.text, at = spotX(m, t, PX(m.v), PY(0), fitsAx); texts += word(at.x, at.y, at.anchor, t); }
    for (const m of o.ynums || []) { const t = m.text == null ? plain(asQ(m.v)) : m.text, at = spotY(m, t, PX(0), PY(m.v), fitsAx); texts += word(at.x, at.y, at.anchor, t); }
    // 축의 이름과 원점의 이름은 직선에서 먼 쪽에 적는다.
    const ySide = fits(PX(0) + 9, PY(R) - 9, 4) >= fits(PX(0) - 9, PY(R) - 9, 4) ? 1 : -1, xUp = fits(PX(R) + 9, PY(0) + 10, 4) >= fits(PX(R) + 9, PY(0) - 10, 4) ? 1 : -1;
    texts += `<text x="${f1(PX(R) + 9)}" y="${f1(PY(0) + (xUp > 0 ? 14 : -6))}" text-anchor="middle" style="font-size:13px;fill:#1f2933;${ITALIC};${HALO}">x</text><text x="${f1(PX(0) + ySide * 9)}" y="${f1(PY(R) - 5)}" text-anchor="middle" style="font-size:13px;fill:#1f2933;${ITALIC};${HALO}">y</text>`;
    let best = null;
    // 같은 줄의 수와 8px 안으로 붙는 자리는 한 점 깎는다(「−2 O」가 −20처럼 읽히지 않게 반대쪽이 비었으면 그쪽에 적는다).
    const beside = (cx0, cy) => Math.min(99, ...boxes.map(([bx, by, bw]) => (Math.abs(by - cy) < 11 ? Math.abs(bx - cx0) - bw - 4.5 : 99)));
    for (const side of [-1, 1]) for (const dx of [7, 9]) for (const dy of [12, 14, -4, -6]) { const cx0 = PX(0) + side * dx, cy = PY(0) + dy - 4, s = Math.min(fits(cx0, cy, 4.5), 4) - 0.02 * (dx + Math.abs(dy)) - (side > 0 ? 0.03 : 0) - (dy < 0 ? 0.5 : 0) - (beside(cx0, cy) < 8 ? 1 : 0); if (!best || s > best.s) best = { s, x: cx0, y: PY(0) + dy }; }
    texts += ink12(best.x, best.y, 'middle', 'O');
    return `<svg class="mb-geo" viewBox="0 0 ${f1(W)} ${f1(H)}" width="${Math.round(W)}" role="img" aria-label="좌표평면${o.name ? ' ' + o.name : ''}: ${o.say || ''}">${out}${texts}</svg>`;
  }
  // 작은 그림 넷을 두 줄로 놓고 이름(㉠~㉣)을 단다.
  const picks = (figs) => '<div style="display:grid;grid-template-columns:repeat(2,max-content);gap:8px 14px">' + figs.map((h, i) => `<div style="display:grid;gap:1px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">${LAB[i]}</div>${h}</div>`).join('') + '</div>';
  // 절편이 적힌 작은 그래프(직선이 x축과 p, y축과 q인 곳에서 만난다)
  const cutMini = (p, q, name, R) => { const a = Q(-q, p); return mini({ R, name, lines: [{ a, b: q }], xnums: [cutX(a, q)], ynums: [cutY(a, q)], say: `직선이 x축과 만나는 곳에 ${plain(Q(p))}, y축과 만나는 곳에 ${plain(Q(q))}${tail(Math.abs(q), '이/가')} 적혀 있다.` }); };
  // 두 양 사이의 관계를 나타낸 그래프: 공용 도구 graph 의 글씨를 12px 로 키우고, 커진 만큼 가로축 눈금 수와 세로축 이름을 조금 내린다(가로축에 닿는 선의 끝·그림 위쪽 가장자리와 닿지 않게).
  const gr = (o) => graph(o).replace(/font-size:(?:10\.5|11\.5|11)px/g, 'font-size:12px')
    .replace(/(<text class="mb-axis-label" style="font-size:12px" x="[\d.]+" y=")([\d.]+)(" text-anchor="middle">)/g, (all, head, y, rest) => head + (Number(y) + 1.5) + rest)
    .replace(/(<text x="[\d.]+" y=")11(" style="font-size:12px;fill:#1f2933;font-weight:600">)/, (all, head, rest) => head + '14' + rest);

  // ── 함수인 것과 아닌 것 ──
  // say: 보기로 쓰는 말, eq: 관계식(있으면), why: 함수가 아닌 까닭
  const YES_SIT = [
    (d) => { const g = d.pick([150, 200, 250]); return { say: `한 봉지에 ${g} g인 과자 ${X}봉지의 무게 ${Y} g` }; },
    (d) => { const p = d.pick([20, 30, 40]); return { say: `둘레의 길이가 ${p} cm인 직사각형의 가로의 길이 ${X} cm와 세로의 길이 ${Y} cm` }; },
    (d) => { const p = d.pick([600, 700, 800]), m = d.pick([5000, 10000]); return { say: `한 권에 ${p}원인 공책 ${X}권을 사고 ${m}원을 냈을 때의 거스름돈 ${Y}원` }; },
    (d) => { const v = d.pick([60, 80, 90]); return { say: `시속 ${v} km로 ${X}시간 동안 달린 거리 ${Y} km` }; },
    (d) => { const k = d.pick([13, 14, 15]); return { say: `올해 ${k}살인 학생의 ${X}년 후의 나이 ${Y}살` }; },
    (d) => { const s = d.pick([24, 36, 48]); return { say: `넓이가 ${s} cm²인 직사각형의 가로의 길이 ${X} cm와 세로의 길이 ${Y} cm` }; },
    (d) => { const r = d.pick([10, 20, 30]); return { say: `정가가 ${X}원인 물건을 ${r} % 할인한 가격 ${Y}원` }; }
  ];
  const NO_NUM = [
    () => ({ say: `자연수 ${X}의 배수 ${Y}`, why: `${is(X, 2)}일 때 ${Y}의 값은 2, 4, 6, …이다.` }),
    () => ({ say: `자연수 ${X}의 약수 ${Y}`, why: `${is(X, 4)}일 때 ${Y}의 값은 1, 2, 4이다.` }),
    () => ({ say: `자연수 ${X}와 서로소인 자연수 ${Y}`, why: `${is(X, 2)}일 때 ${Y}의 값은 1, 3, 5, …이다.` }),
    () => ({ say: `자연수 ${X}보다 큰 자연수 ${Y}`, why: `${is(X, 1)}일 때 ${Y}의 값은 2, 3, 4, …이다.` }),
    () => ({ say: `자연수 ${X}의 소인수 ${Y}`, why: `${is(X, 6)}일 때 ${Y}의 값은 2, 3이다.` }),
    () => ({ say: `자연수 ${X}보다 작은 소수 ${Y}`, why: `${is(X, 6)}일 때 ${Y}의 값은 2, 3, 5이다.` })
  ];
  const NO_SIT = [() => ({ say: `키가 ${X} cm인 사람의 몸무게 ${Y} kg`, why: `키가 같아도 몸무게는 사람마다 다를 수 있다.` })];
  const YES_NUM = [
    (d) => { const k = d.int(2, 4), c = d.int(1, 5); return { say: `자연수 ${X}의 ${k}배보다 ${c}만큼 큰 수 ${Y}`, eq: eq(k, c) }; },
    (d) => { const c = d.int(2, 6); return { say: `자연수 ${X}보다 ${c}만큼 작은 수 ${Y}`, eq: eq(1, -c) }; },
    (d) => { const k = d.int(2, 5); return { say: `자연수 ${X}의 ${k}배인 수 ${Y}`, eq: eq(k, 0) }; }
  ];

  // ── 일차함수인 것과 아닌 것 ──
  // 식: h 적힌 꼴, lin 일차함수인가, as 정리한 꼴(정리해야 보이는 식)
  const xOver = (k, n) => nb(`${Y} = ${frac(`${X} ${sgn(-k)}`, n)}`);   // y = (x − k)/n
  const FORM = {
    plain: (d) => { const a = slope(d, d.bool() ? 'int' : 'frac'), b = nz(d, -7, 7); return { h: eq(a, b), lin: true }; },
    over: (d) => { const n = d.pick([2, 3, 4]), k = pm(d) * d.int(1, 6); return { h: xOver(k, n), lin: true, as: eq(Q(1, n), Q(-k, n)) }; },
    negParen: (d) => { const k = pm(d) * d.int(2, 7); return { h: nb(`${Y} = ${MINUS}(${X} ${sgn(-k)})`), lin: true, as: eq(-1, k) }; },
    sum: (d) => { const k = d.int(2, 9); return { h: nb(`${X} + ${Y} = ${k}`), lin: true, as: eq(-1, k) }; },
    move: (d) => { const p = d.int(2, 5), q = d.int(2, 5), c = nz(d, -6, 6); return { h: nb(`${Y} + ${p}${X} = ${MINUS}${q}${X} ${sgn(c)}`), lin: true, as: eq(-p - q, c) }; },
    konst: (d) => ({ h: is(Y, nz(d, -7, 7)), lin: false, why: `${X}의 항이 없다` }),
    inv: (d) => ({ h: eqI(nz(d, -6, 6)), lin: false, why: `${X}가 분모에 있다` }),
    invPlus: (d) => { const k = d.int(2, 6), c = nz(d, -5, 5); return { h: nb(`${Y} = ${frac(k, X)} ${sgn(c)}`), lin: false, why: `${X}가 분모에 있다` }; },
    quad: (d) => { const a = nz(d, -3, 3), b = nz(d, -4, 4), c = nz(d, -5, 5); return { h: eqT(tm(a, X + sup(2)), tm(b, X), tm(c)), lin: false, why: `${X}${sup(2)}의 항이 있다` }; },
    prod: (d) => { const k = d.int(2, 5), neg = d.bool(); return { h: nb(`${Y} = ${neg ? MINUS : ''}${X}(${k} ${neg ? '+' : MINUS} ${X})`), lin: false, as: eqT(tm(-1, X + sup(2)), tm(neg ? -k : k, X)), why: `${X}${sup(2)}의 항이 있다` }; },
    // 정리하면 x의 항이 사라지는 식(일차함수가 아니다)
    vanish: (d) => { const p = d.int(2, 5), r = d.int(1, 6), plus = d.bool(); return { h: nb(`${Y} = ${p}${X} ${MINUS} ${p}(${X} ${plus ? '+' : MINUS} ${r})`), lin: false, as: is(Y, plus ? -p * r : p * r), why: `${X}의 항이 없다` }; }
  };

  // ── 두 양 사이의 관계가 드러난 상황(일차함수인가) ──
  // say: 보기로 쓰는 말, full: 문장, eq: 관계식, miss: 흔히 잘못 세우는 식, lin: 일차함수인가
  const CM2 = 'cm²';
  const STORY = {
    pens: (d) => { const p = d.pick([500, 700, 800]), q = d.pick([1200, 1500, 2000]); return { say: `한 자루에 ${p}원인 볼펜 ${X}자루와 ${q}원인 필통 한 개의 값 ${Y}원`, full: `한 자루에 ${p}원인 볼펜 ${X}자루와 ${q}원인 필통 한 개의 값은 ${Y}원이다.`, eq: eq(p, q), miss: eq(p + q, 0), lin: true }; },
    pages: (d) => { const n = d.pick([150, 200, 250]); return { say: `전체 ${n}쪽인 책에서 ${X}쪽을 읽고 남은 쪽수 ${Y}쪽`, full: `전체 ${n}쪽인 책에서 ${X}쪽을 읽고 남은 쪽수는 ${Y}쪽이다.`, eq: eqT(tm(n), tm(-1, X)), miss: eqI(n), lin: true }; },
    change: (d) => { const p = d.pick([500, 600, 800]), m = d.pick([5000, 10000]); return { say: `한 개에 ${p}원인 빵 ${X}개를 사고 ${m}원을 냈을 때의 거스름돈 ${Y}원`, full: `한 개에 ${p}원인 빵 ${X}개를 사고 ${m}원을 냈을 때의 거스름돈은 ${Y}원이다.`, eq: eqT(tm(m), tm(-p, X)), miss: eq(p, -m), lin: true }; },
    rect: (d) => { const p = d.pick([20, 24, 30]); return { say: `둘레의 길이가 ${p} cm이고 가로의 길이가 ${X} cm인 직사각형의 세로의 길이 ${Y} cm`, full: `둘레의 길이가 ${p} cm이고 가로의 길이가 ${X} cm인 직사각형의 세로의 길이는 ${Y} cm이다.`, eq: eqT(tm(p / 2), tm(-1, X)), miss: eqT(tm(p), tm(-1, X)), lin: true }; },
    square: () => ({ say: `한 변의 길이가 ${X} cm인 정사각형의 둘레의 길이 ${Y} cm`, full: `한 변의 길이가 ${X} cm인 정사각형의 둘레의 길이는 ${Y} cm이다.`, eq: eq(4, 0), miss: eqT(tm(1, X + sup(2))), lin: true }),
    drive: (d) => { const v = d.pick([60, 70, 80]); return { say: `시속 ${v} km로 ${X}시간 동안 달린 거리 ${Y} km`, full: `시속 ${v} km로 ${X}시간 동안 달린 거리는 ${Y} km이다.`, eq: eq(v, 0), miss: eqI(v), lin: true }; },
    truck: (d) => { const w = d.pick([2, 3, 4]), g = d.pick([5, 6, 8]); return { say: `무게가 ${w} kg인 상자에 한 통에 ${g} kg인 수박 ${X}통을 담았을 때의 전체 무게 ${Y} kg`, full: `무게가 ${w} kg인 상자에 한 통에 ${g} kg인 수박 ${X}통을 담았을 때의 전체 무게는 ${Y} kg이다.`, eq: eq(g, w), miss: eq(g + w, 0), lin: true }; },
    area: () => ({ say: `한 변의 길이가 ${X} cm인 정사각형의 넓이 ${Y} ${CM2}`, full: `한 변의 길이가 ${X} cm인 정사각형의 넓이는 ${Y} ${CM2}이다.`, eq: eqT(tm(1, X + sup(2))), miss: eq(4, 0), lin: false }),
    circle: () => ({ say: `반지름의 길이가 ${X} cm인 원의 넓이 ${Y} ${CM2}`, full: `반지름의 길이가 ${X} cm인 원의 넓이는 ${Y} ${CM2}이다.`, eq: nb(`${Y} = π${X}${sup(2)}`), miss: nb(`${Y} = 2π${X}`), lin: false }),
    trip: (d) => { const D = d.pick([24, 60, 120]); return { say: `${D} km 떨어진 곳까지 시속 ${X} km로 갈 때 걸리는 시간 ${Y}시간`, full: `${D} km 떨어진 곳까지 시속 ${X} km로 갈 때 걸리는 시간은 ${Y}시간이다.`, eq: eqI(D), miss: eq(D, 0), lin: false }; },
    cake: (d) => { const w = d.pick([600, 700, 900]); return { say: `무게가 ${w} g인 케이크를 ${X}조각으로 똑같이 나눈 한 조각의 무게 ${Y} g`, full: `무게가 ${w} g인 케이크를 ${X}조각으로 똑같이 나눈 한 조각의 무게는 ${Y} g이다.`, eq: eqI(w), miss: eqT(tm(w), tm(-1, X)), lin: false }; },
    outer: () => ({ say: `${X}각형의 외각의 크기의 합 ${Y}°`, full: `${X}각형의 외각의 크기의 합은 ${Y}°이다.`, eq: is(Y, 360), miss: eq(360, 0), lin: false }),
    cube: () => ({ say: `한 모서리의 길이가 ${X} cm인 정육면체의 부피 ${Y} cm³`, full: `한 모서리의 길이가 ${X} cm인 정육면체의 부피는 ${Y} cm³이다.`, eq: eqT(tm(1, X + sup(3))), miss: eq(3, 0), lin: false })
  };
  const LIN_STORY = ['pens', 'pages', 'change', 'rect', 'square', 'drive', 'truck'], NON_STORY = ['area', 'circle', 'trip', 'cake', 'outer', 'cube'];

  B.addUnit({
    id: '8-1-5', grade: 8, semester: 1, no: 5, title: '일차함수와 그 그래프', version: 3,
    groups: [
      {
        id: 'func', title: '함수의 뜻', standard: S14,
        types: [
          T('func-term', '함수의 뜻', '②1', (d) => {
            const opts = d.shuffle(['함수', '함숫값', '일차함수', '기울기']);
            return C(`두 변수 ${X}, ${Y}에 대하여 ${X}의 값이 변함에 따라 ${Y}의 값이 하나씩 정해지는 대응 관계가 있을 때, ${Y}를 ${X}의 무엇이라 하는가?`, opts, opts.indexOf('함수'), {
              explain: `${X}의 값이 변함에 따라 ${Y}의 값이 하나씩 정해지는 대응 관계가 있을 때, ${Y}를 ${X}의 함수라 한다.`,
              facts: { truth: opts.map((o) => o === '함수'), want: true }
            });
          }),
          T('func-table-judge', '대응을 따져 보고 함수인지 판단하기', '①1·2 ②2·3', (d, n) => {
            if (n === 0) {
              // 정비례가 아닌 관계도 함수이다. 보기는 관계식 둘(바른 식, 표와 맞지 않는 식)과 판단 둘을 짝지은 넷이다.
              const s = d.pick([
                () => { const L = d.pick([24, 36, 48, 60]); return { full: `길이가 ${L} cm인 끈을 ${X}도막으로 똑같이 나눌 때 한 도막의 길이를 ${Y} cm라 하자.`, xs: [1, 2, 3, 4], f: (x) => L / x, eq: eqI(L), miss: eqT(tm(L), tm(-1, X)) }; },
                () => ({ full: `하루 중 낮의 길이가 ${X}시간일 때 밤의 길이를 ${Y}시간이라 하자.`, xs: [10, 11, 12, 13], f: (x) => 24 - x, eq: eqT(tm(24), tm(-1, X)), miss: eqI(24) }),
                () => { const p = d.pick([300, 400, 500]), m = d.pick([3000, 5000]); return { full: `한 개에 ${p}원인 지우개 ${X}개를 사고 ${m}원을 냈을 때의 거스름돈을 ${Y}원이라 하자.`, xs: [1, 2, 3, 4], f: (x) => m - p * x, eq: eqT(tm(m), tm(-p, X)), miss: eq(p, -m) }; }
              ])();
              const rows = d.shuffle([[s.eq, true], [s.eq, false], [s.miss, true], [s.miss, false]]);
              return C(`${s.full} ${X}와 ${Y} 사이의 관계를 나타낸 다음 표를 보고 바르게 설명한 것은?`, rows.map(([h, yes]) => `관계식은 ${h}이고, ${Y}는 ${X}의 함수${yes ? '이다' : '가 아니다'}.`), rows.findIndex(([h, yes]) => h === s.eq && yes), {
                figure: xyTable(s.xs, s.xs.map(s.f)),
                explain: `표의 값을 넣어 보면 관계식은 ${s.eq}이다. ${X}의 값이 정해지면 ${Y}의 값이 하나씩 정해지므로 ${Y}는 ${X}의 함수이다.`,
                facts: { truth: rows.map(([h, yes]) => h === s.eq && yes), want: true, rule: 'func-table-yes' }
              });
            }
            // x의 값 하나에 y의 값이 여러 개인 대응. 보기는 y의 값(모두, 가장 큰 것 하나)과 판단 둘을 짝지은 넷이다.
            const s = d.pick([
              () => { const x = d.pick([4, 5, 6]); return { x, say: `자연수 ${X}보다 작은 홀수를 ${Y}라 하자.`, all: [1, 3, 5].filter((v) => v < x) }; },
              () => { const x = d.pick([4, 6, 9]); return { x, say: `자연수 ${X}의 약수를 ${Y}라 하자.`, all: [1, 2, 3, 4, 6, 9].filter((v) => x % v === 0) }; },
              () => { const x = d.pick([5, 6, 7]); return { x, say: `자연수 ${X}보다 작은 짝수를 ${Y}라 하자.`, all: [2, 4, 6].filter((v) => v < x) }; }
            ])(), all = s.all.join(', '), last = s.all[s.all.length - 1];
            const rows = d.shuffle([[all, false, true], [all, true, false], [`${last}뿐`, true, false], [`${last}뿐`, false, false]]);
            return C(`${s.say} ${X}와 ${Y} 사이의 대응 관계를 바르게 설명한 것은?`, rows.map(([v, yes]) => `${is(X, s.x)}일 때 ${Y}의 값은 ${v}이고, ${Y}는 ${X}의 함수${yes ? '이다' : '가 아니다'}.`), rows.findIndex((r) => r[2]), {
              explain: `${is(X, s.x)}일 때 ${Y}의 값은 ${all}이다. ${X}의 값 하나에 ${Y}의 값이 하나씩 정해지지 않으므로 ${Y}는 ${X}의 함수가 아니다.`,
              facts: { truth: rows.map((r) => r[2]), want: true, rule: 'func-table-no' }
            });
          }, { count: 2 }),
          T('func-pick', '함수인 것과 함수가 아닌 것 가리기', '①4·5 ②4 심1', (d, n) => {
            if (n === 0) {
              const yes = d.shuffle(YES_SIT).slice(0, 3).map((f) => f(d)), no = d.pick(NO_NUM.slice(0, 4).concat(NO_SIT))(d), rows = d.shuffle(yes.map((r) => [r, true]).concat([[no, false]]));
              return C(`다음 중 ${Y}가 ${X}의 함수가 아닌 것은?`, rows.map((r) => r[0].say), rows.findIndex((r) => !r[1]), {
                explain: `${no.why} ${X}의 값 하나에 ${Y}의 값이 하나씩 정해지지 않으므로 함수가 아니다. 나머지는 ${X}의 값이 정해지면 ${Y}의 값이 하나씩 정해진다.`,
                facts: { truth: rows.map((r) => r[1]), want: false, rule: 'func-not' }
              });
            }
            const no = d.shuffle(NO_NUM).slice(0, 3).map((f) => f(d)), yes = d.pick(YES_NUM)(d), rows = d.shuffle(no.map((r) => [r, false]).concat([[yes, true]]));
            return C(`다음 중 ${Y}가 ${X}의 함수인 것은?`, rows.map((r) => r[0].say), rows.findIndex((r) => r[1]), {
              explain: `${yes.eq}이므로 ${X}의 값이 정해지면 ${Y}의 값이 하나씩 정해진다. 나머지는 ${X}의 값 하나에 ${Y}의 값이 여러 개이거나 없을 수 있어 함수가 아니다.`,
              facts: { truth: rows.map((r) => r[1]), want: true, rule: 'func-is' }
            });
          }, { count: 2 }),
          T('func-pick-mixed', '식과 문장이 섞인 보기에서 함수인 것 모두 고르기', '①6', (d) => {
            // 식 둘(일차식, 분모에 x가 있는 식)과 문장 둘(함수인 것, 아닌 것). 보기: 바른 셋, 식 둘만, 일차식과 문장, 넷 모두.
            const a = pm(d) * d.int(2, 6), k = d.int(2, 9), yes = d.pick(YES_NUM.slice(0, 2))(d), no = d.pick(NO_NUM.slice(0, 3))(d);
            const rows = d.shuffle([{ h: eq(a, nz(d, -6, 6)), key: 'lin' }, { h: eqI(pm(d) * k), key: 'inv' }, { h: yes.say, key: 'yes' }, { h: no.say, key: 'no' }]);
            const tags = (keys) => rows.map((r, i) => (keys.includes(r.key) ? LAB[i] : '')).filter(Boolean).join(', ');
            const opts = d.shuffle([['lin', 'inv', 'yes'], ['lin', 'inv'], ['lin', 'yes'], ['lin', 'inv', 'yes', 'no']]);
            return C(`다음 중 ${Y}가 ${X}의 함수인 것을 모두 고른 것은?`, opts.map(tags), opts.findIndex((o) => o.length === 3), {
              figure: rows1(rows.map((r) => r.h), LAB),
              explain: `${X}의 값이 정해지면 ${Y}의 값이 하나씩 정해지는 것이 함수이다. 식으로 나타낸 두 관계와 ${tags(['yes'])}은 ${Y}의 값이 하나씩 정해지고, ${tags(['no'])}은 ${no.why.replace(/이다\.$/, '')}이어서 하나로 정해지지 않는다.`,
              facts: { truth: opts.map((o) => o.length === 3), want: true }
            });
          })
        ]
      },
      {
        id: 'value', title: '함숫값', standard: S14,
        types: [
          T('value-linear', '일차식으로 주어진 함수의 함숫값', '①7 ②6', (d) => {
            const a = pm(d) * d.int(2, 6), b = nz(d, -9, 9), k = pm(d) * d.int(2, 5), v = a * k + b;
            return N(`함수 ${fx(a, b)}에 대하여 ${fv(k)}의 값은?`, v, { signed: true,
              explain: `${fv(k)} = ${iq(a)} × ${par(k)} ${sgn(b)} = ${iq(v)}이다.`,
              facts: { value: `${jn(a)}*${jn(k)}+${jn(b)}` }
            });
          }),
          T('value-inverse', 'y = a/x 꼴로 주어진 함수의 함숫값', '①8 ②6', (d) => {
            const m = d.pick([12, 18, 20, 24, 30, 36]), a = pm(d) * m, k = pm(d) * d.pick([2, 3, 4, 5, 6, 9, 10, 12].filter((v) => m % v === 0)), v = a / k;
            return N(`함수 ${fxI(a)}에 대하여 ${fv(k)}의 값은?`, v, { signed: true,
              explain: `${fv(k)} = ${a < 0 ? MINUS : ''}${frac(m, par(k))} = ${iq(v)}이다.`,
              facts: { value: `${jn(a)}/${jn(k)}` }
            });
          }),
          T('value-frac-in', '분수를 넣은 함숫값', '①7 ②6', (d) => {
            const q = d.pick([2, 3, 4, 5]), p = pm(d) * d.until(() => d.int(1, 2 * q - 1), (v) => gcd(v, q) === 1), t = nz(d, -3, 3), a = q * t, b = nz(d, -7, 7), v = t * p + b, k = Q(p, q);
            return N(`함수 ${fx(a, b)}에 대하여 ${fv(k)}의 값은?`, v, { signed: true,
              explain: `${fv(k)} = ${iq(a)} × ${par(k)} ${sgn(b)} = ${iq(t * p)} ${sgn(b)} = ${iq(v)}이다.`,
              facts: { value: `${jn(a)}*${js(k)}+${jn(b)}` }
            });
          }),
          T('value-sum', '함숫값의 합과 차', '①7·8 ②6', (d, n) => {
            if (n === 0) {
              const a = pm(d) * d.int(2, 5), b = nz(d, -7, 7), c = d.pick([2, 3]), [p, q] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([u, v]) => u !== v), minus = d.bool(), fp = a * p + b, fq = a * q + b, v = c * fp + (minus ? -fq : fq);
              return N(`함수 ${fx(a, b)}에 대하여 ${c}${fv(p)} ${minus ? MINUS : '+'} ${fv(q)}의 값은?`, v, { signed: true,
                explain: `${is(fv(p), fp)}, ${is(fv(q), fq)}이므로 ${c}${fv(p)} ${minus ? MINUS : '+'} ${fv(q)} = ${c} × ${par(fp)} ${minus ? MINUS : '+'} ${par(fq)} = ${iq(v)}이다.`,
                facts: { value: `${c}*(${jn(a)}*${jn(p)}+${jn(b)})${minus ? '-' : '+'}(${jn(a)}*${jn(q)}+${jn(b)})`, rule: 'sum-one' }
              });
            }
            // 두 함수 f, g 의 함숫값을 따로 구해 더한다. g 는 y = a/x 꼴이다.
            const a = pm(d) * d.int(2, 5), b = nz(d, -7, 7), p = nz(d, -4, 4), m = d.pick([6, 8, 12, 18]), c = pm(d) * m, q = pm(d) * d.pick([2, 3, 4, 6].filter((v) => m % v === 0)), k = d.pick([2, 3]), fp = a * p + b, gq = c / q, v = fp + k * gq;
            return N(`두 함수 ${fx(a, b)}, ${fxI(c, GN)}에 대하여 ${fv(p)} + ${k}${fv(q, GN)}의 값은?`, v, { signed: true,
              explain: `${is(fv(p), fp)}, ${is(fv(q, GN), gq)}이므로 ${fv(p)} + ${k}${fv(q, GN)} = ${iq(fp)} + ${k} × ${par(gq)} = ${iq(v)}이다.`,
              facts: { value: `${jn(a)}*${jn(p)}+${jn(b)}+${k}*${jn(c)}/${jn(q)}`, rule: 'sum-two' }
            });
          }, { count: 2 }),
          T('value-cancel', '모르는 수가 지워지는 함숫값의 합', '②6', (d) => {
            const b = nz(d, -9, 9), k = d.int(2, 6);
            return N(`함수 ${fxT(lt(A + X), tm(b))}에 대하여 ${fv(-k)} + ${fv(k)}의 값은? (단, ${A}는 수이다.)`, 2 * b, { signed: true,
              explain: `${fv(-k)} = ${ex(lt(k + A, true), tm(b))}, ${fv(k)} = ${ex(lt(k + A), tm(b))}이므로 ${fv(-k)} + ${fv(k)} = ${par(b)} + ${par(b)} = ${iq(2 * b)}이다.`,
              facts: { value: `${jn(b)}+${jn(b)}` }
            });
          }),
          T('value-claims', '함숫값을 적은 등식의 참·거짓', '①9 ②7', (d) => {
            // 틀린 등식: 상수항을 놓친 값, 부호를 놓친 값, 상수항을 뺀 값
            const a = slope(d, 'frac'), b = nz(d, -5, 5), want = d.bool(), f = (t) => a.p * t + b;
            const ts = d.shuffle([-3, -2, -1, 1, 2, 3]).slice(0, 4), slips = d.shuffle([(t) => a.p * t, (t) => -a.p * t + b, (t) => a.p * t - b]);
            const rows = d.shuffle(ts.map((t, i) => { const bad = want ? i > 0 : i === 0; return { k: a.q * t, said: bad ? slips[i % 3](t) : f(t), ok: !bad }; }));
            const at = rows.findIndex((r) => r.ok === want), hit = rows[at];
            return C(`함수 ${fx(a, b)}에 대하여 다음 중 ${want ? '옳은' : '옳지 않은'} 것은?`, rows.map((r) => is(fv(r.k), r.said)), at, {
              explain: `${fv(hit.k)} = ${iq(a)} × ${par(hit.k)} ${sgn(b)} = ${iq(f(hit.k / a.q))}이다.`,
              facts: { claimed: rows.map((r) => [`${mulA(a, jn(r.k))}+${jn(b)}`, r.said]), claimedWant: want }
            });
          }),
          T('value-pick-func', '함숫값이 주어진 값이 되는 함수 고르기', '①9', (d) => {
            // 틀린 함수: 부호가 반대인 값이 되는 y = a/x 꼴, 상수항의 부호를 바꾼 것, 주어진 값을 계수로 쓴 것
            const [k, a, bb] = d.until(() => [pm(d) * d.int(2, 4), pm(d) * d.int(2, 4), nz(d, -6, 6)], ([u, v, w]) => v * u + w !== 0), vv = a * k + bb;
            const rows = d.shuffle([[fx(a, bb), `${jn(a)}*${jn(k)}+${jn(bb)}`, true], [fxI(-k * vv), `${jn(-k * vv)}/${jn(k)}`, false], [fx(a, -bb), `${jn(a)}*${jn(k)}+${jn(-bb)}`, false], [fx(vv, 0), `${jn(vv)}*${jn(k)}`, false]]);
            return C(`다음 함수 중 ${is(fv(k), vv)}인 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[2]), {
              explain: `${fx(a, bb)}에서 ${fv(k)} = ${iq(a)} × ${par(k)} ${sgn(bb)} = ${iq(vv)}이다. 나머지 함수에서 ${fv(k)}의 값은 ${iq(vv)}${tail(Math.abs(vv), '이/가')} 아니다.`,
              facts: { claimed: rows.map((r) => [r[1], vv]), claimedWant: true }
            });
          }),
          T('value-find-x', '함숫값이 주어질 때 x의 값', '①10 ②8', (d, n) => {
            if (n === 0) {
              const a = pm(d) * d.int(2, 6), b = nz(d, -9, 9), k = nz(d, -5, 5), v = a * k + b;
              return N(`함수 ${fx(a, b)}에 대하여 ${is(fv(K), v)}일 때, ${K}의 값은?`, k, { signed: true,
                explain: `${fv(K)} = ${ex(lt(Math.abs(a) + K, a < 0), tm(b))} = ${iq(v)}에서 ${ex(lt(Math.abs(a) + K, a < 0))} = ${iq(v - b)}이므로 ${is(K, k)}이다.`,
                facts: { value: `(${jn(v)}-${jn(b)})/${jn(a)}`, rule: 'find-linear' }
              });
            }
            const m = d.pick([12, 18, 20, 24, 30]), a = pm(d) * m, k = pm(d) * d.pick([2, 3, 4, 5, 6].filter((w) => m % w === 0)), v = a / k;
            return N(`함수 ${fxI(a)}에 대하여 ${is(fv(K), v)}일 때, ${K}의 값은?`, k, { signed: true,
              explain: `${fv(K)} = ${a < 0 ? MINUS : ''}${frac(m, K)} = ${iq(v)}에서 ${K} = ${iq(a)} ÷ ${par(v)} = ${iq(k)}이다.`,
              facts: { value: `${jn(a)}/${jn(v)}`, rule: 'find-inverse' }
            });
          }, { count: 2 }),
          T('value-self', '함숫값이 넣은 수와 같아지는 x의 값', '①10', (d) => {
            const p = d.pick([-4, -3, -2, 2, 3, 4, 5]), k = nz(d, -4, 4), q = k * (1 - p);
            return N(`함수 ${fx(p, q)}에 대하여 ${fv(K)} = ${K}일 때, ${K}의 값은?`, k, { signed: true,
              explain: `${fv(K)} = ${ex(lt(Math.abs(p) + K, p < 0), tm(q))} = ${K}에서 ${ex(lt((Math.abs(p - 1) === 1 ? '' : Math.abs(p - 1)) + K, p - 1 < 0))} = ${iq(-q)}이므로 ${is(K, k)}이다.`,
              facts: { value: `${jn(q)}/(1-${jn(p)})`, unseen: [1] }
            });
          }),
          T('value-both-ways', '함숫값과, 그 함숫값을 주는 x의 값', '①10 심4', (d) => {
            const m = pm(d) * d.int(2, 5), c = nz(d, -7, 7), [p, bv] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([u, v]) => u !== v), av = m * p + c, v = m * bv + c;
            return vals(`함수 ${fx(m, c)}에 대하여 ${fv(p)} = ${A}, ${is(fv(BB), v)}일 때, ${A}, ${BB}의 값은?`, [[A, av], [BB, bv]], {
              explain: `${A} = ${fv(p)} = ${iq(m)} × ${par(p)} ${sgn(c)} = ${iq(av)}이다. ${fv(BB)} = ${ex(lt(Math.abs(m) + BB, m < 0), tm(c))} = ${iq(v)}에서 ${is(BB, bv)}이다.`,
              facts: { calc: [[`${jn(m)}*${jn(p)}+${jn(c)}`, 0], [`(${jn(v)}-${jn(c)})/${jn(m)}`, 1]] }
            });
          }),
          T('value-coef', '함숫값으로 식의 수 구하기', '②9', (d) => {
            const a = nz(d, -5, 5), b = nz(d, -7, 7), p = pm(d) * d.int(2, 5), v = a * p + b;
            return N(`함수 ${fxT(lt(A + X), tm(b))}에 대하여 ${is(fv(p), v)}일 때, 수 ${A}의 값은?`, a, { signed: true,
              explain: `${fv(p)} = ${ex(lt(Math.abs(p) + A, p < 0), tm(b))} = ${iq(v)}에서 ${ex(lt(Math.abs(p) + A, p < 0))} = ${iq(v - b)}이므로 ${is(A, a)}이다.`,
              facts: { value: `(${jn(v)}-${jn(b)})/${jn(p)}` }
            });
          }),
          T('value-coef-then', '함숫값으로 식의 수를 정하고 다른 함숫값 구하기', '①11 ②10 심5', (d, n) => {
            if (n === 0) {
              const a = slope(d, 'frac'), c = nz(d, -6, 6), [s, t] = d.until(() => [nz(d, -3, 3), nz(d, -3, 3)], ([u, v]) => u !== v), x0 = a.q * s, x1 = a.q * t, v0 = a.p * s + c, v1 = a.p * t + c;
              return N(`함수 ${fxT(tm(a, X), lt(A))}에 대하여 ${is(fv(x0), v0)}일 때, ${fv(x1)}의 값은? (단, ${A}는 수이다.)`, v1, { signed: true,
                explain: `${fv(x0)} = ${iq(a.p * s)} + ${A} = ${iq(v0)}에서 ${is(A, c)}이다. ${fx(a, c)}이므로 ${fv(x1)} = ${iq(a.p * t)} ${sgn(c)} = ${iq(v1)}이다.`,
                facts: { value: `${jn(v0)}-${mulA(a, jn(x0))}+${mulA(a, jn(x1))}`, rule: 'then-linear' }
              });
            }
            // y = a/x 꼴: 답은 분수이다.
            const p = pm(d) * d.int(2, 5), v = pm(d) * d.int(2, 6), a = p * v, q = pm(d) * d.until(() => d.int(2, 9), (w) => a % w !== 0), ans = Q(a, q);
            return ansV(`함수 ${nb(`${FN}(${X}) = ${frac(A, X)}`)}에 대하여 ${is(fv(p), v)}일 때, ${fv(q)}의 값은? (단, ${A}는 수이다.)`, ans, 'frac', {
              explain: `${fv(p)} = ${frac(A, iq(p))} = ${iq(v)}에서 ${A} = ${iq(p)} × ${par(v)} = ${iq(a)}이다. ${fxI(a)}이므로 ${fv(q)} = ${iq(ans)}이다.`,
              facts: { value: `${jn(p)}*${jn(v)}/${jn(q)}`, rule: 'then-inverse' }
            });
          }, { count: 2 }),
          T('value-two-eq', '두 함숫값으로 식을 정하고 다른 함숫값 구하기', '①12', (d) => {
            const a = nz(d, -4, 4), b = nz(d, -6, 6), [p, q, r] = d.until(() => [d.int(-3, 3), d.int(-3, 3), d.int(-4, 4)], ([u, v, w]) => u < v && w !== u && w !== v), f = (x) => a * x + b;
            return N(`함수 ${fxT(lt(A + X), lt(BB))}에 대하여 ${is(fv(p), f(p))}, ${is(fv(q), f(q))}일 때, ${fv(r)}의 값은? (단, ${A}, ${BB}는 수이다.)`, f(r), { signed: true,
              explain: `${X}의 값이 ${iq(p)}에서 ${nj(q, '으로/로')} ${q - p}만큼 증가할 때 함숫값은 ${iq(f(q) - f(p))}만큼 증가하므로 ${is(A, a)}이다. ${fv(p)} = ${iq(a * p)} + ${BB} = ${iq(f(p))}에서 ${is(BB, b)}이므로 ${fx(a, b)}이고, ${is(fv(r), f(r))}이다.`,
              facts: { value: `${jn(f(p))}+(${jn(f(q))}-${jn(f(p))})*(${jn(r)}-${jn(p)})/(${jn(q)}-${jn(p)})` }
            });
          }),
          T('value-graph-read', '그래프에서 함숫값 읽기', '①13 ②13', (d) => {
            // 모눈 점을 지나는 직선에서 x의 값 셋에 대한 함숫값을 읽는다(읽을 점에 점을 찍었다).
            const cfg = d.until(() => {
              const [p, q] = d.pick([[1, 1], [2, 1], [1, 2], [3, 2], [1, 3], [2, 3]]), a = Q(pm(d) * p, q), b = nz(d, -3, 3);
              const xs = [-3, -2, -1, 0, 1, 2, 3].filter((x) => x % q === 0 && Math.abs(a.p * x / q + b) <= 3);
              return { a, b, xs: d.shuffle(xs).slice(0, 3).sort((u, v) => u - v) };
            }, (c) => c.xs.length === 3 && c.xs[0] < 0 && c.xs[2] > 0 && plOk(gridOf(c.a, c.b, c.xs.map((x) => [x, c.a.p * x / c.a.q + c.b]))));
            const { a, b, xs } = cfg, ys = xs.map((x) => a.p * x / a.q + b);
            return M(`그림은 함수 ${nb(`${Y} = ${FN}(${X})`)}의 그래프이다. 다음 함숫값을 구하시오.`, xs.map((x, i) => ({ lead: `${fv(x)} =`, answer: ys[i], signed: true })), {
              figure: pl(gridOf(a, b, xs.map((x, i) => [x, ys[i]]))),
              shown: xs.map((x, i) => is(fv(x), ys[i])).join(', '),
              explain: `그래프가 세 점 ${xs.map((x, i) => pt(x, ys[i])).join(', ')}${tail(Math.abs(ys[2]), '을/를')} 지나므로 ${xs.map((x, i) => is(fv(x), ys[i])).join(', ')}이다.`,
              facts: { calc: xs.map((x, i) => [`${mulA(a, jn(x))}+${jn(b)}`, i]), unseen: [0] }
            });
          }),
          T('value-story', '상황을 함수의 식으로 나타내고 함숫값 구하기', '①3 ②11 심3', (d) => {
            const s = d.pick([
              () => { const p = d.pick([1500, 1800, 2000]), r = d.pick([800, 900, 1200]), k = d.int(3, 6); return { a: r, b: p, k, unseen: [], calc: [`${r}`, `${p}`, `${r}*${k}+${p}`], text: `한 개에 ${p}원인 우유 1개와 한 개에 ${r}원인 빵 ${X}개의 값을 ${Y}원이라 하자.`, told: `빵 ${X}개의 값은 ${r}${X}원이고 우유의 값은 ${p}원이다.` }; },
              () => { const k = d.int(6, 9); return { a: 180, b: -360, k, unseen: [180, 2, 0], calc: ['180', '0-180*2', `180*(${k}-2)`], text: `${X}각형의 내각의 크기의 합을 ${Y}°라 하자.`, told: `${X}각형의 내각의 크기의 합은 180° × (${X} ${MINUS} 2)이다.` }; },
              () => { const p = d.pick([20, 30, 40]), r = d.int(3, 6), k = d.pick([5, 8, 10, 12]); return { a: r, b: p, k, unseen: [], calc: [`${r}`, `${p}`, `${r}*${k}+${p}`], text: `물이 ${p} L 들어 있는 물통에 1분에 ${r} L씩 물을 넣을 때, ${X}분 후 물통에 들어 있는 물의 양을 ${Y} L라 하자.`, told: `${X}분 동안 넣은 물의 양은 ${r}${X} L이고 처음에 ${p} L가 들어 있다.` }; }
            ])(), v = s.a * s.k + s.b;
            return inline(`${s.text} 함수 ${nb(`${Y} = ${FN}(${X})`)}의 식과 ${fv(s.k)}의 값을 구하시오.`, `${Y} = {0}${X} {1}<br>${fv(s.k)} = {2}`, [{ answer: s.a, signed: true }, { answer: s.b, signed: true }, { answer: v }], {
              shown: `${eq(s.a, s.b)}, ${is(fv(s.k), v)}`,
              explain: `${s.told} 따라서 ${eq(s.a, s.b)}이고, ${fv(s.k)} = ${s.a} × ${s.k} ${sgn(s.b)} = ${v}이다.`,
              facts: { calc: s.calc.map((text, i) => [text, i]), unseen: s.unseen }
            });
          }),
          T('value-letter-in', 'x 자리에 문자식을 넣은 함숫값', '심6', (d) => {
            // f(a/n) = ra + s: x 자리에 a/n 을 통째로 넣는다.
            const n = d.pick([2, 3]), t = nz(d, -4, 4), p = n * t, q = nz(d, -7, 7), r = d.until(() => pm(d) * d.int(2, 6), (v) => v !== t), a = nz(d, -4, 4), s = (t - r) * a + q;
            return N(`함수 ${fx(p, q)}에 대하여 ${nb(`${FN}(${frac(A, n)}) = ${ex(tm(r, A), tm(s))}`)}일 때, ${A}의 값은?`, a, { signed: true,
              explain: `${X} 자리에 ${frac(A, n)}${tail(n, '을/를')} 넣으면 ${nb(`${FN}(${frac(A, n)})`)} = ${iq(p)} × ${frac(A, n)} ${sgn(q)} = ${ex(tm(t, A), tm(q))}이다. ${ex(tm(t, A), tm(q))} = ${ex(tm(r, A), tm(s))}에서 ${ex(tm(t - r, A))} = ${iq(s - q)}이므로 ${is(A, a)}이다.`,
              facts: { value: `(${jn(s)}-${jn(q)})/(${jn(p)}/${n}-${jn(r)})`, unseen: s === 0 ? [0] : [] }
            });
          })
        ]
      },
      {
        id: 'linear', title: '일차함수의 뜻', standard: S15,
        types: [
          T('linear-pick-eq', '식을 보고 일차함수 찾기', '①14 ②14', (d) => {
            const good = d.pick([FORM.plain, FORM.over, FORM.negParen, FORM.sum])(d), bad = d.shuffle([FORM.konst, FORM.inv, FORM.invPlus, FORM.quad, FORM.prod]).slice(0, 3).map((f) => f(d)), rows = d.shuffle([good].concat(bad));
            return C(`다음 식 중 ${Y}가 ${X}에 대한 일차함수인 것은?`, rows.map((r) => r.h), rows.indexOf(good), {
              explain: `${Y}가 ${X}에 대한 일차식 ${eqAB}(${A} ≠ 0)로 나타날 때, 이 함수를 일차함수라 한다. ${good.as ? `${good.h}에서 ${good.as}이므로 일차함수이다.` : `일차함수인 것은 ${good.h}이다.`}`,
              facts: { truth: rows.map((r) => r.lin), want: true }
            });
          }),
          T('linear-cond', '일차함수가 되게 하는 수의 조건', '①16 ②15', (d) => {
            // 정리하면 x의 계수가 0이 되는 a의 값을 구한다(그 값이면 x의 항이 사라진다).
            const s = d.pick([
              () => { const p = d.pick([2, 3]), t = d.int(2, 5), r = d.int(2, 6), plus = d.bool(); return { h: nb(`${Y} = ${p}${A}${X} + ${p * t}(${r} ${plus ? '+' : MINUS} ${X})`), v: plus ? -t : t, value: plus ? `0-${p * t}/${p}` : `${p * t}/${p}`, unseen: plus ? [0] : [], told: `${X}의 계수는 ${ex(lt(p + A), tm(plus ? p * t : -p * t))}` }; },
              () => { const c = d.int(2, 9), s2 = d.int(2, 6), plus = d.bool(); return { h: nb(`${Y} = ${c} ${MINUS} (${A} + ${s2})${X} ${plus ? '+' : MINUS} ${X}`), v: plus ? 1 - s2 : -1 - s2, value: plus ? `1-${s2}` : `0-1-${s2}`, unseen: [0, 1], told: `${X}의 계수는 ${ex(lt(A, true), tm(plus ? 1 - s2 : -1 - s2))}` }; }
            ])();
            return N(`${s.h}가 ${X}에 대한 일차함수일 때, 수 ${A}의 값이 될 수 없는 수는?`, s.v, { signed: true,
              explain: `식을 정리하면 ${s.told}이다. 일차함수가 되려면 ${X}의 계수가 0이 아니어야 하므로 ${nb(`${A} ≠ ${iq(s.v)}`)}이다.`,
              facts: { value: s.value, unseen: s.unseen }
            });
          }),
          T('linear-pick-story', '문장을 보고 일차함수 찾기', '①15 ②16 심9', (d, n) => {
            // 첫째: 일차함수인 것 하나(나머지는 x²·분모의 x·수만 있는 식). 둘째: 일차함수가 아닌 것 하나(y = ax 꼴도 일차함수이다).
            const lins = d.shuffle(LIN_STORY).slice(0, n === 0 ? 1 : 3).map((k) => STORY[k](d)), nons = d.shuffle(NON_STORY).slice(0, n === 0 ? 3 : 1).map((k) => STORY[k](d)), rows = d.shuffle(lins.concat(nons)), at = rows.findIndex((r) => r.lin === (n === 0));
            return C(`다음 중 ${Y}가 ${X}에 대한 일차함수${n === 0 ? '인' : '가 아닌'} 것은?`, rows.map((r) => r.say), at, {
              explain: `관계식은 차례로 ${rows.map((r) => r.eq).join(', ')}이다. 이 가운데 ${eqAB}(${A} ≠ 0) 꼴${n === 0 ? '인' : '이 아닌'} 것은 ${rows[at].eq}뿐이다.`,
              facts: { truth: rows.map((r) => r.lin), want: n === 0, rule: 'story-' + n }
            });
          }, { count: 2 }),
          T('linear-story-eq', '상황을 식으로 나타내고 일차함수인지 판단하기', '②17', (d, n) => {
            // 보기는 식 둘(바른 식, 흔히 잘못 세우는 식)과 판단 둘을 짝지은 넷이다. 첫째는 일차함수인 상황, 둘째는 아닌 상황.
            const s = STORY[d.pick(n === 0 ? ['pens', 'change', 'rect', 'truck'] : ['area', 'trip', 'cake'])](d);
            const rows = d.shuffle([[s.eq, true], [s.eq, false], [s.miss, true], [s.miss, false]]).map(([h, says]) => ({ h: `${h}이고, ${Y}는 ${X}에 대한 일차함수${says ? '이다' : '가 아니다'}.`, ok: h === s.eq && says === s.lin }));
            return C(`${s.full} ${X}와 ${Y} 사이의 관계를 바르게 설명한 것은?`, rows.map((r) => r.h), rows.findIndex((r) => r.ok), {
              explain: `관계식은 ${s.eq}이다. ${s.lin ? `${Y}가 ${X}에 대한 일차식으로 나타나므로 일차함수이다.` : `${Y}가 ${X}에 대한 일차식으로 나타나지 않으므로 일차함수가 아니다.`}`,
              facts: { truth: rows.map((r) => r.ok), want: true, rule: 'story-eq-' + n }
            });
          }, { count: 2 })
        ]
      },
      { id: 'shift', title: '일차함수의 그래프와 평행이동', standard: S15, types: [] },
      { id: 'intercept', title: 'x절편과 y절편', standard: S15, types: [] },
      { id: 'slope', title: '기울기', standard: S15, types: [] },
      { id: 'nature', title: '그래프의 성질', standard: S16, types: [] },
      { id: 'parallel', title: '평행과 일치', standard: S16, types: [] },
      { id: 'equation', title: '일차함수의 식 구하기', standard: S16, types: [] },
      { id: 'use', title: '일차함수의 활용', standard: S16, types: [] }
    ]
  });

  // ── 일차함수의 그래프와 평행이동 ──
  B.addTypes('8-1-5', 'shift', [
    T('shift-point-on', '점이 일차함수의 그래프 위에 있는지 가리기', '①17 ②22', (d) => {
      // 그래프 위에 없는 점: 상수항의 부호를 놓친 것, 기울기의 부호를 놓친 것, x와 y의 자리를 바꾼 것
      const want = d.bool();
      const c = d.until(() => {
        const a = nz(d, -4, 4), b = nz(d, -6, 6), f = (x) => a * x + b, xs = d.shuffle([-3, -2, -1, 1, 2, 3]);
        return { a, b, f, good: [0, xs[0], xs[1]].map((x) => [x, f(x)]), bad: [[xs[2], a * xs[2] - b], [xs[3], -a * xs[3] + b], [f(xs[4]), xs[4]]].filter(([x, y]) => f(x) !== y) };
      }, (v) => v.bad.length === 3 && new Set(v.good.concat(v.bad).map((p) => p.join())).size === 6);
      const { a, b, f } = c, rows = d.shuffle(want ? [c.good[d.int(0, 2)]].concat(c.bad) : c.good.concat([c.bad[d.int(0, 2)]])), at = rows.findIndex(([x, y]) => (f(x) === y) === want), [x0, y0] = rows[at];
      return C(`다음 중 일차함수 ${eq(a, b)}의 그래프 위의 점${want ? '은' : '이 아닌 것은'}?`, rows.map(([x, y]) => pt(x, y)), at, {
        explain: `${eq(a, b)}에 ${is(X, x0)}${tail(Math.abs(x0), '을/를')} 대입하면 ${Y} = ${iq(a)} × ${par(x0)} ${sgn(b)} = ${iq(f(x0))}이다. 따라서 점 ${ptj(x0, y0, '은/는')} 그래프 위의 점${want ? '이다' : '이 아니다'}.`,
        facts: { claimed: rows.map(([x, y]) => [`${jn(a)}*${jn(x)}+${jn(b)}`, y]), claimedWant: want }
      });
    }),
    T('shift-point-fill', '그래프가 지나는 점의 빈 좌표 구하기', '①18', (d) => {
      const a = slope(d, d.bool() ? 'int' : 'frac'), b = nz(d, -5, 5), [t1, t2] = d.until(() => [nz(d, -3, 3), nz(d, -3, 3)], ([u, v]) => u !== v), x1 = a.q * t1, y1 = a.p * t1 + b, x2 = a.q * t2, y2 = a.p * t2 + b;
      return M(`일차함수 ${eq(a, b)}의 그래프가 두 점 ${pt(x1, LAB[0])}, ${ptj(LAB[1], y2, '을/를')} 지날 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: y1, signed: true }, { label: LAB[1], answer: x2, signed: true }], {
        explain: `${eq(a, b)}에 ${is(X, x1)}${tail(Math.abs(x1), '을/를')} 대입하면 ${is(Y, y1)}이므로 ㉠은 ${iq(y1)}이다. ${is(Y, y2)}${tail(Math.abs(y2), '을/를')} 대입하면 ${is(X, x2)}이므로 ㉡은 ${iq(x2)}이다.`,
        facts: { calc: [[`${mulA(a, jn(x1))}+${jn(b)}`, 0], [divA(`(${jn(y2)}-${jn(b)})`, a), 1]] }
      });
    }),
    T('shift-coef-from-point', '그래프가 지나는 한 점으로 식의 수 구하기', '①19', (d, n) => {
      if (n === 0) {
        const a = pm(d) * d.int(2, 5), b = nz(d, -7, 7), x0 = nz(d, -4, 4), y0 = a * x0 + b, h = eqT(lt(A + X), tm(b));
        return N(`일차함수 ${h}의 그래프가 점 ${ptj(x0, y0, '을/를')} 지날 때, 수 ${A}의 값은?`, a, { signed: true,
          explain: `${h}에 ${is(X, x0)}, ${is(Y, y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${iq(y0)} = ${ex(lt((Math.abs(x0) === 1 ? '' : Math.abs(x0)) + A, x0 < 0), tm(b))}이므로 ${is(A, a)}이다.`,
          facts: { value: `(${jn(y0)}-${jn(b)})/${jn(x0)}`, rule: 'coef-once' }
        });
      }
      // 식의 두 곳에 a가 있다: y = ax + ca
      const c = pm(d) * d.int(2, 4), a = pm(d) * d.int(2, 5), x0 = d.until(() => nz(d, -5, 5), (v) => Math.abs(v + c) > 1), y0 = a * (x0 + c), h = eqT(lt(A + X), lt(Math.abs(c) + A, c < 0));
      return N(`일차함수 ${h}의 그래프가 점 ${ptj(x0, y0, '을/를')} 지날 때, 수 ${A}의 값은?`, a, { signed: true,
        explain: `${h}에 ${is(X, x0)}, ${is(Y, y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${iq(y0)} = ${ex(lt((Math.abs(x0) === 1 ? '' : Math.abs(x0)) + A, x0 < 0), lt(Math.abs(c) + A, c < 0))}, 곧 ${iq(y0)} = ${ex(lt(Math.abs(x0 + c) + A, x0 + c < 0))}이므로 ${is(A, a)}이다.`,
        facts: { value: `${jn(y0)}/(${jn(x0)}+${jn(c)})`, rule: 'coef-twice' }
      });
    }, { count: 2 }),
    T('shift-two-graphs-point', '두 그래프가 모두 지나는 점으로 식의 수 구하기', '①19 심44', (d) => {
      const a = nz(d, -5, 5), c1 = nz(d, -6, 6), c2 = pm(d) * d.int(2, 5), p = nz(d, -3, 3), q = a * p + c1, b = q - c2 * p, h1 = eqT(lt(A + X), tm(c1)), h2 = eqT(tm(c2, X), lt(BB));
      return vals(`두 일차함수 ${h1}, ${h2}의 그래프가 모두 점 ${ptj(p, q, '을/를')} 지날 때, 수 ${A}, ${BB}의 값은?`, [[A, a], [BB, b]], {
        explain: `${h1}에 ${is(X, p)}, ${is(Y, q)}${tail(Math.abs(q), '을/를')} 대입하면 ${iq(q)} = ${ex(lt((Math.abs(p) === 1 ? '' : Math.abs(p)) + A, p < 0), tm(c1))}이므로 ${is(A, a)}이다. ${h2}에 대입하면 ${iq(q)} = ${iq(c2 * p)} + ${BB}이므로 ${is(BB, b)}이다.`,
        facts: { calc: [[`(${jn(q)}-${jn(c1)})/${jn(p)}`, 0], [`${jn(q)}-${jn(c2)}*${jn(p)}`, 1]] }
      });
    }),
    T('shift-two-points-coef', '그래프가 지나는 두 점으로 수 둘 구하기', '②25', (d) => {
      const m = pm(d) * d.int(2, 5), b = nz(d, -7, 7), [x1, av] = d.until(() => [nz(d, -3, 3), nz(d, -4, 4)], ([u, v]) => u !== v), y1 = m * x1 + b, y2 = m * av + b, h = eqT(tm(m, X), lt(BB));
      return vals(`일차함수 ${h}의 그래프가 두 점 ${pt(x1, y1)}, ${ptj(A, y2, '을/를')} 지날 때, 수 ${A}, ${BB}의 값은?`, [[A, av], [BB, b]], {
        explain: `${h}에 ${is(X, x1)}, ${is(Y, y1)}${tail(Math.abs(y1), '을/를')} 대입하면 ${iq(y1)} = ${iq(m * x1)} + ${BB}이므로 ${is(BB, b)}이다. ${eq(m, b)}에 ${is(Y, y2)}${tail(Math.abs(y2), '을/를')} 대입하면 ${is(X, av)}이므로 ${is(A, av)}이다.`,
        facts: { calc: [[`(${jn(y2)}-${jn(y1)}+${jn(m)}*${jn(x1)})/${jn(m)}`, 0], [`${jn(y1)}-${jn(m)}*${jn(x1)}`, 1]] }
      });
    }),
    T('shift-how-much', '얼마만큼 평행이동한 그래프인지 구하기', '①20 ②18', (d, n) => {
      const a = slope(d, d.bool() ? 'int' : 'frac'), lead = (h1, h0) => `일차함수 ${h1}의 그래프는 일차함수 ${h0}의 그래프를 ${YA}의 방향으로 얼마만큼 평행이동한 것인가?`;
      if (n === 0) {
        const b = nz(d, -8, 8);
        return N(lead(eq(a, b), eq(a, 0)), b, { signed: true, explain: `일차함수 ${eqAB}의 그래프는 일차함수 ${eqT(lt(A + X))}의 그래프를 ${YA}의 방향으로 ${BB}만큼 평행이동한 직선이다. ${eq(a, b)}에서 ${BB}의 자리의 수는 ${iq(b)}이다.`, facts: { value: jn(b), rule: 'how-0' } });
      }
      if (n === 1) {
        const [b0, b1] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6)], ([u, v]) => u !== v);
        return N(lead(eq(a, b1), eq(a, b0)), b1 - b0, { signed: true, explain: `${YA}의 방향으로 ${K}만큼 평행이동하면 상수항이 ${K}만큼 커진다. ${iq(b0)} + ${K} = ${iq(b1)}에서 ${is(K, b1 - b0)}이다.`, facts: { value: `${jn(b1)}-${jn(b0)}`, rule: 'how-1' } });
      }
      const m = pm(d) * d.int(2, 5), c = nz(d, -5, 5), h = nb(`${Y} = ${iq(m)}(${X} ${sgn(c)})`);
      return N(lead(h, eq(m, 0)), m * c, { signed: true, explain: `괄호를 풀면 ${h}에서 ${eq(m, m * c)}이다. 따라서 ${eq(m, 0)}의 그래프를 ${YA}의 방향으로 ${iq(m * c)}만큼 평행이동한 것이다.`, facts: { value: `${jn(m)}*${jn(c)}`, rule: 'how-2' } });
    }, { count: 3 }),
    T('shift-eq', '평행이동한 그래프의 식 구하기', '①21 ②19', (d, n) => {
      const a = pm(d) * d.int(2, 6), k = nz(d, -7, 7), b = n === 0 ? 0 : d.until(() => nz(d, -6, 6), (v) => v + k !== 0);
      return eqAns(`일차함수 ${eq(a, b)}의 그래프를 ${YA}의 방향으로 ${iq(k)}만큼 평행이동한 그래프가 나타내는 일차함수의 식을 구하시오.`, a, b + k, {
        explain: n === 0 ? `${eq(a, 0)}의 그래프를 ${YA}의 방향으로 ${iq(k)}만큼 평행이동한 그래프의 식은 ${eq(a, k)}이다.` : `평행이동하여도 기울기는 변하지 않고 상수항에 ${iq(k)}${tail(Math.abs(k), '이/가')} 더해진다. ${iq(b)} + ${par(k)} = ${iq(b + k)}이므로 ${eq(a, b + k)}이다.`,
        facts: { calc: [[jn(a), 0], [n === 0 ? jn(k) : `${jn(b)}+${jn(k)}`, 1]], rule: 'shift-eq-' + n }
      });
    }, { count: 2 }),
    T('shift-overlap', '평행이동하면 겹쳐지는 그래프 고르기', '②20', (d) => {
      // 틀린 식: 기울기의 부호가 다른 것 둘, 기울기가 역수인 것 둘
      const a = pm(d) * d.int(2, 4), c = () => nz(d, -7, 7), s = a > 0 ? 1 : -1, n = Math.abs(a);
      const good = eq(a, c()), rows = d.shuffle([good].concat(d.shuffle([eq(-a, 0), eq(-a, c()), eq(Q(s, n), c()), eq(Q(-s, n), c())]).slice(0, 3)));
      return C(`다음 일차함수 중 그 그래프가 일차함수 ${eq(a, 0)}의 그래프를 평행이동하였을 때 겹쳐지는 것은?`, rows, rows.indexOf(good), {
        explain: `평행이동하여도 기울기는 변하지 않는다. 기울기가 ${iq(a)}인 ${good}의 그래프가 겹쳐진다.`,
        facts: { truth: rows.map((r) => r === good), want: true }
      });
    }),
    T('shift-match', '평행이동한 그래프가 다른 그래프와 일치할 때 수 구하기', '①23 ②21', (d, n) => {
      const m = pm(d) * d.int(2, 5), [c1, c2] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6)], ([u, v]) => u !== v);
      if (n === 0) {
        const k = d.until(() => nz(d, -6, 6), (v) => v !== c2), b = c2 - k, h1 = eqT(tm(m, X), lt(BB)), h2 = eqT(lt(A + X), tm(c2));
        return vals(`일차함수 ${h1}의 그래프를 ${YA}의 방향으로 ${iq(k)}만큼 평행이동하면 일차함수 ${h2}의 그래프와 일치한다. 수 ${A}, ${BB}의 값은?`, [[A, m], [BB, b]], {
          explain: `평행이동한 그래프의 식은 ${eqT(tm(m, X), lt(BB), tm(k))}이다. 이 그래프가 ${h2}의 그래프와 일치하므로 기울기와 ${YI}이 각각 같다. ${is(A, m)}이고, ${ex(lt(BB), tm(k))} = ${iq(c2)}에서 ${is(BB, b)}이다.`,
          facts: { calc: [[jn(m), 0], [`${jn(c2)}-${jn(k)}`, 1]], rule: 'match-const' }
        });
      }
      // 옮긴 양이 문자이다.
      const h1 = eqT(lt(A + X), tm(c1));
      return vals(`일차함수 ${h1}의 그래프를 ${YA}의 방향으로 ${BB}만큼 평행이동하면 일차함수 ${eq(m, c2)}의 그래프와 일치한다. 수 ${A}, ${BB}의 값은?`, [[A, m], [BB, c2 - c1]], {
        explain: `평행이동한 그래프의 식은 ${eqT(lt(A + X), tm(c1), lt(BB))}이다. 이 그래프가 ${eq(m, c2)}의 그래프와 일치하므로 ${is(A, m)}이고, ${ex(tm(c1), lt(BB))} = ${iq(c2)}에서 ${is(BB, c2 - c1)}이다.`,
        facts: { calc: [[jn(m), 0], [`${jn(c2)}-${jn(c1)}`, 1]], rule: 'match-amount' }
      });
    }, { count: 2 }),
    T('shift-through-point', '평행이동한 그래프가 지나는 점', '①22 ②23', (d, n) => {
      if (n === 0) {
        const a = pm(d) * d.int(2, 5), b = d.bool() ? 0 : nz(d, -5, 5), x0 = nz(d, -4, 4), k = nz(d, -8, 8), y0 = a * x0 + b + k;
        return N(`일차함수 ${eq(a, b)}의 그래프를 ${YA}의 방향으로 ${K}만큼 평행이동하면 점 ${ptj(x0, y0, '을/를')} 지난다. ${K}의 값은?`, k, { signed: true,
          explain: `평행이동한 그래프의 식은 ${eqT(tm(a, X), tm(b), lt(K))}이다. ${is(X, x0)}, ${is(Y, y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${iq(y0)} = ${ex(tm(a * x0 + b), lt(K))}이므로 ${is(K, k)}이다.`,
          facts: { value: b === 0 ? `${jn(y0)}-${jn(a)}*${jn(x0)}` : `${jn(y0)}-(${jn(a)}*${jn(x0)}+${jn(b)})`, rule: 'through-k' }
        });
      }
      if (n === 1) {
        const a = slope(d, 'frac'), k = nz(d, -6, 6), t = nz(d, -3, 3), x0 = a.q * t, y0 = a.p * t + k;
        return N(`일차함수 ${eq(a, 0)}의 그래프를 ${YA}의 방향으로 ${iq(k)}만큼 평행이동한 그래프가 점 ${pt(x0, K)}를 지날 때, ${K}의 값은?`, y0, { signed: true,
          explain: `평행이동한 그래프의 식은 ${eq(a, k)}이다. ${is(X, x0)}${tail(Math.abs(x0), '을/를')} 대입하면 ${K} = ${iq(a.p * t)} ${sgn(k)} = ${iq(y0)}이다.`,
          facts: { value: `${mulA(a, jn(x0))}+${jn(k)}`, rule: 'through-y' }
        });
      }
      // 평행이동한 그래프가 지나는 두 점: 한 점으로 a를 구하고 다른 점의 좌표를 구한다.
      const a = nz(d, -4, 4), c = nz(d, -5, 5), k = d.until(() => nz(d, -5, 5), (v) => v + c !== 0), [x1, x2] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([u, v]) => u !== v), nc = c + k, bv = a * x1 + nc, y2 = a * x2 + nc, h = eqT(lt(A + X), tm(c));
      return vals(`일차함수 ${h}의 그래프를 ${YA}의 방향으로 ${iq(k)}만큼 평행이동한 그래프가 두 점 ${pt(x1, BB)}, ${ptj(x2, y2, '을/를')} 지날 때, 수 ${A}, ${BB}의 값은?`, [[A, a], [BB, bv]], {
        explain: `평행이동한 그래프의 식은 ${eqT(lt(A + X), tm(nc))}이다. ${is(X, x2)}, ${is(Y, y2)}${tail(Math.abs(y2), '을/를')} 대입하면 ${is(A, a)}이다. ${eq(a, nc)}에 ${is(X, x1)}${tail(Math.abs(x1), '을/를')} 대입하면 ${is(BB, bv)}이다.`,
        facts: { calc: [[`(${jn(y2)}-${jn(c)}-${jn(k)})/${jn(x2)}`, 0], [`(${jn(y2)}-${jn(c)}-${jn(k)})*${jn(x1)}/${jn(x2)}+${jn(c)}+${jn(k)}`, 1]], rule: 'through-two' }
      });
    }, { count: 3 }),
    T('shift-fig', '그림의 그래프를 평행이동한 그래프의 절편', '①25', (d) => {
      // 그림에서 두 절편을 읽어 식을 구하고, 상수항에 옮긴 양을 더한다(읽을 두 점에 점을 찍었다).
      const c = d.until(() => { const p = pm(d) * d.int(1, 3), q = pm(d) * d.int(1, 3), a = Q(-q, p), k = nz(d, -5, 5), nq = q + k; return { p, q, a, k, nq, np: nq === 0 ? Q(1, 2) : qdiv(Q(-nq), a) }; },
        (v) => v.np.q === 1 && Math.abs(v.np.p) <= 12 && plOk(gridOf(v.a, v.q, [[v.p, 0], [0, v.q]])));
      const { p, q, a, k, nq } = c;
      return M(`그림과 같은 일차함수의 그래프를 ${YA}의 방향으로 ${iq(k)}만큼 평행이동한 그래프의 ${XI}과 ${YI}을 구하시오.`, [{ label: XI, answer: c.np.p, signed: true }, { label: YI, answer: nq, signed: true }], {
        figure: pl(gridOf(a, q, [[p, 0], [0, q]])),
        explain: `그림의 그래프는 두 점 ${pt(p, 0)}, ${ptj(0, q, '을/를')} 지나므로 기울기는 ${iq(a)}, ${YI}은 ${iq(q)}이고 식은 ${eq(a, q)}이다. 평행이동한 그래프의 식은 ${eq(a, nq)}이므로 ${YI}은 ${iq(nq)}이고, ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${XI}은 ${iq(c.np.p)}이다.`,
        facts: { calc: [[divA(`(0-(${jn(q)}+${jn(k)}))`, a), 0], [`${jn(q)}+${jn(k)}`, 1]], unseen: [0] }
      });
    }),
    T('shift-pick-graph', '평행이동한 그래프를 바르게 그린 것 고르기', '②45', (d) => {
      // 보기: 위로, 아래로, 오른쪽으로, 왼쪽으로 2만큼 옮긴 것. 실선이 축과 만나는 곳에 옮긴 만큼의 수를 적었다.
      // 왼쪽(오른쪽)으로 옮긴 직선은 y축과 2가 아닌 곳에서 만난다(기울기가 1이 아니므로).
      const a = d.pick([Q(2), Q(3, 2), Q(1, 2), Q(2, 3)]), af = fl(a), up = d.bool(), s = 2, xv = af >= 1 ? 3 / af : 3;
      const KIND = {
        up: { b: s, arrow: [-xv, -xv * af, -xv, -xv * af + s], ynums: [{ v: s }], word: '위쪽', at: `y축과 만나는 곳에 ${s}` },
        down: { b: -s, arrow: [xv, xv * af, xv, xv * af - s], ynums: [{ v: -s }], word: '아래쪽', at: `y축과 만나는 곳에 ${MINUS}${s}` },
        right: { b: -s * af, arrow: [1.5, 1.5 * af, 1.5 + s, 1.5 * af], xnums: [{ v: s }], word: '오른쪽', at: `x축과 만나는 곳에 ${s}` },
        left: { b: s * af, arrow: [-1.5, -1.5 * af, -1.5 - s, -1.5 * af], xnums: [{ v: -s }], word: '왼쪽', at: `x축과 만나는 곳에 ${MINUS}${s}` }
      };
      const order = d.shuffle(['up', 'down', 'right', 'left']), right = up ? 'up' : 'down';
      const fig = (key, i) => { const k = KIND[key]; return mini({ name: LAB[i], lines: [{ a, b: 0, dash: true }, { a, b: k.b }], arrow: k.arrow, xnums: k.xnums, ynums: k.ynums, say: `점선은 원점을 지나는 직선이고, 실선은 점선을 ${k.word}으로 평행이동한 직선이다. 실선이 ${k.at}${tail(s, '이/가')} 적혀 있다.` }); };
      return C(`다음 ㉠~㉣에서 점선은 일차함수 ${eq(a, 0)}의 그래프이고, 실선은 점선을 화살표의 방향으로 평행이동한 직선이다. 실선이 일차함수 ${eq(a, up ? s : -s)}의 그래프인 것은?`, LAB.slice(0, 4), order.indexOf(right), {
        figure: picks(order.map(fig)),
        explain: `${eq(a, up ? s : -s)}의 그래프는 ${eq(a, 0)}의 그래프를 ${YA}의 방향으로 ${iq(up ? s : -s)}만큼 평행이동한 직선이다. ${up ? '위쪽' : '아래쪽'}으로 ${s}만큼 옮겨 ${YA}과 만나는 점의 ${Y}좌표가 ${iq(up ? s : -s)}인 그림이 알맞다.`,
        facts: { truth: order.map((key) => key === right), want: true }
      });
    }),
    T('shift-point-then', '지나는 점으로 수를 구한 뒤 평행이동하기', '②24 심13', (d, n) => {
      if (n === 0) {
        const a = nz(d, -4, 4), c = nz(d, -6, 6), k = nz(d, -6, 6), [x1, x2] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([u, v]) => u !== v), y1 = a * x1 + c, y2 = a * x2 + c + k, h = eqT(lt(A + X), tm(c));
        return vals(`일차함수 ${h}의 그래프가 점 ${ptj(x1, y1, '을/를')} 지난다. 이 그래프를 ${YA}의 방향으로 ${BB}만큼 평행이동하면 점 ${ptj(x2, y2, '을/를')} 지날 때, 수 ${A}, ${BB}의 값은?`, [[A, a], [BB, k]], {
          explain: `${h}에 ${is(X, x1)}, ${is(Y, y1)}${tail(Math.abs(y1), '을/를')} 대입하면 ${is(A, a)}이다. 평행이동한 그래프의 식 ${eqT(tm(a, X), tm(c), lt(BB))}에 ${is(X, x2)}, ${is(Y, y2)}${tail(Math.abs(y2), '을/를')} 대입하면 ${iq(y2)} = ${ex(tm(a * x2 + c), lt(BB))}이므로 ${is(BB, k)}이다.`,
          facts: { calc: [[`(${jn(y1)}-${jn(c)})/${jn(x1)}`, 0], [`${jn(y2)}-(${jn(y1)}-${jn(c)})*${jn(x2)}/${jn(x1)}-${jn(c)}`, 1]], rule: 'then-point' }
        });
      }
      // 지나는 점으로 상수항을 구하고, 평행이동한 그래프가 다른 그래프와 일치한다.
      const m = pm(d) * d.int(2, 5), [av, c2] = d.until(() => [nz(d, -6, 6), nz(d, -7, 7)], ([u, v]) => u !== v), x1 = nz(d, -3, 3), y1 = m * x1 + av, h1 = eqT(tm(m, X), lt(A)), h2 = eqT(lt(K + X), tm(c2));
      return vals(`일차함수 ${h1}의 그래프가 점 ${ptj(x1, y1, '을/를')} 지난다. 이 그래프를 ${YA}의 방향으로 ${BB}만큼 평행이동하면 일차함수 ${h2}의 그래프와 일치할 때, 수 ${A}, ${BB}, ${K}의 값은?`, [[A, av], [BB, c2 - av], [K, m]], {
        explain: `${h1}에 ${is(X, x1)}, ${is(Y, y1)}${tail(Math.abs(y1), '을/를')} 대입하면 ${is(A, av)}이다. 평행이동한 그래프의 식 ${eqT(tm(m, X), tm(av), lt(BB))}이 ${h2}${tail(Math.abs(c2), '과/와')} 같으므로 ${is(K, m)}이고, ${ex(tm(av), lt(BB))} = ${iq(c2)}에서 ${is(BB, c2 - av)}이다.`,
        facts: { calc: [[`${jn(y1)}-${jn(m)}*${jn(x1)}`, 0], [`${jn(c2)}-(${jn(y1)}-${jn(m)}*${jn(x1)})`, 1], [jn(m), 2]], rule: 'then-match' }
      });
    }, { count: 2 }),
    T('shift-paren', '괄호가 있는 식의 그래프를 평행이동하기', '①22 심12', (d) => {
      // 옮긴 양은 괄호 안이 아니라 식의 끝에 더한다.
      const a = pm(d) * d.int(2, 4), p = nz(d, -4, 4), s = nz(d, -5, 5), kv = d.until(() => nz(d, -4, 4), (v) => v + p !== 0), y0 = a * (kv + p) + s, h = nb(`${Y} = ${iq(a)}(${X} ${sgn(p)})`);
      return N(`일차함수 ${h}의 그래프를 ${YA}의 방향으로 ${iq(s)}만큼 평행이동한 그래프가 점 ${ptj(K, y0, '을/를')} 지날 때, ${K}의 값은?`, kv, { signed: true,
        explain: `평행이동한 그래프의 식은 ${nb(`${Y} = ${iq(a)}(${X} ${sgn(p)}) ${sgn(s)}`)}이다. ${is(X, K)}, ${is(Y, y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${iq(a)}(${K} ${sgn(p)}) = ${iq(y0 - s)}에서 ${K} ${sgn(p)} = ${iq(kv + p)}이므로 ${is(K, kv)}이다.`,
        facts: { value: `(${jn(y0)}-${jn(s)})/${jn(a)}-${jn(p)}` }
      });
    })
  ]);

  // ── x절편과 y절편 ──
  B.addTypes('8-1-5', 'intercept', [
    T('intercept-term', 'x절편과 y절편의 뜻', '②1', (d) => {
      const onX = d.bool(), right = onX ? XI : YI, opts = d.shuffle([XI, YI, '기울기', '함숫값']);
      return C(`일차함수의 그래프가 ${onX ? XA : YA}과 만나는 점의 ${onX ? X : Y}좌표를 그 그래프의 무엇이라 하는가?`, opts, opts.indexOf(right), {
        explain: `일차함수의 그래프가 ${XA}과 만나는 점의 ${X}좌표를 ${XI}, ${YA}과 만나는 점의 ${Y}좌표를 ${YI}이라 한다.`,
        facts: { truth: opts.map((o) => o === right), want: true }
      });
    }),
    T('intercept-from-eq', '식에서 x절편과 y절편 구하기', '①26 ②27', (d, n) => {
      if (n === 0) {
        // 두 절편이 모두 정수가 되게 절편을 먼저 정한다.
        const [p, q] = d.until(() => [nz(d, -6, 6), nz(d, -8, 8)], ([u, v]) => Math.abs(v) !== Math.abs(u)), a = Q(-q, p);
        return M(`일차함수 ${eq(a, q)}의 그래프의 ${XI}과 ${YI}을 구하시오.`, [{ label: XI, answer: p, signed: true }, { label: YI, answer: q, signed: true }], {
          explain: `${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(X, p)}이므로 ${XI}은 ${iq(p)}이다. ${is(X, 0)}${tail(0, '을/를')} 대입하면 ${is(Y, q)}이므로 ${YI}은 ${iq(q)}이다.`,
          facts: { calc: [[divA(`(0-${jn(q)})`, a), 0], [jn(q), 1]], unseen: [0], rule: 'cut-int' }
        });
      }
      const [a, b] = d.until(() => [pm(d) * d.int(2, 6), nz(d, -9, 9)], ([u, v]) => v % u !== 0), v = Q(-b, a);
      return ansV(`일차함수 ${eq(a, b)}의 그래프의 ${XI}은?`, v, 'frac', {
        explain: `${is(Y, 0)}${tail(0, '을/를')} 대입하면 0 = ${ex(tm(a, X), tm(b))}에서 ${is(X, v)}이다. ${XI}은 ${iq(v)}이다.`,
        facts: { value: `(0-${jn(b)})/${jn(a)}`, unseen: [0], rule: 'cut-frac' }
      });
    }, { count: 2 }),
    T('intercept-axis-points', '그래프가 축과 만나는 점의 좌표', '①26 ②46', (d, n) => {
      // 절편은 수이고, 축과 만나는 점은 좌표이다: x축과 만나는 점은 (x절편, 0), y축과 만나는 점은 (0, y절편).
      const [p, q] = d.until(() => [nz(d, -6, 6), nz(d, -8, 8)], ([u, v]) => Math.abs(v) !== Math.abs(u)), a = Q(-q, p), onX = n === 0;
      return pointAns(`일차함수 ${eq(a, q)}의 그래프가 ${onX ? XA : YA}과 만나는 점의 좌표는?`, onX ? p : 0, onX ? 0 : q, {
        explain: onX ? `${XA} 위의 점은 ${Y}좌표가 0이다. ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(X, p)}이므로 만나는 점의 좌표는 ${pt(p, 0)}이다.` : `${YA} 위의 점은 ${X}좌표가 0이다. ${is(X, 0)}${tail(0, '을/를')} 대입하면 ${is(Y, q)}이므로 만나는 점의 좌표는 ${pt(0, q)}이다.`,
        facts: { calc: onX ? [[divA(`(0-${jn(q)})`, a), 0], ['0', 1]] : [['0', 0], [jn(q), 1]], unseen: [0], rule: 'axis-' + n }
      });
    }, { count: 2 }),
    T('intercept-read', '그래프에서 x절편과 y절편 읽기', '①27 ②26', (d) => {
      const c = d.until(() => { const p = nz(d, -3, 3), q = nz(d, -3, 3); return { p, q, a: Q(-q, p) }; }, (v) => plOk(gridOf(v.a, v.q)));
      return M(`그림과 같은 일차함수의 그래프의 ${XI}과 ${YI}을 구하시오.`, [{ label: XI, answer: c.p, signed: true }, { label: YI, answer: c.q, signed: true }], {
        figure: pl(gridOf(c.a, c.q, [], { say: `직선이 x축과 만나는 곳: ${whereOnPlane(c.p, 0)}. 직선이 y축과 만나는 곳: ${whereOnPlane(0, c.q)}.` })),
        explain: `그래프가 ${XA}과 점 ${pt(c.p, 0)}에서 만나므로 ${XI}은 ${iq(c.p)}이고, ${YA}과 점 ${pt(0, c.q)}에서 만나므로 ${YI}은 ${iq(c.q)}이다.`,
        facts: { calc: [[jn(c.p), 0], [jn(c.q), 1]] }
      });
    }),
    T('intercept-odd-one', 'x절편이 나머지와 다른 그래프 고르기', '①28 ②28', (d) => {
      // 셋은 x절편이 p, 하나는 −p(상수항의 부호만 다르다).
      const p = pm(d) * d.pick([2, 4]), slopes = d.shuffle([Q(2), Q(-3), Q(5), Q(-4), Q(3), Q(-2), Q(1, 2), Q(-1, 2), Q(3, 2)]).slice(0, 4), at = d.int(0, 3);
      const rows = slopes.map((a, i) => ({ a, b: qmul(a, Q(i === at ? p : -p)) }));
      return C(`다음 일차함수 중 그 그래프의 ${XI}이 나머지 셋과 다른 하나는?`, rows.map((r) => eq(r.a, r.b)), at, {
        explain: `${is(Y, 0)}${tail(0, '을/를')} 대입하여 ${XI}을 구하면 차례로 ${rows.map((r) => iq(xcut(r.a, r.b))).join(', ')}이다. ${XI}이 다른 하나는 ${eq(rows[at].a, rows[at].b)}이다.`,
        facts: { truth: rows.map((r) => qcmp(xcut(r.a, r.b), Q(p)) === 0), want: false }
      });
    }),
    T('intercept-coef', 'x절편으로 기울기 구하기', '①29', (d) => {
      const [b, p] = d.until(() => [nz(d, -9, 9), pm(d) * d.int(2, 6)], ([u, v]) => u % v !== 0), a = Q(-b, p), h = eqT(lt(A + X), tm(b));
      return ansV(`일차함수 ${h}의 그래프의 ${XI}이 ${iq(p)}일 때, 수 ${A}의 값은?`, a, 'frac', {
        explain: `${XI}이 ${iq(p)}이므로 그래프가 점 ${ptj(p, 0, '을/를')} 지난다. ${h}에 ${is(X, p)}, ${is(Y, 0)}${tail(0, '을/를')} 대입하면 0 = ${ex(lt(Math.abs(p) + A, p < 0), tm(b))}이므로 ${is(A, a)}이다.`,
        facts: { value: `(0-${jn(b)})/${jn(p)}`, unseen: [0] }
      });
    }),
    T('intercept-other', '한 절편이나 지나는 점으로 수를 정하고 다른 절편 구하기', '①30 ②29', (d, n) => {
      if (n === 0) {
        const a = slope(d, d.bool() ? 'int' : 'frac'), t = nz(d, -3, 3), p = a.q * t, k = -a.p * t, h = eqT(tm(a, X), lt(K));
        return N(`일차함수 ${h}의 그래프의 ${XI}이 ${iq(p)}일 때, 이 그래프의 ${YI}은?`, k, { signed: true,
          explain: `${XI}이 ${iq(p)}이므로 그래프가 점 ${ptj(p, 0, '을/를')} 지난다. ${h}에 대입하면 0 = ${iq(a.p * t)} + ${K}이므로 ${is(K, k)}이다. ${YI}은 ${iq(k)}이다.`,
          facts: { value: `0-${mulA(a, jn(p))}`, unseen: [0], rule: 'other-y' }
        });
      }
      // 지나는 점으로 기울기를 정하고 x절편을 구한다.
      const [p, c, j] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6), pm(d) * d.int(2, 3)], ([u, v, w]) => Math.abs(u * w) <= 12 && Math.abs(v * (1 - w)) <= 12), x0 = p * j, y0 = c * (1 - j), a = Q(-c, p), h = eqT(lt(A + X), tm(c));
      return N(`일차함수 ${h}의 그래프가 점 ${ptj(x0, y0, '을/를')} 지날 때, 이 그래프의 ${XI}은?`, p, { signed: true,
        explain: `${h}에 ${is(X, x0)}, ${is(Y, y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${is(A, a)}이다. ${eq(a, c)}에 ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(X, p)}이므로 ${XI}은 ${iq(p)}이다.`,
        facts: { value: `(0-${jn(c)})*${jn(x0)}/(${jn(y0)}-${jn(c)})`, unseen: [0], rule: 'other-x' }
      });
    }, { count: 2 }),
    T('intercept-link', '한 그래프의 x절편과 다른 그래프의 y절편이 같을 때', '①31 ②30', (d) => {
      const a1 = pm(d) * d.int(2, 5), p = nz(d, -4, 4), b1 = -a1 * p, a2 = slope(d, d.bool() ? 'int' : 'frac'), h2 = eqT(tm(a2, X), lt(A));
      return N(`일차함수 ${eq(a1, b1)}의 그래프의 ${XI}과 일차함수 ${h2}의 그래프의 ${YI}이 서로 같을 때, 수 ${A}의 값은?`, p, { signed: true,
        explain: `${eq(a1, b1)}에 ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(X, p)}이므로 ${XI}은 ${iq(p)}이다. ${h2}의 그래프의 ${YI}은 ${A}이므로 ${is(A, p)}이다.`,
        facts: { value: `(0-${jn(b1)})/${jn(a1)}`, unseen: [0] }
      });
    }),
    T('intercept-meet-x', '두 그래프가 x축 위에서 만날 때 수 구하기', '①28 ②31 심17', (d) => {
      const a1 = pm(d) * d.int(2, 5), p = nz(d, -4, 4), b1 = -a1 * p, a2 = d.until(() => pm(d) * d.int(2, 6), (v) => v !== a1), av = -a2 * p, h2 = eqT(tm(a2, X), lt(A));
      return N(`두 일차함수 ${eq(a1, b1)}, ${h2}의 그래프가 ${XA} 위에서 만날 때, 수 ${A}의 값은?`, av, { signed: true,
        explain: `두 그래프가 ${XA} 위에서 만나므로 두 그래프의 ${XI}이 같다. ${eq(a1, b1)}의 그래프의 ${XI}은 ${iq(p)}이므로 ${h2}의 그래프도 점 ${ptj(p, 0, '을/를')} 지난다. 0 = ${iq(a2 * p)} + ${A}에서 ${is(A, av)}이다.`,
        facts: { value: `${jn(a2)}*${jn(b1)}/${jn(a1)}` }
      });
    }),
    T('intercept-shifted', '평행이동한 그래프의 x절편과 y절편', '①24 심14', (d) => {
      const c = d.until(() => { const a = slope(d, d.bool() ? 'int' : 'frac'), b = d.bool() ? 0 : nz(d, -4, 4), k = nz(d, -8, 8), nq = b + k; return { a, b, k, nq, np: nq === 0 ? Q(1, 2) : qdiv(Q(-nq), a) }; }, (v) => v.np.q === 1);
      const { a, b, k, nq } = c, sum = b === 0 ? jn(k) : `(${jn(b)}+${jn(k)})`;
      return M(`일차함수 ${eq(a, b)}의 그래프를 ${YA}의 방향으로 ${iq(k)}만큼 평행이동한 그래프의 ${XI}과 ${YI}을 구하시오.`, [{ label: XI, answer: c.np.p, signed: true }, { label: YI, answer: nq, signed: true }], {
        explain: `평행이동한 그래프의 식은 ${eq(a, nq)}이다. ${YI}은 ${iq(nq)}이고, ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(X, c.np.p)}이므로 ${XI}은 ${iq(c.np.p)}이다.`,
        facts: { calc: [[divA(`(0-${sum})`, a), 0], [sum, 1]], unseen: [0] }
      });
    }),
    T('intercept-shift-coef', '평행이동한 그래프의 절편으로 수 구하기', '②32', (d) => {
      const [p, q, c] = d.until(() => [nz(d, -5, 5), nz(d, -8, 8), nz(d, -6, 6)], ([u, v, w]) => v % u === 0 && w !== v), a = -q / p, h = eqT(lt(A + X), tm(c));
      return vals(`일차함수 ${h}의 그래프를 ${YA}의 방향으로 ${BB}만큼 평행이동한 그래프의 ${XI}이 ${iq(p)}, ${YI}이 ${iq(q)}일 때, 수 ${A}, ${BB}의 값은?`, [[A, a], [BB, q - c]], {
        explain: `평행이동한 그래프의 식은 ${eqT(lt(A + X), tm(c), lt(BB))}이다. ${YI}이 ${iq(q)}이므로 ${ex(tm(c), lt(BB))} = ${iq(q)}에서 ${is(BB, q - c)}이다. ${eqT(lt(A + X), tm(q))}의 그래프가 점 ${ptj(p, 0, '을/를')} 지나므로 ${is(A, a)}이다.`,
        facts: { calc: [[`(0-${jn(q)})/${jn(p)}`, 0], [`${jn(q)}-${jn(c)}`, 1]], unseen: [0] }
      });
    }),
    T('intercept-area', '그래프와 두 축으로 둘러싸인 도형의 넓이', '①53 ②33', (d) => {
      const [p, q] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9)], ([u, v]) => (u * v) % 2 === 0 && Math.abs(u) !== Math.abs(v) && Math.abs(u) > 1 && Math.abs(v) > 1), a = Q(-q, p), area = Math.abs(p * q) / 2, ap = Math.abs(a.p), aq = Math.abs(q);
      return N(`일차함수 ${eq(a, q)}의 그래프와 ${XA}, ${YA}으로 둘러싸인 도형의 넓이는?`, area, {
        explain: `${XI}은 ${iq(p)}, ${YI}은 ${iq(q)}이므로 둘러싸인 도형은 밑변의 길이가 ${Math.abs(p)}, 높이가 ${Math.abs(q)}인 직각삼각형이다. 넓이는 ${frac(1, 2)} × ${Math.abs(p)} × ${Math.abs(q)} = ${area}이다.`,
        facts: { value: a.q === 1 ? `${aq}*${aq}/${ap}/2` : `${aq}*${aq}*${a.q}/${ap}/2`, unseen: [2] }
      });
    })
  ]);

  // 같은 단원의 다른 파일(8-1-5b.js, 8-1-5c.js)이 함께 쓰는 도구
  B.kit.m815 = {
    S14, S15, S16, sourceOf, T, X, Y, FN, GN, A, BB, K, XA, YA, XI, YI, TAG6, num, iq, jn, par, sgn, nj, tm, lt, ex, eqT, fxT, eq, fx, eqI, fxI, fv, eqAB, is, cmp, cx, pt, ptj, mulA, divA, eqAns, vals, grid2, rows1, cell, xyTable, pairPick,
    QN, missQ, xcut, FRACS, slope, quadText, HALO, ITALIC, ink12, it, cutX, cutY, pl, plOk, plWhy, TICKS, gridOf, axesOf, mini, picks, cutMini, gr, YES_SIT, NO_NUM, NO_SIT, YES_NUM, FORM, xOver, STORY, LIN_STORY, NON_STORY, CM2
  };
})(typeof window !== 'undefined' ? window : globalThis);
