// 고등학교 1학년 2학기(공통수학2) 1단원 평면좌표와 직선의 방정식 — 단원 틀·도구와 앞쪽 묶음(두 점 사이의 거리, 선분의 내분).
// 수집해 둔 천재 T셀파 공통수학2(홍진곤·전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 34꼴, 기본꼴 2: 51꼴, 심화꼴: 7꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/10-2-1/싣기_대조표.md 에 있다.
// (직선의 방정식, 두 직선의 평행과 수직, 점과 직선 사이의 거리는 10-2-1b.js 에, 실력 문항은 10-2-1c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준: 10공수2-01-01(선분의 내분, 두 점 사이의 거리를 먼저 다룬다), 10공수2-01-02(두 직선의 평행 조건과 수직 조건), 10공수2-01-03(점과 직선 사이의 거리).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(좌표·식·그림·상황), 묻는 것(좌표·거리·계수·직선의 방정식·범위·고르기), 이어 하는 일(거리 → 넓이, 내분점 → 거리, 정점 → 거리)이 다르면 따로 싣는다.
//    수만 다른 것은 한 번만 싣는다. 교과서 소단원 차례(두 점 사이의 거리와 선분의 내분 → 직선의 방정식 → 두 직선의 평행과 수직 → 점과 직선 사이의 거리)대로 묶음을 나누었다.
//  - 중학교 단원에 이미 있는 일은 다시 싣지 않는다(이 은행의 7-1-2, 8-1-5, 8-1-6 에 있다): 수직선 위의 두 점 사이의 거리, 한 점과 기울기·두 점·두 절편으로 직선의 방정식,
//    좌표축에 평행한 직선, 두 직선의 교점을 지나는 직선, 평행한 직선 찾기·평행한 직선의 방정식, 세 직선이 한 점에서 만나거나 삼각형을 이루지 않는 조건.
//    교육과정도 「직선의 방정식」을 중학교 용어로 두고, 고려 사항에 「두 직선의 평행 조건과 수직 조건은 중학교에서 학습한 … 직선의 방정식과 연계하여 다룰 수 있다」고 적었다.
//  - 사용자가 정한 것: 수학 실력에 필요해 보이는 꼴은 다 싣는다. 「계산이 지나치게 복잡한 문제는 다루지 않는다」를 까닭으로 수집본의 꼴을 빼지 않고, 그런 꼴은 실력에 싣는다.
//    수집본 기본 문서 세 개 이상에 나오는 꼴(정점을 지나는 직선과 선분·삼각형의 범위, 각의 이등분선, 거리가 주어진 직선)은 단계가 많아도 기본에 두었다.
//  - 답: 좌표는 「( [±][ ] , [±][ ] )」, 직선의 방정식은 「y = [±][ ]x [±][ ]」(기울기는 0이 아닌 정수 — 답이 정수가 되게 수를 골랐다), 길이가 a√b 이면 「[ ]√[ ]」(a ≥ 2),
//    값이 둘이면 「a = [±][ ] 또는 a = [±][ ]」(차례는 따지지 않는다), 범위는 고르기나 「[±][ ] < a < [±][ ]」. 한 유형 안에서는 차례·씨앗이 바뀌어도 칸의 모양이 같다.
//    좌표·계수·기울기처럼 음수일 수 있는 칸에는 모두 부호 단추를 단다. 길이·넓이·자연수라고 정한 값만 단추 없이 받는다.
//    원문의 「a + b의 값」「mn의 값」「3b − a의 값」처럼 따로 구한 수를 더하거나 곱해 묻는 꼴은 수를 하나하나 답하게 바꾸었다(두 쌍이 나와 a² + b² 만 정해지는 꼴은 그대로 둔다).
//  - 참·거짓과 보기는 손으로 적지 않고 코드로 가린다. 답은 모두 코드가 셈한다(꼴 목록에 적힌 원문 답을 따르지 않는다).
//  - 검사 근거: 수 칸은 문제에 적힌 좌표·계수로 다시 셈하는 식(facts.calc)이다. 근호 밖으로 꺼낸 수처럼 글에 없는 수는 facts.unseen 에 밝힌다
//    (seal 이 글에 보이지 않는 수를 찾아 밝히고, 밝히기로 한 수(derived) 밖의 수가 나오면 오류를 낸다).
//
// 뺀 것과 까닭(10-2-1b.js, 10-2-1c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 중학교에 이미 있는 일: ①1(수직선 위의 두 점 사이의 거리 — 7-1-2), ②1(한 점과 기울기 — 8-1-5), ②2(두 점 — 8-1-5·8-1-6), ②3(축에 평행·수직 — 8-1-6), ②5(교점과 다른 한 점 — 8-1-6 에서도 뺀 앞 단원의 일),
//    ②8(일차방정식의 그래프), ②9(지나는 점과 기울기로 식의 수 — 8-1-5), ②13(평행한 직선 찾기 — 8-1-5), ②15(평행한 직선의 방정식 — 8-1-5·8-1-6),
//    ②17·②18·②19의 평행 쪽(8-1-5·8-1-6c), ②26(세 직선이 한 점에서 — 8-1-6), ②27(세 직선이 삼각형을 이루지 않는 수 — 8-1-6c 의 hard-no-triangle),
//    ②28(평행사변형의 한 변 — 두 점을 지나는 직선과 평행한 직선, 8-1-5), 심6(꼭짓점을 지나 넓이를 이등분 — 8-1-6c 의 hard-bisect 와 9-1-6 의 포물선).
//  - 서술형 전용: ①15(중선 정리 확인), ②4(절편으로 나타낸 직선의 방정식 설명), ②29(평행·수직 조건을 계수로 설명), ②51(넓이 공식 확인), ①34의 원리 설명.
//  - 같은 일이어서 한 번만 실은 것(겹침): ①6의 변형(꼭짓점의 좌표가 미지수인 AB = BC — 직선 위의 점과 같은 일), ①17의 변형(2 : 1과 1 : 2를 함께), ①29의 변형(평행사변형 뒤의 직선 — 중2의 일),
//    ②10의 전중17(그림의 삼각형 — 전대09와 같은 일), ②20의 전교마05(이차식이 되는 수직 조건 — 계수가 한 직선에만 든 꼴로 실음), ②23의 전교대05(수직이등분선이 지나는 점),
//    ②35의 홍중4(조건을 붙여 하나만 고르기), ②39의 홍기3·홍교 원점 꼴(원점에서의 거리는 y절편이 ± 짝이라 하나만 고르는 pd-line-by-dist-pick 에 실음), 심1(두 점 사이의 거리의 제곱 — ①2), 심2(①28), 심4(②7), 심5(②20).
//  - 그림을 알 수 없는 것: 없다. ②11(두 직사각형)은 원문 그림을 몰라도 풀이에 적힌 일(대각선의 교점을 지나는 직선)이 분명해 그림을 새로 그려 실었다.
//  - 바꾼 말: 심7의 「두 점 B, C는 직선 y = x에 대하여 대칭」(대칭이동은 뒤 단원 10공수2-01-07)을 「선분 BC의 수직이등분선이 직선 y = x」로 바꾸었다.
//  - 판단이 갈릴 수 있는 것: ①8(AC = 2BC 인 점 — 답의 하나가 선분 밖의 점이지만 절댓값 방정식으로 풀려 외분을 쓰지 않는다. 실력에 실음),
//    ①31(각의 이등분선이 대변을 나누는 점 — 내각의 이등분선 성질은 2022 중학교 성취기준에 없어, 「D에서 두 변까지의 거리가 같다」로 넓이의 비를 세워 풀게 했다. 실력에 실음),
//    ②6(정점 — 중2 hard-fixed-point 는 y = a(x − p) + q 꼴이고, 여기서는 두 일차식의 묶음이라 연립방정식을 풀어야 하므로 실음).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」 문자는 맨 「수 a」로 부르지 않는다: 값을 물으면 「상수 a」, 범위·최댓값·최솟값을 물으면 「실수 a」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, F, inline } = B.kit;
  const { MINUS, gcd, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, fl, tx, nb, tail, lastOf, js, V, sup, nz, pm, asQ, poly, pointAns, plane, rt, grp, sqParts, radText, SG, whereOnPlane } = B.kit.mid;
  const STD1 = '10공수2-01-01', STD2 = '10공수2-01-02', STD3 = '10공수2-01-03', UNIT = '10-2-1';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 밝히기로 한 수(derived)가 아닌 수가 나오면 오류를 낸다(식을 잘못 적은 것).
  function seal(item) {
    const f = item.facts || {}, derived = new Set((f.derived || []).map((v) => Math.abs(Number(v))).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    // 0이 답인 칸의 식이 −0이 되면 검사가 0과 다르게 본다(Object.is): 끝에 + 0을 붙인다.
    if (f.calc) f.calc = f.calc.map(([t, i]) => [`(${t})+0`, i]);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) {
      if (shown.has(n)) continue;
      if (!derived.has(Number(n)) && !out.has(Number(n))) throw new Error('검사 식의 수 ' + n + ' 이 글에도 밝힌 수에도 없다: ' + t);
      out.add(Number(n));
    }
    delete f.derived;
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다. 다 만든 문항은 seal 로 검사 근거를 마무리한다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 6000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  // ref 에 기본꼴(①②)만 있으면 기본 자료, 심화꼴(심)만 있으면 심화 자료
  const sourceOf = (ref) => '수집본 ' + (/[①②]/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: retry(make) }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), VA = V('a'), VB = V('b'), VC = V('c'), VK = V('k'), VM = V('m'), VN = V('n'), VT = V('t');
  const iq = (n) => tx(asQ(n));                                              // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const jn = (n) => js(asQ(n));                                              // 검사 식에 적는 수((-3), (3/4))
  const par = (n) => (fl(asQ(n)) < 0 ? '(' + iq(n) + ')' : iq(n));          // 식 속의 수(음수는 괄호)
  const nj = (n, pair) => iq(n) + tail(lastOf(asQ(n)), pair);               // 수 뒤에 토씨
  const cx = (v) => (typeof v === 'string' ? v : iq(v));                   // 좌표 글(수이거나 이미 적은 글)
  // 글 뒤 토씨: 끝소리에 맞춘다. 숫자는 읽는 소리(분수는 분자, 근호는 근호 안의 수), 위첨자로 끝나면 「제곱」(받침),
  // 문자 m·n·l 은 받침이 있고 나머지 문자(a, b, k, x, y …)는 없다, 한글은 그 글자. 닫는 괄호는 건너뛴다(점 (2, 5)를 — 마지막 좌표로 읽는다).
  function jw(h, pair) {
    const [withB, without] = pair.split('/');
    const flat = String(h).replace(/<sup>[\s\S]*?<\/sup>/g, '²').replace(/<span class="mb-frac"><span>([^<]*)<\/span><span class="mb-frac-bar">\/<\/span><span>[^<]*<\/span><\/span>/g, '$1')
      .replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').replace(/[\s)\]]+$/, '');
    const last = flat.slice(-1);
    if (/\d/.test(last)) return h + tail(Number(/\d+$/.exec(flat)[0]), pair);
    let bat, rieul = false;
    if (last === '²') bat = true;
    else if (/[A-Za-z]/.test(last)) { bat = /[LMNlmn]/.test(last); rieul = /[Ll]/.test(last); }
    else { const code = last.charCodeAt(0) - 0xAC00, t = code >= 0 && code <= 11171 ? code % 28 : 0; bat = t !== 0; rieul = t === 8; }
    if (withB === '으로') return h + (bat && !rieul ? '으로' : '로');
    return h + (bat ? withB : without);
  }
  const pt = (x, y) => nb(`(${cx(x)}, ${cx(y)})`);
  const ptj = (x, y, pair) => nb(jw(pt(x, y), pair));
  const P = (name, x, y) => nb(`${name}(${cx(x)}, ${cx(y)})`);
  const Pj = (name, x, y, pair) => nb(jw(P(name, x, y), pair));
  const P1 = (name, x) => nb(`${name}(${cx(x)})`);
  const P1j = (name, x, pair) => nb(jw(P1(name, x), pair));
  // 분수 꼴(분자는 수, 분모는 글): 음수는 −를 앞에 둔다.
  const fr = (top, bottom) => (typeof top === 'number' && top < 0 ? MINUS + frac(-top, bottom) : frac(top, bottom));
  const cv = (c, v) => (c === 1 ? v : c === -1 ? MINUS + v : iq(c) + v);   // 수와 문자의 곱(계수 1은 적지 않는다)
  const ratio = (m, n) => nb(`${m} : ${n}`);
  const ratioj = (m, n, pair) => nb(`${m} : ${n}${tail(n, pair)}`);
  const QN = ['제1사분면', '제2사분면', '제3사분면', '제4사분면'], QS = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
  // 직선 ax + by + c = 0, y = mx + n 의 글
  const genH = (a, b, c) => nb(poly([[a, X], [b, Y], [c, '']]) + ' = 0');
  const genj = (a, b, c, pair) => nb(genH(a, b, c) + tail(0, pair));
  const slopeH = (m, n) => nb(`${Y} = ${poly([[m, X], [n, '']])}`);
  const slopej = (m, n, pair) => { const q = asQ(n); return nb(slopeH(m, n) + (q.p === 0 ? (pair.split('/')[0] === '으로' ? '로' : pair.split('/')[1]) : tail(lastOf(q), pair))); };
  const isSq = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));
  // √n 을 간단히 한 글(완전제곱수는 정수)
  const lenH = (n2) => { if (isSq(n2)) return String(Math.sqrt(n2)); const [a, b] = sqParts(n2); return radText(a, b); };
  // 길이 글 뒤 토씨: 근호면 근호 안의 수, 정수면 그 수
  const lenj = (n2, pair) => { if (isSq(n2)) return nj(Math.sqrt(n2), pair); const [, b] = sqParts(n2); return lenH(n2) + tail(b, pair); };
  // c(v − h)² + k 의 글(h = 0 이면 cv² + k, k = 0 이면 뒤를 적지 않는다)
  const sqForm = (c, v, h, k) => { const hq = asQ(h); return nb((c === 1 ? '' : String(c)) + (hq.p === 0 ? v + sup(2) : `(${poly([[1, v], [qneg(hq), '']])})${sup(2)}`) + (k === 0 ? '' : ` ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`)); };

  // ── 검사 식 ──
  const sq = (x, y) => `(${jn(x)}*${jn(x)}+${jn(y)}*${jn(y)})`;
  const df = (a, b) => `(${jn(a)}-${jn(b)})`;

  // ── 답 ──
  // 직선의 방정식 y = mx + n: 「y = [±][ ]x [±][ ]」(m 은 0이 아닌 정수, n 은 정수)
  function lineAns(text, m, n, o) {
    if (!Number.isInteger(m) || !Number.isInteger(n) || m === 0) throw new Error('직선 답: 기울기는 0이 아닌 정수, y절편은 정수');
    return inline(text, `${Y} = {0}${X} {1}`, [{ answer: m, signed: true }, { answer: n, signed: true }], Object.assign({}, o, { shown: slopeH(m, n) }));
  }
  // 직선 둘: 「y = [±][ ]x [±][ ] 또는 y = [±][ ]x [±][ ]」(두 직선의 차례는 따지지 않는다). 식 칸 줄은 글자 사이에서도 갈리므로 「또는」을 묶어 둔다.
  function twoLinesAns(text, l1, l2, o) {
    if (![...l1, ...l2].every(Number.isInteger) || l1[0] === 0 || l2[0] === 0 || (l1[0] === l2[0] && l1[1] === l2[1])) throw new Error('직선 둘 답');
    return inline(text, grp(`${Y} = {0}${X} {1}`) + ' ' + grp('또는') + ' ' + grp(`${Y} = {2}${X} {3}`), [l1[0], l1[1], l2[0], l2[1]].map((answer) => ({ answer, signed: true })),
      Object.assign({}, o, { blocks: [[0, 1], [2, 3]], shown: `${slopeH(l1[0], l1[1])} 또는 ${slopeH(l2[0], l2[1])}` }));
  }
  // 길이 a√b: 「[ ]√[ ]」(a ≥ 2, b 는 제곱인 수를 인수로 갖지 않는 2 이상의 자연수). 길이라 부호 단추가 없다.
  function radLen(text, a, b, o) {
    if (!(Number.isInteger(a) && a >= 2 && Number.isInteger(b) && b >= 2 && sqParts(b)[0] === 1)) throw new Error('a√b 답: a ≥ 2, b 는 제곱인 수를 인수로 갖지 않는 2 이상의 자연수');
    return inline(text, grp('{0}' + rt('{1}')), [{ answer: a }, { answer: b }], Object.assign({}, o, { shown: radText(a, b) }));
  }
  // 값 둘: 「a = [±][ ] 또는 a = [±][ ]」(차례는 따지지 않는다). 두 값은 서로 다르고 부호만 다른 짝이 아니다(부호를 뒤집은 답이 맞게 되지 않게).
  function twoVals(text, nameH, v1, v2, o) {
    if (!Number.isInteger(v1) || !Number.isInteger(v2) || v1 === v2 || v1 === -v2) throw new Error('값 둘 칸: 서로 다르고 부호만 다르지 않은 정수');
    return inline(text, grp(`${nameH} = {0}`) + ' ' + grp('또는') + ' ' + grp(`${nameH} = {1}`), [{ answer: v1, signed: true }, { answer: v2, signed: true }],
      Object.assign({}, o, { unordered: true, shown: `${nb(nameH + ' = ' + iq(v1))} 또는 ${nb(nameH + ' = ' + iq(v2))}` }));
  }
  // 문자의 값 여럿: 「a = [±][ ]  b = [±][ ]」. pairs: [[문자 글, 답, 부호 단추를 다는가(기본 단다)], …]
  const vals = (text, pairs, o) => M(text, pairs.map(([lead, answer, signed]) => Object.assign({ lead: lead + ' =', answer }, signed === false ? {} : { signed: true })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => nb(`${lead} = ${iq(answer)}`)).join(', ') }));
  // 범위 「[±][ ] < a < [±][ ]」(두 끝은 정수)
  function rangeAns(text, nameH, lo, hi, o) {
    if (!Number.isInteger(lo) || !Number.isInteger(hi) || lo >= hi) throw new Error('범위 답');
    return inline(text, `{0} &lt; ${nameH} &lt; {1}`, [{ answer: lo, signed: true }, { answer: hi, signed: true }], Object.assign({}, o, { shown: nb(`${iq(lo)} &lt; ${nameH} &lt; ${iq(hi)}`) }));
  }
  // 옳은 것 하나와 나머지를 섞는다. 보기는 [글, 옳은가]이다. 보기가 겹치거나 옳은 보기가 하나가 아니면 null(만들기를 다시 한다).
  function pick(d, text, rows, o) {
    const list = d.shuffle(rows), opt = o || {};
    if (new Set(list.map((r) => stripH(r[0]))).size !== list.length || list.filter((r) => r[1]).length !== 1) return null;
    return C(text, list.map((r) => r[0]), list.findIndex((r) => r[1]), Object.assign({}, opt, { facts: Object.assign({ truth: list.map((r) => r[1]), want: true }, opt.facts || {}) }));
  }

  // ── 수 고르기 ──
  // 길이의 제곱이 n2 인 정수 벡터들(성분 −7~7)
  const vecs = (n2) => { const out = []; for (let x = -7; x <= 7; x += 1) for (let y = -7; y <= 7; y += 1) if (x * x + y * y === n2) out.push([x, y]); return out; };
  const NORM2 = [5, 10, 13, 17, 25, 26, 29, 50];
  // 길이가 같고 방향이 다른(마주 보지도 않는) 두 벡터
  function sameLen(d) {
    const list = vecs(d.pick(NORM2)), u = d.pick(list), w = d.pick(list);
    return (u[0] === w[0] && u[1] === w[1]) || (u[0] === -w[0] && u[1] === -w[1]) ? null : [u, w];
  }
  const RATIOS = [[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 4], [4, 1], [3, 4], [4, 3], [2, 5], [5, 2], [3, 5], [5, 3]];
  const inBox = (pts, k) => pts.every(([x, y]) => Math.abs(x) <= (k || 9) && Math.abs(y) <= (k || 9));
  const add = (p, q) => [p[0] + q[0], p[1] + q[1]], sub = (p, q) => [p[0] - q[0], p[1] - q[1]], mul = (p, k) => [p[0] * k, p[1] * k];
  const d2 = (p, q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
  // 피타고라스 수 [x, y, 길이]
  const PYTH = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [9, 12, 15], [12, 9, 15]];

  // ════════════════════════════════════════════════════════════════
  // ── 두 점 사이의 거리 ──
  const distTypes = [
    T('dist-two', '좌표평면 위의 두 점 사이의 거리', '①2', (d) => {
      const x1 = d.int(-6, 6), y1 = d.int(-6, 6), dx = nz(d, -7, 7), dy = nz(d, -7, 7), x2 = x1 + dx, y2 = y1 + dy, n2 = dx * dx + dy * dy, [a, b] = sqParts(n2);
      if (a < 2 || b < 2 || !inBox([[x2, y2]])) return null;
      return radLen(`두 점 ${P('A', x1, y1)}, ${P('B', x2, y2)} 사이의 거리는?`, a, b, {
        explain: `${SG('AB')} = ${rt(`(${iq(x2)} ${MINUS} ${par(x1)})${sup(2)} + (${iq(y2)} ${MINUS} ${par(y1)})${sup(2)}`)} = ${rt(n2)} = ${radText(a, b)}이다.`,
        facts: { calc: [[`(${df(x2, x1)}*${df(x2, x1)}+${df(y2, y1)}*${df(y2, y1)})/(${a}*${a})`, 1]], derived: [a], check: { n2 } }
      });
    }),
    T('dist-ratio', '원점에서 두 점까지의 거리의 비', '①2의 변형', (d) => {
      const sv = (t) => { const [x, y, r] = d.pick(PYTH), s = [pm(d), pm(d)]; return [x * s[0], y * s[1], r]; };
      const [xa, ya, ra] = sv(), [xb, yb, rb] = sv();
      if (ra === rb || ra % rb === 0 || rb % ra === 0) return null;
      const k = Q(ra, rb);
      return F(`세 점 O(0, 0), ${P('A', xa, ya)}, ${P('B', xb, yb)}에 대하여 ${nb(`${SG('OA')} = ${VK}${SG('OB')}`)}일 때, 상수 ${VK}의 값은?`, k.p, k.q, {
        improper: k.p > k.q,
        explain: `${SG('OA')} = ${rt(`${par(xa)}${sup(2)} + ${par(ya)}${sup(2)}`)} = ${ra}, ${SG('OB')} = ${rt(`${par(xb)}${sup(2)} + ${par(yb)}${sup(2)}`)} = ${rb}이므로 ${VK} = ${frac(ra, rb)}${k.q !== rb ? ' = ' + iq(k) : ''}이다.`,
        facts: { value: `${ra}/${rb}`, derived: [ra, rb] }
      });
    }),
    T('dist-shape', '세 꼭짓점의 좌표로 삼각형의 모양 알기', '①3', (d) => {
      const kind = d.pick(['ri', 'iso', 'rt']), V0 = [d.int(-4, 4), d.int(-4, 4)];
      let pts;
      if (kind === 'ri') { const u = [nz(d, -3, 3), d.int(-3, 3)], s = pm(d); pts = [V0, add(V0, u), add(V0, [-u[1] * s, u[0] * s])]; }
      else if (kind === 'rt') { const u = [nz(d, -2, 2), d.int(-2, 2)], k = d.int(1, 3), l = d.int(1, 3), s = pm(d); if (k === l) return null; pts = [V0, add(V0, mul(u, k)), add(V0, mul([-u[1] * s, u[0] * s], l))]; }
      else { const pr = sameLen(d); if (!pr) return null; const [u, w] = pr; if (u[0] * w[0] + u[1] * w[1] === 0) return null; pts = [V0, add(V0, u), add(V0, w)]; }
      if (!inBox(pts, 8)) return null;
      const [A, Bp, Cp] = d.shuffle(pts), ab = d2(A, Bp), bc = d2(Bp, Cp), ca = d2(Cp, A);
      const sides = [ab, bc, ca].sort((x, y) => x - y), right = sides[0] + sides[1] === sides[2], iso = ab === bc || bc === ca || ca === ab, eq = ab === bc && bc === ca;
      const cls = eq ? 0 : right && iso ? 1 : iso ? 2 : right ? 3 : 4;
      const NAMES5 = ['정삼각형', '직각이등변삼각형', '직각삼각형이 아닌 이등변삼각형', '이등변삼각형이 아닌 직각삼각형', '직각삼각형도 이등변삼각형도 아닌 삼각형'];
      const len = [[SG('AB'), ab], [SG('BC'), bc], [SG('CA'), ca]].map(([n, v]) => `${n} = ${lenH(v)}`).join(', ');
      const why = cls === 1 ? '두 변의 길이가 같고, 가장 긴 변의 길이의 제곱이 나머지 두 변의 길이의 제곱의 합과 같으므로 직각이등변삼각형이다.'
        : cls === 2 ? '두 변의 길이가 같지만, 가장 긴 변의 길이의 제곱이 나머지 두 변의 길이의 제곱의 합과 같지 않으므로 직각삼각형이 아닌 이등변삼각형이다.'
          : '세 변의 길이가 모두 다르고, 가장 긴 변의 길이의 제곱이 나머지 두 변의 길이의 제곱의 합과 같으므로 이등변삼각형이 아닌 직각삼각형이다.';
      return pick(d, `세 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}, ${Pj('C', Cp[0], Cp[1], '을/를')} 꼭짓점으로 하는 삼각형 ABC는 어떤 삼각형인가?`, NAMES5.map((nm, i) => [nm, i === cls]), {
        explain: `세 변의 길이는 ${len}이다. ${why}`
      });
    }),
    T('dist-unknown', '두 점 사이의 거리가 주어질 때 좌표의 미지수', '①4', (d) => {
      const base = nz(d, -5, 5), other = d.int(-5, 5), gap = nz(d, -5, 5), s = d.int(1, 5), n2 = s * s + gap * gap, onX = d.bool();
      const [A, Bt] = onX ? [P('A', base, other), P('B', VA, other + gap)] : [P('A', other, base), P('B', other + gap, VA)];
      if (Math.abs(base) + s > 9 || Math.abs(other + gap) > 9) return null;
      const known = onX ? `(${VA} ${MINUS} ${par(base)})${sup(2)} + ${par(gap)}${sup(2)}` : `${par(gap)}${sup(2)} + (${VA} ${MINUS} ${par(base)})${sup(2)}`;
      return twoVals(`두 점 ${A}, ${Bt} 사이의 거리가 ${lenH(n2)}일 때, 상수 ${VA}의 값은?`, VA, base - s, base + s, {
        explain: `${nb(`${known} = ${n2}`)}에서 ${nb(`(${VA} ${MINUS} ${par(base)})${sup(2)} = ${s * s}`)}이므로 ${nb(`${VA} ${MINUS} ${par(base)} = ±${s}`)}, 곧 ${VA} = ${iq(base - s)} 또는 ${VA} = ${iq(base + s)}이다.`,
        facts: { calc: [[`${jn(base)}-${s}`, 0], [`${jn(base)}+${s}`, 1]], derived: [s] }
      });
    }),
    T('dist-axis-point', '두 점에서 같은 거리에 있는 좌표축 위의 점', '①5', (d, n) => {
      const pr = d.until(() => sameLen(d), Boolean), [u, w] = pr, p = nz(d, -5, 5), onX = n === 0;
      const Pp = onX ? [p, 0] : [0, p], A = add(Pp, u), Bp = add(Pp, w);
      if (!inBox([A, Bp]) || (onX ? A[0] === Bp[0] : A[1] === Bp[1]) || A[0] * A[1] === 0 || Bp[0] * Bp[1] === 0) return null;
      const i = onX ? 0 : 1, num = `(${sq(Bp[0], Bp[1])}-${sq(A[0], A[1])})/(2*${df(Bp[i], A[i])})`;
      const S = onX ? [`(${VA} ${MINUS} ${par(A[0])})${sup(2)} + ${par(A[1])}${sup(2)}`, `(${VA} ${MINUS} ${par(Bp[0])})${sup(2)} + ${par(Bp[1])}${sup(2)}`] : [`${par(A[0])}${sup(2)} + (${VA} ${MINUS} ${par(A[1])})${sup(2)}`, `${par(Bp[0])}${sup(2)} + (${VA} ${MINUS} ${par(Bp[1])})${sup(2)}`];
      return pointAns(`두 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}에서 같은 거리에 있는 ${onX ? X : Y}축 위의 점 P의 좌표는?`, Pp[0], Pp[1], {
        explain: `점 P의 좌표를 ${jw(onX ? pt(VA, 0) : pt(0, VA), '이라/라')} 하면 ${nb(`${SG('AP')}${sup(2)} = ${SG('BP')}${sup(2)}`)}에서 ${nb(S[0])} = ${nb(S[1])}이다. 정리하면 ${VA} = ${iq(p)}이므로 P${pt(Pp[0], Pp[1])}이다.`,
        facts: { calc: [[num, i]], derived: [2] }
      });
    }, { count: 2 }),
    T('dist-axis-area', '두 점에서 같은 거리에 있는 두 축 위의 점과 삼각형의 넓이', '①5의 변형', (d) => {
      const p = nz(d, -6, 6), q = nz(d, -6, 6), g = gcd(Math.abs(p), Math.abs(q));
      if ((p * q) % 2 !== 0) return null;
      const j = d.int(1, g - 1 >= 1 ? g - 1 : 1), M0 = g > 1 ? [p - j * p / g, j * q / g] : null, s = d.int(1, 2), w = [q / g, p / g];
      if (!M0) return null;
      const A = add(M0, mul(w, s)), Bp = sub(M0, mul(w, s));
      if (!inBox([A, Bp]) || A[0] === Bp[0] || A[1] === Bp[1] || (A[0] === 0 && A[1] === 0) || (Bp[0] === 0 && Bp[1] === 0)) return null;
      const area = Math.abs(p * q) / 2, pe = `(${sq(Bp[0], Bp[1])}-${sq(A[0], A[1])})/(2*${df(Bp[0], A[0])})`, qe = `(${sq(Bp[0], Bp[1])}-${sq(A[0], A[1])})/(2*${df(Bp[1], A[1])})`;
      return N(`두 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}에서 같은 거리에 있는 ${X}축 위의 점을 P, ${Y}축 위의 점을 Q라 할 때, 삼각형 OPQ의 넓이는? (단, O는 원점이다.)`, area, {
        explain: `P${pt(VA, 0)}이라 하면 ${nb(`${SG('AP')}${sup(2)} = ${SG('BP')}${sup(2)}`)}에서 ${VA} = ${iq(p)}, Q${pt(0, VB)}라 하면 ${nb(`${SG('AQ')}${sup(2)} = ${SG('BQ')}${sup(2)}`)}에서 ${VB} = ${iq(q)}이다. 삼각형 OPQ의 넓이는 ${frac(1, 2)} × ${Math.abs(p)} × ${Math.abs(q)} = ${area}이다.`,
        facts: { calc: [[`${p * q < 0 ? '(0-' : '('}${pe}*${qe})/2`, 0]], derived: [2] }
      });
    }),
    T('dist-on-line', '두 점에서 같은 거리에 있는 직선 위의 점', '①6', (d) => {
      const pr = d.until(() => sameLen(d), Boolean), [u, w] = pr, m = nz(d, -3, 3), k = d.int(-4, 4), x0 = nz(d, -4, 4), y0 = m * x0 + k, Pp = [x0, y0], A = add(Pp, u), Bp = add(Pp, w);
      if (!inBox([A, Bp, Pp]) || (Bp[0] - A[0]) + m * (Bp[1] - A[1]) === 0) return null;
      const e = `(${sq(Bp[0], Bp[1])}-${sq(A[0], A[1])}-2*${jn(k)}*${df(Bp[1], A[1])})/(2*${df(Bp[0], A[0])}+2*${jn(m)}*${df(Bp[1], A[1])})`;
      return pointAns(`직선 ${slopeH(m, k)} 위의 점 가운데 두 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}에서 같은 거리에 있는 점 P의 좌표는?`, x0, y0, {
        explain: `점 P의 좌표를 ${jw(pt(VA, poly([[m, VA], [k, '']])), '이라/라')} 하면 ${nb(`${SG('AP')}${sup(2)} = ${SG('BP')}${sup(2)}`)}에서 이차항이 지워져 ${VA}에 대한 일차방정식이 되고, 풀면 ${VA} = ${iq(x0)}이다. 따라서 P${pt(x0, y0)}이다.`,
        facts: { calc: [[e, 0], [`${jn(m)}*${e}+${jn(k)}`, 1]], derived: [2] }
      });
    }),
    T('dist-circumcenter', '세 점에서 같은 거리에 있는 점', '①7', (d) => {
      const r2 = d.pick([5, 10, 13, 25, 50]), list = vecs(r2), [u, v, w] = d.shuffle(list).slice(0, 3), c = [d.int(-3, 3), d.int(-3, 3)];
      const A = add(c, u), Bp = add(c, v), Cp = add(c, w);
      if (!inBox([A, Bp, Cp])) return null;
      const a1 = df(Bp[0], A[0]), b1 = df(Bp[1], A[1]), c1 = `(${sq(Bp[0], Bp[1])}-${sq(A[0], A[1])})`, a2 = df(Cp[0], A[0]), b2 = df(Cp[1], A[1]), c2 = `(${sq(Cp[0], Cp[1])}-${sq(A[0], A[1])})`;
      const den = `(2*(${a1}*${b2}-${a2}*${b1}))`;
      return pointAns(`세 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}, ${P('C', Cp[0], Cp[1])}에서 같은 거리에 있는 점 P의 좌표는?`, c[0], c[1], {
        explain: `P${pt(VA, VB)}라 하면 ${nb(`${SG('PA')}${sup(2)} = ${SG('PB')}${sup(2)}`)}, ${nb(`${SG('PA')}${sup(2)} = ${SG('PC')}${sup(2)}`)}에서 ${VA}, ${VB}에 대한 일차방정식 두 개가 나온다. 연립하여 풀면 ${VA} = ${iq(c[0])}, ${VB} = ${iq(c[1])}이므로 P${pt(c[0], c[1])}이다. 세 점까지의 거리는 모두 ${lenH(r2)}이다.`,
        facts: { calc: [[`(${c1}*${b2}-${c2}*${b1})/${den}`, 0], [`(${a1}*${c2}-${a2}*${c1})/${den}`, 1]], derived: [2] }
      });
    }),
    T('dist-min-param', '문자가 든 두 점 사이의 거리가 가장 짧을 때', '①9', (d) => {
      const c1 = d.int(1, 3), c2 = d.int(1, 3), a0 = nz(d, -3, 3), t = nz(d, -2, 2), u = -a0 * c1 + t * c2, w = a0 * c2 + t * c1;
      const d1 = d.int(-4, 4), f1 = d1 - u, e1 = d.int(-5, 5), d2_ = e1 - w;
      if (Math.abs(f1) > 9 || Math.abs(d2_) > 9 || (d1 === 0 && d2_ === 0)) return null;
      const xa = poly([[c1, VA], [d1, '']]), yb = poly([[c2, VA], [d2_, '']]), A2 = c1 * c1 + c2 * c2, B1 = 2 * (c1 * u - c2 * w), C0 = u * u + w * w;
      return N(`두 점 ${P('A', xa, e1)}, ${P('B', f1, yb)}에 대하여 선분 AB의 길이가 가장 짧을 때, 상수 ${VA}의 값은?`, a0, {
        signed: true,
        explain: `${nb(`${SG('AB')}${sup(2)} = (${xa} ${MINUS} ${par(f1)})${sup(2)} + (${iq(e1)} ${MINUS} (${yb}))${sup(2)}`)} = ${nb(poly([[A2, VA + sup(2)], [B1, VA], [C0, '']]))} = ${sqForm(A2, VA, a0, t * t * A2)}이므로 ${VA} = ${iq(a0)}일 때 가장 짧다.`,
        facts: { calc: [[`(0-(${c1}*(${jn(d1)}-${jn(f1)})-${c2}*(${jn(e1)}-${jn(d2_)})))/(${c1}*${c1}+${c2}*${c2})`, 0]] }
      });
    }),
    T('dist-sum-sq-axis', 'x축 위의 점에서 두 점까지의 거리의 제곱의 합이 가장 작을 때', '①11', (d) => {
      const x1 = d.int(-6, 6), x2 = d.int(-6, 6), y1 = nz(d, -6, 6), y2 = nz(d, -6, 6);
      if ((x1 + x2) % 2 !== 0 || x1 === x2) return null;
      const t0 = (x1 + x2) / 2, v = (x1 - x2) ** 2 / 2 + y1 * y1 + y2 * y2;
      return N(`두 점 ${P('A', x1, y1)}, ${Pj('B', x2, y2, '과/와')} ${X}축 위의 점 P에 대하여 ${nb(`${SG('AP')}${sup(2)} + ${SG('BP')}${sup(2)}`)}의 최솟값은?`, v, {
        explain: `P${pt(VT, 0)}이라 하면 ${nb(`${SG('AP')}${sup(2)} + ${SG('BP')}${sup(2)}`)} = ${nb(poly([[2, VT + sup(2)], [-4 * t0, VT], [x1 * x1 + x2 * x2 + y1 * y1 + y2 * y2, '']]))} = ${sqForm(2, VT, t0, v)}이므로 ${VT} = ${iq(t0)}일 때 최솟값 ${nj(v, '을/를')} 갖는다.`,
        facts: { calc: [[`${df(x1, x2)}*${df(x1, x2)}/2+${jn(y1)}*${jn(y1)}+${jn(y2)}*${jn(y2)}`, 0]], derived: [2] }
      });
    }),
    T('dist-sum-sq-point', '세 점까지의 거리의 제곱의 합이 가장 작은 점', '①12', (d) => {
      const pts = [[d.int(-5, 5), d.int(-5, 5)], [d.int(-5, 5), d.int(-5, 5)], [d.int(-5, 5), d.int(-5, 5)]], sx = pts[0][0] + pts[1][0] + pts[2][0], sy = pts[0][1] + pts[1][1] + pts[2][1];
      if (sx % 3 !== 0 || sy % 3 !== 0 || (pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) === (pts[2][0] - pts[0][0]) * (pts[1][1] - pts[0][1])) return null;
      const [A, Bp, Cp] = pts, g = [sx / 3, sy / 3];
      return pointAns(`세 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}, ${P('C', Cp[0], Cp[1])}에 대하여 ${nb(`${SG('AP')}${sup(2)} + ${SG('BP')}${sup(2)} + ${SG('CP')}${sup(2)}`)}의 값이 가장 작게 되는 점 P의 좌표는?`, g[0], g[1], {
        explain: `P${pt(X, Y)}라 하면 주어진 식은 ${nb(`${poly([[3, X + sup(2)], [-2 * sx, X]])} + ${poly([[3, Y + sup(2)], [-2 * sy, Y]])} + (상수)`)}이므로 ${nb(`${sqForm(3, X, g[0], 0)} + ${sqForm(3, Y, g[1], 0)} + (상수)`)} 꼴이 된다. 따라서 P${pt(g[0], g[1])}일 때 가장 작다(삼각형 ABC의 무게중심이다).`,
        facts: { calc: [[`(${jn(A[0])}+${jn(Bp[0])}+${jn(Cp[0])})/3`, 0], [`(${jn(A[1])}+${jn(Bp[1])}+${jn(Cp[1])})/3`, 1]], derived: [3] }
      });
    }),
    T('dist-square-diag', '정사각형의 넓이와 대각선의 양 끝 점', '①14', (d) => {
      const x1 = d.int(-3, 3), y1 = d.int(-4, 4), dy = nz(d, -4, 4), s = d.int(2, 6), S2 = s * s + dy * dy;
      if (S2 % 2 !== 0 || x1 - s >= 0 || x1 + s <= 0) return null;
      const area = S2 / 2, k = x1 + s;
      return N(`좌표평면 위에 있는 정사각형 ABCD의 두 꼭짓점 A, C의 좌표가 각각 ${pt(x1, y1)}, ${pt(VK, y1 + dy)}이고 정사각형 ABCD의 넓이가 ${nj(area, '일/일')} 때, 양수 ${VK}의 값은?`, k, {
        explain: `넓이가 ${area}이므로 대각선 AC의 길이의 제곱은 2 × ${area} = ${S2}이다. ${nb(`(${VK} ${MINUS} ${par(x1)})${sup(2)} + ${par(dy)}${sup(2)} = ${S2}`)}에서 ${nb(`(${VK} ${MINUS} ${par(x1)})${sup(2)} = ${s * s}`)}이므로 ${VK} = ${iq(x1 - s)} 또는 ${VK} = ${iq(k)}이다. 양수인 것은 ${iq(k)}이다.`,
        facts: { calc: [[`${jn(x1)}+${s}`, 0]], derived: [s] }
      });
    })
  ];

  // ── 선분의 내분 ──
  // 수직선·좌표평면 위의 내분점: (m × 끝 + n × 시작) ÷ (m + n)
  const divTypes = [
    T('div-line', '수직선 위의 선분의 내분점과 중점', '①16', (d) => {
      const [m, n] = d.pick(RATIOS), L = (m + n) % 2 === 0 ? m + n : 2 * (m + n), a = d.int(-9, 6), b = a + L * pm(d) * d.int(1, 2);
      if (Math.abs(b) > 16) return null;
      const p = (m * b + n * a) / (m + n), mid = (a + b) / 2;
      return M(`수직선 위의 두 점 ${P1('A', a)}, ${P1('B', b)}에 대하여 선분 AB를 ${ratioj(m, n, '으로/로')} 내분하는 점의 좌표와 선분 AB의 중점의 좌표는?`, [{ label: '내분하는 점', answer: p, signed: true }, { label: '중점', answer: mid, signed: true }], {
        shown: `내분하는 점 ${iq(p)}, 중점 ${iq(mid)}`,
        explain: `내분하는 점의 좌표는 ${frac(`${m} × ${par(b)} + ${n} × ${par(a)}`, `${m} + ${n}`)} = ${iq(p)}, 중점의 좌표는 ${frac(`${iq(a)} + ${par(b)}`, 2)} = ${iq(mid)}이다.`,
        facts: { calc: [[`(${m}*${jn(b)}+${n}*${jn(a)})/(${m}+${n})`, 0], [`(${jn(a)}+${jn(b)})/2`, 1]], derived: [2] }
      });
    }),
    T('div-plane', '좌표평면 위의 선분의 내분점', '①17', (d) => {
      const [m, n] = d.pick(RATIOS), A = [d.int(-6, 6), d.int(-6, 6)], w = [nz(d, -2, 2), nz(d, -2, 2)], Bp = add(A, mul(w, m + n));
      if (!inBox([Bp])) return null;
      const p = add(A, mul(w, m));
      return pointAns(`두 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}에 대하여 선분 AB를 ${ratioj(m, n, '으로/로')} 내분하는 점의 좌표는?`, p[0], p[1], {
        explain: `${nb(`(${frac(`${m} × ${par(Bp[0])} + ${n} × ${par(A[0])}`, `${m} + ${n}`)},`)} ${nb(`${frac(`${m} × ${par(Bp[1])} + ${n} × ${par(A[1])}`, `${m} + ${n}`)})`)} = ${pt(p[0], p[1])}이다.`,
        facts: { calc: [[`(${m}*${jn(Bp[0])}+${n}*${jn(A[0])})/(${m}+${n})`, 0], [`(${m}*${jn(Bp[1])}+${n}*${jn(A[1])})/(${m}+${n})`, 1]] }
      });
    }),
    T('div-on-axis', '내분점이 좌표축 위에 있을 때의 미지수', '①18', (d, k) => {
      const [m, n] = d.pick(RATIOS), onX = k === 0, other = nz(d, -6, 6) * n, a = -m * other / n, fixedA = d.int(-6, 6), fixedB = d.int(-6, 6);
      if (Math.abs(a) > 12 || a === 0 || fixedA === fixedB) return null;
      // x축 위: A(fixedA, a), B(fixedB, other) — 내분점의 y좌표가 0. y축 위: A(a, fixedA), B(other, fixedB) — 내분점의 x좌표가 0.
      const A = onX ? P('A', fixedA, VA) : P('A', VA, fixedA), Bt = onX ? P('B', fixedB, other) : P('B', other, fixedB), co = onX ? Y : X;
      return N(`두 점 ${A}, ${Bt}에 대하여 선분 AB를 ${ratioj(m, n, '으로/로')} 내분하는 점이 ${onX ? X : Y}축 위에 있을 때, 상수 ${VA}의 값은?`, a, {
        signed: true,
        explain: `내분하는 점의 ${co}좌표는 ${frac(`${m} × ${par(other)} + ${cv(n, VA)}`, `${m} + ${n}`)}이고 ${onX ? X : Y}축 위의 점은 ${co}좌표가 0이므로 ${nb(`${m} × ${par(other)} + ${cv(n, VA)} = 0`)}, ${VA} = ${iq(a)}이다.`,
        facts: { calc: [[`(0-${m}*${jn(other)})/${n}`, 0]] }
      });
    }, { count: 2 }),
    T('div-find-end', '내분점의 좌표로 두 끝 점의 미지수 구하기', '①19', (d) => {
      const [m, n] = d.pick(RATIOS), s = m + n, a = d.int(-6, 6), b = d.int(-6, 6), x2 = d.int(-6, 6), y1 = d.int(-6, 6);
      if ((m * x2 + n * a) % s !== 0 || (m * b + n * y1) % s !== 0 || (a === x2 && b === y1)) return null;
      const px = (m * x2 + n * a) / s, py = (m * b + n * y1) / s;
      return vals(`두 점 ${P('A', VA, y1)}, ${P('B', x2, VB)}에 대하여 선분 AB를 ${ratioj(m, n, '으로/로')} 내분하는 점의 좌표가 ${ptj(px, py, '일/일')} 때, 상수 ${VA}, ${VB}의 값은?`, [[VA, a], [VB, b]], {
        explain: `내분하는 점의 좌표는 ${nb(`(${frac(`${m} × ${par(x2)} + ${cv(n, VA)}`, s)}, ${frac(`${cv(m, VB)} + ${n} × ${par(y1)}`, s)})`)}이다. ${nb(`${m} × ${par(x2)} + ${cv(n, VA)} = ${iq(s * px)}`)}에서 ${VA} = ${iq(a)}, ${nb(`${cv(m, VB)} + ${n} × ${par(y1)} = ${iq(s * py)}`)}에서 ${VB} = ${iq(b)}이다.`,
        facts: { calc: [[`((${m}+${n})*${jn(px)}-${m}*${jn(x2)})/${n}`, 0], [`((${m}+${n})*${jn(py)}-${n}*${jn(y1)})/${m}`, 1]] }
      });
    }),
    T('div-mid-on-line', '선분의 중점이 직선 위에 있을 때', '①20', (d) => {
      const A = [d.int(-6, 6), d.int(-6, 6)], Bp = [d.int(-6, 6), d.int(-6, 6)], c = nz(d, -3, 3);
      if ((A[0] + Bp[0]) % 2 !== 0 || (A[1] + Bp[1]) % 2 !== 0 || (A[0] === Bp[0] && A[1] === Bp[1])) return null;
      const mx = (A[0] + Bp[0]) / 2, my = (A[1] + Bp[1]) / 2, k = my - c * mx;
      if (k === 0) return null;
      return N(`두 점 ${P('A', A[0], A[1])}, ${Pj('B', Bp[0], Bp[1], '을/를')} 이은 선분 AB의 중점이 직선 ${nb(`${Y} = ${poly([[c, X]])} + ${VK}`)} 위에 있을 때, 상수 ${VK}의 값은?`, k, {
        signed: true,
        explain: `중점의 좌표는 ${pt(mx, my)}이다. ${nb(`${iq(my)} = ${c === 1 ? '' : c === -1 ? MINUS : iq(c) + ' × '}${par(mx)} + ${VK}`)}에서 ${VK} = ${iq(k)}이다.`,
        facts: { calc: [[`(${jn(A[1])}+${jn(Bp[1])})/2-${jn(c)}*(${jn(A[0])}+${jn(Bp[0])})/2`, 0]], derived: [2] }
      });
    }),
    T('div-ratio-on-line', 'm : 1로 내분하는 점이 직선 위에 있을 때', '①20', (d) => {
      const m = d.int(2, 5), A = [d.int(-6, 6), d.int(-6, 6)], w = [nz(d, -2, 2), nz(d, -2, 2)], Bp = add(A, mul(w, m + 1)), Pp = add(A, mul(w, m)), p = d.int(1, 3), q = nz(d, -3, 3), r = -(p * Pp[0] + q * Pp[1]);
      if (!inBox([Bp]) || p * A[0] + q * A[1] + r === 0 || p * Bp[0] + q * Bp[1] + r === 0 || gcd(gcd(Math.abs(p), Math.abs(q)), Math.abs(r)) !== 1) return null;
      return N(`두 점 ${P('A', A[0], A[1])}, ${Pj('B', Bp[0], Bp[1], '을/를')} 이은 선분 AB를 ${nb(`${VM} : 1`)}로 내분하는 점이 직선 ${genH(p, q, r)} 위에 있을 때, 자연수 ${VM}의 값은?`, m, {
        explain: `내분하는 점의 좌표는 ${nb(`(${frac(`${VM} × ${par(Bp[0])} + ${par(A[0])}`, `${VM} + 1`)}, ${frac(`${VM} × ${par(Bp[1])} + ${par(A[1])}`, `${VM} + 1`)})`)}이다. 이 점을 직선의 방정식에 대입하고 양변에 ${VM} + 1을 곱하면 ${VM}에 대한 일차방정식이 되고, 풀면 ${VM} = ${m}이다.`,
        facts: { calc: [[`(0-(${jn(p)}*${jn(A[0])}+${jn(q)}*${jn(A[1])}+${jn(r)}))/(${jn(p)}*${jn(Bp[0])}+${jn(q)}*${jn(Bp[1])}+${jn(r)})`, 0]] }
      });
    }),
    T('div-then-dist', '내분점을 구해 거리 구하기', '①21', (d, k) => {
      const [m, n] = d.pick(RATIOS.filter(([u, v]) => k === 1 || Math.abs(u - v) >= 2)), A = [d.int(-6, 6), d.int(-6, 6)], w = [nz(d, -2, 2), nz(d, -2, 2)], Bp = add(A, mul(w, m + n));
      if (!inBox([Bp])) return null;
      const Pp = add(A, mul(w, m)), Qp = add(A, mul(w, n)), n2 = k === 0 ? d2(Pp, Qp) : Pp[0] ** 2 + Pp[1] ** 2, [a, b] = sqParts(n2);
      if (a < 2 || b < 2) return null;
      const ex = (u, v) => `((${u}*${jn(Bp[0])}+${v}*${jn(A[0])})/(${m}+${n}))`, ey = (u, v) => `((${u}*${jn(Bp[1])}+${v}*${jn(A[1])})/(${m}+${n}))`;
      const e2 = k === 0 ? `((${ex(m, n)}-${ex(n, m)})*(${ex(m, n)}-${ex(n, m)})+(${ey(m, n)}-${ey(n, m)})*(${ey(m, n)}-${ey(n, m)}))` : `(${ex(m, n)}*${ex(m, n)}+${ey(m, n)}*${ey(m, n)})`;
      const text = k === 0
        ? `두 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}에 대하여 선분 AB를 ${ratioj(m, n, '으로/로')} 내분하는 점을 P, ${ratioj(n, m, '으로/로')} 내분하는 점을 Q라 할 때, 선분 PQ의 길이는?`
        : `두 점 ${P('A', A[0], A[1])}, ${Pj('B', Bp[0], Bp[1], '을/를')} 이은 선분 AB를 ${ratioj(m, n, '으로/로')} 내분하는 점과 원점 사이의 거리는?`;
      return radLen(text, a, b, {
        explain: k === 0 ? `P${pt(Pp[0], Pp[1])}, Q${pt(Qp[0], Qp[1])}이므로 ${SG('PQ')} = ${rt(n2)} = ${radText(a, b)}이다.` : `내분하는 점은 ${pt(Pp[0], Pp[1])}이므로 원점과의 거리는 ${rt(`${par(Pp[0])}${sup(2)} + ${par(Pp[1])}${sup(2)}`)} = ${rt(n2)} = ${radText(a, b)}이다.`,
        facts: { calc: [[`${e2}/(${a}*${a})`, 1]], derived: [a] }
      });
    }, { count: 2 }),
    T('div-t-range', 't : (1 − t)로 내분하는 점이 놓인 사분면과 t의 범위', '①22', (d) => {
      const A = [d.int(-7, 7), d.int(-7, 7)], Bp = [d.int(-7, 7), d.int(-7, 7)], qi = d.int(0, 3), [sx, sy] = QS[qi], dx = Bp[0] - A[0], dy = Bp[1] - A[1];
      if (dx === 0 || dy === 0) return null;
      // 조건 s·(p0 + t·dp) > 0 이 주는 범위(아래 끝 또는 위 끝)
      const bound = (s, p0, dp) => { const b = Q(-p0, dp); return s * dp > 0 ? { lo: b } : { hi: b }; };
      const inter = (parts) => { let lo = null, hi = null; for (const p of parts) { if (p.lo && (!lo || qcmp(p.lo, lo) > 0)) lo = p.lo; if (p.hi && (!hi || qcmp(p.hi, hi) < 0)) hi = p.hi; } return { lo, hi }; };
      const clip = (r) => { const lo = !r.lo || qcmp(r.lo, Q(0)) < 0 ? Q(0) : r.lo, hi = !r.hi || qcmp(r.hi, Q(1)) > 0 ? Q(1) : r.hi; return qcmp(lo, hi) < 0 ? [lo, hi] : null; };
      const raw = inter([bound(sx, A[0], dx), bound(sy, A[1], dy)]), right = clip(raw);
      if (!right || (qcmp(right[0], Q(0)) === 0 && qcmp(right[1], Q(1)) === 0) || [right[0], right[1]].some((v) => v.q > 9)) return null;
      const cands = [];
      if (raw.lo && raw.hi) cands.push([raw.lo, raw.hi]);                                        // 0 < t < 1과 겹치지 않은 범위
      cands.push([qsub(Q(1), right[1]), qsub(Q(1), right[0])]);                                   // t 와 1 − t 를 바꾸어 셈
      const wrong = clip(inter([bound(sx, A[0], dx), bound(-sy, A[1], dy)])); if (wrong) cands.push(wrong);   // 한 좌표의 부호를 거꾸로
      const wrong2 = clip(inter([bound(-sx, A[0], dx), bound(sy, A[1], dy)])); if (wrong2) cands.push(wrong2);
      const only = clip(inter([bound(sx, A[0], dx)])); if (only) cands.push(only);              // x좌표의 조건만
      const key = (r) => r[0].p + '/' + r[0].q + ':' + r[1].p + '/' + r[1].q, seen = new Set([key(right)]), wrongs = [];
      for (const r of cands) if (!seen.has(key(r)) && qcmp(r[0], r[1]) < 0) { seen.add(key(r)); wrongs.push(r); }
      if (wrongs.length < 3) return null;
      const show = (r) => nb(`${iq(r[0])} &lt; ${VT} &lt; ${iq(r[1])}`);
      const xs = poly([[dx, VT], [A[0], '']]), ys = poly([[dy, VT], [A[1], '']]);
      return pick(d, `두 점 ${P('A', A[0], A[1])}, ${Pj('B', Bp[0], Bp[1], '을/를')} 이은 선분 AB를 ${nb(`${VT} : (1 ${MINUS} ${VT})`)}로 내분하는 점 P가 ${QN[qi]} 위에 있을 때, ${VT}의 값의 범위는? (단, ${nb(`0 &lt; ${VT} &lt; 1`)})`,
        [[show(right), true]].concat(wrongs.slice(0, 4).map((r) => [show(r), false])), {
          explain: `P의 좌표는 ${nb(`(${VT} × ${par(Bp[0])} + (1 ${MINUS} ${VT}) × ${par(A[0])},`)} ${nb(`${VT} × ${par(Bp[1])} + (1 ${MINUS} ${VT}) × ${par(A[1])})`)}, 곧 ${pt(xs, ys)}이다. ${QN[qi]} 위에 있으려면 ${nb(`${xs} ${sx > 0 ? '&gt;' : '&lt;'} 0`)}, ${nb(`${ys} ${sy > 0 ? '&gt;' : '&lt;'} 0`)}이어야 한다. 이 범위와 ${nb(`0 &lt; ${VT} &lt; 1`)}을 함께 만족시키는 범위는 ${show(right)}이다.`
        });
    }),
    T('div-quadrant-param', '내분점이 놓인 사분면으로 좌표의 미지수의 범위 구하기', '①22의 변형', (d) => {
      const [m, n] = d.pick([[3, 1], [1, 3], [2, 1], [1, 2], [3, 2], [2, 3]]), qi = d.pick([1, 3]), [sx, sy] = QS[qi], x2 = nz(d, -4, 4) * n, y1 = nz(d, -4, 4) * m, s = d.int(-4, 4);
      // A(a, y1), B(x2, a + s). 내분점 ((m x2 + n a)/(m+n), (m(a + s) + n y1)/(m+n))
      const xb = -m * x2 / n, yb = -(m * s + n * y1) / m;
      if (!Number.isInteger(yb)) return null;
      // 제2사분면: x < 0 → a < xb, y > 0 → a > yb. 제4사분면: x > 0 → a > xb, y < 0 → a < yb.
      const [lo, hi] = sx < 0 ? [yb, xb] : [xb, yb];
      if (lo >= hi || hi - lo > 14 || Math.abs(lo) > 12 || Math.abs(hi) > 12) return null;
      const Bt = P('B', x2, poly([[1, VA], [s, '']]));
      return rangeAns(`두 점 ${P('A', VA, y1)}, ${Bt}에 대하여 선분 AB를 ${ratioj(m, n, '으로/로')} 내분하는 점이 ${QN[qi]} 위에 있도록 하는 실수 ${VA}의 값의 범위는?`, VA, lo, hi, {
        explain: `내분하는 점의 좌표는 ${nb(`(${frac(`${m} × ${par(x2)} + ${cv(n, VA)}`, m + n)}, ${frac(`${m === 1 ? '' : m}(${poly([[1, VA], [s, '']])}) + ${n} × ${par(y1)}`, m + n)})`)}이다. ${QN[qi]} 위에 있으려면 ${X}좌표가 ${sx > 0 ? '양수' : '음수'}, ${Y}좌표가 ${sy > 0 ? '양수' : '음수'}이므로 ${VA} ${sx > 0 ? '&gt;' : '&lt;'} ${iq(xb)}, ${VA} ${sy > 0 ? '&gt;' : '&lt;'} ${iq(yb)}이다. 따라서 ${nb(`${iq(lo)} &lt; ${VA} &lt; ${iq(hi)}`)}이다.`,
        facts: { calc: [[sx < 0 ? `(0-(${m}*${jn(s)}+${n}*${jn(y1)}))/${m}` : `(0-${m}*${jn(x2)})/${n}`, 0], [sx < 0 ? `(0-${m}*${jn(x2)})/${n}` : `(0-(${m}*${jn(s)}+${n}*${jn(y1)}))/${m}`, 1]] }
      });
    }),
    T('div-ratio-length', '내분의 비와 선분의 길이', '①23', (d) => {
      const [m, n] = d.pick(RATIOS), j = d.int(2, 5), ap = m * j, pb = n * j;
      return N(`점 P는 선분 AB를 ${ratioj(m, n, '으로/로')} 내분하는 점이다. ${nb(`${SG('AP')} = ${ap}`)}일 때, 선분 PB의 길이는?`, pb, {
        explain: `${nb(`${SG('AP')} : ${SG('PB')} = ${m} : ${n}`)}이므로 ${nb(`${ap} : ${SG('PB')} = ${m} : ${n}`)}, ${SG('PB')} = ${pb}이다.`,
        facts: { calc: [[`${ap}*${n}/${m}`, 0]] }
      });
    }),
    T('div-mobile', '모빌이 평형을 이루는 점', '①24', (d, k) => {
      const HEAD = '막대의 두 점 A, B에 물체를 매달 때 막대 위의 점 P에 줄을 매달아 평형을 이루게 하려면, 점 P는 선분 AB를 (B에 매단 물체의 질량) : (A에 매단 물체의 질량)으로 내분하는 점이어야 한다.';
      if (k === 0) {
        const w1 = 10 * d.int(1, 5), w2 = 10 * d.int(1, 5), L = 4 * d.int(3, 10);
        if (w1 === w2 || (w2 * L) % (w1 + w2) !== 0) return null;
        const p = w2 * L / (w1 + w2);
        return N(`${HEAD} 수직선 위의 두 점 ${P1('A', 0)}, ${P1('B', L)}에 질량이 각각 ${w1} g, ${w2} g인 물체를 매달았을 때, 평형을 이루게 하는 점 P의 좌표는?`, p, {
          explain: `점 P는 선분 AB를 ${ratioj(w2, w1, '으로/로')} 내분하는 점이므로 ${frac(`${w2} × ${L} + ${w1} × 0`, `${w2} + ${w1}`)} = ${p}이다.`,
          facts: { calc: [[`${w2}*${L}/(${w1}+${w2})`, 0]] }
        });
      }
      const w1 = 10 * d.int(1, 4), w2 = 10 * d.int(1, 4), w3 = 10 * d.int(1, 4), b = 4 * d.int(2, 8), L = b + 4 * d.int(2, 8);
      if (w1 === w2 || (w2 * b) % (w1 + w2) !== 0) return null;
      const q = w2 * b / (w1 + w2), num = w3 * L + (w1 + w2) * q;
      if (num % (w1 + w2 + w3) !== 0) return null;
      const p = num / (w1 + w2 + w3);
      return N(`${HEAD} 수직선 위의 세 점 ${P1('A', 0)}, ${P1('B', b)}, ${P1('C', L)}에 질량이 각각 ${w1} g, ${w2} g, ${w3} g인 물체를 매달았다. 먼저 A, B의 두 물체가 평형을 이루는 점 Q를 구하고, Q에 두 물체의 질량의 합을 매단 것으로 보아 Q, C의 두 물체가 평형을 이루는 점 P를 구할 때, 점 P의 좌표는?`, p, {
        explain: `Q는 선분 AB를 ${ratioj(w2, w1, '으로/로')} 내분하는 점이므로 Q의 좌표는 ${frac(`${w2} × ${b}`, `${w2} + ${w1}`)} = ${q}이다. Q에 ${w1 + w2} g, C에 ${w3} g이 매달린 것으로 보면 P는 선분 QC를 ${ratioj(w3, w1 + w2, '으로/로')} 내분하는 점이므로 ${frac(`${w3} × ${L} + ${w1 + w2} × ${q}`, `${w3} + ${w1 + w2}`)} = ${p}이다.`,
        facts: { calc: [[`(${w3}*${L}+(${w1}+${w2})*(${w2}*${b}/(${w1}+${w2})))/(${w1}+${w2}+${w3})`, 0]] }
      });
    }, { count: 2 }),
    T('div-centroid', '삼각형의 무게중심의 좌표', '①25', (d) => {
      const pts = [0, 1, 2].map(() => [d.int(-7, 7), d.int(-7, 7)]), sx = pts.reduce((s, p) => s + p[0], 0), sy = pts.reduce((s, p) => s + p[1], 0);
      if (sx % 3 !== 0 || sy % 3 !== 0 || (pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) === (pts[2][0] - pts[0][0]) * (pts[1][1] - pts[0][1])) return null;
      const [A, Bp, Cp] = pts;
      return pointAns(`세 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}, ${Pj('C', Cp[0], Cp[1], '을/를')} 꼭짓점으로 하는 삼각형 ABC의 무게중심의 좌표는?`, sx / 3, sy / 3, {
        explain: `무게중심의 좌표는 ${nb(`(${frac(`${iq(A[0])} + ${par(Bp[0])} + ${par(Cp[0])}`, 3)}, ${frac(`${iq(A[1])} + ${par(Bp[1])} + ${par(Cp[1])}`, 3)})`)} = ${pt(sx / 3, sy / 3)}이다.`,
        facts: { calc: [[`(${jn(A[0])}+${jn(Bp[0])}+${jn(Cp[0])})/3`, 0], [`(${jn(A[1])}+${jn(Bp[1])}+${jn(Cp[1])})/3`, 1]], derived: [3] }
      });
    }),
    T('div-centroid-find', '무게중심의 좌표로 꼭짓점의 미지수 구하기', '①26', (d) => {
      const A = [d.int(-6, 6), d.int(-6, 6)], Bp = [d.int(-6, 6), d.int(-6, 6)], Cp = [d.int(-6, 6), d.int(-6, 6)], sx = A[0] + Bp[0] + Cp[0], sy = A[1] + Bp[1] + Cp[1];
      if (sx % 3 !== 0 || sy % 3 !== 0 || (Bp[0] - A[0]) * (Cp[1] - A[1]) === (Cp[0] - A[0]) * (Bp[1] - A[1])) return null;
      const g = [sx / 3, sy / 3];
      return vals(`세 점 ${P('A', A[0], A[1])}, ${P('B', VA, Bp[1])}, ${Pj('C', Cp[0], VB, '을/를')} 꼭짓점으로 하는 삼각형 ABC의 무게중심의 좌표가 ${ptj(g[0], g[1], '일/일')} 때, 상수 ${VA}, ${VB}의 값은?`, [[VA, Bp[0]], [VB, Cp[1]]], {
        explain: `${nb(`${frac(`${iq(A[0])} + ${VA} + ${par(Cp[0])}`, 3)} = ${iq(g[0])}`)}에서 ${VA} = ${iq(Bp[0])}, ${nb(`${frac(`${iq(A[1])} + ${par(Bp[1])} + ${VB}`, 3)} = ${iq(g[1])}`)}에서 ${VB} = ${iq(Cp[1])}이다.`,
        facts: { calc: [[`3*${jn(g[0])}-${jn(A[0])}-${jn(Cp[0])}`, 0], [`3*${jn(g[1])}-${jn(A[1])}-${jn(Bp[1])}`, 1]], derived: [3] }
      });
    }),
    T('div-centroid-mid', '무게중심과 한 변의 중점으로 꼭짓점 구하기', '①27', (d, k) => {
      if (k === 0) {
        const G = [d.int(-4, 4), d.int(-4, 4)], Mm = [d.int(-5, 5), d.int(-5, 5)], A = [3 * G[0] - 2 * Mm[0], 3 * G[1] - 2 * Mm[1]];
        if (G[0] === Mm[0] && G[1] === Mm[1]) return null;
        if (!inBox([A], 12)) return null;
        const [side, opp] = d.pick([['BC', 'A'], ['CA', 'B'], ['AB', 'C']]);
        return pointAns(`삼각형 ABC의 무게중심의 좌표가 ${pt(G[0], G[1])}이고 변 ${side}의 중점의 좌표가 ${ptj(Mm[0], Mm[1], '일/일')} 때, 꼭짓점 ${opp}의 좌표는?`, A[0], A[1], {
          explain: `변 ${side}의 중점을 M이라 하면 무게중심은 선분 ${opp}M을 2 : 1로 내분하는 점이다. ${opp}${pt(X, Y)}라 하면 ${nb(`${frac(`2 × ${par(Mm[0])} + ${X}`, 3)} = ${iq(G[0])}`)}, ${nb(`${frac(`2 × ${par(Mm[1])} + ${Y}`, 3)} = ${iq(G[1])}`)}이므로 ${opp}${pt(A[0], A[1])}이다.`,
          facts: { calc: [[`3*${jn(G[0])}-2*${jn(Mm[0])}`, 0], [`3*${jn(G[1])}-2*${jn(Mm[1])}`, 1]], derived: [2, 3] }
        });
      }
      const A = [d.int(-5, 5), d.int(-5, 5)], Bp = [d.int(-5, 5), d.int(-5, 5)], Cp = [d.int(-5, 5), d.int(-5, 5)];
      const sx = A[0] + Bp[0] + Cp[0], sy = A[1] + Bp[1] + Cp[1];
      if (sx % 3 || sy % 3 || (A[0] + Bp[0]) % 2 || (A[1] + Bp[1]) % 2 || (A[0] + Cp[0]) % 2 || (A[1] + Cp[1]) % 2 || (Bp[0] - A[0]) * (Cp[1] - A[1]) === (Cp[0] - A[0]) * (Bp[1] - A[1])) return null;
      const Mm = [(A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2], G = [sx / 3, sy / 3], N2 = [(A[0] + Cp[0]) / 2, (A[1] + Cp[1]) / 2];
      return pointAns(`삼각형 ABC의 한 꼭짓점 A의 좌표가 ${pt(A[0], A[1])}, 변 AB의 중점 M의 좌표가 ${pt(Mm[0], Mm[1])}, 무게중심 G의 좌표가 ${ptj(G[0], G[1], '일/일')} 때, 변 AC의 중점의 좌표는?`, N2[0], N2[1], {
        explain: `M은 선분 AB의 중점이므로 B${pt(Bp[0], Bp[1])}이다. C${pt(X, Y)}라 하면 무게중심의 좌표에서 ${nb(`${frac(`${iq(A[0])} + ${par(Bp[0])} + ${X}`, 3)} = ${iq(G[0])}`)}, ${nb(`${frac(`${iq(A[1])} + ${par(Bp[1])} + ${Y}`, 3)} = ${iq(G[1])}`)}이므로 C${pt(Cp[0], Cp[1])}이다. 따라서 변 AC의 중점은 ${pt(N2[0], N2[1])}이다.`,
        facts: { calc: [[`(${jn(A[0])}+3*${jn(G[0])}-${jn(A[0])}-(2*${jn(Mm[0])}-${jn(A[0])}))/2`, 0], [`(${jn(A[1])}+3*${jn(G[1])}-${jn(A[1])}-(2*${jn(Mm[1])}-${jn(A[1])}))/2`, 1]], derived: [2, 3] }
      });
    }, { count: 2 }),
    T('div-centroid-on-line', '무게중심이 직선 위에 있을 때의 미지수', '①28 심2', (d) => {
      const A = [d.int(-6, 6), d.int(-6, 6)], Bp = [d.int(-6, 6), d.int(-6, 6)], c3 = d.int(-6, 6), p = nz(d, -3, 3), q = d.int(-4, 4);
      // 무게중심 G((x1 + x2 + k)/3, (y1 + y2 + c3)/3) 이 y = px + q 위: y1 + y2 + c3 = p(x1 + x2 + k) + 3q
      const top = A[1] + Bp[1] + c3 - 3 * q;
      if (top % p !== 0) return null;
      const k = top / p - A[0] - Bp[0];
      if (Math.abs(k) > 12 || (Bp[0] - A[0]) * (c3 - A[1]) === (k - A[0]) * (Bp[1] - A[1])) return null;
      return N(`세 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}, ${Pj('C', VK, c3, '을/를')} 꼭짓점으로 하는 삼각형 ABC의 무게중심이 직선 ${slopeH(p, q)} 위에 있을 때, 상수 ${VK}의 값은?`, k, {
        signed: true,
        explain: `무게중심의 좌표는 ${nb(`(${frac(poly([[A[0] + Bp[0], ''], [1, VK]]), 3)}, ${fr(A[1] + Bp[1] + c3, 3)})`)}이다. 이 점을 직선의 방정식에 대입하면 ${nb(`${fr(A[1] + Bp[1] + c3, 3)} = ${p === 1 ? '' : p === -1 ? MINUS : iq(p) + ' × '}${frac(poly([[A[0] + Bp[0], ''], [1, VK]]), 3)}${q === 0 ? '' : ' ' + (q < 0 ? MINUS : '+') + ' ' + Math.abs(q)}`)}이고, 풀면 ${VK} = ${iq(k)}이다.`,
        facts: { calc: [[`(${jn(A[1])}+${jn(Bp[1])}+${jn(c3)}-3*${jn(q)})/${jn(p)}-${jn(A[0])}-${jn(Bp[0])}`, 0]], derived: [3] }
      });
    }),
    T('div-parallelogram', '평행사변형의 꼭짓점의 미지수 구하기', '①29', (d) => {
      const A = [d.int(-6, 6), d.int(-6, 6)], u = [nz(d, -5, 5), d.int(-5, 5)], v = [d.int(-5, 5), nz(d, -5, 5)];
      if (u[0] * v[1] - u[1] * v[0] === 0) return null;
      const Bp = add(A, u), Cp = add(Bp, v), Dp = add(A, v);
      if (!inBox([Bp, Cp, Dp])) return null;
      // 원문처럼 A의 x좌표와 D의 y좌표를 모른다.
      return vals(`네 점 ${P('A', VA, A[1])}, ${P('B', Bp[0], Bp[1])}, ${P('C', Cp[0], Cp[1])}, ${Pj('D', Dp[0], VB, '을/를')} 꼭짓점으로 하는 사각형 ABCD가 평행사변형일 때, 상수 ${VA}, ${VB}의 값은?`, [[VA, A[0]], [VB, Dp[1]]], {
        explain: `평행사변형의 두 대각선은 서로 다른 것을 이등분하므로 선분 AC의 중점과 선분 BD의 중점이 같다. ${nb(`${frac(`${VA} + ${par(Cp[0])}`, 2)} = ${frac(`${iq(Bp[0])} + ${par(Dp[0])}`, 2)}`)}에서 ${VA} = ${iq(A[0])}, ${nb(`${frac(`${iq(A[1])} + ${par(Cp[1])}`, 2)} = ${frac(`${iq(Bp[1])} + ${VB}`, 2)}`)}에서 ${VB} = ${iq(Dp[1])}이다.`,
        facts: { calc: [[`${jn(Bp[0])}+${jn(Dp[0])}-${jn(Cp[0])}`, 0], [`${jn(A[1])}+${jn(Cp[1])}-${jn(Bp[1])}`, 1]] }
      });
    }),
    T('div-midpoint-triangle', '세 변의 중점이 만드는 삼각형의 무게중심', '①34', (d) => {
      const pts = [0, 1, 2].map(() => [d.int(-6, 6), d.int(-6, 6)]), sx = pts.reduce((s, p) => s + p[0], 0), sy = pts.reduce((s, p) => s + p[1], 0);
      if (sx % 3 || sy % 3 || (pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) === (pts[2][0] - pts[0][0]) * (pts[1][1] - pts[0][1])) return null;
      const [A, Bp, Cp] = pts, mid = (p, q) => [Q(p[0] + q[0], 2), Q(p[1] + q[1], 2)], [Pp, Qp, Rp] = [mid(A, Bp), mid(Bp, Cp), mid(Cp, A)];
      return pointAns(`세 점 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}, ${Pj('C', Cp[0], Cp[1], '을/를')} 꼭짓점으로 하는 삼각형 ABC에서 세 변 AB, BC, CA의 중점을 각각 P, Q, R라 할 때, 삼각형 PQR의 무게중심의 좌표는?`, sx / 3, sy / 3, {
        explain: `P${pt(Pp[0], Pp[1])}, Q${pt(Qp[0], Qp[1])}, R${pt(Rp[0], Rp[1])}이므로 삼각형 PQR의 무게중심은 ${pt(sx / 3, sy / 3)}이다. 삼각형 ABC의 무게중심과 같다.`,
        facts: { calc: [[`(${jn(A[0])}+${jn(Bp[0])}+${jn(Cp[0])})/3`, 0], [`(${jn(A[1])}+${jn(Bp[1])}+${jn(Cp[1])})/3`, 1]], derived: [3] }
      });
    })
  ];

  B.kit.m1021 = {
    STD1, STD2, STD3, UNIT, stripH, seal, retry, sourceOf, T, H, X, Y, VA, VB, VC, VK, VM, VN, VT, iq, jn, par, nj, cx, cv, jw, fr, pt, ptj, P, Pj, P1, P1j, ratio, ratioj, QN, QS,
    genH, genj, slopeH, slopej, isSq, lenH, lenj, sqForm, sq, df, lineAns, twoLinesAns, radLen, twoVals, vals, rangeAns, pick, vecs, NORM2, sameLen, RATIOS, inBox, add, sub, mul, d2, PYTH
  };

  B.addUnit({
    id: '10-2-1', grade: 10, semester: 2, no: 1, title: '평면좌표와 직선의 방정식', version: 1,
    groups: [
      { id: 'dist', title: '두 점 사이의 거리', standard: STD1, types: distTypes },
      { id: 'div', title: '선분의 내분', standard: STD1, types: divTypes }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
