// 5학년 1학기 3단원 대응 관계 — 단원 틀과 기본 문항(두 양 사이의 대응 관계, 표로·말로·식으로 나타내기).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 58·66·59꼴, 심화꼴 74꼴)을 처음부터 끝까지 대조하여,
// 꼴마다 ① 대응의 구조가 무엇인가 ② 무엇을 주고 무엇을 묻는가를 따져서 실었다. 꼴 번호는 ①n = 기본꼴_1의 n번, ②n, ③n, 심n.
// (한 양에서 다른 양 구하기, 식을 읽고 상황 찾기의 기본 문항과 실력 문항은 5-1-3b.js에 있다.)
//
// 싣는 기준
//  - 대응의 구조는 연산 하나짜리 셋뿐이다: ① 몇 배(△ = □ × 4, □ = △ ÷ 4) ② 얼마 더하기·빼기(△ = □ + 3, □ = △ − 3) ③ 합이 일정(□ + △ = 10).
//    교육과정이 「덧셈식, 뺄셈식, 곱셈식, 나눗셈식 중 하나로 표현되는 간단한 경우만」 다루게 하므로 연산이 둘인 대응은 싣지 않는다.
//  - 구조, 주는 것(글·표·도형의 배열·식), 묻는 것(따라 변하는 양, 표의 빈칸, 관계를 말한 것, 알맞은 식, 잘못 나타낸 식, 기호가 나타내는 것)이
//    다르면 다른 문제다. 상황(탁자와 의자, 자동차와 바퀴, 봉지와 귤)만 다르고 구조와 묻는 것이 같으면 한 번만 싣는다.
//  - 구조가 상황에서 나오는 것은 따로 싣는다: 나이(차가 변하지 않는다), 연도와 나이, 두 도시의 시각, 자른 횟수와 도막 수(+1),
//    이어 붙인 사진과 누름 못(+1), 기둥과 그 사이의 줄(−1), 먼저 저금한 돈, 나누어 가진 수(합이 일정).
//  - 식을 쓰는 꼴과 말로 쓰는 꼴(서술형)은 「알맞은 식은?」「바르게 말한 것은?」으로 바꾸어 실었다. 보기에는 두 양의 자리를 바꾼 것,
//    곱셈과 덧셈을 바꾼 것(표의 첫 짝만 보면 맞아 보이는 것)을 넣었다. 답이 여럿인 꼴(모두 고르기)은 「잘못 나타낸 것은?」으로 바꾸었다.
//  - 보기의 참·거짓은 손으로 적지 않고 수의 짝 전부에 식을 넣어 코드로 정한다(judge). 검사가 다시 셈하도록 짝 하나를 facts.claimed 에 적는다.
//  - □는 양을 나타내는 기호로 쓰므로, 답을 적을 빈칸은 ㉠·㉡을 적은 칸으로 나타낸다.
//
// 뺀 것과 까닭
//  - 연산이 둘인 대응(곱하고 더하기·빼기): 이어 붙인 성냥개비 도형, 둘러싼 사각형, 이어 붙인 탁자, 두 연산 수 놀이
//    (①46·47 ②11·55·56 ③35 심28·64·65·66·67·74, ②16·심13의 곱하고 더하기 변형)
//  - 늘어나는 양이 일정하지 않은 배열: 같은 수를 두 번 곱하는 배열(①48 ②58 심59·60, ③38의 그런 배열), 계단 모양(심61),
//    층마다 달라지는 탑(②59), 변마다 찍은 점(②57)
//  - 곱이 일정한 대응(심68), 대응을 둘 잇는 것(심45·46, 자르는 데 걸리는 시간 심70), 이익 풀이(②43 심47), 나머지 처리(③20 심40)
//  - 서술형·작도·답이 열린 것: 그림에서 두 양을 스스로 찾아 쓰기(①5·29 ②12·62 ③6·51 심2), 기호를 스스로 정하기(①28 ②40 ③45),
//    상황·문제 만들기(①57·58 ②64 ③58 심37), 다음 모양 그리기(①12 ②65 심15), 준비 학습(②66 ③59)
//  - 뜻 없는 셈: 빈칸에 들어갈 수끼리 더하고 빼기(심48, ①7·③56의 ㉠ + ㉡ 변형)
//  - 그림이 필요해 미룬 것: 날개 5개인 바람개비·컵을 든 사람처럼 그림에서 수를 읽어 식이 다른 하나 찾기(①35),
//    식탁·의자·컵이 함께 놓인 그림에서 세 양의 관계 고르기(②22), 접어서 겹쳐 놓고 자르는 끈(심71)
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, lines, table, josa, name, nick, N, M, C } = B.kit;
  const G = B.kit.geo;
  const STD = '6수02-01';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const ORD = ['첫째', '둘째', '셋째', '넷째', '다섯째'];
  const S = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  const range = (n, from) => Array.from({ length: n }, (_, i) => i + (from || 0));
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  const ev = (x, op, k) => (op === '+' ? x + k : op === '-' ? x - k : op === '*' ? x * k : x / k);
  // 기호를 읽는 말(토씨를 붙일 때 쓴다)
  const READ = { '□': '네모', '△': '세모', '○': '동그라미', '☆': '별', '◇': '마름모', '♡': '하트' };
  const jo = (word, pair) => (READ[word] ? word + josa(READ[word], pair).slice(READ[word].length) : josa(word, pair));
  const SYMS = [['□', '△'], ['○', '△'], ['☆', '○'], ['◇', '○'], ['♡', '☆'], ['△', '☆'], ['◇', '☆'], ['○', '□']];
  // 도형·바둑돌 그림이 있는 문항에서는 그림 속 모양과 헷갈리지 않는 기호만 쓴다.
  const PLAIN_SYMS = [['☆', '♡'], ['♡', '☆'], ['◇', '☆'], ['☆', '◇'], ['♡', '◇']];
  const called = (A, B2, s) => `${jo(A, '을/를')} ${s[0]}, ${jo(B2, '을/를')} ${jo(s[1], '이라고/라고')} 할 때`;

  // ── 식과 말 ─────────────────────────────────────────────────
  // 식 한 줄은 [왼쪽 양, 연산, 수, 오른쪽 양] — 「(왼쪽 양) (연산) (수) = (오른쪽 양)」. 양은 0(앞의 양) 또는 1(뒤의 양)이다.
  const holds = (e, pairs) => pairs.every((p) => ev(p[e[0]], e[1], e[2]) === p[e[3]]);
  const eq = (e, names) => `${names[e[0]]} ${S[e[1]]} ${e[2]} = ${names[e[3]]}`;
  const eqLead = (e, names) => `${names[e[3]]} = ${names[e[0]]} ${S[e[1]]} ${e[2]}`;
  // 식 글 뒤에 토씨를 붙인다(끝의 기호를 읽는 소리에 맞춘다).
  const eqj = (e, names, pair) => { const last = names[e[3]], text = eq(e, names); return text.slice(0, text.length - last.length) + jo(last, pair); };
  const pairsOf = (op, k, xs) => xs.map((a) => [a, ev(a, op, k)]);
  const X6 = [1, 2, 3, 4, 5, 6];
  // 관계를 말로 나타낸 글. q 는 수를 비교하는 말({ unit: '개', more: '많다', less: '적다' }), plain 이면 「~에 ~을 곱하면 ~와 같다」 꼴.
  const CNT = { unit: '개', more: '많다', less: '적다' }, AGE = { unit: '살', more: '많다', less: '적다' }, NUM = { unit: '만큼', more: '크다', less: '작다' };
  const said = (e, names, q, plain) => {
    const [l, op, k, r] = e, L = names[l], R = names[r];
    if (op === '*') return plain ? `${L}에 ${josa(k, '을/를')} 곱하면 ${jo(R, '과/와')} 같다.` : `${jo(R, '은/는')} ${L}의 ${k}배이다.`;
    if (op === '/') return plain ? `${jo(L, '을/를')} ${josa(k, '으로/로')} 나누면 ${jo(R, '과/와')} 같다.` : `${jo(R, '은/는')} ${jo(L, '을/를')} ${josa(k, '으로/로')} 나눈 몫이다.`;
    if (op === '+') return plain ? `${L}에 ${josa(k, '을/를')} 더하면 ${jo(R, '과/와')} 같다.` : `${jo(R, '은/는')} ${L}보다 ${k}${q.unit} 더 ${q.more}.`;
    return plain ? `${L}에서 ${josa(k, '을/를')} 빼면 ${jo(R, '과/와')} 같다.` : `${jo(R, '은/는')} ${L}보다 ${k}${q.unit} 더 ${q.less}.`;
  };
  // 보기의 참·거짓을 코드로 정한다. 보기는 { text, e }(식: 수의 짝 전부에 맞아야 참) 또는 { text, ok, claim }(식으로 따질 수 없는 말).
  // 검사가 다시 셈하도록, 식인 보기마다 그 참·거짓이 드러나는 짝 하나를 골라 [식 글, 적힌 값]으로 적는다(facts.claimed).
  function judge(list, pairs, want) {
    const rows = list.map((o) => {
      if (!o.e) return o;
      const ps = o.pairs || pairs, ok = holds(o.e, ps), p = ps.slice().reverse().find((q) => holds(o.e, [q]) === ok);
      return { text: o.text, ok, claim: [`${p[o.e[0]]}${o.e[1]}${o.e[2]}`, p[o.e[3]]] };
    });
    if (rows.filter((o) => o.ok === want).length !== 1) throw new Error('답이 하나가 아니다: ' + rows.map((o) => o.text + '=' + o.ok).join(' | '));
    const facts = { truth: rows.map((o) => o.ok), want };
    if (rows.every((o) => o.claim)) { facts.claimed = rows.map((o) => o.claim); facts.claimedWant = want; }
    return { options: rows.map((o) => o.text), answer: rows.findIndex((o) => o.ok === want), facts };
  }
  const choose = (d, text, list, pairs, want, o) => { const j = judge(d.shuffle(list), pairs, want); return C(text, j.options, j.answer, Object.assign({}, o, { facts: j.facts })); };

  // ── 상황 ────────────────────────────────────────────────────
  // 몇 배인 대응: 앞의 양(a) 하나에 뒤의 양(b)이 k씩. A·B 는 양의 이름, ua·ub 는 세는 말.
  const mk = (a, b, k, text, ua, ub, B2) => ({ a, b, k, text, ua, ub, A: a + '의 수', B: B2 || b + '의 수' });
  const NATURE = [
    mk('탁자', '의자', 4, '탁자 한 개에 의자가 4개씩 놓여 있다.', '개', '개'),
    mk('세발자전거', '바퀴', 3, '세발자전거 한 대에는 바퀴가 3개 있다.', '대', '개'),
    mk('자동차', '바퀴', 4, '자동차 한 대에는 바퀴가 4개 있다.', '대', '개'),
    mk('오각형', '변', 5, '오각형 한 개에는 변이 5개 있다.', '개', '개'),
    mk('육각형', '꼭짓점', 6, '육각형 한 개에는 꼭짓점이 6개 있다.', '개', '개'),
    mk('문어', '다리', 8, '문어 한 마리에는 다리가 8개 있다.', '마리', '개', '문어 다리의 수'),
    mk('개미', '다리', 6, '개미 한 마리에는 다리가 6개 있다.', '마리', '개', '개미 다리의 수'),
    mk('나비', '날개', 4, '나비 한 마리에는 날개가 4장 있다.', '마리', '장')
  ];
  const PACK = [
    (k) => mk('봉지', '귤', k, `귤이 한 봉지에 ${k}개씩 들어 있다.`, '개', '개'),
    (k) => mk('상자', '사과', k, `사과가 한 상자에 ${k}개씩 들어 있다.`, '개', '개'),
    (k) => mk('접시', '만두', k, `만두가 한 접시에 ${k}개씩 놓여 있다.`, '개', '개'),
    (k) => mk('꽃병', '장미', k, `꽃병 한 개에 장미가 ${k}송이씩 꽂혀 있다.`, '개', '송이'),
    (k) => mk('모둠', '학생', k, `한 모둠에 학생이 ${k}명씩 있다.`, '개', '명'),
    (k) => mk('필통', '연필', k, `필통 한 개에 연필이 ${k}자루씩 들어 있다.`, '개', '자루'),
    (k) => mk('바구니', '감', k, `감이 한 바구니에 ${k}개씩 담겨 있다.`, '개', '개'),
    (k) => mk('쟁반', '송편', k, `송편이 한 쟁반에 ${k}개씩 놓여 있다.`, '개', '개')
  ];
  const ELDERS = ['어머니', '아버지', '이모', '삼촌', '선생님'];

  // ── 표 ──────────────────────────────────────────────────────
  // 대응 표(가로): 줄마다 [이름, 값 …]. 이름 칸은 좁은 화면에서 두 줄로 접힌다.
  const tableOf = (rows) => '<div class="mb-table-wrap"><table class="mb-table"><tbody>' + rows.map((row) => '<tr>' + row.map((c, i) => '<td style="padding:5px 7px' + (i ? '' : ';white-space:normal;word-break:keep-all') + '">' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';

  // ── 도형의 배열 ──────────────────────────────────────────────
  // 조각 하나는 [x, y, 종류]. 모눈 한 칸에 조각 하나를 조금 띄워 그린다. 종류: s 사각형, c 원, t 삼각형, k 검은 바둑돌, w 흰 바둑돌.
  const fx = (v) => Math.round(v * 10) / 10;
  const stone = (fill) => (u, x, y) => '<circle class="mb-poly" style="stroke-width:1.2;fill:' + fill + '" cx="' + fx(x + u / 2) + '" cy="' + fx(y + u / 2) + '" r="' + fx(u * 0.41) + '"/>';
  const PIECE = {
    s: (u, x, y) => '<rect class="mb-poly" style="stroke-width:1.2;fill:#fde68a" x="' + fx(x + u * 0.09) + '" y="' + fx(y + u * 0.09) + '" width="' + fx(u * 0.82) + '" height="' + fx(u * 0.82) + '"/>',
    t: (u, x, y) => '<path class="mb-poly" style="stroke-width:1.2;fill:#bbf7d0" d="M' + fx(x + u / 2) + ' ' + fx(y + u * 0.1) + 'L' + fx(x + u * 0.93) + ' ' + fx(y + u * 0.9) + 'H' + fx(x + u * 0.07) + 'Z"/>',
    c: stone('#bfdbfe'), k: stone('#374151'), w: stone('#fff')
  };
  const NAME = { s: '사각형', c: '원', t: '삼각형', k: '검은 바둑돌', w: '흰 바둑돌' };
  const shape = (cells) => ({ w: 1 + Math.max.apply(null, cells.map((c) => c[0])), h: 1 + Math.max.apply(null, cells.map((c) => c[1])), kinds: cells.map((c) => c[2]).filter((kind, i, all) => all.indexOf(kind) === i),
    n: (kind) => cells.filter((c) => c[2] === kind).length, body: (u, ox, oy) => cells.map(([x, y, kind]) => PIECE[kind](u, ox + x * u, oy + y * u)).join('') });
  // 모양 여럿을 왼쪽부터 나란히 놓고(바닥을 맞춘다) 아래에 이름을 적는다.
  function steps(shapes, names, label, maxUnit) {
    const gap = 12, pad = 6, slotsFor = (unit) => shapes.map((sh) => Math.max(sh.w * unit, 30)), widthFor = (unit) => pad * 2 + gap * (shapes.length - 1) + slotsFor(unit).reduce((s, v) => s + v, 0);
    let u = maxUnit || 16;
    while (u > 8 && widthFor(u) > 276) u -= 1;
    const slots = slotsFor(u), high = Math.max.apply(null, shapes.map((sh) => sh.h)) * u;
    let x = pad, out = '';
    shapes.forEach((sh, i) => {
      out += sh.body(u, x + (slots[i] - sh.w * u) / 2, pad + high - sh.h * u);
      out += '<text class="mb-label" x="' + fx(x + slots[i] / 2) + '" y="' + fx(pad + high + 16) + '" text-anchor="middle">' + names[i] + '</text>';
      x += slots[i] + gap;
    });
    return '<svg class="mb-geo" viewBox="0 0 ' + fx(x - gap + pad) + ' ' + fx(pad + high + 24) + '" width="' + fx(x - gap + pad) + '" role="img" aria-label="' + label + '">' + out + '</svg>';
  }
  const told = (shapes, names, head) => (head || '모양의 배열') + ': ' + shapes.map((sh, i) => names[i] + ' ' + sh.kinds.map((kind) => NAME[kind] + ' ' + sh.n(kind) + '개').join(' ')).join(', ');
  // 배열: 한 줄에 base 하나와 그 위에 top k개 / 윗줄 n개와 아랫줄 n + k개 / 가로 n, 세로 rows 인 직사각형
  const cols = (n, k, base, top) => range(n).reduce((all, i) => all.concat(range(k).map((j) => [i, j, top]), [[i, k, base]]), []);
  const twoRows = (n, k, up, down) => range(n).map((i) => [i, 0, up]).concat(range(n + k).map((i) => [i, 1, down]));
  const block = (rows, n, kind) => range(rows).reduce((all, r) => all.concat(range(n).map((c) => [c, r, kind])), []);
  // 줄마다 왼쪽에 이름을 적고 오른쪽에 그림을 그린다(자른 끈, 이어 붙인 사진, 기둥과 줄).
  function rowsFig(rows, label) {
    const rowH = 34;
    const out = rows.map(([nameText, draw], i) => '<text class="mb-label" x="4" y="' + (6 + i * rowH + 13) + '" dominant-baseline="central">' + nameText + '</text>' + draw(60, 6 + i * rowH)).join('');
    return '<svg class="mb-geo" viewBox="0 0 276 ' + (rows.length * rowH + 4) + '" width="276" role="img" aria-label="' + label + '">' + out + '</svg>';
  }
  const cutRow = (n) => (x, y) => '<rect class="mb-poly" style="stroke-width:1.2;fill:#fde68a" x="' + x + '" y="' + (y + 5) + '" width="204" height="16" rx="2"/>'
    + range(n, 1).map((i) => '<path style="stroke:#b42318;stroke-width:1.8;stroke-dasharray:4 3;fill:none" d="M' + fx(x + (204 * i) / (n + 1)) + ' ' + y + 'v26"/>').join('');
  const pinRow = (n) => (x, y) => range(n).map((i) => '<rect class="mb-poly" style="stroke-width:1.2;fill:#dbeafe" x="' + (x + 4 + i * 42) + '" y="' + (y + 2) + '" width="42" height="24"/>').join('')
    + range(n + 1).map((i) => '<circle style="fill:#b42318;stroke:#7f1d1d;stroke-width:1" cx="' + (x + 4 + i * 42 + (i === 0 ? 5 : i === n ? -5 : 0)) + '" cy="' + (y + 8) + '" r="3.4"/>').join('');
  const fenceRow = (n) => (x, y) => range(n - 1).map((i) => '<path style="stroke:#2563eb;stroke-width:2.6;fill:none" d="M' + (x + 8 + i * 46) + ' ' + (y + 10) + 'h46"/>').join('')
    + range(n).map((i) => '<rect class="mb-poly" style="stroke-width:1.2;fill:#b45309" x="' + (x + 4 + i * 46) + '" y="' + (y + 2) + '" width="8" height="26" rx="2"/>').join('');
  const cutFig = (list) => rowsFig(list.map((n) => [n + '번', cutRow(n)]), '끈 한 개를 자른 모습: ' + list.map((n) => `${n}번 자르면 ${n + 1}도막`).join(', '));
  const pinFig = (list) => rowsFig(list.map((n) => [n + '장', pinRow(n)]), '한 줄로 이어 붙인 사진: ' + list.map((n) => `사진 ${n}장에 누름 못 ${n + 1}개`).join(', '));
  const fenceFig = (list) => rowsFig(list.map((n) => [n + '개', fenceRow(n)]), '기둥과 기둥 사이에 건 줄: ' + list.map((n) => `기둥 ${n}개에 줄 ${n - 1}개`).join(', '));

  B.addUnit({
    id: '5-1-3', grade: 5, semester: 1, no: 3, title: '대응 관계', version: 2,
    groups: [
      {
        id: 'pair', title: '두 양 사이의 대응 관계', standard: STD,
        types: [
          T('pr-word', '대응 관계의 뜻', '①1 ③1', (d) => {
            const rows = d.shuffle([['대응 관계', true], ['크기 비교', false], ['계산 순서', false], ['어림', false]]);
            return C('한 양이 변할 때 다른 양이 그에 따라 일정하게 변하는 두 양 사이의 관계를 무엇이라고 하는가?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              explain: '한 양이 변할 때 다른 양이 그에 따라 일정하게 변하는 관계를 대응 관계라고 한다. 탁자의 수와 의자의 수처럼 서로 짝을 이루는 두 양 사이의 관계이다.', facts: truthOf(rows, true)
            });
          }),
          T('pr-find', '따라 변하는 양 찾기', '①2 ②60 ③2 심1', (d) => {
            // 틀린 보기: 글에 나온 수(한 묶음의 수)는 변하지 않는 양이다.
            const [lead, base, right, wrong] = d.pick([
              ['사탕이 한 봉지에 6개씩 들어 있다.', '봉지의 수', '사탕의 수', ['한 봉지에 든 사탕의 수', '사탕 한 개의 무게', '봉지 한 개의 크기']],
              ['탁자 한 개에 의자가 4개씩 놓여 있다.', '탁자의 수', '의자의 수', ['탁자 한 개에 놓인 의자의 수', '의자 한 개의 무게', '탁자 한 개의 높이']],
              ['자동차 한 대에는 바퀴가 4개 있다.', '자동차의 수', '바퀴의 수', ['자동차 한 대에 있는 바퀴의 수', '바퀴 한 개의 크기', '자동차 한 대의 길이']]
            ]);
            const rows = d.shuffle([[right, true]].concat(wrong.map((w) => [w, false])));
            return C(`${lead} ${jo(base, '이/가')} 변할 때 그에 따라 일정하게 변하는 양은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              explain: `${jo(base, '이/가')} 1, 2, 3, …으로 변하면 ${right}도 그에 따라 변한다. 나머지는 ${jo(base, '이/가')} 변해도 변하지 않는다.`, facts: truthOf(rows, true)
            });
          }),
          T('pr-which', '대응 관계가 아닌 두 양', '①4 ②61 ③4', (d) => {
            const odd = d.pick([['필통의 수와 필통에 든 연필의 수(필통마다 든 연필의 수가 다르다.)', '필통마다 든 연필의 수가 다르면 필통의 수만 알아서는 연필의 수를 알 수 없다.'], ['책꽂이의 수와 꽂힌 책의 수(책꽂이마다 꽂힌 책의 수가 다르다.)', '책꽂이마다 꽂힌 책의 수가 다르면 책꽂이의 수만 알아서는 책의 수를 알 수 없다.']]);
            const rows = d.shuffle([['책상의 수와 책상 다리의 수(책상 한 개에 다리가 4개 있다.)', true], ['세발자전거의 수와 바퀴의 수', true], ['삼각형의 수와 꼭짓점의 수', true], [odd[0], false]]);
            return C('한 양이 변할 때 다른 양이 일정하게 따라 변하는 두 양을 찾으려고 한다. 알맞지 않은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), {
              explain: `${odd[1]} 나머지는 한 양이 1씩 커질 때 다른 양이 4, 3, 3씩 일정하게 커진다.`, facts: truthOf(rows, false)
            });
          }),
          T('pr-match', '주어진 양과 대응하는 양', '③3·5', (d) => {
            // 틀린 보기: 값표에 적힌 값(변하지 않는 양)
            const goods = [['지우개', '개', d.pick([400, 500, 600])], ['연필', '자루', d.pick([700, 800, 900])], ['가위', '개', d.pick([1500, 2000, 2500])]], at = d.int(0, 2), [what, unit] = goods[at];
            const rows = d.shuffle([[`${what}값으로 내는 돈`, true]].concat(goods.map(([g, u]) => [`${g} 한 ${u}의 값`, false])));
            return C(`문구점에서 지우개는 한 개에 ${goods[0][2]}원, 연필은 한 자루에 ${goods[1][2]}원, 가위는 한 개에 ${goods[2][2]}원에 판다. ${jo(what, '을/를')} 여러 ${unit} 살 때, 사는 ${what}의 수에 따라 일정하게 변하는 양은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              explain: `${jo(what, '을/를')} 1${unit}, 2${unit}, 3${unit} 사면 내는 돈은 ${goods[at][2]}원, ${goods[at][2] * 2}원, ${goods[at][2] * 3}원으로 변한다. 한 ${unit}의 값은 몇 ${unit}를 사도 변하지 않는다.`, facts: truthOf(rows, true)
            });
          }),
          T('pr-sum-dir', '한 양이 많아질 때 다른 양이 적어지는 관계', '③7·8 심3', (d) => {
            const down = d.pick([['200쪽인 책을 읽을 때 읽은 쪽수와 남은 쪽수', '읽은 쪽수가 많아지는 만큼 남은 쪽수는 적어진다. 두 양의 합은 200쪽으로 변하지 않는다.'], ['5000원을 내고 물건 하나를 살 때 물건값과 거스름돈', '물건값이 많아지는 만큼 거스름돈은 적어진다. 두 양의 합은 5000원으로 변하지 않는다.'], ['10 km 떨어진 곳까지 갈 때 간 거리와 남은 거리', '간 거리가 많아지는 만큼 남은 거리는 적어진다. 두 양의 합은 10 km로 변하지 않는다.']]);
            const rows = d.shuffle([['사자의 수와 사자 다리의 수', false], ['1시간에 60 km씩 가는 자동차의 이동 시간과 이동 거리', false], ['한 봉지에 5개씩 담을 때 봉지의 수와 귤의 수', false], [down[0], true]]);
            return C('한 양이 많아질 때 다른 양은 그만큼 적어지는 두 양은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { explain: `${down[1]} 나머지는 한 양이 많아지면 다른 양도 많아진다.`, facts: truthOf(rows, true) });
          }),
          T('pr-step-mul', '하나 늘 때마다 늘어나는 수(몇 배)', '①14 ②3 ③11 심9', (d) => {
            const [lead, A, ua, B2, ub] = d.pick([['접시마다 만두를 같은 수만큼 담았다.', '접시의 수', '개', '만두의 수', '개'], ['꽃병마다 장미를 같은 수만큼 꽂았다.', '꽃병의 수', '개', '장미의 수', '송이'], ['봉지마다 귤을 같은 수만큼 담았다.', '봉지의 수', '개', '귤의 수', '개']]), k = d.int(3, 9);
            return N(`${lead} ${jo(A, '이/가')} 1${ua}씩 늘어날 때마다 ${jo(B2, '은/는')} 몇 ${ub}씩 늘어나는가?`, k, {
              unit: ub, figure: tableOf([[`${A}(${ua})`, 1, 2, 3, 4], [`${B2}(${ub})`, k, 2 * k, 3 * k, 4 * k]]),
              explain: `${jo(B2, '은/는')} ${k}, ${2 * k}, ${3 * k}, ${josa(4 * k, '으로/로')} ${k}${ub}씩 늘어난다. ${2 * k} − ${k} = ${k}`, facts: { calc: [[`${2 * k}-${k}`, 0]] }
            });
          }),
          T('pr-step-add', '하나 늘 때마다 늘어나는 수(하나 차이)', '②2·4 ③24', (d) => {
            const list = range(3, d.pick([1, 2]));
            return N('사진을 한 줄로 이어 붙이면서 누름 못을 꽂았다. 사진의 수가 1장씩 늘어날 때마다 누름 못의 수는 몇 개씩 늘어나는가?', 1, {
              unit: '개', figure: pinFig(list), explain: `누름 못의 수는 ${list.map((n) => n + 1 + '개').join(', ')}로 1개씩 늘어난다. 누름 못의 수가 사진의 수의 몇 배인 것은 아니지만, 사진의 수가 변하면 누름 못의 수도 일정하게 따라 변한다.`,
              facts: { calc: [[`${list[1] + 1}-${list[0] + 1}`, 0]] }
            });
          }),
          T('pr-pic-mul', '배열에서 두 양이 변하는 모습', '①3·8 ②1 ③11', (d) => {
            const k = d.pick([2, 3]), top = d.pick(['c', 't']), what = NAME[top], shapes = range(3, 1).map((n) => shape(cols(n, k, 's', top)));
            return M(`규칙에 따라 사각형과 ${jo(what, '을/를')} 늘어놓았다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: k, unit: '개' }, { label: LABELS[1], answer: 4 * k, unit: '개' }], {
              figure: steps(shapes, ORD, told(shapes, ORD)) + lines([`사각형이 1개 늘어날 때마다 ${jo(what, '은/는')} ${box(LABELS[0])}개씩 늘어난다.`, `사각형이 4개일 때 ${jo(what, '은/는')} ${box(LABELS[1])}개이다.`]),
              explain: `${jo(what, '은/는')} ${k}개, ${2 * k}개, ${3 * k}개로 ${k}개씩 늘어난다. 사각형이 4개일 때는 ${3 * k} + ${k} = ${4 * k}(개)이다.`, facts: { calc: [[`${2 * k}-${k}`, 0], [`${3 * k}+${k}`, 1]] }
            });
          }),
          T('pr-pic-next', '다음에 이어질 모양', '①11 ③36', (d) => {
            // 틀린 보기: 첫째 모양만 보고 「1개 더 많다」로 본 것, 한 단계 더 간 것
            const top = d.pick(['c', 't']), what = NAME[top], shapes = range(3, 1).map((n) => shape(cols(n, 2, 's', top))), names = ['가', '나', '다'];
            const lone = range(4).reduce((all, i) => all.concat([[i, 1, top], [i, 2, 's']]), [[0, 0, top]]);
            const picks = d.shuffle([shape(cols(4, 2, 's', top)), shape(lone), shape(cols(5, 2, 's', top))]), truth = picks.map((sh) => sh.n('s') === 4 && sh.n(top) === 2 * 4);
            return C(`규칙에 따라 사각형과 ${jo(what, '을/를')} 늘어놓았다. 넷째에 알맞은 모양은?`, names, truth.indexOf(true), {
              figure: steps(shapes, ORD, told(shapes, ORD)) + steps(picks, names, told(picks, names, '고를 모양'), 12),
              explain: `${what}의 수는 사각형의 수의 2배이다. 넷째 모양은 사각형이 4개, ${jo(what, '이/가')} 8개이다.`, facts: { truth, want: true }
            });
          })
        ]
      },
      {
        id: 'table', title: '대응 관계를 표로 나타내기', standard: STD,
        types: [
          T('tb-mul', '몇 배인 대응의 표', '①6 ②5 ③9 심4', (d) => {
            const c = d.pick(NATURE.slice(1, 7)), k = c.k;
            return M(`${c.text} 표의 ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: 3 * k }, { label: LABELS[1], answer: 5 * k }], {
              figure: tableOf([[`${c.A}(${c.ua})`, 1, 2, 3, 4, 5], [`${c.B}(${c.ub})`, k, 2 * k, box(LABELS[0]), 4 * k, box(LABELS[1])]]),
              explain: `${jo(c.B, '은/는')} ${c.A}의 ${k}배이다. ㉠은 3 × ${k} = ${3 * k}, ㉡은 5 × ${k} = ${5 * k}이다.`, facts: { calc: [[`3*${k}`, 0], [`5*${k}`, 1]] }
            });
          }),
          T('tb-mul-skip', '건너뛴 칸과 윗줄의 빈칸', '①7 ②6 ③10 심5', (d) => {
            // 옆 칸과의 차로 채우면 틀린다. 윗줄은 나누어 구한다.
            const [lead, A, B2, k] = d.pick([['빵 한 개의 무게는 70 g이다.', '빵의 수(개)', '빵의 무게(g)', 70], ['지우는 1분에 60 m씩 걷는다.', '걸은 시간(분)', '걸은 거리(m)', 60], ['서연이는 책을 하루에 25쪽씩 읽는다.', '읽은 날수(일)', '읽은 쪽수(쪽)', 25], ['식빵 한 장에 잼을 45 g씩 바른다.', '식빵의 수(장)', '잼의 양(g)', 45]]), m = d.int(7, 9);
            return M(`${lead} 표의 ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: m }, { label: LABELS[1], answer: 5 * k }], {
              figure: tableOf([[A, 1, 2, 5, box(LABELS[0])], [B2, k, 2 * k, box(LABELS[1]), m * k]]),
              explain: `아랫줄의 수는 윗줄의 수의 ${k}배이다. ㉠은 ${m * k} ÷ ${k} = ${m}, ㉡은 5 × ${k} = ${5 * k}이다.`, facts: { calc: [[`${m * k}/${k}`, 0], [`5*${k}`, 1]] }
            });
          }),
          T('tb-pic-mul', '배열 순서와 조각의 수의 표', '①8 ②5·26 ③37 심4', (d) => {
            const k = d.pick([2, 3, 4]), shapes = range(3, 1).map((n) => shape(block(k, n, 's')));
            return M('규칙에 따라 사각형 조각을 늘어놓았다. 배열 순서와 사각형 조각의 수 사이의 대응 관계를 나타낸 표의 ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: 2 * k }, { label: LABELS[1], answer: 5 * k }], {
              figure: steps(shapes, ORD, told(shapes, ORD)) + tableOf([['배열 순서', 1, 2, 3, 4, 5], ['사각형 조각의 수(개)', k, box(LABELS[0]), 3 * k, 4 * k, box(LABELS[1])]]),
              explain: `사각형 조각의 수는 배열 순서의 ${k}배이다. ㉠은 2 × ${k} = ${2 * k}, ㉡은 5 × ${k} = ${5 * k}이다.`, facts: { calc: [[`2*${k}`, 0], [`5*${k}`, 1]] }
            });
          }),
          T('tb-pic-add', '배열을 세어 채우는 표(더하기)', '①9 ②7 ③22 심6', (d) => {
            const k = d.pick([2, 3]), shapes = range(3, 1).map((n) => shape(twoRows(n, k, 'k', 'w')));
            return M('규칙에 따라 검은 바둑돌과 흰 바둑돌을 늘어놓았다. 표의 ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: 4 + k }, { label: LABELS[1], answer: 5 + k }], {
              figure: steps(shapes, ORD, told(shapes, ORD)) + tableOf([['검은 바둑돌의 수(개)', 1, 2, 3, 4, 5], ['흰 바둑돌의 수(개)', 1 + k, 2 + k, 3 + k, box(LABELS[0]), box(LABELS[1])]]),
              explain: `흰 바둑돌의 수는 검은 바둑돌의 수보다 ${k}개 더 많다. ㉠은 4 + ${k} = ${4 + k}, ㉡은 5 + ${k} = ${5 + k}이다.`, facts: { calc: [[`4+(${1 + k}-1)`, 0], [`5+(${1 + k}-1)`, 1]] }
            });
          }),
          T('tb-sub', '두 줄에 빈칸이 있는 표(빼기)', '②7 ③23 심6', (d) => {
            const s = d.pick(SYMS), k = d.int(4, 8), a = d.int(k + 2, k + 6);
            return M(`표에서 ${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 찾아 ㉠, ㉡에 알맞은 수를 구하면?`, [{ label: LABELS[0], answer: a + 2 }, { label: LABELS[1], answer: a + 1 - k }], {
              figure: tableOf([[s[0], a, a + 1, box(LABELS[0]), a + 3, a + 4], [s[1], a - k, box(LABELS[1]), a + 2 - k, a + 3 - k, a + 4 - k]]),
              explain: `${jo(s[1], '은/는')} ${s[0]}에서 ${josa(k, '을/를')} 뺀 수이다. ㉠은 ${a + 2 - k} + ${k} = ${a + 2}, ㉡은 ${a + 1} − ${k} = ${a + 1 - k}이다.`, facts: { calc: [[`${a + 2 - k}+(${a}-${a - k})`, 0], [`${a + 1}-(${a}-${a - k})`, 1]] }
            });
          }),
          T('tb-age', '두 사람의 나이의 표', '①10 ②9 ③30 심6', (d) => {
            const child = d.pick(NAMES), elder = d.pick(ELDERS), c = d.int(10, 13), e = c + d.int(21, 32);
            return M(`올해 ${name(child, '은/는')} ${c}살이고 ${jo(elder, '은/는')} ${e}살이다. 표의 ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: e + 4 }, { label: LABELS[1], answer: e + 9 }], {
              figure: tableOf([[`${nick(child)}의 나이(살)`, c, c + 1, c + 4, c + 9], [`${elder}의 나이(살)`, e, e + 1, box(LABELS[0]), box(LABELS[1])]]),
              explain: `두 사람의 나이의 차는 ${e} − ${c} = ${e - c}(살)로 변하지 않는다. ㉠은 ${c + 4} + ${e - c} = ${e + 4}, ㉡은 ${c + 9} + ${e - c} = ${e + 9}이다.`, facts: { calc: [[`${c + 4}+(${e}-${c})`, 0], [`${c + 9}+(${e}-${c})`, 1]] }
            });
          }),
          T('tb-year', '연도와 나이의 표', '①10 ②9', (d) => {
            const child = d.pick(NAMES), y = d.int(2024, 2027), a = d.int(10, 13);
            return M(`${y}년에 ${name(child, '은/는')} ${a}살이다. 표의 ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: y + 2 }, { label: LABELS[1], answer: a + 1 }], {
              figure: tableOf([['연도(년)', y, y + 1, box(LABELS[0]), y + 3], [`${nick(child)}의 나이(살)`, a, box(LABELS[1]), a + 2, a + 3]]),
              explain: `연도가 1년 지날 때마다 나이도 1살씩 많아진다. ㉠은 ${a + 2}살인 해이므로 ${y + 3} − 1 = ${y + 2}, ㉡은 ${y + 1}년의 나이이므로 ${a} + 1 = ${a + 1}이다.`, facts: { calc: [[`${y + 3}-(${a + 3}-${a + 2})`, 0], [`${a}+(${y + 1}-${y})`, 1]] }
            });
          }),
          T('tb-time', '두 도시의 시각의 표', '①10 ②9 심6', (d) => {
            const [city, gap] = d.pick([['방콕', 2], ['베이징', 1], ['두바이', 5]]), h = d.int(gap + 1, 8);
            return M(`서울이 오후 ${h}시일 때 ${jo(city, '은/는')} 같은 날 오후 ${h - gap}시이다. 표의 ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: h + 2 - gap, unit: '시' }, { label: LABELS[1], answer: h + 3 - gap, unit: '시' }], {
              figure: table(['서울의 시각', `${city}의 시각`], [[`오후 ${h}시`, `오후 ${h - gap}시`], [`오후 ${h + 1}시`, `오후 ${h + 1 - gap}시`], [`오후 ${h + 2}시`, `오후 ${box(LABELS[0])}시`], [`오후 ${h + 3}시`, `오후 ${box(LABELS[1])}시`]]),
              explain: `${city}의 시각은 서울의 시각보다 ${gap}시간 느리다. ㉠은 ${h + 2} − ${gap} = ${h + 2 - gap}, ㉡은 ${h + 3} − ${gap} = ${h + 3 - gap}이다.`, facts: { calc: [[`${h + 2}-(${h}-${h - gap})`, 0], [`${h + 3}-(${h}-${h - gap})`, 1]] }
            });
          }),
          T('tb-save', '먼저 저금한 돈이 있을 때의 표', '①10 ②10 ③23', (d) => {
            const [p, q] = d.shuffle(NAMES).slice(0, 2), first = d.pick([2000, 3000, 4000]);
            return M(`${name(p, '은/는')} ${first}원을 먼저 저금하였고, 다음 주부터 ${josa(nick(p), '과/와')} ${name(q, '은/는')} 일주일에 1000원씩 저금한다. 두 사람이 모은 돈을 나타낸 표의 ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: first + 3000, unit: '원' }, { label: LABELS[1], answer: first + 4000, unit: '원' }], {
              figure: tableOf([[`${nick(q)}의 돈(원)`, 1000, 2000, 3000, 4000], [`${nick(p)}의 돈(원)`, first + 1000, first + 2000, box(LABELS[0]), box(LABELS[1])]]),
              explain: `두 사람이 똑같이 1000원씩 저금하므로 ${name(p, '이/가')} 모은 돈은 ${name(q, '이/가')} 모은 돈보다 늘 ${first}원 많다. ㉠은 3000 + ${first} = ${first + 3000}, ㉡은 4000 + ${first} = ${first + 4000}이다.`, facts: { calc: [[`3000+${first}`, 0], [`4000+${first}`, 1]] }
            });
          }),
          T('tb-far-mul', '표의 먼 칸(몇 배)', '①43 ②8 ③56', (d) => {
            const s = d.pick(SYMS), k = d.int(6, 9), m = d.int(11, 15);
            return N(`표에서 ${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 찾아 ㉠에 알맞은 수를 구하면?`, m, {
              figure: tableOf([[s[0], 1, 2, 3, 4, '…', box(LABELS[0])], [s[1], k, 2 * k, 3 * k, 4 * k, '…', m * k]]),
              explain: `${jo(s[1], '은/는')} ${s[0]}의 ${k}배이다. ㉠은 ${m * k} ÷ ${k} = ${m}이다.`, facts: { calc: [[`${m * k}/(${2 * k}/2)`, 0]] }
            });
          }),
          T('tb-far-add', '표의 먼 칸(더하기)', '②8·48 ③56', (d) => {
            const s = d.pick(SYMS), k = d.int(4, 9), a = d.int(11, 15), m = d.int(31, 58);
            return N(`${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 나타낸 표이다. ㉠에 알맞은 수는?`, m + k, {
              figure: tableOf([[s[0], a, a + 1, a + 2, a + 3, '…', m], [s[1], a + k, a + 1 + k, a + 2 + k, a + 3 + k, '…', box(LABELS[0])]]),
              explain: `${jo(s[1], '은/는')} ${s[0]}보다 ${k}만큼 더 크다. ㉠은 ${m} + ${k} = ${m + k}이다.`, facts: { calc: [[`${m}+(${a + k}-${a})`, 0]] }
            });
          }),
          T('tb-div', '윗줄이 큰 표의 빈칸', '①24 ②31 심5·19', (d) => {
            // 고르게 늘지 않는 표다. 윗줄은 아랫줄에 곱하여, 아랫줄은 윗줄을 나누어 구한다.
            const s = d.pick(SYMS), k = d.pick([3, 4, 6, 7]), bs = d.pick([[5, 8, 9, 12, 14], [4, 6, 9, 11, 15], [3, 7, 8, 10, 13]]);
            return M(`표에서 ${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 찾아 ㉠, ㉡에 알맞은 수를 구하면?`, [{ label: LABELS[0], answer: bs[3] * k }, { label: LABELS[1], answer: bs[1] }], {
              figure: tableOf([[s[0], bs[0] * k, bs[1] * k, bs[2] * k, box(LABELS[0]), bs[4] * k], [s[1], bs[0], box(LABELS[1]), bs[2], bs[3], bs[4]]]),
              explain: `${bs[0] * k} ÷ ${bs[0]} = ${k}, ${bs[2] * k} ÷ ${bs[2]} = ${k}이므로 ${jo(s[1], '은/는')} ${jo(s[0], '을/를')} ${josa(k, '으로/로')} 나눈 몫이다. ㉠은 ${bs[3]} × ${k} = ${bs[3] * k}, ㉡은 ${bs[1] * k} ÷ ${k} = ${bs[1]}이다.`, facts: { calc: [[`${bs[3]}*(${bs[0] * k}/${bs[0]})`, 0], [`${bs[1] * k}/(${bs[0] * k}/${bs[0]})`, 1]] }
            });
          }),
          T('tb-from-say', '말로 나타낸 관계로 표 채우기', '심7', (d) => {
            // 「뺀」「작다」라는 말이 있지만 채울 쪽은 더해야 나온다.
            const s = d.pick(SYMS), k = d.int(3, 8), a = d.int(1, 9), minus = d.bool();
            return M(`「${minus ? `${jo(s[0], '은/는')} ${s[1]}에서 ${josa(k, '을/를')} 뺀 수이다.` : `${jo(s[0], '은/는')} ${s[1]}보다 ${k}만큼 더 작다.`}」 이 대응 관계를 나타낸 표의 ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: a + 1 + k }, { label: LABELS[1], answer: a + 3 + k }], {
              figure: tableOf([[s[0], a, a + 1, a + 2, a + 3], [s[1], a + k, box(LABELS[0]), a + 2 + k, box(LABELS[1])]]),
              explain: `${jo(s[1], '은/는')} ${s[0]}보다 ${k}만큼 더 크다. ㉠은 ${a + 1} + ${k} = ${a + 1 + k}, ㉡은 ${a + 3} + ${k} = ${a + 3 + k}이다.`, facts: { calc: [[`${a + 1}+${k}`, 0], [`${a + 3}+${k}`, 1]] }
            });
          }),
          T('tb-talk', '말한 수와 답한 수의 표', '①42 ③22 심8', (d) => {
            const [p, q] = d.shuffle(NAMES).slice(0, 2), k = d.int(4, 9), said4 = d.until(() => [d.int(k + 6, 20), d.int(k + 1, k + 5), d.int(21, 29), d.int(30, 45)], (list) => new Set(list).size === 4);
            return M(`${name(p, '이/가')} 수를 말하면 ${name(q, '은/는')} 규칙에 따라 답한다. 표의 ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: said4[2] - k }, { label: LABELS[1], answer: said4[3] - k }], {
              figure: tableOf([[`${name(p, '이/가')} 말한 수`].concat(said4), [`${name(q, '이/가')} 답한 수`, said4[0] - k, said4[1] - k, box(LABELS[0]), box(LABELS[1])]]),
              explain: `${said4[0]} − ${said4[0] - k} = ${k}, ${said4[1]} − ${said4[1] - k} = ${k}이므로 말한 수에서 ${josa(k, '을/를')} 뺀 수를 답한다. ㉠은 ${said4[2]} − ${k} = ${said4[2] - k}, ㉡은 ${said4[3]} − ${k} = ${said4[3] - k}이다.`,
              facts: { calc: [[`${said4[2]}-(${said4[0]}-${said4[0] - k})`, 0], [`${said4[3]}-(${said4[0]}-${said4[0] - k})`, 1]] }
            });
          }),
          T('tb-sum', '나누어 가진 수의 표(합이 일정)', '③8 심3·26', (d) => {
            const [p, q] = d.shuffle(NAMES).slice(0, 2), total = d.pick([20, 24, 30]), xs = d.until(() => [d.int(3, 7), d.int(8, 11), d.int(12, 15), d.int(16, total - 2)], (list) => list.every((x) => x * 2 !== total));
            return M(`색종이 ${total}장을 ${josa(nick(p), '과/와')} ${name(q, '이/가')} 남김없이 나누어 가진다. 표의 ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: xs[3], unit: '장' }, { label: LABELS[1], answer: total - xs[2], unit: '장' }], {
              figure: tableOf([[`${name(p, '이/가')} 가진 수(장)`, xs[0], xs[1], xs[2], box(LABELS[0])], [`${name(q, '이/가')} 가진 수(장)`, total - xs[0], total - xs[1], box(LABELS[1]), total - xs[3]]]),
              explain: `두 사람이 가진 색종이의 수의 합은 늘 ${total}장이다. ㉠은 ${total} − ${total - xs[3]} = ${xs[3]}, ㉡은 ${total} − ${xs[2]} = ${total - xs[2]}이다.`, facts: { calc: [[`${total}-${total - xs[3]}`, 0], [`${total}-${xs[2]}`, 1]] }
            });
          })
        ]
      },
      {
        id: 'say', title: '대응 관계를 말로 나타내기', standard: STD,
        types: [
          T('sy-mul-blank', '나눗셈으로 말한 관계의 수', '①13 ②13 ③12 심10', (d) => {
            const c = d.pick(NATURE.slice(4)), k = c.k;
            return N('표를 보고 ㉠에 알맞은 수를 구하면?', k, {
              figure: tableOf([[`${c.A}(${c.ua})`, 2, 3, 4, 5], [`${c.B}(${c.ub})`, 2 * k, 3 * k, 4 * k, 5 * k]]) + lines([`${jo(c.A, '은/는')} ${jo(c.B, '을/를')} ${box(LABELS[0])}(으)로 나눈 몫이다.`]),
              explain: `${2 * k} ÷ 2 = ${k}, ${3 * k} ÷ 3 = ${k}이므로 ${jo(c.B, '은/는')} ${c.A}의 ${k}배이다. ${jo(c.A, '은/는')} ${jo(c.B, '을/를')} ${josa(k, '으로/로')} 나눈 몫이다.`, facts: { calc: [[`${2 * k}/2`, 0]] }
            });
          }),
          T('sy-add-blank', '얼마 더 많은지 말한 관계의 수', '①16 ②14 ③24 심10', (d) => {
            const k = d.pick([2, 3, 4]), shapes = range(3, 1).map((n) => shape(twoRows(n, k, 's', 'c')));
            return N('규칙에 따라 사각형과 원을 늘어놓았다. ㉠에 알맞은 수는?', k, {
              figure: steps(shapes, ORD, told(shapes, ORD)) + lines([`원의 수는 사각형의 수보다 ${box(LABELS[0])}개 더 많다.`]),
              explain: `원의 수에서 사각형의 수를 빼면 ${1 + k} − 1 = ${k}, ${2 + k} − 2 = ${k}, ${3 + k} − 3 = ${josa(k, '으로/로')} 늘 같다.`, facts: { calc: [[`${1 + k}-1`, 0]] }
            });
          }),
          T('sy-add-dir', '많은 쪽과 적은 쪽 가려 말하기', '①16 ②14 ③25·26', (d) => {
            // 틀린 보기: 많고 적음을 거꾸로 말한 것, 기준이 되는 양을 바꾼 것, 옆 칸과의 차를 말한 것
            const child = d.pick(NAMES), elder = d.pick(ELDERS), c = d.int(10, 13), k = d.int(21, 32), names = [`${nick(child)}의 나이`, `${elder}의 나이`], ages = range(4).map((i) => [c + i, c + k + i]);
            return choose(d, '두 사람의 나이를 나타낸 표이다. 두 사람의 나이 사이의 대응 관계를 바르게 말한 것은?', [{ text: said([1, '-', k, 0], names, AGE), e: [1, '-', k, 0] }, { text: said([1, '+', k, 0], names, AGE), e: [1, '+', k, 0] }, { text: said([0, '-', k, 1], names, AGE), e: [0, '-', k, 1] }, { text: said([1, '-', 1, 0], names, AGE), e: [1, '-', 1, 0] }], ages, true, {
              figure: tableOf([[names[0] + '(살)'].concat(ages.map((p) => p[0])), [names[1] + '(살)'].concat(ages.map((p) => p[1]))]),
              explain: `${ages[0][1]} − ${ages[0][0]} = ${k}, ${ages[1][1]} − ${ages[1][0]} = ${k}이므로 ${jo(names[1], '은/는')} ${names[0]}보다 ${k}살 더 많고, ${jo(names[0], '은/는')} ${names[1]}보다 ${k}살 더 적다.`
            });
          }),
          T('sy-mul-pick', '바르게 말한 것(몇 배)', '①17·49 ②15·17 ③14·16 심11·12', (d) => {
            // 틀린 보기: 두 양의 자리를 바꾼 것, 첫 짝만 보고 더하기로 말한 것, 곱셈과 나눗셈의 방향을 바꾼 것
            const c = d.bool() ? d.pick(NATURE) : d.pick(PACK)(d.int(5, 9)), k = c.k, names = [c.A, c.B], right = d.bool() ? [0, '*', k, 1] : [1, '/', k, 0];
            return choose(d, `${c.text} 두 양 사이의 대응 관계를 바르게 말한 것은?`, [{ text: said(right, names, CNT), e: right }, { text: said([1, '*', k, 0], names, CNT), e: [1, '*', k, 0] }, { text: said([0, '+', k - 1, 1], names, CNT, true), e: [0, '+', k - 1, 1] }, { text: said([0, '/', k, 1], names, CNT, true), e: [0, '/', k, 1] }], pairsOf('*', k, [1, 2, 3, 4]), true, {
              figure: tableOf([[`${c.A}(${c.ua})`, 1, 2, 3, 4], [`${c.B}(${c.ub})`, k, 2 * k, 3 * k, 4 * k]]),
              explain: `${k} ÷ 1 = ${k}, ${2 * k} ÷ 2 = ${k}, ${3 * k} ÷ 3 = ${k}이므로 ${jo(c.B, '은/는')} ${c.A}의 ${k}배이고, ${jo(c.A, '은/는')} ${jo(c.B, '을/를')} ${josa(k, '으로/로')} 나눈 몫이다.`
            });
          }),
          T('sy-add-pick', '바르게 말한 것(더하기)', '①17·49 ②16·18 ③16 심11·13', (d) => {
            // 틀린 보기: 첫 짝(1과 1 + k)만 보고 몇 배로 말한 것, 두 양의 자리를 바꾼 것, 옆 칸과의 차를 말한 것
            const k = d.pick([2, 3, 4]), names = ['검은 바둑돌의 수', '흰 바둑돌의 수'];
            return choose(d, '검은 바둑돌과 흰 바둑돌을 규칙에 따라 놓고 수를 세어 표로 나타냈다. 두 양 사이의 대응 관계를 바르게 말한 것은?', [{ text: said([0, '+', k, 1], names, CNT), e: [0, '+', k, 1] }, { text: said([0, '*', k + 1, 1], names, CNT), e: [0, '*', k + 1, 1] }, { text: said([1, '+', k, 0], names, CNT), e: [1, '+', k, 0] }, { text: said([0, '+', 1, 1], names, CNT, true), e: [0, '+', 1, 1] }], pairsOf('+', k, [1, 2, 3, 4]), true, {
              figure: tableOf([['검은 바둑돌의 수(개)', 1, 2, 3, 4], ['흰 바둑돌의 수(개)', 1 + k, 2 + k, 3 + k, 4 + k]]),
              explain: `${1 + k} − 1 = ${k}, ${2 + k} − 2 = ${k}, ${3 + k} − 3 = ${k}이므로 흰 바둑돌의 수는 검은 바둑돌의 수보다 ${k}개 더 많다. ${k + 1}배인 것은 첫 칸뿐이다.`
            });
          }),
          T('sy-other-mul', '같은 관계를 다르게 말하기(몇 배)', '①17 ②15 ③17 심11', (d) => {
            const c = d.pick(PACK.slice(2))(d.int(3, 9)), k = c.k, names = [c.A, c.B];
            return choose(d, `「${said([1, '/', k, 0], names, CNT, true)}」 이것과 같은 대응 관계를 말한 것은?`, [{ text: said([0, '*', k, 1], names, CNT, true), e: [0, '*', k, 1] }, { text: said([1, '*', k, 0], names, CNT, true), e: [1, '*', k, 0] }, { text: said([0, '+', k, 1], names, CNT, true), e: [0, '+', k, 1] }, { text: said([0, '/', k, 1], names, CNT, true), e: [0, '/', k, 1] }], pairsOf('*', k, X6), true, {
              explain: `${jo(c.B, '을/를')} ${josa(k, '으로/로')} 나누어 ${jo(c.A, '이/가')} 되면, 거꾸로 ${c.A}에 ${josa(k, '을/를')} 곱하면 ${jo(c.B, '이/가')} 된다. ${c.A} 1, 2, 3에 ${c.B} ${k}, ${2 * k}, ${josa(3 * k, '이/가')} 대응한다.`
            });
          }),
          T('sy-other-add', '같은 관계를 다르게 말하기(더하기)', '①17 ③17 심11·14', (d) => {
            const p = d.pick(NAMES), k = d.int(2, 6), names = ['동생의 나이', `${nick(p)}의 나이`];
            return choose(d, `「${said([0, '+', k, 1], names, AGE, true)}」 이것과 같은 대응 관계를 말한 것은?`, [{ text: said([1, '-', k, 0], names, AGE, true), e: [1, '-', k, 0] }, { text: said([0, '-', k, 1], names, AGE, true), e: [0, '-', k, 1] }, { text: said([1, '+', k, 0], names, AGE, true), e: [1, '+', k, 0] }, { text: said([0, '*', k, 1], names, AGE, true), e: [0, '*', k, 1] }], pairsOf('+', k, [5, 6, 7, 8, 9, 10]), true, {
              explain: `동생의 나이에 ${josa(k, '을/를')} 더하여 ${nick(p)}의 나이가 되면, 거꾸로 ${nick(p)}의 나이에서 ${josa(k, '을/를')} 빼면 동생의 나이가 된다. 동생이 5살, 6살일 때 ${name(p, '은/는')} ${5 + k}살, ${6 + k}살이다.`
            });
          }),
          T('sy-wrong-add', '잘못 말한 것(하나 차이)', '②19 ③14 심12', (d) => {
            // 틀린 보기(답): 첫 칸(1번에 2도막)만 보고 2배라고 한 것
            const names = ['자른 횟수', '도막의 수'], xs = range(4, 1);
            return choose(d, '끈 한 개를 자른 횟수와 도막의 수를 표로 나타냈다. 두 양 사이의 대응 관계를 잘못 말한 것은?', [{ text: said([0, '+', 1, 1], names, NUM), e: [0, '+', 1, 1] }, { text: said([1, '-', 1, 0], names, NUM, true), e: [1, '-', 1, 0] }, { text: said([0, '*', 2, 1], names, NUM), e: [0, '*', 2, 1] },
              { text: '자른 횟수가 1번 늘어날 때마다 도막의 수는 1도막씩 늘어난다.', ok: true, claim: [`${xs[1] + 1}-${xs[0] + 1}`, 1] }], pairsOf('+', 1, xs), false, {
              figure: tableOf([['자른 횟수(번)'].concat(xs), ['도막의 수(도막)'].concat(xs.map((x) => x + 1))]),
              explain: '도막의 수가 자른 횟수의 2배인 것은 1번 잘랐을 때뿐이다. 2번 자르면 3도막, 3번 자르면 4도막이므로 도막의 수는 자른 횟수보다 1만큼 더 크다.'
            });
          }),
          T('sy-wrong-mul', '잘못 말한 것(몇 배)', '①49 ③15 심12', (d) => {
            // 틀린 보기(답): 첫 칸만 보고 「k − 1을 빼면」이라고 한 것
            const c = d.pick(PACK.slice(0, 4))(d.int(4, 9)), k = c.k, names = [c.A, c.B];
            return choose(d, `${c.text} 두 양 사이의 대응 관계를 잘못 말한 것은?`, [{ text: said([0, '*', k, 1], names, CNT, true), e: [0, '*', k, 1] }, { text: said([1, '/', k, 0], names, CNT), e: [1, '/', k, 0] }, { text: said([1, '-', k - 1, 0], names, CNT, true), e: [1, '-', k - 1, 0] },
              { text: `${jo(c.A, '이/가')} 1${c.ua} 늘어날 때마다 ${jo(c.B, '은/는')} ${k}${c.ub}씩 늘어난다.`, ok: true, claim: [`${2 * k}-${k}`, k] }], pairsOf('*', k, [1, 2, 3, 4]), false, {
              figure: tableOf([[`${c.A}(${c.ua})`, 1, 2, 3, 4], [`${c.B}(${c.ub})`, k, 2 * k, 3 * k, 4 * k]]),
              explain: `${k} − ${k - 1} = 1이지만 ${2 * k} − ${k - 1} = ${josa(k + 1, '은/는')} 2가 아니다. ${jo(c.B, '을/를')} ${josa(k, '으로/로')} 나누어야 ${jo(c.A, '이/가')} 된다.`
            });
          }),
          T('sy-name', '관계를 말한 글에 알맞은 양', '①15 ③13', (d) => {
            // 틀린 보기: 두 양의 자리를 바꾼 것, 한 묶음의 수가 다른 양을 넣은 것
            const [base, ub, p1, n1, u1, p2, n2, u2] = d.pick([['세발자전거', '대', '바퀴', 3, '개', '손잡이', 2, '개'], ['나비', '마리', '날개', 4, '장', '더듬이', 2, '개'], ['개미', '마리', '다리', 6, '개', '더듬이', 2, '개']]);
            const count = { [base]: (x) => x, [p1]: (x) => n1 * x, [p2]: (x) => n2 * x };
            const list = [[base, p1], [p1, base], [base, p2], [p2, p1]].map(([x, y]) => ({ text: `(가) ${x}, (나) ${y}`, ok: [1, 2, 3].every((n) => count[x](n) * n1 === count[y](n)), claim: [`${count[x](2)}*${n1}`, count[y](2)] }));
            const j = judge(d.shuffle(list), null, true);
            return C(`${base} 한 ${ub}에는 ${jo(p1, '이/가')} ${n1}${u1}, ${jo(p2, '이/가')} ${n2}${u2} 있다. 「( 가 )의 수에 ${josa(n1, '을/를')} 곱하면 ( 나 )의 수와 같다.」에서 (가), (나)에 알맞은 말은?`, j.options, j.answer, {
              explain: `${base}가 1${ub}, 2${ub}, 3${ub}일 때 ${jo(p1, '은/는')} ${n1}${u1}, ${2 * n1}${u1}, ${3 * n1}${u1}이다. ${base}의 수에 ${josa(n1, '을/를')} 곱하면 ${p1}의 수와 같다.`, facts: j.facts
            });
          }),
          T('sy-who', '잘못 말한 사람', '①50·51 ③52 심14·32', (d) => {
            // 세 사람이 서로 다른 대응 관계를 말한다. 한 사람은 두 양의 자리를 바꾸어 말했다.
            const trio = [['줄넘기', '손잡이', 2], ['상자', '탁구공', 6], ['스케이트보드', '바퀴', 4]], who = d.shuffle(NAMES).slice(0, 3), bad = d.int(0, 2);
            const list = trio.map(([a, b, k], i) => { const names = [a + '의 수', b + '의 수'], e = i === bad ? [1, '*', k, 0] : d.bool() ? [0, '*', k, 1] : [1, '/', k, 0]; return { text: who[i], said: said(e, names, CNT), e, pairs: pairsOf('*', k, [1, 2, 3]) }; });
            const j = judge(list, null, false), [a, b, k] = trio[bad];
            return C('줄넘기 한 개에는 손잡이가 2개 있고, 상자 한 개에는 탁구공이 6개 들어 있고, 스케이트보드 한 대에는 바퀴가 4개 있다. 대응 관계를 잘못 말한 사람은?', j.options, j.answer, {
              figure: lines(list.map((o) => `${o.text}: ${o.said}`)), explain: `${a}가 1, 2, 3일 때 ${jo(b, '은/는')} ${k}, ${2 * k}, ${3 * k}이다. ${b}의 수가 ${a}의 수의 ${k}배이다. ${nick(who[bad])}의 말은 두 양의 자리가 바뀌었다.`, facts: j.facts
            });
          }),
          T('sy-table-ox', '표를 보고 값을 말한 것', '①53 ②20', (d) => {
            // 틀린 보기: 첫 칸만 보고 몇 배로 셈한 값, 더하는 쪽과 빼는 쪽을 바꾼 값, 더하는 수를 옆 칸과의 차로 말한 것
            const s = d.pick(SYMS), k = d.pick([2, 3, 4]), x = d.int(8, 15), y = d.int(16, 25), gap = `(${1 + k}-1)`;
            const list = [{ text: `${jo(s[0], '이/가')} ${x}일 때 ${jo(s[1], '은/는')} ${x + k}이다.`, ok: true, claim: [`${x}+${gap}`, x + k] }, { text: `${jo(s[0], '이/가')} ${x}일 때 ${jo(s[1], '은/는')} ${x * (k + 1)}이다.`, ok: false, claim: [`${x}+${gap}`, x * (k + 1)] },
              { text: `${jo(s[1], '이/가')} ${y}일 때 ${jo(s[0], '은/는')} ${y + k}이다.`, ok: false, claim: [`${y}-${gap}`, y + k] }, { text: `${jo(s[0], '이/가')} 1씩 커질 때 ${jo(s[1], '은/는')} ${k}씩 커진다.`, ok: false, claim: [`${2 + k}-${1 + k}`, k] }];
            const j = judge(d.shuffle(list), null, true);
            return C(`${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 나타낸 표이다. 표를 보고 바르게 말한 것은?`, j.options, j.answer, {
              figure: tableOf([[s[0], 1, 2, 3, 4, 5], [s[1], 1 + k, 2 + k, 3 + k, 4 + k, 5 + k]]),
              explain: `${jo(s[1], '은/는')} ${s[0]}보다 ${k}만큼 더 크다. ${jo(s[0], '이/가')} ${x}일 때 ${jo(s[1], '은/는')} ${x} + ${k} = ${x + k}이고, ${jo(s[1], '이/가')} ${y}일 때 ${jo(s[0], '은/는')} ${y} − ${k} = ${y - k}이다. ${jo(s[0], '이/가')} 1씩 커질 때 ${s[1]}도 1씩 커진다.`, facts: j.facts
            });
          }),
          T('sy-sum-pick', '바르게 말한 것(합이 일정)', '③8 심3·26', (d) => {
            // 틀린 보기: 첫 칸만 보고 몇 배·얼마 더 많다고 한 것, 두 양이 함께 많아진다고 한 것
            const paid = d.pick([5000, 6000]), left = (v) => paid - v;
            const list = [{ text: `물건값과 거스름돈의 합은 늘 ${paid}원이다.`, ok: true, claim: [`2000+${left(2000)}`, paid] }, { text: `거스름돈은 물건값의 ${left(1000) / 1000}배이다.`, ok: false, claim: [`2000*${left(1000) / 1000}`, left(2000)] },
              { text: `거스름돈은 물건값보다 ${left(2000)}원 더 많다.`, ok: false, claim: [`2000+${left(2000)}`, left(2000)] }, { text: '물건값이 1000원 많아지면 거스름돈도 1000원 많아진다.', ok: false, claim: [`${left(1000)}+1000`, left(2000)] }];
            const j = judge(d.shuffle(list), null, true);
            return C(`${paid}원을 내고 물건 하나를 살 때 물건값과 거스름돈을 표로 나타냈다. 두 양 사이의 대응 관계를 바르게 말한 것은?`, j.options, j.answer, {
              figure: tableOf([['물건값(원)', 1000, 2000, 3000], ['거스름돈(원)', left(1000), left(2000), left(3000)]]),
              explain: `1000 + ${left(1000)} = ${paid}, 2000 + ${left(2000)} = ${paid}, 3000 + ${left(3000)} = ${paid}이다. 물건값이 많아지는 만큼 거스름돈은 적어지고 두 양의 합은 변하지 않는다.`, facts: j.facts
            });
          })
        ]
      },
      {
        id: 'expr', title: '대응 관계를 식으로 나타내기', standard: STD,
        types: [
          T('ex-op', '낱말 식에 알맞은 연산 기호', '①18·20·23 ②23 ③41 심21·22', (d) => {
            const c = d.pick(NATURE), k = c.k, pairs = pairsOf('*', k, [1, 2, 3]), OPS = [['*', '/'], ['/', '*'], ['+', '-'], ['-', '+']];
            const list = OPS.map(([p, q]) => ({ text: `㉠ ${S[p]}, ㉡ ${S[q]}`, ok: holds([0, p, k, 1], pairs) && holds([1, q, k, 0], pairs), claim: [`3${p}${k}`, 3 * k] })), j = judge(d.shuffle(list), null, true);
            return C(`${c.text} 두 양 사이의 대응 관계를 식으로 나타낼 때 ㉠, ㉡에 알맞은 기호는?`, j.options, j.answer, {
              figure: lines([`(${c.A}) ${box(LABELS[0])} ${k} = (${c.B})`, `(${c.B}) ${box(LABELS[1])} ${k} = (${c.A})`]),
              explain: `${jo(c.B, '은/는')} ${c.A}의 ${k}배이므로 (${c.A}) × ${k} = (${c.B})이고, 거꾸로 (${c.B}) ÷ ${k} = (${c.A})이다.`, facts: j.facts
            });
          }),
          T('ex-word-age', '낱말 식의 빈칸(나이)', '①19 ③42 심21', (d) => {
            const child = d.pick(NAMES), elder = d.pick(ELDERS), c = d.int(10, 13), e = c + d.int(21, 32);
            return N(`올해 ${jo(elder, '은/는')} ${e}살이고 ${name(child, '은/는')} ${c}살이다. 두 사람의 나이 사이의 대응 관계를 식으로 나타낼 때 ㉠에 알맞은 수는?`, e - c, {
              figure: lines([`(${elder}의 나이) − ${box(LABELS[0])} = (${nick(child)}의 나이)`]), explain: `두 사람의 나이의 차는 ${e} − ${c} = ${e - c}(살)이고 해가 바뀌어도 변하지 않는다. (${elder}의 나이) − ${e - c} = (${nick(child)}의 나이)`, facts: { calc: [[`${e}-${c}`, 0]] }
            });
          }),
          T('ex-word-pick', '알맞은 낱말 식(하나 차이)', '①19·26 ②24 ③32 심20', (d) => {
            // 틀린 보기: 하나 더 많다고 본 것, 첫 그림(기둥 2개에 줄 1개)만 보고 2로 나눈 것, 두 양의 자리를 바꾼 것
            const list = range(3, 2), W = ['(기둥의 수)', '(줄의 수)'];
            return choose(d, '기둥을 한 줄로 세우고 기둥과 기둥 사이에 줄을 하나씩 걸었다. 기둥의 수와 줄의 수 사이의 대응 관계를 식으로 바르게 나타낸 것은?', [[0, '-', 1, 1], [0, '+', 1, 1], [0, '/', 2, 1], [1, '-', 1, 0]].map((e) => ({ text: eqLead(e, W), e })), list.map((n) => [n, n - 1]), true, {
              figure: fenceFig(list), explain: '기둥이 2개, 3개, 4개일 때 줄은 1개, 2개, 3개이다. 줄의 수는 기둥의 수보다 1만큼 더 작다.'
            });
          }),
          T('ex-mul-pick', '알맞은 식(몇 배)', '①21·31 ②25·34 ③43·49 심16·29', (d) => {
            // 틀린 보기: 두 양의 자리를 바꾼 것, 곱하지 않고 더한 것, 곱셈과 나눗셈을 바꾼 것
            const c = d.pick(PACK)(d.int(4, 9)), k = c.k, s = d.pick(SYMS);
            return choose(d, `${c.text} ${called(c.A, c.B, s)}, 두 양 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '*', k, 1], [1, '*', k, 0], [0, '+', k, 1], [0, '/', k, 1]].map((e) => ({ text: eq(e, s), e })), pairsOf('*', k, X6), true, {
              explain: `${c.A}가 1, 2, 3일 때 ${jo(c.B, '은/는')} ${k}, ${2 * k}, ${3 * k}이다. ${c.A}에 ${josa(k, '을/를')} 곱하면 ${jo(c.B, '이/가')} 되므로 ${eq([0, '*', k, 1], s)}이다.`
            });
          }),
          T('ex-mul-not', '잘못 나타낸 식(몇 배)', '①32·51 ②35·39 ③49·52 심30·32', (d) => {
            const c = d.pick(NATURE), k = c.k, s = d.pick(SYMS), bad = d.pick([[1, '*', k, 0], [0, '/', k, 1]]);
            return choose(d, `${c.text} ${called(c.A, c.B, s)}, 두 양 사이의 대응 관계를 잘못 나타낸 식은?`, [{ text: eq([0, '*', k, 1], s), e: [0, '*', k, 1] }, { text: eq([1, '/', k, 0], s), e: [1, '/', k, 0] }, { text: eqLead([0, '*', k, 1], s), e: [0, '*', k, 1] }, { text: eq(bad, s), e: bad }], pairsOf('*', k, X6), false, {
              explain: `${jo(c.B, '은/는')} ${c.A}의 ${k}배이므로 바른 식은 ${eq([0, '*', k, 1], s)}, ${eq([1, '/', k, 0], s)}이다. ${eq(bad, s)}에 ${s[0]} = 1, ${s[1]} = ${josa(k, '을/를')} 넣으면 맞지 않는다.`
            });
          }),
          T('ex-word-tb', '낱말 표에 알맞은 식(큰 수)', '①21·22 ②25 심16·17', (d) => {
            const [A, ua, B2, ub, k] = d.pick([['입장객의 수', '명', '입장료', '원', 1500], ['공책의 수', '권', '공책값', '원', 700], ['달린 시간', '분', '달린 거리', 'm', 150], ['과자의 수', '봉지', '과자의 무게', 'g', 90]]), s = d.pick(SYMS);
            return choose(d, `${jo(A, '과/와')} ${B2} 사이의 대응 관계를 표로 나타냈다. ${called(A, B2, s)}, 두 양 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '*', k, 1], [1, '*', k, 0], [0, '+', k, 1], [0, '/', k, 1]].map((e) => ({ text: eq(e, s), e })), pairsOf('*', k, [1, 2, 3, 4]), true, {
              figure: tableOf([[`${A}(${ua})`, 1, 2, 3, 4], [`${B2}(${ub})`, k, 2 * k, 3 * k, 4 * k]]),
              explain: `${2 * k} ÷ 2 = ${k}, ${3 * k} ÷ 3 = ${k}이므로 ${jo(B2, '은/는')} ${A}의 ${k}배이다. ${eq([0, '*', k, 1], s)}이다.`
            });
          }),
          T('ex-div-pick', '작은 쪽의 양을 구하는 식', '①22 ②41 심19', (d) => {
            const c = d.pick([PACK[0], PACK[1], PACK[6]])(d.pick([10, 12, 15, 20])), k = c.k, s = d.pick(SYMS);
            return choose(d, `${c.text} ${called(c.A, c.B, s)}, ${jo(c.A, '을/를')} 구하는 식으로 알맞은 것은?`, [[1, '/', k, 0], [1, '*', k, 0], [1, '-', k, 0], [1, '+', k, 0]].map((e) => ({ text: eqLead(e, s), e })), pairsOf('*', k, X6), true, {
              explain: `${jo(c.B, '은/는')} ${c.A}의 ${k}배이므로 ${jo(c.B, '을/를')} ${josa(k, '으로/로')} 나누면 ${jo(c.A, '이/가')} 된다. ${eqLead([1, '/', k, 0], s)}`
            });
          }),
          T('ex-tb-mul', '기호 표에 알맞은 식(몇 배)', '①22·24 ②31·36 ③48 심17', (d) => {
            // 틀린 보기: 첫 짝만 맞는 덧셈식(2와 4: 2배와 2 더하기), 두 양의 자리를 바꾼 것, 나눗셈으로 쓴 것
            const [a0, k] = d.pick([[1, 3], [2, 2], [2, 3], [1, 4], [3, 2], [2, 4]]), s = d.pick(SYMS), pairs = pairsOf('*', k, range(4, a0)), trap = a0 * (k - 1);
            return choose(d, `표를 보고 ${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '*', k, 1], [0, '+', trap, 1], [1, '*', k, 0], [0, '/', k, 1]].map((e) => ({ text: eq(e, s), e })), pairs, true, {
              figure: tableOf([[s[0]].concat(pairs.map((p) => p[0])), [s[1]].concat(pairs.map((p) => p[1]))]),
              explain: `${pairs.map((p) => `${p[0]} × ${k} = ${p[1]}`).join(', ')}이다. ${eqj([0, '+', trap, 1], s, '은/는')} 첫 칸에만 맞고 둘째 칸에서 ${pairs[1][0]} + ${trap} = ${josa(pairs[1][0] + trap, '으로/로')} 맞지 않는다.`
            });
          }),
          T('ex-tb-add', '기호 표에 알맞은 식(더하기)', '①25 ②30·36 ③48 심20·31', (d) => {
            // 틀린 보기: 첫 짝만 맞는 곱셈식(1과 5: 5배와 4 더하기), 두 양의 자리를 바꾼 것, 뺄셈으로 쓴 것
            const [a0, k] = d.pick([[1, 2], [1, 3], [1, 4], [2, 2], [2, 4], [3, 3]]), s = d.pick(SYMS), pairs = pairsOf('+', k, range(5, a0)), m = (a0 + k) / a0;
            return choose(d, `${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 나타낸 표이다. 이 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '+', k, 1], [0, '*', m, 1], [1, '+', k, 0], [0, '-', k, 1]].map((e) => ({ text: eq(e, s), e })), pairs, true, {
              figure: tableOf([[s[0]].concat(pairs.map((p) => p[0])), [s[1]].concat(pairs.map((p) => p[1]))]),
              explain: `${pairs.slice(0, 3).map((p) => `${p[0]} + ${k} = ${p[1]}`).join(', ')}이다. ${eqj([0, '*', m, 1], s, '은/는')} 첫 칸에만 맞고 둘째 칸에서 ${pairs[1][0]} × ${m} = ${josa(pairs[1][0] * m, '으로/로')} 맞지 않는다.`
            });
          }),
          T('ex-tb-div', '윗줄이 큰 표에 알맞은 식', '①22·24 ②31 심19', (d) => {
            // 틀린 보기: 곱셈으로 쓴 것, 첫 짝만 맞는 뺄셈식, 두 양의 자리를 바꾼 것
            const k = d.pick([3, 4, 6, 7, 8]), b0 = d.pick([2, 3]), s = d.pick(SYMS), pairs = range(4, b0).map((b) => [k * b, b]), trap = k * b0 - b0;
            return choose(d, `윗줄의 수가 아랫줄의 수보다 큰 표이다. ${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '/', k, 1], [0, '*', k, 1], [0, '-', trap, 1], [1, '/', k, 0]].map((e) => ({ text: eq(e, s), e })), pairs, true, {
              figure: tableOf([[s[0]].concat(pairs.map((p) => p[0])), [s[1]].concat(pairs.map((p) => p[1]))]),
              explain: `${pairs.slice(0, 3).map((p) => `${p[0]} ÷ ${k} = ${p[1]}`).join(', ')}이다. ${eqj([0, '-', trap, 1], s, '은/는')} 첫 칸에만 맞는다.`
            });
          }),
          T('ex-tb-sub', '기호 표에 알맞은 식(빼기)', '①27 ②30 ③46', (d) => {
            // 틀린 보기: 첫 짝만 맞는 나눗셈식(5와 1: 5로 나누기와 4 빼기), 뺀 수를 더한 것, 두 양의 자리를 바꾼 것
            const k = d.int(3, 7), s = d.pick(SYMS), pairs = pairsOf('-', k, range(5, k + 1));
            return choose(d, `표에서 ${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 찾아 식으로 바르게 나타낸 것은?`, [[0, '-', k, 1], [0, '/', k + 1, 1], [0, '+', k, 1], [1, '-', k, 0]].map((e) => ({ text: eq(e, s), e })), pairs, true, {
              figure: tableOf([[s[0]].concat(pairs.map((p) => p[0])), [s[1]].concat(pairs.map((p) => p[1]))]),
              explain: `${pairs.slice(0, 3).map((p) => `${p[0]} − ${k} = ${p[1]}`).join(', ')}이다. ${eqj([0, '/', k + 1, 1], s, '은/는')} 첫 칸에만 맞는다.`
            });
          }),
          T('ex-skip-add', '건너뛴 표에 알맞은 식(더하기)', '①25 ②30 심20', (d) => {
            // 틀린 보기: 옆 칸과의 차(건너뛴 수)를 더한 것, 건너뛴 수를 곱한 것, 두 양의 자리를 바꾼 것
            const [g, k] = d.pick([[3, 5], [3, 7], [2, 5], [2, 7], [4, 6], [4, 9]]), s = d.pick(SYMS), pairs = pairsOf('+', k, range(4, 1).map((i) => g * i));
            return choose(d, `윗줄의 수를 ${g}씩 건너뛰어 적은 표이다. ${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '+', k, 1], [0, '+', g, 1], [0, '*', g, 1], [1, '+', k, 0]].map((e) => ({ text: eq(e, s), e })), pairs, true, {
              figure: tableOf([[s[0]].concat(pairs.map((p) => p[0])), [s[1]].concat(pairs.map((p) => p[1]))]),
              explain: `위아래로 짝 지은 두 수의 차가 ${pairs.slice(0, 3).map((p) => `${p[1]} − ${p[0]} = ${k}`).join(', ')}${josa(k, '으로/로').slice(String(k).length)} 늘 같다. ${josa(g, '은/는')} 옆 칸과의 차이지 두 양 사이의 관계가 아니다.`
            });
          }),
          T('ex-num-blank', '기호 식의 빈칸에 알맞은 수', '①23 ②30 ③46 심21', (d) => {
            const s = d.pick(SYMS), k = d.int(4, 8), a = d.int(k + 2, k + 6), xs = [a, a + 2, a + 5, a + 6];
            return N(`표를 보고 ${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 식으로 나타낼 때 ㉠에 알맞은 수는?`, k, {
              figure: tableOf([[s[0]].concat(xs), [s[1]].concat(xs.map((x) => x - k))]) + lines([`${s[1]} = ${s[0]} − ${box(LABELS[0])}`]),
              explain: `${xs.slice(0, 3).map((x) => `${x} − ${x - k} = ${k}`).join(', ')}이므로 ${s[1]} = ${s[0]} − ${k}이다.`, facts: { calc: [[`${xs[0]}-${xs[0] - k}`, 0]] }
            });
          }),
          T('ex-same-add', '같은 관계를 나타낸 다른 식(더하기)', '①20 ③47 심20', (d) => {
            const s = d.pick(SYMS), k = d.int(3, 9);
            return choose(d, `두 양 ${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 ${eqj([0, '+', k, 1], s, '으로/로')} 나타냈다. 같은 대응 관계를 나타낸 식은?`, [[1, '-', k, 0], [0, '-', k, 1], [1, '+', k, 0], [1, '*', k, 0]].map((e) => ({ text: eq(e, s), e })), pairsOf('+', k, X6), true, {
              explain: `${s[0]}에 ${josa(k, '을/를')} 더하여 ${jo(s[1], '이/가')} 되면, ${s[1]}에서 ${josa(k, '을/를')} 빼면 ${jo(s[0], '이/가')} 된다. ${s[0]} = 1일 때 ${s[1]} = ${1 + k}이고 ${1 + k} − ${k} = 1이다.`
            });
          }),
          T('ex-same-mul', '같은 관계를 나타낸 다른 식(몇 배)', '①20 ③47', (d) => {
            const s = d.pick(SYMS), k = d.int(3, 9);
            return choose(d, `두 양 ${jo(s[0], '과/와')} ${s[1]} 사이의 대응 관계를 ${eqj([0, '*', k, 1], s, '으로/로')} 나타냈다. 같은 대응 관계를 나타낸 식은?`, [[1, '/', k, 0], [0, '/', k, 1], [1, '*', k, 0], [1, '-', k, 0]].map((e) => ({ text: eq(e, s), e })), pairsOf('*', k, X6), true, {
              explain: `${s[0]}에 ${josa(k, '을/를')} 곱하여 ${jo(s[1], '이/가')} 되면, ${jo(s[1], '을/를')} ${josa(k, '으로/로')} 나누면 ${jo(s[0], '이/가')} 된다. ${s[0]} = 2일 때 ${s[1]} = ${2 * k}이고 ${2 * k} ÷ ${k} = 2이다.`
            });
          }),
          T('ex-time', '알맞은 식(두 도시의 시각)', '①27 ②28', (d) => {
            // 틀린 보기: 느린 쪽에 더한 것, 두 양의 자리를 바꾼 것, 시각의 차를 곱한 것
            const [city, gap] = d.pick([['방콕', 2], ['하노이', 2], ['두바이', 5]]), h = d.int(gap + 2, 8), s = d.pick(SYMS);
            return choose(d, `서울이 오후 ${h}시일 때 ${jo(city, '은/는')} 같은 날 오후 ${h - gap}시이다. 두 도시가 모두 오후일 때, 서울의 시각을 오후 ${s[0]}시, ${city}의 시각을 오후 ${s[1]}시라고 하면 두 양 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '-', gap, 1], [0, '+', gap, 1], [1, '-', gap, 0], [0, '*', gap, 1]].map((e) => ({ text: eq(e, s), e })), range(3).map((i) => [h + i, h + i - gap]), true, {
              explain: `${city}의 시각은 서울의 시각보다 ${h} − ${h - gap} = ${gap}(시간) 느리다. 서울의 시각에서 ${josa(gap, '을/를')} 빼면 ${city}의 시각이 되므로 ${eq([0, '-', gap, 1], s)}이다.`
            });
          }),
          T('ex-three-ages', '세 사람 가운데 두 사람의 나이에 알맞은 식', '②12 심30·51', (d) => {
            // 틀린 보기: 다른 사람과의 나이 차를 쓴 것, 두 양의 자리를 바꾼 것
            const child = d.pick(NAMES), c = d.int(10, 13), mom = c + d.int(27, 31), dad = mom + d.int(2, 4), s = d.pick(SYMS), k = dad - c;
            return choose(d, `올해 아버지는 ${dad}살, 어머니는 ${mom}살, ${name(child, '은/는')} ${c}살이다. ${nick(child)}의 나이를 ${s[0]}, 아버지의 나이를 ${jo(s[1], '이라고/라고')} 할 때, 두 양 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '+', k, 1], [0, '+', mom - c, 1], [0, '+', dad - mom, 1], [1, '+', k, 0]].map((e) => ({ text: eq(e, s), e })), [[c, dad], [c + 1, dad + 1], [c + 4, dad + 4]], true, {
              explain: `아버지와 ${nick(child)}의 나이의 차는 ${dad} − ${c} = ${k}(살)로 변하지 않는다. ${eq([0, '+', k, 1], s)}이다. ${josa(mom - c, '은/는')} 어머니와 ${nick(child)}의 나이의 차이다.`
            });
          }),
          T('ex-add-not', '잘못 나타낸 식(더하기)', '①33 ③50 심30', (d) => {
            const p = d.pick(NAMES), k = d.int(2, 6), s = d.pick(SYMS);
            return choose(d, `${name(p, '은/는')} 동생보다 ${k}살 많다. 동생의 나이를 ${s[0]}, ${nick(p)}의 나이를 ${jo(s[1], '이라고/라고')} 할 때, 두 양 사이의 대응 관계를 잘못 나타낸 식은?`, [{ text: eq([0, '+', k, 1], s), e: [0, '+', k, 1] }, { text: eq([1, '-', k, 0], s), e: [1, '-', k, 0] }, { text: eqLead([0, '+', k, 1], s), e: [0, '+', k, 1] }, { text: eq([1, '+', k, 0], s), e: [1, '+', k, 0] }], pairsOf('+', k, [5, 6, 7, 8]), false, {
              explain: `${nick(p)}의 나이 ${jo(s[1], '이/가')} 동생의 나이 ${s[0]}보다 ${k}만큼 더 크다. ${eqj([1, '+', k, 0], s, '은/는')} 동생이 ${k}살 더 많다는 식이다.`
            });
          }),
          T('ex-year', '알맞은 식(연도와 나이)', '①27 ②28·37 심24', (d) => {
            // 틀린 보기: 두 양의 자리를 바꾼 것, 글에 나온 연도를 그대로 더한 것, 연도에 더한 것을 나이에서 뺀 것
            const child = d.pick(NAMES), y = d.int(2024, 2027), a = d.int(10, 13), base = y - a, s = d.pick(SYMS);
            return choose(d, `${y}년에 ${name(child, '은/는')} ${a}살이다. ${nick(child)}의 나이를 ${s[0]}, 연도를 ${jo(s[1], '이라고/라고')} 할 때, 두 양 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '+', base, 1], [1, '+', base, 0], [0, '+', y, 1], [0, '-', base, 1]].map((e) => ({ text: eq(e, s), e })), [[a, y], [a + 1, y + 1], [a + 2, y + 2]], true, {
              explain: `연도와 나이의 차는 ${y} − ${a} = ${josa(base, '으로/로')} 변하지 않는다. 나이에 ${josa(base, '을/를')} 더하면 연도가 되므로 ${eq([0, '+', base, 1], s)}이다.`
            });
          }),
          T('ex-cut', '알맞은 식(자른 횟수와 도막의 수)', '①26 ②27 ③32 심20', (d) => {
            // 틀린 보기: 첫 그림(1번에 2도막)만 보고 2배로 쓴 것, 하나 적다고 본 것, 두 양의 자리를 바꾼 것
            const s = d.pick(SYMS), list = [1, 2, 3];
            return choose(d, `끈 한 개를 그림과 같이 잘랐다. 자른 횟수를 ${s[0]}, 도막의 수를 ${jo(s[1], '이라고/라고')} 할 때, 두 양 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '+', 1, 1], [0, '*', 2, 1], [0, '-', 1, 1], [1, '+', 1, 0]].map((e) => ({ text: eq(e, s), e })), list.map((n) => [n, n + 1]), true, {
              figure: cutFig(list), explain: `1번 자르면 2도막, 2번 자르면 3도막, 3번 자르면 4도막이다. 도막의 수는 자른 횟수보다 1만큼 더 크므로 ${eq([0, '+', 1, 1], s)}이다.`
            });
          }),
          T('ex-pic-mul', '배열에 알맞은 식(몇 배)', '①22 ②26 ③43 심17', (d) => {
            const k = d.pick([2, 3]), s = d.pick(PLAIN_SYMS), shapes = range(3, 1).map((n) => shape(cols(n, k, 's', 't')));
            return choose(d, `규칙에 따라 사각형과 삼각형을 늘어놓았다. 사각형의 수를 ${s[0]}, 삼각형의 수를 ${jo(s[1], '이라고/라고')} 할 때, 두 양 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '*', k, 1], [0, '+', k - 1, 1], [1, '*', k, 0], [0, '/', k, 1]].map((e) => ({ text: eq(e, s), e })), shapes.map((sh) => [sh.n('s'), sh.n('t')]), true, {
              figure: steps(shapes, ORD, told(shapes, ORD)), explain: `사각형이 1개, 2개, 3개일 때 삼각형은 ${k}개, ${2 * k}개, ${3 * k}개이다. 삼각형의 수는 사각형의 수의 ${k}배이므로 ${eq([0, '*', k, 1], s)}이다.`
            });
          }),
          T('ex-pic-add', '배열에 알맞은 식(더하기)', '①26 ②27 ③45 심20', (d) => {
            const k = d.pick([2, 3]), s = d.pick(PLAIN_SYMS), shapes = range(3, 1).map((n) => shape(twoRows(n, k, 'k', 'w')));
            return choose(d, `규칙에 따라 바둑돌을 늘어놓았다. 검은 바둑돌의 수를 ${s[0]}, 흰 바둑돌의 수를 ${jo(s[1], '이라고/라고')} 할 때, 두 양 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '+', k, 1], [0, '*', k + 1, 1], [1, '+', k, 0], [0, '-', k, 1]].map((e) => ({ text: eq(e, s), e })), shapes.map((sh) => [sh.n('k'), sh.n('w')]), true, {
              figure: steps(shapes, ORD, told(shapes, ORD)), explain: `검은 바둑돌이 1개, 2개, 3개일 때 흰 바둑돌은 ${1 + k}개, ${2 + k}개, ${3 + k}개이다. 흰 바둑돌의 수는 검은 바둑돌의 수보다 ${k}만큼 더 크므로 ${eq([0, '+', k, 1], s)}이다.`
            });
          }),
          T('ex-pic-order', '배열 순서와 바둑돌의 수에 알맞은 식', '①22 ②26·34 ③37', (d) => {
            // 틀린 보기: 첫째 모양만 맞는 덧셈식, 두 양의 자리를 바꾼 것, 나눗셈으로 쓴 것
            const k = d.pick([3, 4]), s = d.pick(PLAIN_SYMS), names = range(3, 1).map((i) => i + '번째'), shapes = range(3, 1).map((n) => shape(block(k, n, 'w')));
            return choose(d, `규칙에 따라 흰 바둑돌을 늘어놓았다. 배열 순서를 ${s[0]}, 흰 바둑돌의 수를 ${jo(s[1], '이라고/라고')} 할 때, 두 양 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '*', k, 1], [0, '+', k - 1, 1], [1, '*', k, 0], [0, '/', k, 1]].map((e) => ({ text: eq(e, s), e })), shapes.map((sh, i) => [i + 1, sh.n('w')]), true, {
              figure: steps(shapes, names, told(shapes, names)), explain: `배열 순서가 1, 2, 3일 때 흰 바둑돌은 ${k}개, ${2 * k}개, ${3 * k}개이다. 흰 바둑돌의 수는 배열 순서의 ${k}배이므로 ${eq([0, '*', k, 1], s)}이다.`
            });
          }),
          T('ex-symbol-mean', '식에서 기호가 나타내는 양', '①52 ③53 심33', (d) => {
            // 곱셈식에서는 곱해지는 쪽이 작은 양, 나눗셈식에서는 나누어지는 쪽이 큰 양이다.
            const c = d.pick([PACK[0], PACK[1], PACK[5], PACK[6]])(d.int(3, 9)), k = c.k, s = d.pick(SYMS), swap = d.bool(), names = swap ? [s[1], s[0]] : s, e = d.bool() ? [0, '*', k, 1] : [1, '/', k, 0], at = d.int(0, 1);
            const rows = d.shuffle([[c.A, at === 0], [c.B, at === 1], [`${c.a} 한 개에 든 ${c.b}의 수`, false]]);
            return C(`${c.text} 이 대응 관계를 ${eqj(e, names, '으로/로')} 나타냈다. ${jo(names[at], '이/가')} 나타내는 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              explain: `${c.A}에 ${josa(k, '을/를')} 곱하면 ${jo(c.B, '이/가')} 된다. ${eq(e, names)}에서 ${jo(names[0], '은/는')} ${c.A}, ${jo(names[1], '은/는')} ${jo(c.B, '을/를')} 나타낸다.`, facts: truthOf(rows, true)
            });
          }),
          T('ex-match', '식에 알맞은 표', '①34 ②38 심31', (d) => {
            // 세 표의 첫 칸이 닮았다(1 → k 가 둘). 둘째 칸부터 넣어 보아야 가려진다.
            const k = d.pick([4, 5, 6]), s = d.pick(SYMS), names = ['가', '나', '다'], op = d.pick(['*', '+']), e = [0, op, k, 1];
            const kinds = d.shuffle([['*', k], ['+', k], ['+', k - 1]]), rowsOf = ([o, n]) => [1, 2, 3, 4].map((a) => ev(a, o, n));
            return C(`${eqj(e, s, '을/를')} 나타낸 표는?`, names, kinds.findIndex(([o, n]) => o === op && n === k), {
              figure: G.tiles(kinds.map((kind, i) => [names[i], tableOf([[s[0], 1, 2, 3, 4], [s[1]].concat(rowsOf(kind))])])),
              explain: `${s[0]}에 2를 넣으면 ${s[1]} = 2 ${S[op]} ${k} = ${ev(2, op, k)}, 3을 넣으면 ${ev(3, op, k)}이다. 둘째 칸이 ${ev(2, op, k)}, 셋째 칸이 ${ev(3, op, k)}인 표를 찾는다.`,
              facts: { choose: { exprs: kinds.map((kind) => String(rowsOf(kind)[2])), rule: 'equals', target: ev(3, op, k) } }
            });
          }),
          T('ex-two-pairs', '한 글에 든 두 쌍을 가려 식 고르기', '①30 심43', (d) => {
            // 틀린 보기: 다른 쌍의 수를 쓴 것, 두 양의 자리를 바꾼 것, 곱하지 않고 더한 것
            const [p, q] = d.pick([[8, 4], [6, 4], [8, 5], [6, 3], [5, 3]]), s = d.pick(SYMS);
            return choose(d, `둥근 탁자 한 개에는 의자가 ${p}개씩, 네모난 탁자 한 개에는 접시가 ${q}개씩 놓여 있다. 네모난 탁자의 수를 ${s[0]}, 접시의 수를 ${jo(s[1], '이라고/라고')} 할 때, 두 양 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '*', q, 1], [0, '*', p, 1], [1, '*', q, 0], [0, '+', q, 1]].map((e) => ({ text: eq(e, s), e })), pairsOf('*', q, X6), true, {
              explain: `접시는 네모난 탁자 한 개에 ${q}개씩 놓여 있다. 접시의 수는 네모난 탁자의 수의 ${q}배이므로 ${eq([0, '*', q, 1], s)}이다. ${josa(p, '은/는')} 둥근 탁자와 의자 사이의 관계에 쓰는 수이다.`
            });
          }),
          T('ex-changed', '조건을 바꾼 뒤의 식', '①21 ②42 ③43', (d) => {
            // 큰 쪽의 양(과자의 수)을 먼저 부른다. 틀린 보기: 바꾸기 전의 수를 쓴 것, 더 넣은 수만 더한 것, 두 양의 자리를 바꾼 것
            const k = d.int(5, 9), m = d.pick([1, 2]), s = d.pick(SYMS);
            return choose(d, `과자를 한 봉지에 ${k}개씩 담았다가, 봉지마다 과자를 ${m}개씩 더 넣어 다시 포장하였다. 다시 포장한 뒤 과자의 수를 ${s[1]}, 봉지의 수를 ${jo(s[0], '이라고/라고')} 할 때, 두 양 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '*', k + m, 1], [0, '*', k, 1], [0, '+', m, 1], [1, '*', k + m, 0]].map((e) => ({ text: eq(e, s), e })), pairsOf('*', k + m, X6), true, {
              explain: `다시 포장한 뒤에는 한 봉지에 ${k} + ${m} = ${k + m}(개)씩 들어 있다. 과자의 수는 봉지의 수의 ${k + m}배이므로 ${eq([0, '*', k + m, 1], s)}이다.`
            });
          }),
          T('ex-talk', '말한 수와 답한 수에 알맞은 식', '①42 ②32·33 ③44 심20', (d) => {
            // 틀린 보기: 한 쌍(k → 2k)만 맞는 곱셈식, 더하지 않고 뺀 것, 두 양의 자리를 바꾼 것
            const [p, q] = d.shuffle(NAMES).slice(0, 2), k = d.pick([4, 5, 6, 8]), s = d.pick(SYMS), xs = [k + 2, k, 2 * k];
            return choose(d, `${name(p, '이/가')} ${josa(xs[0], '이라고/라고')} 말하면 ${name(q, '은/는')} ${xs[0] + k}, ${josa(xs[1], '이라고/라고')} 말하면 ${xs[1] + k}, ${josa(xs[2], '이라고/라고')} 말하면 ${josa(xs[2] + k, '이라고/라고')} 답한다. ${name(p, '이/가')} 말한 수를 ${s[0]}, ${name(q, '이/가')} 답한 수를 ${jo(s[1], '이라고/라고')} 할 때, 두 양 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '+', k, 1], [0, '*', 2, 1], [0, '-', k, 1], [1, '+', k, 0]].map((e) => ({ text: eq(e, s), e })), pairsOf('+', k, xs), true, {
              explain: `${xs.map((x) => `${x} + ${k} = ${x + k}`).join(', ')}이므로 말한 수에 ${josa(k, '을/를')} 더한 수를 답한다. ${eqj([0, '*', 2, 1], s, '은/는')} ${josa(k, '을/를')} 말했을 때에만 맞는다.`
            });
          }),
          T('ex-talk-div', '말한 수와 답한 수에 알맞은 식(나누기)', '①42 ②33', (d) => {
            // 틀린 보기: 첫 쌍만 맞는 뺄셈식, 나누지 않고 곱한 것, 두 양의 자리를 바꾼 것
            const [p, q] = d.shuffle(NAMES).slice(0, 2), k = d.pick([2, 3, 4]), s = d.pick(SYMS), xs = [6, 10, 18].map((v) => v * k), trap = xs[0] - xs[0] / k;
            return choose(d, `${name(p, '이/가')} 수를 말하면 ${name(q, '은/는')} 규칙에 따라 답한다. ${josa(xs[0], '을/를')} 말하면 ${xs[0] / k}, ${josa(xs[1], '을/를')} 말하면 ${xs[1] / k}, ${josa(xs[2], '을/를')} 말하면 ${josa(xs[2] / k, '을/를')} 답한다. ${name(p, '이/가')} 말한 수를 ${s[0]}, ${name(q, '이/가')} 답한 수를 ${jo(s[1], '이라고/라고')} 할 때, ${jo(s[1], '을/를')} 구하는 식으로 알맞은 것은?`, [[0, '/', k, 1], [0, '-', trap, 1], [0, '*', k, 1], [1, '/', k, 0]].map((e) => ({ text: eqLead(e, s), e })), xs.map((x) => [x, x / k]), true, {
              explain: `${xs.map((x) => `${x} ÷ ${k} = ${x / k}`).join(', ')}이므로 말한 수를 ${josa(k, '으로/로')} 나눈 몫을 답한다. ${xs[0]} − ${trap} = ${josa(xs[0] / k, '은/는')} 첫 쌍에만 맞는다.`
            });
          }),
          T('ex-rename', '기호를 바꾸어 나타낸 식', '③54 심34', (d) => {
            // 기호는 양을 나타내는 이름일 뿐이다. 기호를 바꾸어도 두 양 사이의 관계는 그대로다.
            const [a, b, op, k] = d.pick([['연필', '지우개', '+', 3], ['공책', '색연필', '+', 5], ['접시', '과자', '*', 6], ['상자', '구슬', '*', 8]]), s = ['□', '△'], t = d.pick([['○', '☆'], ['◇', '♡'], ['♡', '◇']]), other = op === '+' ? '*' : '+';
            return choose(d, `${a}의 수를 ${s[0]}, ${b}의 수를 ${jo(s[1], '이라고/라고')} 할 때 두 양 사이의 대응 관계는 ${eq([0, op, k, 1], s)}이다. 기호를 바꾸어 ${a}의 수를 ${t[0]}, ${b}의 수를 ${jo(t[1], '이라고/라고')} 할 때, 같은 대응 관계를 나타낸 식은?`, [[0, op, k, 1], [1, op, k, 0], [0, other, k, 1], [0, op === '+' ? '-' : '/', k, 1]].map((e) => ({ text: eq(e, t), e })), pairsOf(op, k, X6), true, {
              explain: `기호를 바꾸어도 ${a}의 수와 ${b}의 수 사이의 관계는 변하지 않는다. ${s[0]} 자리에 ${t[0]}, ${s[1]} 자리에 ${jo(t[1], '을/를')} 쓰면 ${eq([0, op, k, 1], t)}이다.`
            });
          }),
          T('ex-sum', '알맞은 식(합이 일정)', '심26', (d) => {
            // 틀린 보기: 두 양의 차가 전체라고 본 것, 한 양에 전체를 더한 것
            const [p, q] = d.shuffle(NAMES).slice(0, 2), total = d.pick([20, 24, 30, 36]), s = d.pick(SYMS), x = d.int(3, total / 2 - 2), y = total - x, lead = d.bool();
            const list = [lead ? { text: `${s[0]} = ${total} − ${s[1]}`, ok: true, claim: [`${total}-${y}`, x] } : { text: `${s[0]} + ${s[1]} = ${total}`, ok: true, claim: [`${x}+${y}`, total] },
              { text: `${s[1]} − ${s[0]} = ${total}`, ok: false, claim: [`${y}-${x}`, total] }, { text: `${s[0]} + ${total} = ${s[1]}`, ok: false, claim: [`${x}+${total}`, y] }, { text: `${s[1]} + ${total} = ${s[0]}`, ok: false, claim: [`${y}+${total}`, x] }];
            const j = judge(d.shuffle(list), null, true);
            return C(`붙임딱지 ${total}장을 ${josa(nick(p), '과/와')} ${name(q, '이/가')} 남김없이 나누어 가진다. ${name(p, '이/가')} 가진 수를 ${s[0]}, ${name(q, '이/가')} 가진 수를 ${jo(s[1], '이라고/라고')} 할 때, 두 양 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, j.options, j.answer, {
              explain: `${name(p, '이/가')} ${x}장을 가지면 ${name(q, '은/는')} ${y}장을 가진다. 두 사람이 가진 수의 합은 늘 ${total}이므로 ${s[0]} + ${s[1]} = ${total}, ${s[0]} = ${total} − ${s[1]}이다.`, facts: j.facts
            });
          }),
          T('ex-save', '알맞은 식(먼저 저금한 돈)', '②24·29 심25', (d) => {
            // 틀린 보기: 첫 주에만 맞는 곱셈식, 매주 저금하는 돈을 더한 것, 두 양의 자리를 바꾼 것
            const [p, q] = d.shuffle(NAMES).slice(0, 2), first = d.pick([2000, 3000, 4000]), s = d.pick(SYMS), pairs = [1, 2, 3, 4].map((w) => [1000 * w, first + 1000 * w]);
            return choose(d, `${name(p, '은/는')} ${first}원을 먼저 저금하였고, 다음 주부터 ${josa(nick(p), '과/와')} ${name(q, '은/는')} 일주일에 1000원씩 저금한다. ${name(q, '이/가')} 모은 돈을 ${s[0]}원, ${name(p, '이/가')} 모은 돈을 ${s[1]}원이라고 할 때, 두 양 사이의 대응 관계를 식으로 바르게 나타낸 것은?`, [[0, '+', first, 1], [0, '*', first / 1000 + 1, 1], [0, '+', 1000, 1], [1, '+', first, 0]].map((e) => ({ text: eq(e, s), e })), pairs, true, {
              explain: `두 사람이 똑같이 1000원씩 저금하므로 ${name(p, '이/가')} 모은 돈은 ${name(q, '이/가')} 모은 돈보다 늘 ${first}원 많다. ${eqj([0, '*', first / 1000 + 1, 1], s, '은/는')} 첫 주(1000원과 ${first + 1000}원)에만 맞는다.`
            });
          })
        ]
      },
      { id: 'value', title: '대응 관계로 수 구하기', standard: STD, types: [] },
      { id: 'read', title: '식을 읽고 상황 찾기', standard: STD, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
