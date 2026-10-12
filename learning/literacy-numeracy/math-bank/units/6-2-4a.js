// 6학년 2학기 4단원 비례식과 비례배분 — 단원 틀, 세 파일이 함께 쓰는 도구(B.kit.r624), 기본 문항(비의 성질, 간단한 자연수의 비로 나타내기).
// 수집해 둔 교과서 8종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 71·81·76꼴, 심화꼴 65꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/6-2-4/싣기_대조표.md 에 있다.
// (비례식, 비례식의 성질, 비례식의 활용은 6-2-4b.js 에, 비례배분과 실력 문항은 6-2-4c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
// 영역은 변화와 관계, 성취기준은 6수02-04(비례식을 알고, 그 성질을 이해하며, 이를 활용하여 간단한 비례식을 풀 수 있다)와 6수02-05(비례배분을 알고, 주어진 양을 비례배분 할 수 있다)이다.
//
// 싣는 기준
//  - 싣는 것: 비의 성질로 비율이 같은 비 만들기, 가장 간단한 자연수의 비로 나타내기(자연수·소수·분수·섞인 비, 과정의 빈칸과 답), 비례식 가려내기,
//    비례식의 성질(외항의 곱 = 내항의 곱)로 □ 구하기, 비례식을 한 번 세워 푸는 문장제, 두 쪽으로 나누는 비례배분.
//  - 「간단한 비례식」: 모르는 수는 하나이고 분수·소수는 한 겹뿐이다. 한 항이 식(□ − 2)인 비례식, 분수·소수가 겹친 비례식, 조건 여럿으로 빈 항 셋을 채우는 비례식은 싣지 않는다.
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·화살표 틀·표·그림·문장), 묻는 것(값·빈칸·고르기·짝), 수의 갈래(자연수·소수·분수·섞인 것), 식의 꼴(□가 외항인가 내항인가),
//    문장제의 얼개(비와 한쪽 양 / 짝 지어진 두 양 / 앞의 양을 거꾸로 / 단위 바꾸기)가 다르면 따로 싣는다. 수나 상황만 다른 것은 한 번만 싣는다
//    (얼개가 같은 상황은 한 유형 안에서 하나가 뽑힌다 — 값과 개수·톱니바퀴의 회전수·높이와 그림자, 관람객·나무·책·섞어 만든 음료).
//  - 답이 하나가 되게 묻는다: 「가장 간단한 자연수의 비」라고 밝히고 답 칸은 「□ : □」이다. 비율이 같은 비를 아무것이나 쓰는 꼴은 빈칸 하나를 채우는 꼴로 바꾸었다.
//  - 낱말: 교과서가 쓰는 전항·후항·외항·내항을 문항의 글에 쓴다. 이 낱말은 교육과정의 용어 목록(비, 기준량, 비교하는 양, 비율, 백분율, 비례식, 비례배분)에 없으므로
//    이름 자체를 묻는 문항은 기본에 두 유형(term-outer, term-both)만 두고 실력에는 두지 않는다.
//  - 답과 참·거짓은 모두 코드로 셈한다. 소수는 소수점을 뗀 자연수와 10의 거듭제곱으로, 분수는 분자와 분모로 셈한 뒤 글로 적는다(뜬 소수 오차를 막는다).
//    꼴 목록에 적힌 원문 답지의 잘못(천재 수행 평가 02차시 등)은 따르지 않았다.
//  - 서술형은 고르기·빈칸으로 바꾸었다: 까닭 쓰기 → 두 곱을 바르게 말한 것 고르기, 비례식 세우기 → 바르게 세운 식 고르기·식의 빈칸, 두 가지 방법으로 쓰기 → 방법마다 과정의 빈칸.
//
// 뺀 것과 까닭(세 파일의 것을 여기에 모아 적는다)
//  - 중학교: 맞물린 톱니바퀴의 톱니 수와 회전수(반비례 — ②26 심46. 회전수끼리만 견주는 것은 실었다), 한 항이 식인 비례식(①43 심32),
//    「가의 몇과 나의 몇이 같다」에서 가 : 나 구하기와 곱셈식을 비례식으로 뒤집기(①33 ②57 심48), 햇빛의 각과 지구 둘레(②58)
//  - 「간단한 비례식」을 넘는 것: 분수·소수가 겹치거나 분수 속에 모르는 수가 든 것(①18의 셋째 ③24·39의 일부 심15, 심31·35의 변형),
//    비율과 곱·항의 자리 같은 조건 여럿으로 비례식 완성하기(①31 ②45 ③31·44 심36·37), 곱의 배수 조건에서 가장 큰 수(②46 ③43)
//  - 넓이 셈이 일의 대부분인 것: 두 도형의 넓이의 비(①22 ②25 ③21 심52), 비례식·비례배분 뒤 넓이 구하기(①53·66 ③55·67·68 심49·51, ②71·심59의 넓이 변형)
//  - 일의 양·빨라지는(늦어지는) 시계·속력을 여러 단계로 엮은 것(심19·20·47 ③54, 심17의 속력 변형, ③61의 마주 달리기)
//  - 조건 풀이·경우 따지기가 어려움의 대부분인 것: 수 카드로 비례식 만들기(①32 ②36·37 심38, ③32의 넉 장 — 두 장으로 비율이 같은 비 하나를 만드는 것만 실었다),
//    범위에 드는 비의 개수 세기(②10 — 범위에 드는 비가 하나뿐인 꼴로 바꾸어 실었다), 합과 차로 두 수를 구해 비로 나타내기(심18),
//    한쪽만 늘어 비가 바뀌는 것·같은 돈을 쓰고 남은 돈의 비·전체는 그대로이고 비가 바뀌는 것(②74 심64·65), 주어진 비가 되도록 옮기기(③71),
//    비례배분 뒤 다시 비례식(②73), 이익에서 전체 이익을 거꾸로 구하는 세 단계(심61의 대표), 층 사이의 수 세기(심41의 변형)
//  - 뜻 없는 셈: 두 비례식의 답끼리 더하고 곱하기(①40 ③40의 변형 심26의 변형, ②7·42·44의 합·차 — 빈칸은 하나씩 묻는다), 비례배분을 두 번 해서 더하기(②72)
//  - 6-1의 일: 비율 견주기(③56 — 비례식 두 번을 따로 풀어 누가 더 많은지 견준다)
//  - 서술형·작도·열린 답·놀이: 방법·까닭 쓰기(①15·36·67 ②38·55·75 ③70과 여러 꼴의 「쓰기」 변형 심22·29), 그리기(①8 ②59 ③11의 변형), 문제 만들기, 색칠·주사위·카드 놀이(②80·81)
//  - 용어 묻기는 두 유형만 싣고 나머지는 뺐다(①70·71 ②79 ③75·76 심29, ①68 ②76 ③73 심27의 「전항·후항 쓰기」는 term-both 가 대신한다).
//  - 같은 문제여서 한 번만 실은 것: 화살표 대신 =로 적은 비의 성질(①29 ②30 ③28 — 화살표 틀·비례식의 □와 같다), 잇기(①17·56 ②15 ③4의 변형 — 짝 고르기 하나와 같다),
//    한쪽 양을 구한 뒤 더해 전체 구하기(①52 ②54 — 한쪽 몫에서 전체 구하기와 얼개가 같다), 사람 수·일한 시간의 비로 나누기(①59 ②66 ③63 — 낸 돈의 비로 나누기와 얼개가 같다),
//    두 정삼각형의 둘레를 나눈 뒤 한 변 구하기(②71 — 비례배분 뒤 나눗셈 한 번), 시곗바늘이 도는 바퀴 수·줄인 그림(③53 심42 — 짝 지어진 두 양과 같다)
//  - 그림이 필요해 미룬 것은 없다. 변의 길이를 적은 직사각형(rect), 화살표 틀(flow), 두 줄 수직선(6-2-4b.js 의 twin)은 단원 파일의 작은 함수로 그렸고,
//    칸을 나눈 띠와 길 그림은 엔진의 pieces·route 를 썼다. 높이가 적힌 건물·지도 그림(①9 ②11·23·56)은 수를 글에 적어 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, mixed, lines, table, cards, N, M, C } = B.kit;
  const EQ = '6수02-04', SHARE = '6수02-05';
  // 글 속의 비(3 : 5)와 단위 붙은 수(250 mL, 20 %가)가 줄 끝에서 갈라지지 않게, 문항을 만든 뒤 그 사이의 빈칸을 줄이 바뀌지 않는 빈칸으로 바꾼다
  // (검사는 이 빈칸도 보통 빈칸으로 읽는다). 백분율은 기호와 토씨 사이에서도 줄이 바뀌므로 토씨까지 한 덩어리로 묶는다.
  // 분수는 따로 떨어진 상자(inline-flex)라 줄이 바뀌지 않는 빈칸으로도 붙지 않는다. 분수가 든 비와 분수 뒤의 토씨는 한 덩어리로 감싼다.
  const NB = String.fromCharCode(160), keep = (html) => '<span style="white-space:nowrap">' + html + '</span>';
  const FRAC = '<span class="mb-frac"><span>[^<]*</span><span class="mb-frac-bar">/</span><span>[^<]*</span></span>', VALUE = '(?:<span class="mb-mixed">\\d+' + FRAC + '</span>|' + FRAC + '|\\d+(?:\\.\\d+)?)';
  const RATIO_WORD = new RegExp('(' + VALUE + ') : (' + VALUE + ')([가-힣]*)', 'g'), FRAC_WORD = new RegExp('(<span class="mb-mixed">\\d+' + FRAC + '</span>|' + FRAC + ')([가-힣]+)', 'g');
  const glue = (html) => String(html)
    .replace(RATIO_WORD, (all, x, y, word) => (all.includes('<') ? keep(x + NB + ':' + NB + y + word) : all))
    .replace(FRAC_WORD, (all, value, word) => keep(value + word))
    .replace(/(\S) : (?=\S)/g, (all, before) => before + NB + ':' + NB)
    .replace(/(\d) (?=(?:mm|cm|km|kg|mL|m|g|L)(?![A-Za-z]))/g, (all, digit) => digit + NB)
    .replace(/(\d+) %([가-힣]*)/g, (all, number, word) => keep(number + NB + '%' + word));
  const tidy = (item) => Object.assign(item, { text: glue(item.text), explain: glue(item.explain) }, item.figure ? { figure: glue(item.figure) } : {}, item.choice ? { choice: { options: item.choice.options.map(glue), answer: item.choice.answer } } : {});
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make: (d, n) => tidy(make(d, n)) }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣', '㉤'], KA = ['가', '나', '다', '라'];
  const labelled = (answers) => answers.map((answer, i) => ({ label: LAB[i], answer }));
  const gcd = (x, y) => (y ? gcd(y, x % y) : x), lcm = (x, y) => x / gcd(x, y) * y;
  // 토씨: 수 뒤의 토씨만 떼어 낸다(분수는 분자를, 소수는 끝자리 숫자를 마지막에 읽는다).
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  const SIMPLE = '가장 간단한 자연수의 비로 나타내시오.';
  const truthOf = (flags, want) => ({ truth: flags, want });

  // ── 수 하나: 자연수·소수·분수·대분수 ──
  // p/q 가 그 수의 값이다(소수는 소수점을 뗀 자연수와 10의 거듭제곱으로 셈한다 — 자바스크립트에서 0.1 × 3 은 0.3 이 아니다).
  // html: 문제에 적는 글, last: 토씨를 정하는 마지막 숫자, ex: 검사가 다시 셈하는 식에 적는 글(문제에 적힌 수 그대로).
  const ds = (m, k) => { const s = String(m).padStart(k + 1, '0'); return s.slice(0, -k) + '.' + s.slice(-k); };
  const nat = (n) => ({ kind: 'nat', p: n, q: 1, html: String(n), last: n, ex: String(n) });
  const dec = (m, k) => ({ kind: 'dec', p: m, q: 10 ** k, html: ds(m, k), last: m % 10, ex: ds(m, k) });
  const fr = (n, den) => ({ kind: 'frac', p: n, q: den, n, d: den, html: frac(n, den), last: n, ex: `(${n}/${den})` });
  const mx = (w, n, den) => ({ kind: 'mixed', p: w * den + n, q: den, w, n, d: den, html: mixed(w, n, den), last: n, ex: `(${w}+${n}/${den})` });
  const vj = (v, pair) => v.html + tail(v.last, pair);
  // 비: 자연수끼리(r), 값끼리(R). 뒤에 토씨를 붙일 때는 rj, Rj.
  const r = (a, b) => `${a} : ${b}`;
  const rj = (a, b, pair) => `${a} : ${josa(b, pair)}`;
  const R = (x, y) => `${x.html} : ${y.html}`;
  const Rj = (x, y, pair) => `${x.html} : ${vj(y, pair)}`;
  // 비를 답하는 칸: 「□ : □」
  const ratioIn = (a, b) => [{ answer: a, unit: ':' }, { answer: b }];
  // 비례식 한 줄. 항 자리에 box() 를 넣으면 빈칸이 된다.
  const P = (a, b, c, e) => ex(`${a} : ${b} <i>=</i> ${c} : ${e}`);
  // 값 v 에 K 를 곱하고 g 로 나눈 자연수를 검사가 다시 셈하는 식: [식 글, 글에 없는 수]. 소수는 뜬 소수 오차가 없을 때만 소수 그대로 적는다.
  function scaled(v, K, g) {
    if (v.kind === 'nat') return [`${v.p}*${K}/${g}`, [K, g]];
    if (v.kind === 'dec') return v.p / v.q * K / g === v.p * (K / v.q) / g ? [`${v.ex}*${K}/${g}`, [K, g]] : [`${v.p}*${K / v.q}/${g}`, [v.p, K / v.q, g]];
    if (v.kind === 'frac') return [`${v.n}*${K}/${v.d}/${g}`, [K, g]];
    return [`(${v.w}*${v.d}+${v.n})*${K}/${v.d}/${g}`, [K, g]];
  }
  // 두 값의 비를 가장 간단한 자연수의 비로: 전항과 후항에 K 를 곱해 A : B, 다시 g 로 나누어 a : b.
  function simplify(x, y) {
    const K = lcm(x.q, y.q), A = x.p * K / x.q, A2 = y.p * K / y.q, g = gcd(A, A2), [ea, ua] = scaled(x, K, g), [eb, ub] = scaled(y, K, g);
    return { K, A, B: A2, g, a: A / g, b: A2 / g, facts: { calc: [[ea, 0], [eb, 1]], unseen: ua.concat(ub) } };
  }
  // 간단히 하는 과정을 적은 풀이. word: 곱하는 수를 부르는 말(두 분모의 최소공배수 …)
  function how(s, word) {
    const up = s.K > 1 ? `전항과 후항에 ${word ? word + ' ' : ''}${josa(s.K, '을/를')} 곱하면 ${s.A} : ${s.B}이다.` : '';
    const down = s.g > 1 ? `${up ? ' 다시 ' : ''}전항과 후항을 ${up ? '' : '두 수의 최대공약수 '}${josa(s.g, '으로/로')} 나누면 ${s.a} : ${s.b}이다.` : '';
    return up + down;
  }
  // 값을 자바스크립트 수로(식 글 ex 를 셈한 값과 같다)
  const val = (v) => (v.kind === 'nat' ? v.p : v.kind === 'dec' ? v.p / v.q : v.kind === 'frac' ? v.n / v.d : v.w + v.n / v.d);
  const topOf = (v) => (v.kind === 'mixed' ? `(${v.w}*${v.d}+${v.n})` : String(v.kind === 'frac' ? v.n : v.p));
  // (nums 의 곱) ÷ (dens 의 곱)을 검사가 다시 셈하는 식: { text, unseen }.
  // 분수·자연수뿐이면 분자·분모의 자연수 곱으로 적는다(오차가 없다). 소수가 끼면 소수 그대로 적되, 자연수 답(want)과 어긋나는 수에서는 소수점을 뗀 자연수로 적고 unseen 에 밝힌다.
  function quot(nums, dens, want) {
    if (nums.concat(dens).every((v) => v.kind !== 'dec')) {
      const up = nums.map(topOf).concat(dens.filter((v) => v.q > 1).map((v) => String(v.d))), down = dens.map(topOf).concat(nums.filter((v) => v.q > 1).map((v) => String(v.d)));
      return { text: up.join('*') + (down.length ? '/(' + down.join('*') + ')' : ''), unseen: [] };
    }
    const text = nums.map((v) => v.ex).join('*') + dens.map((v) => '/' + v.ex).join('');
    let got = val(nums[0]); nums.slice(1).forEach((v) => { got *= val(v); }); dens.forEach((v) => { got /= val(v); });
    if (want === undefined || got === want) return { text, unseen: [] };
    const up = nums.reduce((n, v) => n * v.p, 1) * dens.reduce((n, v) => n * v.q, 1), down = nums.reduce((n, v) => n * v.q, 1) * dens.reduce((n, v) => n * v.p, 1);
    return { text: `${up}/${down}`, unseen: [up, down] };
  }
  // 가장 간단한 자연수의 비를 답하는 문항
  const simplest = (text, x, y, o) => { const s = simplify(x, y); return M(text, ratioIn(s.a, s.b), { figure: o.figure, explain: (o.lead || '') + how(s, o.word) + (o.after || ''), facts: Object.assign({}, s.facts, o.rule ? { rule: o.rule } : {}) }); };
  // 서로 다른 두 수(공약수는 1뿐)
  const co = (d, lo, hi, ok) => d.until(() => [d.int(lo, hi), d.int(lo, hi)], ([a, b]) => a !== b && gcd(a, b) === 1 && (!ok || ok(a, b)));
  // 화살표 틀: 수 → (×3) → 수. 화살표 위 글에도 빈칸을 둘 수 있게 엔진의 chain 과 같은 class 로 직접 적는다. 화살표 조각은 [글] 로 넘긴다.
  const flow = (parts) => '<div class="mb-chain">' + parts.map((part) => (Array.isArray(part) ? '<span class="mb-step">' + part[0] + '</span>' : '<span class="mb-node">' + part + '</span>')).join('') + '</div>';
  const wide = (html) => '<span style="display:inline-block;margin-right:16px;white-space:nowrap">' + html + '</span>';
  // 여러 사람이 한 말. rows: [말, 참·거짓]. 이름을 보기로 하여 want 인 말을 한 사람을 고른다.
  function talk(d, text, rows, want, o) {
    const list = d.shuffle(rows), who = d.shuffle(NAMES).slice(0, list.length), hit = list.findIndex((row) => row[1] === want);
    if (list.filter((row) => row[1] === want).length !== 1) throw new Error('답이 하나가 아니다');
    return C(text, who, hit, { figure: lines(list.map((row, i) => `${who[i]}: ${row[0]}`)), explain: o.explain(who[hit], list[hit]), facts: Object.assign(truthOf(list.map((row) => row[1]), want), o.facts || {}) });
  }
  // 보기 [글, 참·거짓(, 다시 셈할 짝)] 가운데 want 인 것 하나를 고른다. 짝 [식 글, 적힌 값]이 모두 있으면 검사가 다시 셈한다(claimed).
  function oneOf(d, text, rows, want, o) {
    const list = o.keep ? rows : d.shuffle(rows), hit = list.findIndex((row) => row[1] === want), facts = truthOf(list.map((row) => row[1]), want);
    if (list.filter((row) => row[1] === want).length !== 1) throw new Error('답이 하나가 아니다');
    if (list.every((row) => row[2])) { facts.claimed = list.map((row) => row[2]); facts.claimedWant = want; }
    const tags = o.tags ? LAB.slice(0, list.length) : null;
    return C(text, tags || list.map((row) => row[0]), hit, { figure: (o.figure || '') + (tags ? lines(list.map((row, i) => `<span class="mb-tag mb-tag-short">${tags[i]}</span>${row[0]}`)) : ''), explain: typeof o.explain === 'function' ? o.explain(list[hit], tags ? tags[hit] : '') : o.explain, facts: Object.assign(facts, o.facts || {}) });
  }

  // ── 그림 ──
  // 변의 길이를 적은 직사각형 하나(1 cm 를 4 px 로 줄여 그린다). 그림 속 수는 그림 설명에도 적는다.
  function rect(w, h, tag) {
    const s = 4, W = w * s, H = h * s, width = W + 52, height = H + 26;
    return `<svg class="mb-pieces" viewBox="0 0 ${width} ${height}" width="${width}" role="img" aria-label="직사각형 ${tag}: 가로 ${w} cm, 세로 ${h} cm">`
      + `<rect class="mb-piece" x="4" y="4" width="${W}" height="${H}"/>`
      + `<text class="mb-km-label" x="${4 + W / 2}" y="${8 + H / 2}" text-anchor="middle">${tag}</text>`
      + `<text class="mb-km-label" x="${4 + W / 2}" y="${H + 20}" text-anchor="middle">${w} cm</text>`
      + `<text class="mb-km-label" x="${W + 9}" y="${8 + H / 2}">${h} cm</text></svg>`;
  }

  B.kit.r624 = { EQ, SHARE, T, tidy, LAB, KA, labelled, gcd, lcm, tail, ex, SIMPLE, truthOf, ds, nat, dec, fr, mx, vj, r, rj, R, Rj, ratioIn, P, scaled, simplify, how, simplest, val, quot, co, flow, wide, talk, oneOf, rect };

  B.addUnit({
    id: '6-2-4', grade: 6, semester: 2, no: 4, title: '비례식과 비례배분', version: 1,
    groups: [
      {
        id: 'prop', title: '비의 성질', standard: EQ,
        types: [
          T('prop-word', '비의 성질을 바르게 말한 것 고르기', '①1 ②1 ③2 심6·7', (d) => {
            const right = d.pick(['비의 전항과 후항에 0이 아닌 같은 수를 곱하여도 비율은 같다.', '비의 전항과 후항을 0이 아닌 같은 수로 나누어도 비율은 같다.']);
            return oneOf(d, '비의 성질을 바르게 말한 것은?', [[right, true], ['비의 전항과 후항에 같은 수를 더하여도 비율은 같다.', false], ['비의 전항과 후항에서 같은 수를 빼어도 비율은 같다.', false], ['비의 전항과 후항에 0을 곱하여도 비율은 같다.', false]], true, {
              explain: '비의 전항과 후항에 0이 아닌 같은 수를 곱하거나, 전항과 후항을 0이 아닌 같은 수로 나누어도 비율은 같다. 같은 수를 더하거나 빼면 비율이 달라지고, 0을 곱하면 0 : 0이 되어 비율을 구할 수 없다.'
            });
          }),
          T('prop-arrow', '전항과 후항에 같은 수를 곱하거나 나눈 비 구하기', '①2 ②2·3 ③1 심1', (d, n) => {
            const [a, b] = co(d, 2, 12), k = d.int(2, 9), from = n === 0 ? [a, b] : [a * k, b * k], to = n === 0 ? [a * k, b * k] : [a, b];
            return M('비의 성질을 이용하여 비율이 같은 비를 만들었다. ㉠, ㉡에 알맞은 수는?', labelled(to), {
              figure: flow([r(...from), [(n === 0 ? '×' : '÷') + k], `${box(LAB[0])} : ${box(LAB[1])}`]),
              explain: n === 0 ? `전항과 후항에 각각 ${josa(k, '을/를')} 곱한다. ${a} × ${k} = ${a * k}, ${b} × ${k} = ${b * k}이므로 ${a * k} : ${b * k}이다.`
                : `전항과 후항을 각각 ${josa(k, '으로/로')} 나눈다. ${a * k} ÷ ${k} = ${a}, ${b * k} ÷ ${k} = ${b}이므로 ${a} : ${b}이다.`,
              facts: { calc: n === 0 ? [[`${a}*${k}`, 0], [`${b}*${k}`, 1]] : [[`${a * k}/${k}`, 0], [`${b * k}/${k}`, 1]], rule: n === 0 ? 'arrow-mul' : 'arrow-div' }
            });
          }, { count: 2 }),
          T('prop-arrow-both', '곱한 수·나눈 수와 빈 항을 함께 구하기', '①2 ②2·12 ③1·13·23', (d) => {
            const [a, b] = co(d, 2, 12), k = d.int(3, 9), mul = d.bool(), from = mul ? [a, b] : [a * k, b * k], to = mul ? [a * k, b * k] : [a, b];
            return M('비의 성질을 이용하여 비율이 같은 비를 만들었다. ㉠, ㉡에 알맞은 수는?', labelled([k, to[1]]), {
              figure: flow([r(...from), [(mul ? '×' : '÷') + box(LAB[0])], `${to[0]} : ${box(LAB[1])}`]),
              explain: mul ? `전항 ${a}${tail(a, '이/가')} ${a * k}${tail(a * k, '이/가')} 되었다. ${a * k} ÷ ${a} = ${k}이므로 전항에 ${josa(k, '을/를')} 곱하였다. 후항에도 ${josa(k, '을/를')} 곱하면 ${b} × ${k} = ${b * k}이다.`
                : `전항 ${a * k}${tail(a * k, '이/가')} ${a}${tail(a, '이/가')} 되었다. ${a * k} ÷ ${a} = ${k}이므로 전항을 ${josa(k, '으로/로')} 나누었다. 후항도 ${josa(k, '으로/로')} 나누면 ${b * k} ÷ ${k} = ${b}이다.`,
              facts: { calc: [[`${a * k}/${a}`, 0], [mul ? `${b}*${a * k}/${a}` : `${b * k}*${a}/${a * k}`, 1]] }
            });
          }),
          T('prop-fill', '비율이 같도록 빈 항 구하기', '①3 ②7 ③9 심1·5', (d) => {
            const [a, b] = co(d, 2, 9), m = d.pick([2, 3, 4, 6]), s = d.pick([1, 2, 3].filter((v) => v < m && m % v === 0)), t = m * d.int(2, 4);
            return M(`${rj(a * m, b * m, '과/와')} 비율이 같은 비가 되도록 ㉠, ㉡에 알맞은 수를 구하시오.`, labelled([b * s, a * t]), {
              figure: lines([ex(`${a * s} : ${box(LAB[0])}`), ex(`${box(LAB[1])} : ${b * t}`)]),
              explain: `전항 ${a * m}${tail(a * m, '을/를')} ${josa(m / s, '으로/로')} 나누면 ${a * s}이므로 후항도 ${josa(m / s, '으로/로')} 나누어 ㉠은 ${b * s}이다. 후항 ${b * m}에 ${josa(t / m, '을/를')} 곱하면 ${b * t}이므로 전항에도 ${josa(t / m, '을/를')} 곱하여 ㉡은 ${a * t}이다.`,
              facts: { calc: [[`${b * m}*${a * s}/${a * m}`, 0], [`${a * m}*${b * t}/${b * m}`, 1]] }
            });
          }),
          T('prop-fill-via', '몇 배인지 바로 보이지 않는 비율이 같은 비의 빈 항 구하기', '③9 심1', (d) => {
            const [a, b] = co(d, 2, 9), [m, t] = d.until(() => [d.int(4, 9), d.int(6, 12)], ([x, y]) => y > x && y % x !== 0 && b * y <= 90);
            return N(`${rj(a * m, b * m, '과/와')} ㉠ : ${josa(b * t, '은/는')} 비율이 같다. ㉠에 알맞은 수는?`, a * t, {
              explain: `${a * m} : ${b * m}의 전항과 후항을 ${josa(m, '으로/로')} 나누면 ${a} : ${b}이다. ${b} × ${t} = ${b * t}이므로 ${a} : ${b}의 전항과 후항에 ${josa(t, '을/를')} 곱하면 ${a * t} : ${b * t}이다.`,
              facts: { calc: [[`${a * m}*${b * t}/${b * m}`, 0]] }
            });
          }),
          T('prop-same-pick', '비율이 같은 비 고르기', '①5 ②5 ③3·13 심3', (d) => {
            const [a, b] = co(d, 2, 9), v = d.until(() => {
              const m = d.int(2, 5), n = d.until(() => d.int(1, 8), (x) => x !== m), k = d.int(2, 6), c = d.int(1, 4);
              return { m, rows: [[a * n, b * n], [b * k, a * k], [a * m + c, b * m + c], [a * n, b * m]] };
            }, (x) => new Set(x.rows.map((row) => row.join(':'))).size === 4 && x.rows.filter(([p, q]) => p * b === q * a).length === 1);
            const rows = d.shuffle(v.rows), hit = rows.findIndex(([p, q]) => p * b === q * a), A = a * v.m, A2 = b * v.m;
            return C(`${rj(A, A2, '과/와')} 비율이 같은 비는?`, rows.map(([p, q]) => r(p, q)), hit, {
              explain: `${A} : ${A2}의 전항과 후항을 ${josa(v.m, '으로/로')} 나누면 ${a} : ${b}이다.` + (rows[hit][0] === a ? '' : ` ${rj(rows[hit][0], rows[hit][1], '은/는')} ${a} : ${b}의 전항과 후항에 ${josa(rows[hit][0] / a, '을/를')} 곱한 비이므로 비율이 같다.`),
              facts: { choose: { exprs: rows.map(([p, q]) => `${p}/${q}`), rule: 'equals', target: A / A2 } }
            });
          }),
          T('prop-diff-pick', '비율이 다른 비 고르기', '①5 ③3', (d) => {
            const [a, b] = co(d, 2, 9), ks = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 4), kind = d.int(0, 2), k = ks[3];
            const odd = kind === 0 ? [b * k, a * k] : kind === 1 ? [a * k, b * (k + 1)] : [a * k + 2, b * k + 2];
            const rows = d.shuffle(ks.slice(0, 3).map((x) => [a * x, b * x]).concat([odd])), hit = rows.indexOf(odd);
            return C('비율이 나머지 셋과 다른 비는?', rows.map(([p, q]) => r(p, q)), hit, {
              explain: `${rows.filter((row) => row !== odd).map(([p, q]) => r(p, q)).join(', ')}의 비율은 모두 ${a} : ${b}의 비율과 같다. ${rj(odd[0], odd[1], '은/는')} ${a} : ${b}의 전항과 후항에 같은 수를 곱하여 만들 수 없다.`,
              facts: { choose: { exprs: rows.map(([p, q]) => `${p}/${q}`), rule: 'odd' } }
            });
          }),
          T('prop-match', '비율이 같은 비끼리 짝 짓기', '①6 ②6 ③4', (d) => {
            const bases = d.until(() => [co(d, 2, 9), co(d, 2, 9), co(d, 2, 9)], (l) => new Set(l.map(([a, b]) => a / b)).size === 3);
            const left = bases.map(([a, b]) => { const k = d.int(1, 4); return [a * k, b * k]; }), order = d.shuffle([0, 1, 2]);
            const right = order.map((i) => { const [a, b] = bases[i], k = d.until(() => d.int(1, 6), (x) => x * a !== left[i][0]); return [a * k, b * k]; });
            const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]], good = [0, 1, 2].map((i) => order.indexOf(i));
            const opts = d.shuffle([good].concat(d.shuffle(PERMS.filter((p) => p.join() !== good.join())).slice(0, 3)));
            return C('㉠, ㉡, ㉢과 비율이 같은 비를 가, 나, 다에서 찾아 바르게 짝 지은 것은?', opts.map((p) => p.map((j, i) => `${LAB[i]}-${KA[j]}`).join(', ')), opts.indexOf(good), {
              figure: lines([left.map((x, i) => wide(`${LAB[i]} ${r(...x)}`)).join(''), right.map((x, j) => wide(`${KA[j]} ${r(...x)}`)).join('')]),
              explain: `비를 간단히 하면 ${left.map((x, i) => `${LAB[i]} ${r(...bases[i])}`).join(', ')}이고, ${right.map((x, j) => `${KA[j]} ${r(...bases[order[j]])}`).join(', ')}이다. 따라서 ${good.map((j, i) => `${LAB[i]}-${KA[j]}`).join(', ')}이다.`,
              facts: { match: { exprs: left.map(([p, q]) => `${p}/${q}`), options: opts.map((p) => p.map((j) => right[j][0] / right[j][1])) } }
            });
          }),
          T('prop-cant', '전항과 후항에 곱하거나 나눌 수 없는 수', '①7 ②1 ③2 심7', (d) => {
            const mul = d.bool(), g = d.pick([12, 18, 24]), [a, b] = mul ? co(d, 3, 12) : co(d, 2, 4), A = mul ? a : a * g, A2 = mul ? b : b * g;
            const others = mul ? d.shuffle([2, 3, 5, 7, 10]).slice(0, 3) : d.shuffle([2, 3, 6]), opts = d.shuffle([0].concat(others)), sign = mul ? '×' : '÷';
            return C(`다음 비는 ${rj(A, A2, '과/와')} 비율이 같다. □ 안에 공통으로 들어갈 수 없는 수는?`, opts.map(String), opts.indexOf(0), {
              figure: ex(`(${A} <i>${sign}</i> ${box()}) : (${A2} <i>${sign}</i> ${box()})`),
              explain: mul ? '비의 전항과 후항에 0이 아닌 같은 수를 곱하여야 비율이 같다. 0을 곱하면 0 : 0이 되어 비율을 구할 수 없다.' : '비의 전항과 후항을 0이 아닌 같은 수로 나누어야 비율이 같다. 0으로는 나눌 수 없다.',
              facts: truthOf(opts.map((x) => x === 0), true)
            });
          }),
          T('prop-talk', '비율이 같은 비를 바르게 구한 것 고르기', '①1 ③2 심6', (d) => {
            const [a, b] = co(d, 2, 9), m = d.int(2, 4), A = a * m, A2 = b * m, k = d.int(2, 5), c = d.int(1, Math.min(A, A2) - 1), byDiv = d.bool();
            const good = byDiv ? [`전항과 후항을 ${josa(m, '으로/로')} 나누어 ${a} : ${b}`, a, b] : [`전항과 후항에 ${josa(k, '을/를')} 곱하여 ${A * k} : ${A2 * k}`, A * k, A2 * k];
            const rows = [good, [`전항과 후항에 ${josa(c, '을/를')} 더하여 ${A + c} : ${A2 + c}`, A + c, A2 + c], [`전항과 후항에서 ${josa(c, '을/를')} 빼어 ${A - c} : ${A2 - c}`, A - c, A2 - c], [`전항에만 ${josa(k, '을/를')} 곱하여 ${A * k} : ${A2}`, A * k, A2]];
            return oneOf(d, `${rj(A, A2, '과/와')} 비율이 같은 비를 바르게 구한 것은?`, rows.map(([text, p, q]) => [text, p * A2 === q * A, [`${p}*${A2}`, q * A]]), true, {
              explain: '비의 전항과 후항에 0이 아닌 같은 수를 곱하거나, 전항과 후항을 0이 아닌 같은 수로 나눈 비만 비율이 같다. 같은 수를 더하거나 빼면 비율이 달라진다.'
            });
          }),
          T('prop-rect', '가로와 세로의 비가 주어진 비인 직사각형 찾기', '①8 ②8 ③11·20 심16', (d) => {
            const v = d.until(() => {
              const [a, b] = co(d, 2, 7), k = d.int(2, 6), k2 = d.int(2, 6), w = d.int(8, 20), h = d.int(8, 20);
              return { a, b, rows: d.shuffle([[a * k, b * k], [b * k2, a * k2], [w, h]]) };
            }, (x) => x.rows.every(([w, h]) => w >= 8 && w <= 20 && h >= 8 && h <= 20) && x.rows.filter(([w, h]) => w * x.b === h * x.a).length === 1 && new Set(x.rows.map((row) => row.join())).size === 3);
            const hit = v.rows.findIndex(([w, h]) => w * v.b === h * v.a), [w, h] = v.rows[hit];
            return C(`가로와 세로의 비가 ${v.a} : ${v.b}인 직사각형은?`, LAB.slice(0, 3), hit, {
              figure: v.rows.map(([x, y], i) => rect(x, y, LAB[i])).join(''),
              explain: `${LAB[hit]}의 가로와 세로의 비는 ${w} : ${h}이다. 전항과 후항을 ${josa(w / v.a, '으로/로')} 나누면 ${v.a} : ${v.b}이다.`,
              facts: { choose: { exprs: v.rows.map(([x, y]) => `${x}/${y}`), rule: 'equals', target: v.a / v.b } }
            });
          }),
          T('prop-wrong-say', '비를 보고 잘못 말한 사람 찾기', '①9 ②11·35 ③12 심6·9', (d) => {
            const [a, b] = co(d, 2, 7, (x, y) => x < y), m = d.int(2, 4), A = a * m, A2 = b * m, k = d.int(2, 4), bad = d.int(0, 2), c = d.int(2, 5), m2 = m === 2 ? 3 : m - 1;
            const rows = [
              [`비율은 ${bad === 0 ? frac(b, a) : frac(a, b)}이다.`, bad !== 0],
              [`${bad === 1 ? rj(A + c, A2 + c, '은/는') : rj(A * k, A2 * k, '은/는')} ${rj(A, A2, '과/와')} 비율이 같은 비이다.`, bad !== 1],
              [`${rj(a, b, '은/는')} ${A} : ${A2}의 전항과 후항을 ${josa(bad === 2 ? m2 : m, '으로/로')} 나눈 비이다.`, bad !== 2]
            ];
            const why = [`${A} : ${A2}의 비율은 ${frac(A, A2)}, 곧 ${frac(a, b)}이다.`, `${A + c} : ${josa(A2 + c, '은/는')} ${A} : ${A2}의 전항과 후항에 ${josa(c, '을/를')} 더한 비이므로 비율이 다르다.`, `${A} : ${A2}의 전항과 후항을 ${josa(m, '으로/로')} 나누어야 ${a} : ${b}이다.`][bad];
            return talk(d, `${A} : ${A2}에 대하여 잘못 말한 사람은?`, rows, false, { explain: (who) => `${why} 잘못 말한 사람은 ${who}이다.` });
          }),
          T('prop-cards', '수 카드 두 장으로 비율이 같은 비 만들기', '①5 ②4 ③32 심38', (d) => {
            const v = d.until(() => {
              const [a, b] = co(d, 2, 9), k = d.int(2, 6);
              return { a, b, k, list: d.shuffle([a * k, b * k].concat(Array.from({ length: 4 }, () => d.int(2, 45)))) };
            }, (x) => new Set(x.list).size === 6 && Math.max(...x.list) <= 54 && x.list.reduce((n, p) => n + x.list.filter((q) => q !== p && p * x.b === q * x.a).length, 0) === 1);
            return M(`수 카드 6장 가운데 2장을 골라 ${rj(v.a, v.b, '과/와')} 비율이 같은 비를 만들었다. 만든 비는?`, ratioIn(v.a * v.k, v.b * v.k), {
              figure: cards(v.list),
              explain: `${v.a} : ${v.b}의 전항과 후항에 ${josa(v.k, '을/를')} 곱하면 ${v.a * v.k} : ${v.b * v.k}이고, 두 수가 모두 수 카드에 있다.`,
              facts: { calc: [[`${v.a}*${v.k}`, 0], [`${v.b}*${v.k}`, 1]], unseen: [v.k] }
            });
          }),
          T('prop-sum', '전항과 후항의 합이나 차가 정해진 비율이 같은 비', '②9 ③7 심8', (d, n) => {
            const [a, b] = co(d, 2, 9, (x, y) => n === 0 || Math.abs(x - y) >= 2), k = d.int(3, 9), part = n === 0 ? a + b : Math.abs(a - b), total = part * k;
            return M(`${rj(a, b, '과/와')} 비율이 같은 비 가운데 전항과 후항의 ${n === 0 ? '합' : '차'}${n === 0 ? '이' : '가'} ${total}인 비는?`, ratioIn(a * k, b * k), {
              explain: `${a} : ${b}의 전항과 후항의 ${n === 0 ? '합' : '차'}${n === 0 ? '은' : '는'} ${part}이다. ${total} ÷ ${part} = ${k}이므로 전항과 후항에 ${josa(k, '을/를')} 곱하면 ${a * k} : ${b * k}이다.`,
              facts: { calc: [[`${a}*${total}/${part}`, 0], [`${b}*${total}/${part}`, 1]], unseen: [part], rule: n === 0 ? 'sum' : 'diff' }
            });
          }, { count: 2 }),
          T('prop-between', '전항이 정해진 범위에 드는 비율이 같은 비', '②10 ③6', (d) => {
            const [a, b] = co(d, 3, 9), k = d.int(3, 9), lo = a * k - d.int(1, a - 1), hi = a * k + d.int(2, a - 1);
            return N(`${rj(a, b, '과/와')} 비율이 같은 비 가운데 전항이 ${lo}보다 크고 ${hi}보다 작은 비의 후항은?`, b * k, {
              explain: `${a} : ${josa(b, '과/와')} 비율이 같은 비의 전항은 ${a}의 배수이다. ${lo}보다 크고 ${hi}보다 작은 ${a}의 배수는 ${a * k}이고 ${a * k} ÷ ${a} = ${k}이므로 후항은 ${b} × ${k} = ${b * k}이다.`,
              facts: { calc: [[`${b}*${k}`, 0]], unseen: [k] }
            });
          }),
          T('prop-rate-fill', '비율이 주어진 비의 빈 항 구하기', '③8', (d) => {
            const [p, q] = co(d, 1, 9, (x, y) => x < y && y >= 3), s = d.int(2, 9), t = d.until(() => d.int(2, 9), (x) => x !== s);
            return M(`비율이 ${frac(p, q)}인 비가 되도록 ㉠, ㉡에 알맞은 수를 구하시오.`, labelled([p * s, q * t]), {
              figure: lines([ex(`${box(LAB[0])} : ${q * s}`), ex(`${p * t} : ${box(LAB[1])}`)]),
              explain: `비율이 ${frac(p, q)}인 비는 ${p} : ${josa(q, '과/와')} 비율이 같다. ${q} × ${s} = ${q * s}이므로 ㉠은 ${p} × ${s} = ${p * s}이고, ${p} × ${t} = ${p * t}이므로 ㉡은 ${q} × ${t} = ${q * t}이다.`,
              facts: { calc: [[`${q * s}*${p}/${q}`, 0], [`${p * t}*${q}/${p}`, 1]] }
            });
          }),
          T('prop-mix-who', '주어진 비로 섞은 사람 찾기', '③10', (d) => {
            const [x, y, z] = d.pick([['흰색', '검은색', '회색'], ['노란색', '파란색', '초록색'], ['빨간색', '흰색', '분홍색'], ['빨간색', '노란색', '주황색']]), who = d.shuffle(NAMES).slice(0, 3);
            const v = d.until(() => {
              const [a, b] = co(d, 2, 5), k = d.int(2, 6) * 10, k2 = d.int(2, 6) * 10, k3 = d.int(2, 6) * 10;
              return { a, b, rows: d.shuffle([[a * k, b * k], [b * k2, a * k2], [a * k3, b * k3 + d.pick([10, 20])]]) };
            }, (o) => o.rows.filter(([p, q]) => p * o.b === q * o.a).length === 1 && new Set(o.rows.map((row) => row.join())).size === 3);
            const hit = v.rows.findIndex(([p, q]) => p * v.b === q * v.a), [p, q] = v.rows[hit];
            return C(`${x} 물감과 ${y} 물감을 ${rj(v.a, v.b, '으로/로')} 섞어 ${z} 물감을 만들려고 한다. 세 사람이 섞은 물감의 양이 다음과 같을 때, 알맞게 섞은 사람은?`, who, hit, {
              figure: table(['이름', x, y], v.rows.map(([m, n], i) => [who[i], `${m} mL`, `${n} mL`])),
              explain: `${name(who[hit], '이/가')} 섞은 양의 비는 ${p} : ${q}이다. 전항과 후항을 ${josa(p / v.a, '으로/로')} 나누면 ${v.a} : ${v.b}이다. 나머지 두 사람이 섞은 양의 비는 ${v.rows.filter((_, i) => i !== hit).map(([m, n]) => { const g = gcd(m, n); return r(m / g, n / g); }).join(', ')}이다.`,
              facts: { choose: { exprs: v.rows.map(([m, n]) => `${m}/${n}`), rule: 'equals', target: v.a / v.b } }
            });
          })
        ]
      },
      {
        id: 'simple', title: '간단한 자연수의 비로 나타내기', standard: EQ,
        types: [
          T('simple-nat', '자연수의 비를 가장 간단한 자연수의 비로 나타내기', '①10 ②12 ③13 심10', (d) => {
            const [a, b] = co(d, 2, 13), g = d.until(() => d.int(3, 13), (x) => a * x <= 150 && b * x <= 150);
            return simplest(SIMPLE, nat(a * g), nat(b * g), { figure: ex(r(a * g, b * g)), rule: 'nat' });
          }),
          T('simple-dec', '소수의 비를 가장 간단한 자연수의 비로 나타내기(곱하면 끝나는 것)', '①11 ②13 ③14', (d, n) => {
            const k = n + 1, [a, b] = co(d, n === 0 ? 2 : 11, n === 0 ? 19 : 99, (x, y) => x % 10 !== 0 && y % 10 !== 0);
            return simplest(SIMPLE, dec(a, k), dec(b, k), { figure: ex(R(dec(a, k), dec(b, k))), rule: ['dec-one', 'dec-two'][n] });
          }, { count: 2 }),
          T('simple-dec-reduce', '소수의 비를 가장 간단한 자연수의 비로 나타내기(곱한 뒤 다시 나누는 것)', '①11 ②13 ③15 심10', (d) => {
            const k = d.pick([1, 1, 2]), [a, b] = co(d, 2, 9), g = d.until(() => d.int(2, 12), (x) => (a * x) % 10 !== 0 && (b * x) % 10 !== 0 && a * x <= 99 && b * x <= 99);
            return simplest(SIMPLE, dec(a * g, k), dec(b * g, k), { figure: ex(R(dec(a * g, k), dec(b * g, k))), rule: 'dec-reduce' });
          }),
          T('simple-dec-nat', '소수와 자연수의 비를 가장 간단한 자연수의 비로 나타내기', '①11 ③15 심10', (d) => {
            const [m, n] = d.until(() => [d.int(2, 48), d.int(2, 9)], ([x, y]) => x % 10 !== 0 && gcd(x, y * 10) > 1), first = d.bool(), x = first ? dec(m, 1) : nat(n), y = first ? nat(n) : dec(m, 1);
            return simplest(SIMPLE, x, y, { figure: ex(R(x, y)), rule: 'dec-nat' });
          }),
          T('simple-dec-steps', '소수의 비를 간단히 하는 과정의 빈칸 채우기', '①14 ②13 ③15', (d) => {
            const [a, b] = co(d, 2, 9), g = d.until(() => d.int(2, 9), (x) => (a * x) % 10 !== 0 && (b * x) % 10 !== 0 && a * x <= 99 && b * x <= 99), x = dec(a * g, 1), y = dec(b * g, 1);
            const [e1, u1] = scaled(y, 10, 1), [e2, u2] = scaled(y, 10, g);
            return M(`${R(x, y)}${tail(y.last, '을/를')} 가장 간단한 자연수의 비로 나타내는 과정이다. ㉠, ㉡에 알맞은 수는?`, labelled([b * g, b]), {
              figure: flow([R(x, y), ['×10'], `${a * g} : ${box(LAB[0])}`, ['÷' + g], `${a} : ${box(LAB[1])}`]),
              explain: `전항과 후항에 10을 곱하면 ${a * g} : ${b * g}이고, 전항과 후항을 ${josa(g, '으로/로')} 나누면 ${a} : ${b}이다.`,
              facts: { calc: [[e1, 0], [e2, 1]], unseen: u1.concat(u2) }
            });
          }),
          T('simple-dec-times', '자리 수가 다른 소수의 비에 곱할 수 고르기', '①14 ②17 ③23 심13', (d) => {
            const a = d.until(() => d.int(2, 9), (x) => x % 10 !== 0), b = d.until(() => d.int(11, 99), (x) => x % 10 !== 0), first = d.bool(), x = first ? dec(a, 1) : dec(b, 2), y = first ? dec(b, 2) : dec(a, 1);
            const rows = [['전항과 후항에 각각 100을 곱한다.', true], ['전항과 후항에 각각 10을 곱한다.', false], [first ? '전항에 10을, 후항에 100을 곱한다.' : '전항에 100을, 후항에 10을 곱한다.', false]];
            return oneOf(d, `${R(x, y)}${tail(y.last, '을/를')} 자연수의 비로 나타내려고 한다. 알맞은 방법은?`, rows, true, {
              explain: `비율이 같으려면 전항과 후항에 같은 수를 곱해야 한다. ${ds(b, 2)}${tail(b % 10, '이/가')} 소수 두 자리 수이므로 전항과 후항에 각각 100을 곱하면 ${first ? a * 10 : b} : ${first ? b : a * 10}이다.`
            });
          }),
          T('simple-frac-unit', '단위분수의 비를 가장 간단한 자연수의 비로 나타내기', '①12 ②14 ③16 심10', (d) => {
            const [p, q] = d.until(() => [d.int(2, 10), d.int(2, 10)], ([x, y]) => x !== y && lcm(x, y) <= 40), x = fr(1, p), y = fr(1, q);
            return simplest(SIMPLE, x, y, { figure: ex(R(x, y)), word: '두 분모의 최소공배수', rule: 'frac-unit' });
          }),
          T('simple-frac', '진분수의 비를 가장 간단한 자연수의 비로 나타내기', '①12 ②14 ③16 심10', (d, n) => {
            const v = d.until(() => { const [a, b] = co(d, 1, 12, (x, y) => x < y), [c, e] = co(d, 1, 12, (x, y) => x < y); return [fr(a, b), fr(c, e)]; },
              ([x, y]) => x.n > 1 && y.n > 1 && x.d !== y.d && x.d !== 11 && y.d !== 11 && lcm(x.d, y.d) <= 48 && (simplify(x, y).g > 1) === (n === 1));
            return simplest(SIMPLE, v[0], v[1], { figure: ex(R(v[0], v[1])), word: '두 분모의 최소공배수', rule: ['frac-plain', 'frac-reduce'][n] });
          }, { count: 2 }),
          T('simple-frac-mixed', '대분수나 자연수가 든 분수의 비를 가장 간단한 자연수의 비로 나타내기', '①12 ②14 ③16', (d, n) => {
            const v = d.until(() => { const [a, b] = co(d, 1, 9, (p, q) => p < q), [c, e] = co(d, 1, 9, (p, q) => p < q && q !== b); return [n === 0 ? mx(d.int(1, 3), a, b) : nat(d.int(2, 6)), fr(c, e)]; }, (l) => simplify(l[0], l[1]).a <= 40 && simplify(l[0], l[1]).b <= 40);
            const first = d.bool(), big = v[0], small = v[1], x = first ? big : small, y = first ? small : big;
            return simplest(SIMPLE, x, y, { figure: ex(R(x, y)), lead: n === 0 ? `${big.html} = ${frac(big.p, big.q)}이다. ` : '', word: n === 0 ? '두 분모의 최소공배수' : '분모', rule: ['frac-mixed', 'frac-nat'][n] });
          }, { count: 2 }),
          T('simple-frac-steps', '분수의 비를 간단히 하는 과정의 빈칸 채우기', '①14 ②14·17 ③16', (d) => {
            const v = d.until(() => { const [a, b] = co(d, 1, 9, (x, y) => x < y), [c, e] = co(d, 1, 9, (x, y) => x < y); return [fr(a, b), fr(c, e)]; }, ([x, y]) => x.d !== y.d && simplify(x, y).g === 1 && simplify(x, y).K <= 72);
            const [x, y] = v, s = simplify(x, y), g = gcd(x.d, y.d);
            return M(`${R(x, y)}${tail(y.last, '을/를')} 가장 간단한 자연수의 비로 나타내려고 전항과 후항에 두 분모의 최소공배수를 곱하였다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([s.K, s.a, s.b]), {
              figure: flow([R(x, y), ['×' + box(LAB[0])], `${box(LAB[1])} : ${box(LAB[2])}`]),
              explain: `${x.d}${tail(x.d, '과/와')} ${y.d}의 최소공배수는 ${s.K}이다. ${x.html} × ${s.K} = ${s.a}, ${y.html} × ${s.K} = ${s.b}이므로 ${s.a} : ${s.b}이다.`,
              facts: { calc: [[`${x.d}*${y.d}/${g}`, 0], [`${x.n}*${s.K}/${x.d}`, 1], [`${y.n}*${s.K}/${y.d}`, 2]], unseen: [g, s.K] }
            });
          }),
          T('simple-mix', '소수와 분수의 비를 가장 간단한 자연수의 비로 나타내기', '①13 ②15 ③17 심11', (d, n) => {
            const v = d.until(() => {
              const [a, b] = co(d, 1, 9, (x, y) => x < y), m = d.int(2, 29), first = d.bool(), f = n === 0 ? fr(a, b) : mx(d.int(1, 3), a, b), e = dec(m, 1);
              return first ? [e, f] : [f, e];
            }, ([x, y]) => (x.kind === 'dec' ? x : y).p % 10 !== 0 && [2, 3, 4, 5, 6, 8].includes((x.kind === 'dec' ? y : x).d) && simplify(x, y).a <= 60 && simplify(x, y).b <= 60 && simplify(x, y).a !== simplify(x, y).b);
            const f = v[0].kind === 'dec' ? v[1] : v[0], e = v[0].kind === 'dec' ? v[0] : v[1];
            return simplest(SIMPLE, v[0], v[1], { figure: ex(R(v[0], v[1])), lead: `${e.html}${tail(e.last, '을/를')} 분수로 고치면 ${frac(e.p, e.q)}${n === 1 ? `이고 ${f.html} = ${frac(f.p, f.q)}` : ''}이다. `, rule: ['mix-proper', 'mix-mixed'][n] });
          }, { count: 2 }),
          T('simple-mix-ways', '소수와 분수의 비를 한 가지 꼴로 고쳐 간단히 하는 과정', '①14·15 ②16 ③17 심11', (d, n) => {
            if (n === 0) {
              // 분수를 소수로 고친다: 분모가 2·5·10인 분수만 소수 한 자리 수가 된다.
              const v = d.until(() => { const den = d.pick([2, 5, 5]), a = d.int(1, den - 1), m = d.int(2, 19); return { f: fr(a, den), e: dec(m, 1), t: a * 10 / den }; }, (o) => gcd(o.f.n, o.f.d) === 1 && o.e.p % 10 !== 0 && gcd(o.t, o.e.p) === 1 && o.t !== o.e.p);
              return M(`${R(v.f, v.e)}${tail(v.e.last, '을/를')} 가장 간단한 자연수의 비로 나타내려고 분수를 소수로 고쳤다. ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: v.t / 10, decimal: true }, { label: LAB[1], answer: v.t }], {
                figure: lines([ex(`${R(v.f, v.e)} <i>=</i> ${box(LAB[0])} : ${v.e.html}`), `전항과 후항에 10을 곱하면 ${ex(`${box(LAB[1])} : ${v.e.p}`)}`]),
                explain: `${v.f.html} = ${ds(v.t, 1)}이므로 ${ds(v.t, 1)} : ${v.e.html}이다. 전항과 후항에 10을 곱하면 ${v.t} : ${v.e.p}이다.`,
                facts: { calc: [[`${v.f.n}/${v.f.d}`, 0], [`${v.f.n}*10/${v.f.d}`, 1]], rule: 'to-decimal' }
              });
            }
            // 소수를 분수로 고친다: 10 과 분모의 최소공배수가 10 이 아니게 하여 빈칸의 수가 서로 다르게 한다.
            const v = d.until(() => { const den = d.pick([3, 4, 6, 8]), a = d.int(1, den - 1), m = d.int(1, 9); return { f: fr(a, den), e: dec(m, 1) }; }, (o) => gcd(o.f.n, o.f.d) === 1 && simplify(o.e, o.f).g === 1);
            const s = simplify(v.e, v.f);
            return M(`${R(v.e, v.f)}${tail(v.f.last, '을/를')} 가장 간단한 자연수의 비로 나타내려고 소수를 분수로 고쳤다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([v.e.p, s.a, s.b]), {
              figure: lines([ex(`${R(v.e, v.f)} <i>=</i> ${frac(box(LAB[0]), 10)} : ${v.f.html}`), `전항과 후항에 ${s.K}${tail(s.K, '을/를')} 곱하면 ${ex(`${box(LAB[1])} : ${box(LAB[2])}`)}`]),
              explain: `${v.e.html} = ${frac(v.e.p, 10)}이므로 ${frac(v.e.p, 10)} : ${v.f.html}이다. 전항과 후항에 10과 ${v.f.d}의 최소공배수 ${josa(s.K, '을/를')} 곱하면 ${s.a} : ${s.b}이다.`,
              facts: { calc: [[`${v.e.ex}*10`, 0], [`${v.e.ex}*${s.K}`, 1], [`${v.f.n}*${s.K}/${v.f.d}`, 2]], rule: 'to-fraction' }
            });
          }, { count: 2 }),
          T('simple-right-pick', '간단한 자연수의 비로 바르게 나타낸 것·잘못 나타낸 것 고르기', '①16 ②18 ③25 심12', (d) => {
            // 틀린 답은 차례를 뒤바꾼 것, 분모끼리의 비로 적은 것, 한쪽만 나눈 것이다.
            const v = d.until(() => {
              const [a, b] = co(d, 2, 11), g = d.int(4, 9), [p, q] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y), [c, e] = co(d, 2, 9), h = d.pick([2, 3, 4, 6]);
              return [[nat(a * g), nat(b * g), [a, b + 1]], [fr(1, p), fr(1, q), [p / gcd(p, q), q / gcd(p, q)]], [dec(c * h, 1), dec(e * h, 1), [e, c]]];
            }, (rows) => rows.every(([x, y]) => x.p % 10 !== 0 || x.kind !== 'dec') && rows[2][0].p % 10 !== 0 && rows[2][1].p % 10 !== 0 && rows[2][0].p <= 60 && rows[2][1].p <= 60);
            const want = d.bool(), keep = want ? [d.int(0, 2)] : d.shuffle([0, 1, 2]).slice(0, 2);
            const rows = v.map(([x, y, wrong], i) => { const s = simplify(x, y), ok = keep.includes(i), [p, q] = ok ? [s.a, s.b] : wrong; return [`${R(x, y)} → ${r(p, q)}`, ok, [`${x.p * y.q}*${q}`, y.p * x.q * p], s]; });
            return oneOf(d, `비를 가장 간단한 자연수의 비로 ${want ? '바르게' : '잘못'} 나타낸 것은?`, rows.map((row) => row.slice(0, 3)), want, {
              tags: true, keep: true,
              explain: (row, tag) => { const s = rows.find((x) => x[0] === row[0])[3]; return want ? `${tag}만 바르게 나타내었다. ${how(s)}` : `${tag}을 잘못 나타내었다. ${how(s)}`; }
            });
          }),
          T('simple-odd', '간단히 한 비가 나머지와 다른 것 찾기', '①17 ③3·4 심4', (d) => {
            const [a, b] = co(d, 2, 9), bad = d.int(0, 2), b2 = d.until(() => b + d.pick([-2, -1, 1, 2]), (x) => x >= 2 && x <= 9 && x !== a && x !== b), k = d.pick([10, 20, 30]);
            const tail2 = (i) => (i === bad ? b2 : b), rows = d.shuffle([[nat(a * k), nat(tail2(0) * k)], [dec(a, 1), dec(tail2(1), 1)], [fr(1, tail2(2)), fr(1, a)]]), hit = rows.findIndex(([x, y]) => simplify(x, y).b !== simplify(x, y).a * b / a);
            return C(`가장 간단한 자연수의 비로 나타내었을 때 ${rj(a, b, '이/가')} 되지 않는 것은?`, rows.map(([x, y]) => R(x, y)), hit, {
              explain: `${rows.map(([x, y]) => { const s = simplify(x, y); return `${Rj(x, y, '은/는')} ${s.a} : ${s.b}`; }).join(', ')}이다.`,
              facts: { choose: { exprs: rows.map(([x, y]) => `${x.ex}/${y.ex}`), rule: 'odd' } }
            });
          }),
          T('simple-word-nat', '두 양의 비를 가장 간단한 자연수의 비로 나타내기', '②20 ③18 심16', (d) => {
            const [a, b] = co(d, 2, 11), g = d.int(4, 12), [x, y, u] = d.pick([['사탕', '초콜릿', '개'], ['빨간 구슬', '파란 구슬', '개'], ['동화책', '과학책', '권'], ['연필', '볼펜', '자루'], ['사과', '배', '개']]);
            return simplest(`${josa(x, '이/가')} ${a * g}${u}, ${josa(y, '이/가')} ${b * g}${u} 있다. ${x} 수와 ${y} 수의 비를 ${SIMPLE}`, nat(a * g), nat(b * g), { lead: `${x} 수와 ${y} 수의 비는 ${a * g} : ${b * g}이다. `, rule: 'word-nat' });
          }),
          T('simple-word-about', '「~에 대한 ~의 비」를 가장 간단한 자연수의 비로 나타내기', '②20·22', (d) => {
            const [a, b] = co(d, 2, 9), g = d.int(3, 9), [x, y, u] = d.pick([['축구공', '농구공', '개'], ['흰 바둑돌', '검은 바둑돌', '개'], ['남학생', '여학생', '명'], ['튤립', '장미', '송이']]);
            return simplest(`${josa(x, '이/가')} ${a * g}${u}, ${josa(y, '이/가')} ${b * g}${u} 있다. ${x} 수에 대한 ${y} 수의 비를 ${SIMPLE}`, nat(b * g), nat(a * g), { lead: `${x} 수에 대한 ${y} 수의 비는 기준량인 ${x} 수가 후항이므로 ${b * g} : ${a * g}이다. `, rule: 'word-about' });
          }),
          T('simple-word-dec', '소수·분수로 적힌 두 양의 비를 가장 간단한 자연수의 비로 나타내기', '①19 ②21 ③19 심16', (d, n) => {
            const [x, y, u, what] = d.pick([['밀가루', '설탕', 'kg', '양'], ['주스', '우유', 'L', '양'], ['빨간색 끈', '파란색 끈', 'm', '길이'], ['쌀', '보리', 'kg', '양']]);
            const v = d.until(() => {
              if (n === 0) return [dec(d.int(11, 59), 1), dec(d.int(11, 59), 1)];
              const [a, b] = co(d, 1, 5, (p, q) => p < q && [2, 4, 5].includes(q));
              return d.bool() ? [mx(d.int(1, 4), a, b), dec(d.int(11, 59), 1)] : [dec(d.int(11, 59), 1), mx(d.int(1, 4), a, b)];
            }, ([p, q]) => [p, q].every((o) => o.kind !== 'dec' || o.p % 10 !== 0) && simplify(p, q).a !== simplify(p, q).b && simplify(p, q).a <= 40 && simplify(p, q).b <= 40 && (n === 1 || simplify(p, q).g > 1));
            const m = v.find((o) => o.kind === 'mixed'), e = v.find((o) => o.kind === 'dec');
            return simplest(`${josa(x, '이/가')} ${v[0].html} ${u}, ${josa(y, '이/가')} ${v[1].html} ${u} 있다. ${josa(x, '과/와')} ${y}의 ${what}의 비를 ${SIMPLE}`, v[0], v[1], {
              lead: `${josa(x, '과/와')} ${y}의 ${what}의 비는 ${R(v[0], v[1])}이다. ${n === 1 ? `${m.html} = ${frac(m.p, m.q)}, ${e.html} = ${frac(e.p, e.q)}이다. ` : ''}`, rule: ['word-dec', 'word-mixed'][n]
            });
          }, { count: 2 }),
          T('simple-word-unit', '단위가 다른 두 양의 비를 가장 간단한 자연수의 비로 나타내기', '③19 심17', (d) => {
            const [x, y, big, small, K] = d.pick([['찰흙', '모래', 'kg', 'g', 1000], ['물', '식초', 'L', 'mL', 1000], ['노란색 테이프', '초록색 테이프', 'm', 'cm', 100]]);
            const v = d.until(() => ({ e: dec(d.int(11, 29), 1), s: d.int(3, 39) * (K / 20) }), (o) => o.e.p % 10 !== 0 && o.s !== o.e.p * K / 10 && o.s % K !== 0 && simplify(nat(o.e.p * K / 10), nat(o.s)).b <= 40 && simplify(nat(o.e.p * K / 10), nat(o.s)).a <= 40);
            const A = v.e.p * K / 10, g = gcd(A, v.s), [e1, u1] = scaled(v.e, K, g);
            return M(`${josa(x, '이/가')} ${v.e.html} ${big}, ${josa(y, '이/가')} ${v.s} ${small} 있다. ${josa(x, '과/와')} ${y}의 양의 비를 ${SIMPLE}`, ratioIn(A / g, v.s / g), {
              explain: `단위를 같게 한다. ${v.e.html} ${big} = ${A} ${small}이므로 비는 ${A} : ${v.s}이다. 전항과 후항을 ${josa(g, '으로/로')} 나누면 ${A / g} : ${v.s / g}이다.`,
              facts: { calc: [[e1, 0], [`${v.s}/${g}`, 1]], unseen: u1.concat([g]) }
            });
          }),
          T('simple-word-part', '전체의 몇 분의 몇씩인 두 양의 비', '①20 ②22 ③19 심16·19', (d) => {
            const [p, q] = d.shuffle(NAMES).slice(0, 2), [thing, verb, did] = d.pick([['같은 책', '읽었다', '읽은'], ['크기가 같은 피자', '먹었다', '먹은'], ['같은 길', '걸었다', '걸은'], ['크기가 같은 벽', '칠하였다', '칠한']]);
            const v = d.until(() => { const [a, b] = co(d, 1, 9, (x, y) => x < y), [c, e] = co(d, 1, 9, (x, y) => x < y); return [fr(a, b), fr(c, e)]; }, ([x, y]) => x.d !== y.d && x.p * y.q !== y.p * x.q && simplify(x, y).K <= 63);
            return simplest(`${josa(thing, '을/를')} ${name(p, '은/는')} 전체의 ${v[0].html}만큼, ${name(q, '은/는')} 전체의 ${v[1].html}만큼 ${verb}. ${name(p, '과/와')} ${name(q, '이/가')} ${did} 양의 비를 ${SIMPLE}`, v[0], v[1], {
              lead: `두 사람의 양의 비는 ${R(v[0], v[1])}이다. `, word: '두 분모의 최소공배수', rule: 'word-part'
            });
          }),
          T('simple-part-rest', '한쪽 양을 먼저 구한 뒤 비로 나타내기', '①21 심17', (d, n) => {
            const v = d.until(() => { const [a, b] = co(d, 2, 9), g = d.int(2, 6); return { part: a * g, other: b * g }; }, (o) => o.part + o.other <= 40 && o.part + o.other >= 20 && gcd(o.part, o.part + o.other) > 1), total = v.part + v.other;
            if (n === 0) {
              const [group, x, y] = d.pick([['합창단 학생', '안경을 쓴 학생', '안경을 쓰지 않은 학생'], ['합창단 학생', '6학년인 학생', '6학년이 아닌 학생'], ['동아리 학생', '우산을 가져온 학생', '우산을 가져오지 않은 학생']]), g = gcd(v.part, v.other);
              return M(`${group} ${total}명 가운데 ${josa(x, '은/는')} ${v.part}명이다. ${x} 수와 ${y} 수의 비를 ${SIMPLE}`, ratioIn(v.part / g, v.other / g), {
                explain: `${josa(y, '은/는')} ${total} − ${v.part} = ${v.other}(명)이다. ${v.part} : ${v.other}의 전항과 후항을 ${josa(g, '으로/로')} 나누면 ${v.part / g} : ${v.other / g}이다.`,
                facts: { calc: [[`${v.part}/${g}`, 0], [`(${total}-${v.part})/${g}`, 1]], unseen: [g], rule: 'part-rest' }
              });
            }
            const [x, y, all, u] = d.pick([['흰 바둑돌', '검은 바둑돌', '바둑돌', '개'], ['노란 구슬', '초록 구슬', '구슬', '개'], ['동화책', '위인전', '책', '권']]), g = gcd(v.part, total);
            return M(`${josa(x, '이/가')} ${v.part}${u}, ${josa(y, '이/가')} ${v.other}${u} 있다. ${x} 수와 전체 ${all} 수의 비를 ${SIMPLE}`, ratioIn(v.part / g, total / g), {
              explain: `전체 ${josa(all, '은/는')} ${v.part} + ${v.other} = ${total}(${u})이다. ${v.part} : ${total}의 전항과 후항을 ${josa(g, '으로/로')} 나누면 ${v.part / g} : ${total / g}이다.`,
              facts: { calc: [[`${v.part}/${g}`, 0], [`(${v.part}+${v.other})/${g}`, 1]], unseen: [g], rule: 'part-whole' }
            });
          }, { count: 2 }),
          T('simple-table', '표에서 두 값을 골라 간단한 자연수의 비로 나타내기', '②23', (d) => {
            const ms = d.shuffle([4, 6, 7, 8, 9, 12, 14, 15, 16, 18, 21, 24, 25, 27]).slice(0, 3).concat([10]), order = d.shuffle([0, 1, 2, 3]), vals = order.map((i) => ms[i]);
            const [i, j] = d.until(() => d.shuffle([0, 1, 2, 3]).slice(0, 2), ([p, q]) => gcd(vals[p], vals[q]) > 1 || vals[p] === 10 || vals[q] === 10);
            const show = (m) => (m % 10 === 0 ? nat(m / 10) : dec(m, 1)), x = show(vals[i]), y = show(vals[j]);
            return simplest(`상자 네 개의 무게를 나타낸 표이다. ${KA[i]} 상자와 ${KA[j]} 상자의 무게의 비를 ${SIMPLE}`, x, y, {
              figure: table(['상자', '무게'], vals.map((m, k) => [KA[k], `${show(m).html} kg`])), lead: `${KA[i]} 상자와 ${KA[j]} 상자의 무게의 비는 ${R(x, y)}이다. `, rule: 'table'
            });
          }),
          T('simple-mix-who', '두 양의 비가 나머지와 다른 사람 찾기', '①19 ②24 ③18', (d) => {
            const who = d.shuffle(NAMES).slice(0, 3), [x, y] = d.pick([['꿀', '물'], ['식초', '물'], ['딸기 원액', '우유']]);
            const v = d.until(() => {
              const [a, b] = co(d, 2, 9, (p, q) => p < q), bad = d.int(0, 2), b2 = b + d.pick([-1, 1]), e = (i) => (i === bad ? b2 : b);
              return { a, b, bad, rows: [[fr(a, 10), fr(e(0), 10), '컵'], [dec(a, 1), dec(e(1), 1), 'L'], [nat(a * 20), nat(e(2) * 20), 'mL']] };
            }, (o) => o.rows[o.bad][1].p !== o.rows[o.bad][0].p && o.rows.every((row) => row[1].p > 1) && gcd(o.rows[0][0].p, 10) === 1 && gcd(o.rows[0][1].p, 10) === 1);
            const rows = d.shuffle(v.rows), hit = rows.indexOf(v.rows[v.bad]);
            return C(`세 사람이 ${josa(x, '과/와')} ${josa(y, '을/를')} 섞었다. ${x}의 양과 ${y}의 양의 비가 나머지 두 사람과 다른 사람은?`, who, hit, {
              figure: lines(rows.map((row, i) => { const u = row[2] === '컵' ? '컵' : ' ' + row[2]; return `${who[i]}: ${x} ${row[0].html}${u}, ${y} ${row[1].html}${u}`; })),
              explain: `가장 간단한 자연수의 비로 나타내면 ${rows.map((row, i) => { const s = simplify(row[0], row[1]); return `${who[i]} ${s.a} : ${s.b}`; }).join(', ')}이다.`,
              facts: { choose: { exprs: rows.map((row) => `${row[0].ex}/${row[1].ex}`), rule: 'odd' } }
            });
          })
        ]
      },
      { id: 'eq', title: '비례식', standard: EQ, types: [] },
      { id: 'law', title: '비례식의 성질', standard: EQ, types: [] },
      { id: 'use', title: '비례식의 활용', standard: EQ, types: [] },
      { id: 'share', title: '비례배분', standard: SHARE, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
