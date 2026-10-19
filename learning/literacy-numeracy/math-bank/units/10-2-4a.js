// 고등학교 1학년 2학기(공통수학2) Ⅱ-1 집합 — 단원 틀·도구와 앞쪽 묶음(집합의 뜻과 표현, 집합 사이의 포함 관계, 합집합과 교집합).
// 수집해 둔 천재 T셀파 공통수학2 두 종(홍진곤, 전인태 — 모두 2022 개정)의 교과서·평가 자료에서 뽑은 꼴 목록(기본꼴_1 47꼴, 기본꼴_2 46꼴, 심화꼴 7꼴)을
// 꼴마다 따져서 실었다. 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/10-2-4/싣기_대조표.md 에 있다.
// (여집합과 차집합, 드모르간의 법칙, 연산과 포함 관계, 원소의 개수는 10-2-4b.js 에, 실력 문항은 10-2-4c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준: 10공수2-02-01(집합의 개념과 표현), 10공수2-02-02(포함관계), 10공수2-02-03(집합의 연산, 벤 다이어그램).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(원소나열법·조건제시법·벤 다이어그램·문장), 묻는 것(집합·원소의 개수·미지수·고르기·옳은 것 모두),
//    연산의 꼴(합·교·여·차, 법칙, 여러 연산)이 다르면 따로 싣는다. 수와 상황만 바꾼 유형은 만들지 않는다.
//  - 사용자가 정한 것: 수학 실력에 필요한 꼴은 다 싣는다. 교육과정의 「간단히 다룬다」「확인하는 정도로」는 빼는 까닭이 아니다(그런 꼴은 실력에 싣는다).
//  - 답: 답이 집합이면 집합 다섯을 보기로 주고 고르게 한다(틀린 보기는 끝 원소를 넣고 빼기, 합집합과 교집합 바꾸기, 순서를 바꾼 차집합처럼 실제로 하는 잘못).
//    「옳은 것을 모두 고르시오」는 ㄱ, ㄴ, … 을 모아 적은 보기 다섯에서 고른다. 원소의 개수·부분집합의 개수는 부호 단추 없는 수 칸,
//    미지수의 값은 음수일 수 있으므로 모두 부호 단추를 단다. 범위는 「a [부등호] [±][ ]」 칸으로 받는다.
//  - 참·거짓과 답은 모두 코드가 셈한다: 집합은 원소의 배열로 셈하고, 연산의 등식·조건은 전체집합의 모든 부분집합을 넣어 보아 가린다.
//    미지수 문항은 원소끼리 같아지는 경우를 모두 세워 풀고 대입해 보아 해가 하나뿐인지 확인한다.
//  - 검사 근거: 수 칸은 문제에 적힌 수로 다시 셈하는 식(facts.calc)을 적고, 글에 없는 수(원소의 개수, 2의 거듭제곱의 2)는 facts.unseen 에 밝힌다.
//    식으로 적을 수 없는 답(집합을 고르는 보기, 원소를 세는 답)은 제 작업 폴더의 따로 지은 풀이로 맞춰 보았다.
//
// 뺀 것과 까닭(10-2-4b.js, 10-2-4c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 교육과정 밖: 새 연산 A*B = (A∪B)^C∪(A∩B)를 기호로 정해 쓰는 것(①22 — 대칭차집합의 여집합), 순서쌍 (A, B)를 원소마다 세 갈래로 세는 3^4(②32의 마지막 변형 — 중복순열과 같은 셈).
//  - 다른 단원의 일: 점의 집합이 나타내는 두 원의 포함(②46 — 원과 원의 위치 관계), 원소가 셋인 부분집합의 개수 그 자체(②32의 첫 변형 — 공통수학1 조합의 일).
//  - 서술형·작도: 벤 다이어그램으로 나타내기(①14 — 빈칸을 묻는 변형만 실음), 법칙을 벤 다이어그램으로 확인하기(①47 — 등식의 참·거짓은 ②17·②19가 한다),
//    집합이 되도록 기준 고쳐 쓰기(①1의 활동).
//  - 겹침(같은 일): 여러 연산을 한꺼번에 구하기(②4 — ②5의 고르기와 한 유형), 여집합의 원소의 합(심1 — ②2), 홀수와 7의 배수의 합집합의 개수(심4 — ②40의 둘째 차례로 실음).
//  - 그림을 알 수 없는 것: 전 소단원 평가 2-1-2의 「벤 그림 보고 A^C∪B^C, (A∪B^C)^C」(②13의 변형 — 원소가 다 보이는 홍 기초력 그림으로 같은 일을 실음).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
// 문자를 부르는 말: 값을 물으면 「상수 a」, 범위·최댓값·최솟값을 물으면 「실수 a」(정수·자연수·양수처럼 조건이 되는 말은 그대로 둔다).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, N, M, C, F, inline } = B.kit;
  const { MINUS, gcd, lcm, range, nb, V, tag } = B.kit.mid;
  const UNIT = '10-2-4', S1 = '10공수2-02-01', S2 = '10공수2-02-02', S3 = '10공수2-02-03';
  const HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'], GANA = ['㈎', '㈏', '㈐', '㈑'], CIR = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const X = V('x'), Y = V('y'), va = V('a'), vb = V('b'), vc = V('c'), vk = V('k');
  const sT = (n) => (n < 0 ? MINUS + -n : String(n));
  const rng = (lo, hi) => (hi < lo ? [] : range(lo, hi));
  const odd = (n) => Math.abs(n) % 2 === 1, even = (n) => n % 2 === 0;
  const SUP_C = '<sup>C</sup>';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 밝히기로 한 수(facts.derived)가 아닌 수가 나오면 오류를 낸다(식을 잘못 적은 것).
  function seal(item) {
    const f = item.facts || {}, derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    // −0 으로 셈되는 식(0을 음수로 나눈 것)은 검사가 0과 다르게 보므로 + 0 을 붙인다(붙인 0 도 아래에서 밝힌 수로 넣는다).
    if (f.calc) f.calc = f.calc.map(([t, i]) => [Object.is(Function('return (' + t + ')')(), -0) ? '(' + t + ')+0' : t, i]);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], (f.choose && f.choose.exprs) || [], f.pick ? [f.pick.expr] : []);
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
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 3000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => (/^[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 토씨: 읽을 때 마지막에 오는 소리로 붙인다 ──
  // 수는 수 읽기(엔진과 같은 잣대), 한글은 받침, 영문자는 읽는 소리(L·M·N·R 만 받침), 위첨자(여집합의 C)는 검사처럼 「제곱」으로, ∅ 은 「공집합」으로 읽는다.
  const LETTER = { L: 2, M: 1, N: 1, R: 2 };
  function endSound(html) {
    const t = String(html).replace(/<span class="mb-frac"><span>((?:(?!<\/span>)[\s\S])*)<\/span><span class="mb-frac-bar">\/<\/span><span>(?:(?!<\/span>)[\s\S])*<\/span><\/span>/g, '$1')
      .replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/g, '제곱').replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').trim();
    let i = t.length - 1;
    while (i >= 0 && /[\s})\]|’']/.test(t[i])) i -= 1;
    const ch = t[i] || '';
    if (/\d/.test(ch)) { let j = i; while (j > 0 && /\d/.test(t[j - 1])) j -= 1; const n = Number(t.slice(j, i + 1)); const b = josa(n, '은/는').endsWith('은'); return { b, r: b && !josa(n, '으로/로').endsWith('으로') }; }
    if (/[가-힣]/.test(ch)) { const fin = (ch.charCodeAt(0) - 0xAC00) % 28; return { b: fin !== 0, r: fin === 8 }; }
    if (/[A-Za-z]/.test(ch)) { const v = LETTER[ch.toUpperCase()] || 0; return { b: v > 0, r: v === 2 }; }
    if (ch === '∅') return { b: true, r: false };
    if (/[㉠-㉣]/.test(ch)) return { b: true, r: ch === '㉣' };
    return { b: false, r: false };
  }
  const jo = (html, pair) => { const s = endSound(html), [w, wo] = pair.split('/'); return w === '으로' ? (s.b && !s.r ? '으로' : '로') : (s.b ? w : wo); };
  const wj = (html, pair) => nb(html + jo(html, pair));

  // ── 집합: 원소의 배열(수 또는 영문자 한 글자) ──
  const cmpEl = (x, y) => (typeof x === 'number' && typeof y === 'number' ? x - y : String(x) < String(y) ? -1 : String(x) > String(y) ? 1 : 0);
  const S = (list) => [...new Set(list)].sort(cmpEl);
  const cup = (a, b) => S(a.concat(b)), cap = (a, b) => S(a.filter((x) => b.includes(x))), sub = (a, b) => S(a.filter((x) => !b.includes(x)));
  const same = (a, b) => a.length === b.length && a.every((x) => b.includes(x)), inside = (a, b) => a.every((x) => b.includes(x));
  const keyOf = (a) => S(a).join(',');
  const divisors = (n) => rng(1, n).filter((k) => n % k === 0);
  const isPrime = (n) => n >= 2 && rng(2, Math.floor(Math.sqrt(n))).every((k) => n % k !== 0);
  const primesTo = (n) => rng(2, n).filter(isPrime);
  const subsetsOf = (list) => list.reduce((acc, x) => acc.concat(acc.map((s) => s.concat([x]))), [[]]).map(S);
  const sum = (list) => list.reduce((s, v) => s + v, 0);
  // 원소의 글: 수(음수는 −), 영문자(기울인 글자), 그 밖에는 { h } 로 적은 글
  const elH = (x) => (typeof x === 'number' ? sT(x) : typeof x === 'string' ? (/^[a-z]$/.test(x) ? V(x) : x) : x.h);
  const listH = (list) => list.map(elH).join(', ');
  const setH = (list) => (list.length ? nb('{' + listH(list) + '}') : '∅');
  const sj = (list, pair) => wj(setH(list), pair);
  // 조건제시법 {x | 조건}
  const bset = (cond, v) => '{' + (v || X) + ' | ' + cond + '}';
  const nOf = (name) => V('n') + '(' + name + ')';
  const comp = (name) => name + SUP_C;

  // ── 고르기 ──
  // 옳은 것 하나와 나머지를 섞는다. 보기는 [글, 옳은가]. 보기가 겹치거나 옳은 보기가 하나가 아니면 null(만들기를 다시 한다).
  function choose(d, text, rows, o) {
    const list = d.shuffle(rows), opt = o || {};
    if (new Set(list.map((r) => stripH(r[0]))).size !== list.length || list.filter((r) => r[1]).length !== 1) return null;
    return C(text, list.map((r) => r[0]), list.findIndex((r) => r[1]), Object.assign({}, opt, { facts: Object.assign({ truth: list.map((r) => Boolean(r[1])), want: true }, opt.facts || {}) }));
  }
  // 보기 ㄱ, ㄴ, … 가운데 옳은 것을 모두 고른 것: rows 는 [글, 참인가]. o.head 는 보기 위에 적는 그림·글.
  function combo(d, text, rows, o) {
    const opt = o || {}, labels = HAN.slice(0, rows.length), flags = rows.map((r) => Boolean(r[1])), right = labels.filter((_, i) => flags[i]);
    if (!right.length) return null;
    const all = [];
    for (let m = 1; m < (1 << rows.length); m += 1) all.push(labels.filter((_, i) => m & (1 << i)));
    const dist = (s) => labels.filter((l, i) => s.includes(l) !== flags[i]).length;
    const wrong = all.filter((s) => dist(s) > 0).map((s) => [s, dist(s) + d.next() * 1.5]).sort((x, y) => x[1] - y[1]).slice(0, 4).map((x) => x[0]);
    if (wrong.length < 4) return null;
    const figure = (opt.head || '') + lines(rows.map((r, i) => tag(labels[i] + '.') + r[0]));
    return choose(d, text, wrong.map((s) => [s.join(', '), false]).concat([[right.join(', '), true]]), Object.assign({}, opt, { figure, facts: Object.assign({ combo: flags }, opt.facts || {}) }));
  }
  // 보기 글을 고르는 문항에서 집합 보기 다섯(정답 하나와 틀린 것 넷)을 모은다. wrongs 가운데 정답과 같은 것·겹치는 것은 버린다.
  function setChoice(d, text, right, wrongs, o) {
    const seen = new Set([keyOf(right)]), picked = [];
    for (const w of d.shuffle(wrongs)) { const k = keyOf(w); if (!seen.has(k)) { seen.add(k); picked.push(w); } if (picked.length === 4) break; }
    if (picked.length < 4) return null;
    return choose(d, text, picked.map((w) => [setH(w), false]).concat([[setH(right), true]]), o);
  }

  // ── 집합의 연산식 ──
  // 식: 이름('A','B','C','U','E'(공집합)) 또는 ['u'|'i'|'d', 왼쪽, 오른쪽](합·교·차) 또는 ['c', 식](여집합)
  const OPH = { u: '∪', i: '∩', d: '−' };
  const isBin = (e) => Array.isArray(e) && e[0] !== 'c';
  function exH(e) {
    if (typeof e === 'string') return e === 'E' ? '∅' : e;
    if (e[0] === 'c') return (typeof e[1] === 'string' ? exH(e[1]) : '(' + exH(e[1]) + ')') + SUP_C;
    const side = (x) => (isBin(x) ? '(' + exH(x) + ')' : exH(x));
    return side(e[1]) + OPH[e[0]] + side(e[2]);
  }
  const exN = (e) => nb(exH(e));
  // 원소 하나가 식의 집합에 드는가. m: { A: 참거짓, … }
  function exIn(e, m) {
    if (typeof e === 'string') return e === 'U' ? true : e === 'E' ? false : Boolean(m[e]);
    if (e[0] === 'c') return !exIn(e[1], m);
    const p = exIn(e[1], m), q = exIn(e[2], m);
    return e[0] === 'u' ? p || q : e[0] === 'i' ? p && q : p && !q;
  }
  // 집합들(env: { U, A, B, C })로 식의 값을 셈한다.
  const exVal = (e, env) => env.U.filter((x) => exIn(e, { A: (env.A || []).includes(x), B: (env.B || []).includes(x), C: (env.C || []).includes(x) }));
  // 벤 다이어그램의 칸(원마다 안 1·밖 0)에서 식의 값이 참인 칸들
  const regionsOf = (e, names) => {
    const out = [];
    for (let m = 0; m < (1 << names.length); m += 1) { const key = names.map((_, i) => ((m >> (names.length - 1 - i)) & 1 ? '1' : '0')).join(''); const mm = {}; names.forEach((nm, i) => { mm[nm] = key[i] === '1'; }); if (exIn(e, mm)) out.push(key); }
    return out;
  };
  // 두 식이 언제나 같은가(벤 다이어그램의 모든 칸에서 같은가)
  const sameEx = (e, f, names) => keyOf(regionsOf(e, names)) === keyOf(regionsOf(f, names));

  // ── 벤 다이어그램 ──
  const SHADE = 'fill:rgba(37,99,235,0.28)';
  const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  const INK = 'fill:#1f2933';
  let vseq = 0;
  // 칠할 칸: 칸마다 원의 안·밖으로 가린 겹 가림막(mask)을 씌운 직사각형
  function shading(id, circles, keys, box0, W, H) {
    if (!keys.length) return '';
    const defs = circles.map((c, i) => ['in', 'out'].map((side) => `<mask id="${id}-${i}-${side}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect x="0" y="0" width="${W}" height="${H}" fill="${side === 'in' ? 'black' : 'white'}"/><circle cx="${c.x}" cy="${c.y}" r="${c.r}" fill="${side === 'in' ? 'white' : 'black'}"/></mask>`).join('')).join('');
    const layer = (key) => key.split('').reduce((inner, ch, i) => `<g mask="url(#${id}-${i}-${ch === '1' ? 'in' : 'out'})">${inner}</g>`, `<rect x="${box0.x}" y="${box0.y}" width="${box0.w}" height="${box0.h}" style="${SHADE}"/>`);
    return `<defs>${defs}</defs>` + keys.map(layer).join('');
  }
  const svgText = (x, y, t, size, extra) => `<text x="${x}" y="${y}" text-anchor="middle" style="font-size:${size}px;${INK}${extra ? ';' + extra : ''}">${t}</text>`;
  const elSvg = (x, cx, cy, size) => (typeof x === 'number' ? svgText(cx, cy + size * 0.36, sT(x), size) : typeof x === 'string' && /^[a-z]$/.test(x) ? svgText(cx, cy + size * 0.36, x, size + 1, ITALIC) : svgText(cx, cy + size * 0.36, x.s || x, size));
  // 두 원 A, B(겹침). 칸 글: '10' A에만, '11' 겹친 곳, '01' B에만, '00' 두 원 밖
  const V2 = {
    W: 300, H: 184, rect: { x: 8, y: 20, w: 284, h: 156 }, circles: [{ x: 120, y: 98, r: 64 }, { x: 180, y: 98, r: 64 }],
    names: [[78, 42], [222, 42]],
    slots: {
      10: [[78, 74], [104, 74], [74, 98], [102, 98], [78, 122], [104, 122]],
      11: [[140, 76], [160, 76], [140, 98], [160, 98], [140, 120], [160, 120]],
      '01': [[222, 74], [196, 74], [226, 98], [198, 98], [222, 122], [196, 122]],
      '00': [[28, 40], [272, 40], [26, 100], [274, 100], [28, 158], [272, 158]]
    }
  };
  const V3 = {
    W: 240, H: 222, rect: { x: 8, y: 20, w: 224, h: 194 }, circles: [{ x: 120, y: 86, r: 50 }, { x: 92, y: 134, r: 50 }, { x: 148, y: 134, r: 50 }],
    names: [[166, 44], [46, 182], [194, 182]]
  };
  const PLACE2 = { 10: 'A에만 있는 부분', 11: '두 원이 겹친 부분', '01': 'B에만 있는 부분', '00': '두 원 밖의 부분' };
  const regionWord3 = (key) => {
    const inn = ['A', 'B', 'C'].filter((_, i) => key[i] === '1');
    return inn.length === 0 ? '세 원 밖의 부분' : inn.length === 3 ? '세 원이 모두 겹친 부분' : inn.length === 1 ? inn[0] + '에만 있는 부분' : inn.join('와 ') + '만 겹친 부분';
  };
  // 두 원 벤 다이어그램. o: { items: { 10: [...], 11: [...], '01': [...], '00': [...] }, shade: [칸], universe(기본 참), names, small, blanks: { 원소: '㈎' } }
  function venn2(o) {
    const L = V2, id = 'v24-' + (vseq += 1), small = Boolean(o.small), names = o.names || ['A', 'B'], uni = o.universe !== false;
    const sw = small ? 2.6 : 1.5, fs = small ? 30 : 15;
    let out = shading(id, L.circles, o.shade || [], uni ? L.rect : { x: 0, y: 0, w: L.W, h: L.H }, L.W, L.H);
    if (uni) out += `<rect x="${L.rect.x}" y="${L.rect.y}" width="${L.rect.w}" height="${L.rect.h}" style="fill:none;stroke:#1f2933;stroke-width:${sw}"/>` + svgText(small ? 26 : 16, small ? 16 : 15, 'U', small ? 26 : 14, ITALIC);
    out += L.circles.map((c) => `<circle cx="${c.x}" cy="${c.y}" r="${c.r}" style="fill:none;stroke:#1f2933;stroke-width:${sw}"/>`).join('');
    out += names.map((nm, i) => svgText(L.names[i][0], L.names[i][1] + (small ? 4 : 0), nm, fs, ITALIC)).join('');
    const items = o.items || {}, said = [];
    for (const key of ['10', '11', '01', '00']) {
      const list = items[key] || [];
      if (list.length > L.slots[key].length) throw new Error('벤 다이어그램 칸에 원소가 너무 많다');
      list.forEach((x, k) => { const [cx, cy] = L.slots[key][k]; out += o.blanks && o.blanks[String(x)] ? svgText(cx, cy + 5, o.blanks[String(x)], 15) : elSvg(x, cx, cy, 14); });
      if (o.items && (key !== '00' || uni)) said.push(`${PLACE2[key]}: ${list.length ? list.map((x) => (o.blanks && o.blanks[String(x)] ? o.blanks[String(x)] : typeof x === 'number' ? sT(x) : x.s || x)).join(', ') : '없음'}`);
    }
    const shadeSaid = (o.shade || []).length ? ` 색칠한 부분: ${o.shade.map((k) => PLACE2[k]).join(', ')}.` : '';
    const label = `벤 다이어그램: ${uni ? '전체집합 U를 나타낸 직사각형 안에 ' : ''}두 원 ${names[0]}, ${names[1]}가 겹쳐 있다.` + (said.length ? ' ' + said.join(' / ') + '.' : '') + shadeSaid;
    // 휴대폰 문항 칸(290px)에 줄이지 않고 들어가도록 그림 전체를 0.95배로 그린다.
    return `<svg class="mb-geo" viewBox="0 0 ${L.W * 0.95} ${L.H * 0.95}" width="${small ? 112 : L.W * 0.95}" role="img" aria-label="${label}"><g transform="scale(0.95)">${out}</g></svg>`;
  }
  // 세 원 벤 다이어그램(칠한 칸만). o: { shade: ['100', …], small }
  function venn3(o) {
    const L = V3, id = 'v34-' + (vseq += 1), small = Boolean(o.small), sw = small ? 2.6 : 1.5, fs = small ? 30 : 15;
    let out = shading(id, L.circles, o.shade || [], L.rect, L.W, L.H);
    out += `<rect x="${L.rect.x}" y="${L.rect.y}" width="${L.rect.w}" height="${L.rect.h}" style="fill:none;stroke:#1f2933;stroke-width:${sw}"/>` + svgText(small ? 26 : 16, small ? 16 : 15, 'U', small ? 26 : 14, ITALIC);
    out += L.circles.map((c) => `<circle cx="${c.x}" cy="${c.y}" r="${c.r}" style="fill:none;stroke:#1f2933;stroke-width:${sw}"/>`).join('');
    out += ['A', 'B', 'C'].map((nm, i) => svgText(L.names[i][0], L.names[i][1] + (small ? 6 : 0), nm, fs, ITALIC)).join('');
    const label = `벤 다이어그램: 전체집합 U를 나타낸 직사각형 안에 세 원 A(위), B(왼쪽 아래), C(오른쪽 아래)가 서로 겹쳐 있다. 색칠한 부분: ${(o.shade || []).map(regionWord3).join(', ') || '없음'}.`;
    return `<svg class="mb-geo" viewBox="0 0 ${L.W} ${L.H}" width="${small ? 104 : L.W}" role="img" aria-label="${label}">${out}</svg>`;
  }
  // 한 원 안에 다른 원이 든 벤 다이어그램(A ⊂ B). inner: A의 원소, outer: B−A의 원소, blanks: { 원소: '㈎' }
  function vennIn(inner, outer, blanks) {
    const W = 300, H = 184, big = { x: 150, y: 98, r: 74 }, little = { x: 124, y: 102, r: 38 };
    const IN = [[112, 90], [136, 90], [112, 116], [136, 116]], OUT = [[196, 78], [200, 104], [196, 130], [150, 44], [150, 156]];
    if (inner.length > IN.length || outer.length > OUT.length) throw new Error('원소가 너무 많다');
    let out = `<circle cx="${big.x}" cy="${big.y}" r="${big.r}" style="fill:none;stroke:#1f2933;stroke-width:1.5"/><circle cx="${little.x}" cy="${little.y}" r="${little.r}" style="fill:none;stroke:#1f2933;stroke-width:1.5"/>`
      + svgText(70, 42, 'B', 15, ITALIC) + svgText(124, 56, 'A', 15, ITALIC);
    const put = (x, [cx, cy]) => (blanks[String(x)] ? svgText(cx, cy + 5, blanks[String(x)], 15) : elSvg(x, cx, cy, 14));
    inner.forEach((x, k) => { out += put(x, IN[k]); });
    outer.forEach((x, k) => { out += put(x, OUT[k]); });
    const tell = (list) => list.map((x) => blanks[String(x)] || sT(x)).join(', ');
    return `<svg class="mb-geo" viewBox="0 0 ${W * 0.95} ${H * 0.95}" width="${W * 0.95}" role="img" aria-label="벤 다이어그램: 원 B 안에 원 A가 들어 있다. 원 A 안: ${tell(inner)} / 원 B 안이지만 원 A 밖: ${tell(outer)}."><g transform="scale(0.95)">${out}</g></svg>`;
  }
  // 그림만 있는 보기에 기호(㉠㉡…)를 붙인다.
  const figOpt = (t, fig) => `<span style="display:inline-flex;align-items:center;gap:6px"><span style="font-weight:700">${t}</span>${fig}</span>`;

  // ── 조건제시법으로 적을 수 있는 유한집합들(모아 둔 목록) ──
  // { h: 조건제시법 글, set, key, kind } — 같은 집합을 여러 가지로 적은 것을 찾을 때 쓴다.
  const rootsH = (a, b) => {
    const f = (r) => (r === 0 ? X : '(' + X + ' ' + (r > 0 ? MINUS + ' ' + r : '+ ' + -r) + ')');
    return a === 0 ? X + f(b) : b === 0 ? X + f(a) : f(a) + f(b);
  };
  const CAT = (() => {
    const out = [], add = (h, set, kind) => out.push({ h, set: S(set), key: keyOf(set), kind });
    for (let n = 2; n <= 30; n += 1) if (divisors(n).length <= 8) add(bset(`${X}는 ${n}의 약수`), divisors(n), 'div');
    for (let n = 3; n <= 15; n += 1) { add(bset(`${X}는 ${n} 이하의 홀수`), rng(1, n).filter(odd), 'odd'); add(bset(`${X}는 ${n}보다 작은 홀수`), rng(1, n - 1).filter(odd), 'odd'); }
    for (let n = 4; n <= 16; n += 1) { add(bset(`${X}는 ${n} 이하의 짝수`), rng(1, n).filter(even), 'even'); add(bset(`${X}는 ${n}보다 작은 짝수`), rng(1, n - 1).filter(even), 'even'); }
    for (let n = 4; n <= 20; n += 1) { add(bset(`${X}는 ${n} 이하의 소수`), primesTo(n), 'prime'); add(bset(`${X}는 ${n}보다 작은 소수`), primesTo(n - 1), 'prime'); }
    for (let a = -3; a <= 6; a += 1) for (let b = a + 1; b <= 8; b += 1) add(bset(`${rootsH(a, b)} = 0`), [a, b], 'root');
    for (let r = 1; r <= 5; r += 1) add(bset(`${X}<sup>2</sup> = ${r * r}`), [-r, r], 'sq');
    for (let n = 3; n <= 10; n += 1) add(bset(`${X}는 ${n}보다 작은 자연수`), rng(1, n - 1), 'nat');
    for (const [m, n] of [[12, 18], [12, 20], [18, 24], [16, 24], [20, 30], [8, 12], [24, 36], [12, 30]]) add(bset(`${X}는 ${josa(m, '과/와')} ${n}의 공약수`), cap(divisors(m), divisors(n)), 'cd');
    for (let a = -4; a <= 3; a += 1) for (let b = a + 2; b <= a + 5; b += 1) add(bset(`${sT(a)} &lt; ${X} ≤ ${sT(b)}, ${X}는 정수`), rng(a + 1, b), 'int');
    for (let a = 1; a <= 4; a += 1) for (let b = a + 2; b <= a + 5; b += 1) add(bset(`${X}<sup>2</sup> ${MINUS} ${a + b}${X} + ${a * b} ≤ 0, ${X}는 정수`), rng(a, b), 'qint');
    for (const [n, k] of [[10, 3], [12, 4], [15, 5], [20, 4], [12, 3], [18, 6], [20, 5], [16, 4]]) add(bset(`${X}는 ${n} 이하의 ${k}의 배수`), rng(1, n).filter((v) => v % k === 0), 'mult');
    return out;
  })();
  const catBy = (key) => CAT.filter((c) => c.key === key);
  const NEAR = new Map();
  const nearKeys = (set) => {
    const k = keyOf(set);
    if (!NEAR.has(k)) NEAR.set(k, [...new Set(CAT.filter((c) => c.key !== k && (sub(c.set, set).length + sub(set, c.set).length) === 1).map((c) => c.key))]);
    return NEAR.get(k);
  };

  // ── 수 고르기 ──
  const pickN = (d, list, k) => d.shuffle(list).slice(0, k);
  // 1 ~ hi 에서 서로 다른 수 k 개
  const someNums = (d, k, lo, hi) => S(pickN(d, rng(lo, hi), k));

  // ── 일차식 c·a + e (미지수 문항) ──
  const linH = (c, e, v) => { const t = (c === 1 ? '' : c === -1 ? MINUS : sT(c)) + v; return e === 0 ? t : t + ' ' + (e > 0 ? '+ ' + e : MINUS + ' ' + -e); };
  const linV = (c, e, x) => c * x + e;
  // 칸에 적는 답의 검사 식: c·x + e = t 에서 x
  const solveS = (c, e, t) => { const top = e === 0 ? `${t < 0 ? '(' + t + ')' : t}` : `${t < 0 ? '(' + t + ')' : t}-(${e})`; return c === 1 ? top : `(${top})/(${c})`; };
  // 일차식 꼴 [c, e](c·a + e, 수는 [0, 수])들이 서로 같아지는 a 를 모두 모은다(원소끼리 같아지는 경우를 빠짐없이 세운다).
  const r9 = (v) => Math.round(v * 1e9) / 1e9;
  function meetAll(forms) {
    const out = [];
    for (let i = 0; i < forms.length; i += 1) for (let j = i + 1; j < forms.length; j += 1) { const [c1, e1] = forms[i], [c2, e2] = forms[j]; if (c1 !== c2) out.push(r9((e2 - e1) / (c1 - c2))); }
    return [...new Set(out)];
  }
  const sameR = (a, b) => same(S(a.map(r9)), S(b.map(r9)));
  const valsQ = (text, pairs, o) => M(text, pairs.map(([nm, v]) => ({ answer: v, signed: true, lead: V(nm) + ' =' })), Object.assign({}, o, { shown: pairs.map(([nm, v]) => nb(`${V(nm)} = ${sT(v)}`)).join(', ') }));

  B.kit.m1024 = {
    UNIT, S1, S2, S3, HAN, GANA, CIR, X, Y, va, vb, vc, vk, sT, rng, odd, even, SUP_C, stripH, seal, retry, srcOf, T, H, endSound, jo, wj,
    cmpEl, S, cup, cap, sub, same, inside, keyOf, divisors, isPrime, primesTo, subsetsOf, sum, elH, listH, setH, sj, bset, nOf, comp,
    choose, combo, setChoice, OPH, isBin, exH, exN, exIn, exVal, regionsOf, sameEx, venn2, venn3, vennIn, figOpt, PLACE2, regionWord3,
    rootsH, CAT, catBy, nearKeys, pickN, someNums, linH, linV, solveS, r9, meetAll, sameR, valsQ
  };

  // ════════════════════════════════════════════════════════════════
  // 가. 집합의 뜻과 표현
  // ════════════════════════════════════════════════════════════════
  const DEF = ['10보다 작은 홀수의 모임', '12의 약수의 모임', `방정식 ${X}<sup>2</sup> = 4의 해의 모임`, '두 자리 자연수 가운데 9의 배수의 모임', '우리 반에서 생일이 3월인 학생의 모임',
    '제곱하여 1이 되는 실수의 모임', '한 자리 소수의 모임', '20 이하의 4의 배수의 모임'];
  const VAG = [['큰 자연수의 모임', '크다'], ['아름다운 꽃의 모임', '아름답다'], ['100에 가까운 자연수의 모임', '가깝다'], ['키가 큰 학생의 모임', '크다'],
    ['맛있는 과일의 모임', '맛있다'], ['작은 홀수의 모임', '작다'], ['유명한 가수의 모임', '유명하다'], ['높은 산의 모임', '높다']];
  // 조건 하나로 정한 집합(원소인지 가릴 때): { h, has, list(유한일 때) }
  function condOf(d) {
    const kind = d.int(0, 2);
    if (kind === 0) { const n = d.pick([12, 18, 20, 24, 30, 36]); return { h: bset(`${X}는 ${n}의 약수`), has: (x) => x >= 1 && n % x === 0, list: divisors(n), pool: rng(1, n) }; }
    if (kind === 1) { const k = d.pick([3, 4, 6, 7]); return { h: bset(`${X}는 ${k}의 배수`), has: (x) => x >= 1 && x % k === 0, list: null, pool: rng(2, 6 * k), k }; }
    const m = d.pick([15, 20, 25, 30]); return { h: bset(`${X}는 ${m} 이하의 소수`), has: (x) => isPrime(x) && x <= m, list: primesTo(m), pool: rng(1, m + 4) };
  }
  const memberSaid = (c) => (c.list ? `A = ${setH(c.list)}` : `A는 ${c.k}의 배수 전체의 집합`);

  const meaningTypes = [
    T('mean-set', '집합인 것 가리기', '①1', (d) => {
      const k = d.int(2, 3), sure = d.shuffle(DEF).slice(0, k), vague = d.shuffle(VAG).slice(0, 5 - k);
      const rows = d.shuffle(sure.map((h) => [h, true, '']).concat(vague.map(([h, w]) => [h, false, w])));
      const right = HAN.slice(0, rows.length).filter((_, i) => rows[i][1]), words = [...new Set(rows.filter((r) => !r[1]).map((r) => '‘' + r[2] + '’'))];
      return combo(d, '다음 보기 가운데 집합인 것을 모두 고른 것은?', rows.map((r) => [r[0], r[1]]), {
        explain: `대상을 분명하게 정할 수 있는 모임만 집합이다. ${words.join(', ')}처럼 기준이 분명하지 않은 말이 든 모임은 집합이 아니다. 따라서 집합인 것은 ${right.join(', ')}이다.`
      });
    }),
    T('mean-elem', '원소인가 아닌가 — ∈, ∉', '①2', (d, n) => {
      const ask = '다음 중 □ 안에 들어갈 기호가 나머지 넷과 다른 것은?';
      if (n === 0) {
        const c = condOf(d), ins = d.shuffle(c.pool.filter(c.has)), outs = d.shuffle(c.pool.filter((x) => !c.has(x)));
        const many = d.bool(), main = (many ? ins : outs).slice(0, 4), lone = (many ? outs : ins)[0];
        if (main.length < 4 || lone === undefined) return null;
        const rows = main.map((x) => [nb(`${x} ${box()} A`), false]).concat([[nb(`${lone} ${box()} A`), true]]);
        const inList = S(main.concat([lone]).filter(c.has)), outList = S(main.concat([lone]).filter((x) => !c.has(x)));
        return choose(d, `집합 A = ${c.h}에 대하여 ${ask}`, rows, {
          explain: `${memberSaid(c)}이다. ${wj(listH(inList), '은/는')} A의 원소이므로 □ 안에 ∈가, ${wj(listH(outList), '은/는')} A의 원소가 아니므로 ∉가 들어간다. 따라서 기호가 다른 것은 ${nb(lone + ' □ A')}이다.`,
          facts: { rule: 'elem-cond' }
        });
      }
      // 0과 {0}, ∅, 분수·문자·낱말이 원소인 집합
      const IN = [
        { h: `0 ${box()} {0}`, s: '0은 집합 {0}의 원소이다', v: [0].includes(0) },
        { h: `2 ${box()} ${bset(X + '는 짝수인 소수')}`, s: '짝수인 소수는 2뿐이다', v: primesTo(20).filter(even).includes(2) },
        { h: `${MINUS}1 ${box()} ${bset(X + '<sup>2</sup> = 1')}`, s: `${X}<sup>2</sup> = 1의 해는 ${MINUS}1, 1이다`, v: [-1, 1].includes(-1) },
        { h: `${vc} ${box()} {${V('a')}, ${vb}, ${vc}, ${V('d')}}`, s: `${vc}는 네 원소 가운데 하나이다`, v: ['a', 'b', 'c', 'd'].includes('c') },
        { h: `5 ${box()} {1, 3, 5, 7}`, s: '5는 그 집합의 원소이다', v: [1, 3, 5, 7].includes(5) }
      ];
      const OUT = [
        { h: `0 ${box()} ∅`, s: '공집합에는 원소가 하나도 없다', v: [].includes(0) },
        { h: `4 ${box()} {1, 2, 3}`, s: '4는 그 집합에 없다', v: [1, 2, 3].includes(4) },
        { h: `${frac(1, 3)} ${box()} {${frac(1, 4)}, ${frac(1, 2)}, 2, 4}`, s: `${frac(1, 3)}은 그 집합에 없다`, v: [1 / 4, 1 / 2, 2, 4].includes(1 / 3) },
        { h: `1 ${box()} ${bset(X + '는 소수')}`, s: '1은 소수가 아니다', v: isPrime(1) },
        { h: `${MINUS}2 ${box()} ${bset(X + '는 자연수')}`, s: `${MINUS}2는 자연수가 아니다`, v: -2 >= 1 },
        { h: `귤 ${box()} {배, 사과, 바나나}`, s: '귤은 그 집합에 없다', v: ['배', '사과', '바나나'].includes('귤') }
      ];
      if (IN.some((r) => !r.v) || OUT.some((r) => r.v)) throw new Error('원소 판정이 어긋난다');
      const many = d.bool(), main = d.shuffle(many ? IN : OUT).slice(0, 4), lone = d.pick(many ? OUT : IN);
      return choose(d, ask, main.map((r) => [nb(r.h), false]).concat([[nb(lone.h), true]]), {
        explain: `${lone.s}${many ? '. 따라서 이것만 ∉가 들어가고 나머지는 ∈가 들어간다.' : '. 따라서 이것만 ∈가 들어가고 나머지는 ∉가 들어간다.'}`,
        facts: { rule: 'elem-zero' }
      });
    }, { count: 2 }),
    T('mean-claim', '원소·부분집합 기호 문장의 참·거짓', '①3', (d, n) => {
      const kind = d.int(0, 1), base = kind ? d.pick([12, 18, 20, 24]) : 0;
      const A = kind ? divisors(base) : someNums(d, 4, 1, 9), Ah = kind ? bset(`${X}는 ${base}의 약수`) : setH(A);
      const pool = rng(1, kind ? base + 2 : 10), ins = d.shuffle(A), outs = d.shuffle(pool.filter((x) => !A.includes(x)));
      const [p, q] = ins, r = outs[0], s2 = outs[1];
      const big = kind ? divisors(base * 2) : cup(A, [r]);
      const ALL = [
        [`${p} ∈ A`, A.includes(p)], [`${r} ∈ A`, A.includes(r)], [`${r} ∉ A`, !A.includes(r)], [`${q} ∉ A`, !A.includes(q)],
        [`${setH(S([p, q]))} ⊂ A`, inside([p, q], A)], [`${setH(S([p, r]))} ⊂ A`, inside([p, r], A)], [`${setH(S([q, s2]))} ⊄ A`, !inside([q, s2], A)], [`${setH(S([p, q]))} ⊄ A`, !inside([p, q], A)],
        ['∅ ⊂ A', inside([], A)], ['∅ ⊄ A', !inside([], A)], [`{${p}} ∈ A`, false], [`A ⊂ ${setH(S([p, q]))}`, inside(A, [p, q])],
        [`A ⊂ ${kind ? bset(`${X}는 ${base * 2}의 약수`) : setH(big)}`, inside(A, big)]
      ].map(([h, v]) => [nb(h), v]);
      const head = `집합 A = ${Ah}에 대하여 `;
      const said = kind ? `A = ${setH(A)}이다. ` : '';
      if (n === 0) {
        const rows = d.shuffle(ALL).slice(0, 4);
        if (!rows.some((x) => x[1]) || rows.every((x) => x[1])) return null;
        return combo(d, head + '다음 보기에서 옳은 것을 모두 고른 것은?', rows, {
          explain: `${said}원소는 ∈, ∉로, 집합은 ⊂, ⊄로 나타낸다. 공집합은 모든 집합의 부분집합이고, {${p}}처럼 중괄호로 묶은 것은 원소가 아니라 집합이다. 참인 것은 ${HAN.slice(0, rows.length).filter((_, i) => rows[i][1]).join(', ')}이다.`,
          facts: { rule: 'claim-all' }
        });
      }
      const yes = d.shuffle(ALL.filter((x) => x[1])), no = d.shuffle(ALL.filter((x) => !x[1]));
      if (no.length < 4) return null;
      const rows = [yes[0]].concat(no.slice(0, 4).map((x) => [x[0], false]));
      return choose(d, head + '다음 중 옳은 것은?', rows, {
        explain: `${said}원소는 ∈, 집합은 ⊂로 나타낸다. 옳은 것은 ${yes[0][0]}이다. 나머지는 원소와 집합을 바꾸어 썼거나, 원소가 아닌 수가 들어 있다.`,
        facts: { rule: 'claim-one' }
      });
    }, { count: 2 }),
    T('mean-sym', '□ 안에 알맞은 기호 — ∈, ∉, ⊂, ⊄', '①4', (d) => {
      const A = someNums(d, 3, 0, 6), outs = rng(0, 9).filter((x) => !A.includes(x)), [p, q] = d.shuffle(A), r = d.pick(outs);
      const KINDS = [[`${p} ${box()} A`, '∈', `${josa(p, '은/는')} A의 원소이므로`], [`${r} ${box()} A`, '∉', `${josa(r, '은/는')} A의 원소가 아니므로`], [`{${q}} ${box()} A`, '⊂', `${wj('{' + q + '}', '은/는')} A의 부분집합이므로`],
        [`∅ ${box()} A`, '⊂', '∅은 모든 집합의 부분집합이므로'], [`{${p}, ${r}} ${box()} A`, '⊄', `${josa(r, '이/가')} A에 없어 ${wj('{' + p + ', ' + r + '}', '은/는')} A의 부분집합이 아니므로`]];
      const rows = d.shuffle(KINDS).slice(0, 3), right = rows.map((r0) => r0[1]);
      if (new Set(right).size === 1) return null;
      const alt = (s) => (s === '∈' || s === '∉' ? ['∈', '∉', '⊂'] : ['⊂', '⊄', '∈']);
      const cands = [];
      for (const a of alt(right[0])) for (const b of alt(right[1])) for (const c of alt(right[2])) { const t = [a, b, c]; if (t.join() !== right.join()) cands.push(t); }
      const wrong = d.shuffle(cands).sort((x, y) => x.filter((s, i) => s !== right[i]).length - y.filter((s, i) => s !== right[i]).length).slice(0, 4);
      const tj = (t) => t.join(', ');
      return choose(d, `집합 A = ${setH(A)}에 대하여 ㉠, ㉡, ㉢의 □ 안에 알맞은 기호를 차례로 나열한 것은?`, wrong.map((t) => [tj(t), false]).concat([[tj(right), true]]), {
        figure: lines(rows.map((r0, i) => tag(CIR[i]) + nb(r0[0]))),
        explain: rows.map((r0, i) => `${CIR[i]} ${r0[2]} ${r0[1]}`).join(', ') + '이다.',
        facts: { rule: 'sym-three' }
      });
    }),
    T('mean-list', '조건제시법을 원소나열법으로', '①6', (d) => {
      const kind = d.int(0, 4);
      let cond, right, wrongs;
      if (kind === 0) {
        const a = 2 * d.int(1, 5), b = a + 2 * d.int(3, 4), ev = (lo, hi) => rng(lo, hi).filter(even);
        cond = `${X}는 ${a} 이상 ${b} 이하의 짝수`; right = ev(a, b); wrongs = [ev(a + 1, b), ev(a, b - 1), ev(a + 1, b - 1), ev(a, b + 2), ev(a - 2, b)];
      } else if (kind === 1) {
        const a = d.int(1, 5), b = a + d.int(4, 6);
        cond = `${X}는 ${a}보다 크고 ${b}보다 작은 자연수`; right = rng(a + 1, b - 1); wrongs = [rng(a, b - 1), rng(a + 1, b), rng(a, b), rng(a + 2, b - 1)];
      } else if (kind === 2) {
        const nn = d.pick([12, 18, 20, 28, 30, 16]), dv = divisors(nn);
        cond = `${X}는 ${nn}의 약수`; right = dv; wrongs = [dv.slice(1), dv.slice(0, -1), dv.filter((_, i) => i !== 2), [nn, 2 * nn, 3 * nn], dv.slice(1, -1)];
      } else if (kind === 3) {
        const r = d.int(2, 6);
        cond = `${X}<sup>2</sup> = ${r * r}`; right = [-r, r]; wrongs = [[r], [r * r], [-(r * r), r * r], [-r], [r, r * r]];
      } else {
        const k = d.pick([3, 4, 5, 6]), m = k * d.int(4, 5);
        cond = `${X}는 ${m}보다 작은 ${k}의 배수`; right = rng(1, m - 1).filter((v) => v % k === 0); wrongs = [rng(1, m).filter((v) => v % k === 0), rng(k + 1, m - 1).filter((v) => v % k === 0), divisors(m), rng(0, m - 1).filter((v) => v % k === 0)];
      }
      return setChoice(d, `집합 ${wj(bset(cond), '을/를')} 원소나열법으로 나타낸 것은?`, right, wrongs, {
        explain: `조건을 만족시키는 원소를 모두 찾으면 ${listH(right)}이다. 따라서 ${wj(bset(cond), '은/는')} ${setH(right)}이다.`
      });
    }),
    T('mean-rule', '원소나열법을 조건제시법으로', '①7', (d) => {
      const kind = d.int(0, 2), LIM = 300;
      // 조건마다 1~300 의 원소와 유한인지로 견준다.
      const cond = (h, has, fin) => ({ h: bset(`${X}는 ${h}`), mem: rng(1, LIM).filter(has).join(','), fin });
      let shown, list;
      if (kind === 0) {
        const k = d.pick([3, 4, 5, 6, 7]);
        shown = nb(`{${k}, ${2 * k}, ${3 * k}, …}`);
        const target = cond(`${k}의 배수`, (x) => x % k === 0, false);
        list = [target, cond(`${k}의 약수`, (x) => k % x === 0, true), cond(`${3 * k} 이하의 ${k}의 배수`, (x) => x % k === 0 && x <= 3 * k, true), cond(`${2 * k}의 배수`, (x) => x % (2 * k) === 0, false), cond(`${k} 이상의 자연수`, (x) => x >= k, false)].map((c) => [c.h, c.mem === target.mem && c.fin === target.fin]);
      } else if (kind === 1) {
        const nn = d.pick([6, 8, 10, 12, 15, 16, 18, 20]), dv = divisors(nn);
        shown = setH(dv);
        const target = cond(`${nn}의 약수`, (x) => nn % x === 0, true);
        list = [target, cond(`${2 * nn}의 약수`, (x) => (2 * nn) % x === 0, true), cond(`${nn} 이하의 자연수`, (x) => x <= nn, true), cond(`${nn}보다 작은 ${nn}의 약수`, (x) => nn % x === 0 && x < nn, true), cond(`${nn}의 배수`, (x) => x % nn === 0, false)].map((c) => [c.h, c.mem === target.mem && c.fin === target.fin]);
      } else {
        const m = d.int(4, 7), top = 2 * m - 1, od = rng(1, top).filter(odd);
        shown = setH(od);
        const target = cond(`${2 * m}보다 작은 홀수`, (x) => odd(x) && x < 2 * m, true);
        list = [target, cond(`${top}보다 작은 홀수`, (x) => odd(x) && x < top, true), cond(`${2 * m} 이하의 자연수`, (x) => x <= 2 * m, true), cond(`${top + 2} 이하의 홀수`, (x) => odd(x) && x <= top + 2, true), cond(`${2 * m}의 약수`, (x) => (2 * m) % x === 0, true)].map((c) => [c.h, c.mem === target.mem && c.fin === target.fin]);
      }
      const good = list.find((r) => r[1]);
      return choose(d, `집합 ${wj(shown, '을/를')} 조건제시법으로 나타낸 것은?`, list, {
        explain: `${kind === 0 ? '원소들이 모두 같은 수의 배수이고 끝없이 이어지므로 무한집합이다' : '원소들의 공통된 성질을 찾는다'}. 원소가 꼭 같은 집합은 ${good[0]}이다. 다른 보기는 원소가 하나라도 빠지거나 더 있다.`
      });
    }),
    T('mean-form', '식으로 원소를 만드는 조건제시법', '①8', (d) => {
      const a = d.int(2, 5), b = d.int(1, 4), p = d.int(0, 2), q = p + d.int(3, 4);
      const ks = rng(p + 1, q - 1), f = (k) => a * k + b, right = ks.map(f);
      const wrongs = [rng(p, q - 1).filter((k) => k >= 0).map(f), rng(p + 1, q).map(f), ks, ks.map((k) => a * k), rng(p, q).filter((k) => k >= 0).map(f)];
      const h = `{${a}${vk} + ${b} | ${p} &lt; ${vk} &lt; ${q}, ${vk}는 자연수}`;
      return setChoice(d, `집합 ${wj(h, '을/를')} 원소나열법으로 나타낸 것은?`, right, wrongs, {
        explain: `${p} &lt; ${vk} &lt; ${q}인 자연수 ${vk}는 ${listH(ks)}이다. 이것을 ${a}${vk} + ${b}에 넣으면 ${listH(right)}이므로 ${setH(right)}이다.`
      });
    }),
    T('mean-same', '같은 집합을 나타낸 것 가리기', '①9', (d, n) => {
      const builders = (key) => CAT.filter((c) => c.key === key);
      if (n === 0) {
        const keys = [...new Set(CAT.map((c) => c.key))].filter((k) => builders(k).length >= 4 && nearKeys(builders(k)[0].set).length);
        const key = d.pick(keys), T0 = builders(key)[0].set, good = d.shuffle(builders(key)).slice(0, 4), nk = d.pick(nearKeys(T0)), bad = d.pick(builders(nk));
        return choose(d, `집합 ${wj(setH(T0), '을/를')} 조건제시법으로 나타낸 것으로 옳지 않은 것은?`, good.map((c) => [c.h, false]).concat([[bad.h, true]]), {
          explain: `${wj(bad.h, '을/를')} 원소나열법으로 나타내면 ${wj(setH(bad.set), '이므로/이므로')} ${setH(T0)}${jo(setH(T0), '과/와')} 같지 않다. 나머지는 모두 ${setH(T0)}${jo(setH(T0), '을/를')} 나타낸다.`,
          facts: { rule: 'same-wrong' }
        });
      }
      // 두 쌍이 서로 같은 집합 넷 — 짝 짓기
      const keys = [...new Set(CAT.map((c) => c.key))].filter((k) => builders(k).length >= 1 && k.split(',').length >= 2 && k.split(',').length <= 5);
      const [k1, k2] = d.shuffle(keys);
      const rep = (k) => { const bs = d.shuffle(builders(k)); return d.bool() ? [bs[0].h, setH(bs[0].set)] : bs.length >= 2 ? [bs[0].h, bs[1].h] : [bs[0].h, setH(bs[0].set)]; };
      const four = d.shuffle(rep(k1).map((h) => [h, k1]).concat(rep(k2).map((h) => [h, k2])));
      if (new Set(four.map((x) => stripH(x[0]))).size !== 4) return null;
      const pairings = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]];
      const okP = (pp) => pp.every(([i, j]) => four[i][1] === four[j][1]);
      return choose(d, '다음 네 집합 가운데 서로 같은 집합끼리 바르게 짝 지은 것은?', pairings.map((pp) => [pp.map(([i, j]) => `${CIR[i]}과 ${CIR[j]}`).join(', '), okP(pp)]), {
        figure: lines(four.map((x, i) => tag(CIR[i]) + x[0])),
        explain: `원소나열법으로 고쳐 보면 ${four.map((x, i) => CIR[i] + ' ' + setH(x[1].split(',').map(Number))).join(', ')}이다. 원소가 모두 같은 것끼리 짝 짓는다.`,
        facts: { rule: 'same-pair' }
      });
    }, { count: 2 }),
    T('mean-count', '원소의 개수 n(A)', '①10', (d, n) => {
      if (n === 0) {
        const kind = d.int(0, 3);
        let h, list, calc = null;
        if (kind === 0) { const nn = d.pick([16, 18, 20, 28, 30, 35, 36, 40, 45]); h = bset(`${X}는 ${nn}의 약수`); list = divisors(nn); }
        else if (kind === 1) { const m = d.int(12, 30); h = bset(`${X}는 ${m} 이하의 소수`); list = primesTo(m); }
        else if (kind === 2) { const k = d.int(2, 6); h = bset(`|${X}| ≤ ${k}, ${X}는 정수`); list = rng(-k, k); calc = `2*${k}+1`; }
        else { const a = d.int(-5, 2), b = a + d.int(3, 7); h = bset(`${sT(a)} &lt; ${X} ≤ ${b}, ${X}는 정수`); list = rng(a + 1, b); calc = `${b}-(${a})`; }
        return N(`집합 A = ${h}에 대하여 ${nOf('A')}의 값은?`, list.length, {
          explain: `A = ${wj(setH(list), '이므로/이므로')} ${nOf('A')} = ${list.length}이다.`,
          facts: calc ? { calc: [[calc, 0]], derived: [2] } : { rule: 'count-cond' }
        });
      }
      const a = d.int(2, 9), dd = d.pick([2, 3, 4, 5]), k1 = d.int(6, 12), last1 = a + dd * (k1 - 1);
      const b = d.int(1, 3), e = d.pick([2, 3]), k2 = d.int(7, 14), last2 = b + e * (k2 - 1);
      if (e === dd) return null;
      const A = nb(`{${a}, ${a + dd}, ${a + 2 * dd}, …, ${last1}}`), Bh = nb(`{${b}, ${b + e}, ${b + 2 * e}, …, ${last2}}`);
      return M(`두 집합 A = ${A}, B = ${Bh}에 대하여 ${nOf('A')}, ${nOf('B')}의 값은?`, [{ answer: k1, lead: nOf('A') + ' =' }, { answer: k2, lead: nOf('B') + ' =' }], {
        shown: `${nOf('A')} = ${k1}, ${nOf('B')} = ${k2}`,
        explain: `A의 원소는 ${a}부터 ${dd}씩 커져 ${last1}까지이므로 (${last1} − ${a}) ÷ ${dd} + 1 = ${k1}개, B의 원소는 ${b}부터 ${e}씩 커져 ${last2}까지이므로 (${last2} − ${b}) ÷ ${e} + 1 = ${k2}개이다.`,
        facts: { calc: [[`(${last1}-${a})/${dd}+1`, 0], [`(${last2}-${b})/${e}+1`, 1]], derived: [dd, e] }
      });
    }, { count: 2 }),
    T('mean-empty', '공집합 가리기', '①11', (d) => {
      const a = d.int(1, 9), k = d.int(1, 9), m = d.int(2, 9);
      const EMPTY = [
        [bset(`${X}<sup>2</sup> + ${k} ≤ 0, ${X}는 실수`), [], `${X}<sup>2</sup> ≥ 0이므로 ${X}<sup>2</sup> + ${josa(k, '은/는')} 늘 양수이다`],
        [bset(`${a} &lt; ${X} &lt; ${a + 1}, ${X}는 자연수`), rng(a + 1, a), `${josa(a, '과/와')} ${a + 1} 사이에는 자연수가 없다`],
        [bset(`${X}는 10보다 작은 두 자리 자연수`), rng(10, 9), '두 자리 자연수는 10 이상이다'],
        [bset(`${X}는 2보다 작은 소수`), primesTo(1), '가장 작은 소수는 2이다'],
        [bset(`${X}<sup>2</sup> = ${MINUS}${m}, ${X}는 실수`), [], '제곱하여 음수가 되는 실수는 없다']
      ];
      const FULL = [
        ['{0}', [0], '0을 원소로 갖는다'], [bset(`${X}<sup>2</sup> = 0`), [0], '0을 원소로 갖는다'], [bset(`${X}는 1 이하의 자연수`), [1], '1을 원소로 갖는다'],
        [bset(`${X}<sup>2</sup> ≤ 0, ${X}는 실수`), [0], '0을 원소로 갖는다'], [bset(`${X}는 3보다 작은 소수`), primesTo(2), '2를 원소로 갖는다'], [bset(`${a} ≤ ${X} &lt; ${a + 1}, ${X}는 정수`), rng(a, a), `${josa(a, '을/를')} 원소로 갖는다`]
      ];
      const ke = d.int(1, 2), rows = d.shuffle(d.shuffle(EMPTY).slice(0, ke).concat(d.shuffle(FULL).slice(0, 4 - ke)));
      return combo(d, '다음 보기에서 공집합인 것을 모두 고른 것은?', rows.map((r) => [r[0], r[1].length === 0]), {
        explain: rows.map((r, i) => `${HAN[i]}. ${r[2]}${r[1].length ? '.' : '(공집합).'}`).join(' ') + ' 원소가 0 하나인 {0}은 공집합이 아니다.'
      });
    }),
    T('mean-word', '낱말의 글자로 만든 집합의 원소의 개수', '①13', (d) => {
      const w = d.pick(['banana', 'apple', 'tomato', 'pepper', 'coffee', 'letter', 'success', 'committee', 'mathematics', 'balloon', 'cookie', 'butter']);
      const set = [...new Set(w.split(''))];
      return N(`낱말 ‘${w}’에 들어 있는 알파벳으로 이루어진 집합을 A라 할 때, ${nOf('A')}의 값은?`, set.length, {
        explain: `같은 원소는 한 번만 쓰므로 A = {${set.map((ch) => V(ch)).join(', ')}}이다. 따라서 ${nOf('A')} = ${set.length}이다.`,
        facts: { rule: 'word-letters' }
      });
    }),
    T('mean-venn', '벤 다이어그램의 빈칸에 알맞은 원소', '①14', (d) => {
      const kind = d.int(0, 1);
      let hA, hB, A, Bs;
      if (kind === 0) { const [a, b] = d.pick([[4, 12], [6, 18], [4, 20], [9, 18], [6, 12], [10, 20], [8, 24], [5, 20]]); A = divisors(a); Bs = divisors(b); hA = bset(`${X}는 ${a}의 약수`); hB = bset(`${X}는 ${b}의 약수`); }
      else { const [m, k, b] = d.pick([[10, 3, 18], [12, 4, 24], [15, 5, 30], [10, 5, 20], [12, 6, 24]]); A = rng(1, m).filter((v) => v % k === 0); Bs = divisors(b); hA = bset(`${X}는 ${m} 이하의 ${k}의 배수`); hB = bset(`${X}는 ${b}의 약수`); }
      if (!inside(A, Bs)) throw new Error('A ⊂ B 가 아니다');
      const outer = sub(Bs, A), p = d.pick(A), q = d.pick(outer);
      if (A.length > 4 || outer.length > 5) return null;
      const fig = vennIn(d.shuffle(A), d.shuffle(outer), { [p]: GANA[0], [q]: GANA[1] });
      return M(`두 집합 A = ${hA}, B = ${wj(hB, '을/를')} 벤 다이어그램으로 나타낸 것이다. ㈎, ㈏에 알맞은 수는?`, [{ answer: p, label: '㈎' }, { answer: q, label: '㈏' }], {
        figure: fig, shown: `㈎ ${p}, ㈏ ${q}`,
        explain: `A = ${setH(A)}, B = ${wj(setH(Bs), '이므로/이므로')} A ⊂ B이다. ㈎는 A의 원소 가운데 그림에 없는 ${wj(String(p), '이고/이고')}, ㈏는 B의 원소이지만 A의 원소가 아닌 것 가운데 그림에 없는 ${q}이다.`,
        facts: { rule: 'venn-blank' }
      });
    }),
    T('mean-make', '두 집합의 원소로 만든 집합', '①15', (d, n) => {
      if (n === 0) {
        const A = someNums(d, d.int(2, 3), 0, 6), sums = [], prods = [];
        for (const x of A) for (const y of A) { sums.push(x + y); prods.push(x * y); }
        const right = S(sums), noDouble = S(A.flatMap((x) => A.filter((y) => y !== x).map((y) => x + y)));
        const wrongs = [noDouble, S(A.map((x) => 2 * x)), S(prods), cup(right, [Math.max(...right) + 1]), right.slice(1), right.slice(0, -1)];
        return setChoice(d, `집합 A = ${setH(A)}에 대하여 집합 B = {${X} + ${Y} | ${X} ∈ A, ${Y} ∈ A}를 원소나열법으로 나타낸 것은?`, right, wrongs, {
          explain: `${X}, ${Y}에 A의 원소를 하나씩 넣어(같은 원소를 두 번 넣어도 된다) 더하면 ${sums.join(', ')}이다. 같은 수는 한 번만 쓰므로 B = ${setH(right)}이다.`,
          facts: { rule: 'make-sum' }
        });
      }
      const A = S(d.shuffle([-3, -2, -1, 1, 2, 3, 4]).slice(0, 3)), Bs = S(d.shuffle([-2, -1, 1, 2, 3]).slice(0, 2)), prods = [];
      for (const x of A) for (const y of Bs) prods.push(x * y);
      const Cs = S(prods);
      if (Cs.length >= 6 || Cs.length < 3) return null;
      return N(`두 집합 A = ${setH(A)}, B = ${setH(Bs)}에 대하여 집합 C = {${X}${Y} | ${X} ∈ A, ${Y} ∈ B}일 때, ${nOf('C')}의 값은?`, Cs.length, {
        explain: `A의 원소와 B의 원소를 하나씩 곱하면 ${prods.map(sT).join(', ')}이다. 같은 수는 한 번만 쓰므로 C = ${wj(setH(Cs), '이고/이고')} ${nOf('C')} = ${Cs.length}이다.`,
        facts: { rule: 'make-prod' }
      });
    }, { count: 2 }),
    T('mean-chain', '만든 집합들 사이의 포함 관계', '①16', (d) => {
      const A = S(d.shuffle([-1, 0, 1, 2, 3]).slice(0, 3));
      const OPS = [['x − y', (x, y) => x - y, `${X} ${MINUS} ${Y}`], ['x + y', (x, y) => x + y, `${X} + ${Y}`], ['xy', (x, y) => x * y, `${X}${Y}`], ['x² − y', (x, y) => x * x - y, `${X}<sup>2</sup> ${MINUS} ${Y}`], ['x²', (x) => x * x, `${X}<sup>2</sup>`]];
      const [o1, o2] = d.shuffle(OPS).slice(0, 2), make = (op) => S(A.flatMap((x) => A.map((y) => op[1](x, y))));
      const Bs = make(o1), Cs = make(o2), sets = { A, B: Bs, C: Cs };
      if (new Set([keyOf(A), keyOf(Bs), keyOf(Cs)]).size !== 3) return null;
      const orders = [['A', 'B', 'C'], ['A', 'C', 'B'], ['B', 'A', 'C'], ['B', 'C', 'A'], ['C', 'A', 'B'], ['C', 'B', 'A']];
      const ok = (o) => inside(sets[o[0]], sets[o[1]]) && inside(sets[o[1]], sets[o[2]]);
      if (orders.filter(ok).length !== 1) return null;
      const good = orders.find(ok), shown = d.shuffle(orders.filter((o) => !ok(o))).slice(0, 4).concat([good]);
      const def = (op) => op[0] === 'x²' ? `{${op[2]} | ${X} ∈ A}` : `{${op[2]} | ${X} ∈ A, ${Y} ∈ A}`;
      return choose(d, `세 집합 A = ${setH(A)}, B = ${def(o1)}, C = ${def(o2)}에 대하여 다음 중 옳은 것은?`, shown.map((o) => [nb(o.join(' ⊂ ')), ok(o)]), {
        explain: `B = ${setH(Bs)}, C = ${wj(setH(Cs), '이므로/이므로')} ${good.join(' ⊂ ')}이다.`,
        facts: { rule: 'chain' }
      });
    }),
    T('mean-back', '{x + y | x ≠ y}에서 처음 원소 되짚기', '①17', (d) => {
      const [a, b, c] = d.until(() => someNums(d, 3, 1, 9), (t) => new Set([t[0] + t[1], t[0] + t[2], t[1] + t[2]]).size === 3);
      const s1 = a + b, s2 = a + c, s3 = b + c;
      return M(`서로 다른 세 자연수를 원소로 갖는 집합 A = {${va}, ${vb}, ${vc}}에 대하여 집합 B = {${X} + ${Y} | ${X} ∈ A, ${Y} ∈ A, ${X} ≠ ${Y}}라 하자. B = {${s1}, ${s2}, ${s3}}일 때, ${va}, ${vb}, ${vc}의 값은? (단, ${va} &lt; ${vb} &lt; ${vc})`,
        [{ answer: a, lead: va + ' =' }, { answer: b, lead: vb + ' =' }, { answer: c, lead: vc + ' =' }], {
          shown: `${va} = ${a}, ${vb} = ${b}, ${vc} = ${c}`,
          explain: `${va} &lt; ${vb} &lt; ${vc}이므로 ${va} + ${vb} &lt; ${va} + ${vc} &lt; ${vb} + ${vc}이다. 곧 ${va} + ${vb} = ${s1}, ${va} + ${vc} = ${s2}, ${vb} + ${vc} = ${s3}이다. 세 식을 모두 더하면 2(${va} + ${vb} + ${vc}) = ${s1 + s2 + s3}이므로 ${va} + ${vb} + ${vc} = ${a + b + c}이고, ${va} = ${a}, ${vb} = ${b}, ${vc} = ${c}이다.`,
          facts: { calc: [[`(${s1}+${s2}-${s3})/2`, 0], [`(${s1}+${s3}-${s2})/2`, 1], [`(${s2}+${s3}-${s1})/2`, 2]], derived: [2] }
        });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 나. 집합 사이의 포함 관계
  // ════════════════════════════════════════════════════════════════
  // 두 집합의 짝 하나(포함 관계 가리기): [글, A ⊂ B 인가]
  function pairForSubset(d, kind) {
    if (kind === 0) { const Bs = someNums(d, 5, 1, 12), A = d.bool() ? S(pickN(d, Bs, 2)) : S([d.pick(Bs), d.pick(rng(1, 12).filter((x) => !Bs.includes(x)))]); return [`A = ${setH(A)}, B = ${setH(Bs)}`, inside(A, Bs)]; }
    if (kind === 1) { const L = 'pqrstuvwxyz'.split(''), Bs = S(pickN(d, L, 5)), A = d.bool() ? S(pickN(d, Bs, 3)) : S(pickN(d, Bs, 2).concat([d.pick(L.filter((x) => !Bs.includes(x)))])); return [`A = ${setH(A)}, B = ${setH(Bs)}`, inside(A, Bs)]; }
    if (kind === 2) { const nn = d.pick([6, 8, 10, 12, 18, 20, 24]), [p, q] = S(pickN(d, rng(1, 6), 2)); return [`A = ${bset(`${rootsH(p, q)} = 0`)}, B = ${bset(`${X}는 ${nn}의 약수`)}`, inside([p, q], divisors(nn))]; }
    if (kind === 3) { const m = d.pick([6, 8, 9, 10, 12, 15, 18, 20]), nn = d.pick(rng(2, 6).filter((v) => v !== m)); return [`A = ${bset(`${X}는 ${m}의 배수`)}, B = ${bset(`${X}는 ${nn}의 배수`)}`, m % nn === 0]; }
    const p = d.int(-3, 1), q = p + d.int(2, 5), r = q + d.int(-1, 2);
    return [`A = ${bset(`${rootsH(p, q)} &lt; 0`)}, B = ${bset(`${X} &lt; ${sT(r)}`)}`, q <= r];
  }
  const subsetTypes = [
    T('sub-judge', '두 집합 사이의 포함 관계 가리기', '①23', (d) => {
      const rows = d.shuffle([0, 1, 2, 3, 4]).slice(0, 3).map((k) => pairForSubset(d, k));
      if (rows.every((r) => r[1]) || rows.every((r) => !r[1])) return null;
      return combo(d, '다음 보기에서 A ⊂ B인 것을 모두 고른 것은?', rows, {
        explain: `A의 모든 원소가 B에 속할 때 A ⊂ B이다. 원소나열법으로 고쳐 보거나 범위를 견주어 보면 A ⊂ B인 것은 ${HAN.slice(0, rows.length).filter((_, i) => rows[i][1]).join(', ')}이다. 조건이 배수이면 큰 수의 배수의 집합이 작은 수의 배수의 집합에 포함되고, 범위이면 A의 범위가 B의 범위 안에 들어야 한다.`
      });
    }),
    T('sub-marks', '두 집합의 관계를 나타낸 기호 모두 고르기', '①24', (d) => {
      const keys = [...new Set(CAT.map((c) => c.key))].filter((k) => k.split(',').length >= 2 && k.split(',').length <= 6);
      const rel = d.int(0, 3), k1 = d.pick(keys), set1 = k1.split(',').map(Number);
      let set2;
      if (rel === 0) set2 = set1;
      else if (rel === 1) { const others = keys.filter((k) => k !== k1 && inside(set1, k.split(',').map(Number))); if (!others.length) return null; set2 = d.pick(others).split(',').map(Number); }
      else if (rel === 2) { const others = keys.filter((k) => k !== k1 && inside(k.split(',').map(Number), set1)); if (!others.length) return null; set2 = d.pick(others).split(',').map(Number); }
      else { const others = keys.filter((k) => { const s = k.split(',').map(Number); return !inside(s, set1) && !inside(set1, s) && cap(s, set1).length; }); if (!others.length) return null; set2 = d.pick(others).split(',').map(Number); }
      const c1 = d.pick(catBy(keyOf(set1))), c2 = d.pick(catBy(keyOf(set2))), A = c1.set, Bs = c2.set;
      if (c1.h === c2.h) return null;
      const ST = [['A ⊂ B', inside(A, Bs)], ['B ⊂ A', inside(Bs, A)], ['A ⊄ B', !inside(A, Bs)], ['B ⊄ A', !inside(Bs, A)], ['A = B', same(A, Bs)], ['A ≠ B', !same(A, Bs)]];
      const rows = d.shuffle(ST).slice(0, 4).map(([h, v]) => [nb(h), v]);
      return combo(d, `두 집합 A = ${c1.h}, B = ${c2.h}에 대하여 다음 보기에서 옳은 것을 모두 고른 것은?`, rows, {
        explain: `A = ${setH(A)}, B = ${wj(setH(Bs), '이다/이다')}. ${same(A, Bs) ? 'A ⊂ B이고 B ⊂ A이므로 A = B이다.' : (inside(A, Bs) ? 'A ⊂ B이지만 B ⊄ A이다.' : inside(Bs, A) ? 'B ⊂ A이지만 A ⊄ B이다.' : 'A ⊄ B이고 B ⊄ A이다.') + ' 따라서 A ≠ B이다.'}`
      });
    }),
    T('sub-equal', '서로 같은 두 집합 고르기', '①25', (d) => {
      const keys = [...new Set(CAT.map((c) => c.key))].filter((k) => nearKeys(k.split(',').map(Number)).length && k.split(',').length >= 2);
      const k0 = d.pick(keys), good = catBy(k0), g1 = d.pick(good), g2 = d.bool() || good.length < 2 ? null : d.pick(good.filter((c) => c !== g1));
      const rowOf = (h1, h2) => nb('A = ' + h1) + ', ' + nb('B = ' + h2);
      const rows = [[rowOf(g1.h, g2 ? g2.h : setH(g1.set)), true]];
      // 같지 않은 짝: 조건제시법 하나와, 원소 하나만 다른 집합(원소나열법이나 다른 조건)
      const wrongPair = () => {
        const c1 = rows.length === 1 ? d.pick(good) : d.pick(CAT.filter((c) => c.set.length >= 2 && c.set.length <= 6));
        const nk = nearKeys(c1.set);
        if (nk.length && d.bool()) { const c2 = d.pick(catBy(d.pick(nk))); return [c1.h, c2.h, c1.set, c2.set]; }
        const s2 = nearSet(d, c1.set); return [c1.h, setH(s2), c1.set, s2];
      };
      for (let i = 0; i < 40 && rows.length < 5; i += 1) {
        const [h1, h2, s1, s2] = wrongPair();
        if (same(s1, s2) || h1 === h2) continue;
        rows.push([rowOf(h1, h2), false]);
      }
      if (rows.length < 5) return null;
      return choose(d, '다음 중 두 집합 A, B가 서로 같은 것은?', rows, {
        explain: `원소나열법으로 고쳐 원소가 모두 같은지 본다. 서로 같은 것은 A = ${g1.h}${g2 ? ', B = ' + g2.h : ''}로 둘 다 ${setH(g1.set)}이다.`
      });
    }),
    T('sub-all', '부분집합이 아닌 것 고르기', '①26', (d) => {
      const A = d.bool() ? someNums(d, d.int(3, 4), 1, 9) : S(pickN(d, ['a', 'b', 'c', 'd', 'e'], 3)), pool = typeof A[0] === 'number' ? rng(0, 9) : ['a', 'b', 'c', 'd', 'e', 'f'];
      const outsider = d.pick(pool.filter((x) => !A.includes(x))), subs = subsetsOf(A).filter((s) => s.length >= 1 && s.length < A.length);
      const bad = S(pickN(d, A, d.int(1, 2)).concat([outsider]));
      // 보기: ∅, A 자신, 진부분집합 둘(모두 부분집합) — 그리고 부분집합이 아닌 것 하나(답)
      const rows = [['∅', !inside([], A)], [setH(A), !inside(A, A)]].concat(d.shuffle(subs).slice(0, 2).map((s) => [setH(s), !inside(s, A)]), [[setH(bad), !inside(bad, A)]]);
      return choose(d, `다음 중 집합 A = ${setH(A)}의 부분집합이 아닌 것은?`, rows, {
        explain: `${setH(bad)}의 원소 ${elH(outsider)}${jo(elH(outsider), '은/는')} A의 원소가 아니므로 A의 부분집합이 아니다. ∅은 모든 집합의 부분집합이고, A 자신도 A의 부분집합이다.`
      });
    }),
    T('sub-proper', '진부분집합이 아닌 것 고르기', '①27', (d) => {
      const A = d.bool() ? someNums(d, d.int(3, 4), 0, 9) : S(pickN(d, ['m', 'a', 't', 'h', 'p'], 4)), pool = typeof A[0] === 'number' ? rng(0, 9) : ['m', 'a', 't', 'h', 'p', 's'];
      const subs = d.shuffle(subsetsOf(A).filter((s) => s.length >= 1 && s.length < A.length)), selfAns = d.bool();
      const outsider = d.pick(pool.filter((x) => !A.includes(x)));
      const rows = [['∅', false]].concat(subs.slice(0, 3).map((s) => [setH(s), false]));
      rows.push(selfAns ? [setH(A), true] : [setH(S(pickN(d, A, 1).concat([outsider]))), true]);
      return choose(d, `다음 중 집합 A = ${setH(A)}의 진부분집합이 아닌 것은?`, rows, {
        explain: selfAns ? `진부분집합은 A의 부분집합 가운데 A 자신을 뺀 것이다. ∅도 A의 진부분집합이다. 따라서 진부분집합이 아닌 것은 A 자신인 ${setH(A)}이다.` : `${elH(outsider)}${jo(elH(outsider), '은/는')} A의 원소가 아니므로 그 집합은 A의 부분집합이 아니고, 진부분집합도 아니다. ∅도 A의 진부분집합이다.`
      });
    }),
    T('sub-between', 'A ⊂ C ⊂ B를 만족시키지 않는 C 고르기', '①28', (d) => {
      const Bs = d.bool() ? S(pickN(d, ['a', 'b', 'c', 'd', 'e'], 4)) : someNums(d, 4, 1, 9), A = S(pickN(d, Bs, d.int(1, 2))), rest = sub(Bs, A);
      const goods = d.shuffle(subsetsOf(rest).map((s) => cup(A, s))).slice(0, 4);
      const pool = typeof Bs[0] === 'number' ? rng(1, 9) : ['a', 'b', 'c', 'd', 'e', 'f'];
      const badKind = d.bool(), bad = badKind ? S(rest.slice(0, 2).concat(A.slice(1))) : cup(A, [d.pick(pool.filter((x) => !Bs.includes(x)))]);
      if (goods.length < 4 || inside(A, bad) === true && inside(bad, Bs)) return null;
      return choose(d, `두 집합 A = ${setH(A)}, B = ${setH(Bs)}에 대하여 A ⊂ C ⊂ B를 만족시키는 집합 C가 될 수 없는 것은?`, goods.map((s) => [setH(s), false]).concat([[setH(bad), true]]), {
        explain: `C는 A의 원소 ${wj(listH(A), '을/를')} 모두 갖고, B의 원소가 아닌 것은 갖지 않아야 한다. ${setH(bad)}${jo(setH(bad), '은/는')} ${badKind ? 'A의 원소를 모두 갖지 않는다' : 'B에 없는 원소를 갖는다'}.`
      });
    }),
    T('sub-count', '부분집합의 개수와 진부분집합의 개수', '①29', (d, n) => {
      const kind = d.int(0, 2);
      let h, list;
      if (kind === 0) { const nn = d.pick([8, 10, 12, 16, 18, 20, 30]); h = bset(`${X}는 ${nn}의 약수`); list = divisors(nn); }
      else if (kind === 1) { const m = d.int(8, 19); h = bset(`${X}는 ${m} 이하의 소수`); list = primesTo(m); }
      else { const k = d.int(3, 6); list = S(pickN(d, ['a', 'b', 'c', 'd', 'e', 'f', 'g'], k)); h = setH(list); }
      const k = list.length, total = 2 ** k;
      if (n === 0) return N(`집합 A = ${h}의 부분집합의 개수는?`, total, {
        explain: `A = ${wj(setH(list), '이고/이고')} 원소가 ${k}개이다. 원소마다 넣거나 빼는 두 가지씩이므로 부분집합은 2<sup>${k}</sup> = ${total}개이다.`,
        facts: { calc: [[Array(k).fill('2').join('*'), 0]], derived: [2] }
      });
      return N(`집합 A = ${h}의 진부분집합의 개수는?`, total - 1, {
        explain: `A = ${wj(setH(list), '이고/이고')} 원소가 ${k}개이므로 부분집합은 2<sup>${k}</sup> = ${total}개이다. 진부분집합은 A 자신을 뺀 것이므로 ${total} ${MINUS} 1 = ${total - 1}개이다.`,
        facts: { calc: [[Array(k).fill('2').join('*') + '-1', 0]], derived: [2] }
      });
    }, { count: 2 }),
    T('sub-fixed', '정한 원소를 넣거나 빼는 부분집합의 개수', '①30', (d, n) => {
      if (n === 0) {
        const m = d.int(5, 10), [p, q] = pickN(d, rng(1, m), 2), free = m - 2;
        return N(`집합 A = ${bset(`${X}는 ${m} 이하의 자연수`)}의 부분집합 가운데 ${josa(p, '은/는')} 원소로 갖고 ${josa(q, '은/는')} 원소로 갖지 않는 것의 개수는?`, 2 ** free, {
          explain: `${josa(p, '은/는')} 넣고 ${josa(q, '은/는')} 빼기로 정했으므로 나머지 원소 ${free}개만 넣거나 뺀다. 따라서 2<sup>${free}</sup> = ${2 ** free}개이다.`,
          facts: { calc: [[Array(free).fill('2').join('*'), 0]], derived: [2] }
        });
      }
      const Bs = someNums(d, d.int(5, 7), 1, 12), A = S(pickN(d, Bs, d.int(2, 3))), free = Bs.length - A.length;
      return N(`두 집합 A = ${setH(A)}, B = ${setH(Bs)}에 대하여 A ⊂ X ⊂ B를 만족시키는 집합 X의 개수는?`, 2 ** free, {
        explain: `X는 A의 원소 ${wj(listH(A), '을/를')} 모두 갖는 B의 부분집합이다. B의 원소 가운데 나머지 ${free}개만 넣거나 빼므로 2<sup>${free}</sup> = ${2 ** free}개이다.`,
        facts: { calc: [[Array(free).fill('2').join('*'), 0]], derived: [2] }
      });
    }, { count: 2 }),
    T('sub-eqval', '두 집합이 서로 같을 때 미지수의 값', '①31', (d) => {
      // A = {u, v, f(a)}, B = {u, g(a), h(b)} — f(a) = w, g(a) = v, h(b) = w
      const [u, v, w] = d.shuffle(rng(1, 16)).slice(0, 3), a0 = d.int(-4, 6), b0 = d.int(-4, 6);
      const c1 = d.pick([1, 2, 3]), c2 = d.pick([1, 2, -1]), c3 = d.pick([1, 2, 3]);
      const e1 = w - c1 * a0, e2 = v - c2 * a0, e3 = w - c3 * b0;
      if ([e1, e2, e3].some((e) => Math.abs(e) > 12) || (c1 === c2 && e1 === e2)) return null;
      const f = [c1, e1], g = [c2, e2], h = [c3, e3];
      const Aset = (a) => [u, v, linV(f[0], f[1], a)], Bset = (a, b) => [u, linV(g[0], g[1], a), linV(h[0], h[1], b)];
      // 원소끼리 같아지는 경우에서 나오는 a, b 를 모두 넣어 본다.
      const nums = [u, v, w], cand = (c, e, targets) => targets.map((t) => (t - e) / c);
      const aC = [...new Set(cand(f[0], f[1], nums).concat(cand(g[0], g[1], nums), (f[0] !== g[0] ? [(g[1] - f[1]) / (f[0] - g[0])] : [])))];
      const sols = [];
      for (const a of aC) for (const b of [...new Set(cand(h[0], h[1], nums.concat([linV(f[0], f[1], a), linV(g[0], g[1], a)])))]) if (same(S(Aset(a)), S(Bset(a, b)))) sols.push([a, b]);
      if (sols.length !== 1 || sols[0][0] !== a0 || sols[0][1] !== b0) return null;
      return valsQ(`두 집합 A = {${u}, ${v}, ${linH(f[0], f[1], va)}}, B = {${u}, ${linH(g[0], g[1], va)}, ${linH(h[0], h[1], vb)}}에 대하여 A = B일 때, 상수 ${va}, ${vb}의 값은?`, [['a', a0], ['b', b0]], {
        explain: `A = B이므로 ${josa(v, '은/는')} B의 원소, 곧 ${linH(g[0], g[1], va)} = ${v} 또는 ${linH(h[0], h[1], vb)} = ${v}이다. ${linH(g[0], g[1], va)} = ${v}이면 ${va} = ${sT(a0)}이고 A의 원소 ${linH(f[0], f[1], va)} = ${josa(w, '이/가')} B에도 있어야 하므로 ${linH(h[0], h[1], vb)} = ${w}, 곧 ${vb} = ${sT(b0)}이다. 이때 A = B = ${wj(setH(S([u, v, w])), '이다/이다')}. 다른 경우에는 A = B가 되지 않는다.`,
        facts: { calc: [[solveS(g[0], g[1], v), 0], [solveS(h[0], h[1], w), 1]], derived: [w] }
      });
    }),
    T('sub-eqcase', '두 집합이 서로 같을 때 — 경우를 나누어 확인', '①32', (d) => {
      // A = {p, q, k·a}, B = {q, m·a + s, a + r}: 경우 하나는 맞고 하나는 어긋난다.
      const p = d.int(1, 5), q = d.pick(rng(1, 9).filter((x) => x !== p)), a0 = d.int(2, 6), k = d.pick([2, 3]), m = d.pick([2, 3, 4].filter((x) => x !== k));
      const s = (k - m) * a0, r = p - a0;
      const Aset = (a) => [p, q, k * a], Bset = (a) => [q, m * a + s, a + r];
      const sols = meetAll([[0, p], [0, q], [k, 0], [m, s], [1, r]]).filter((a) => sameR(Aset(a), Bset(a)));
      if (sols.length !== 1 || sols[0] !== a0 || r === 0 || s === 0) return null;
      const a1 = (p - s) / m;
      if (a1 === a0 || !Number.isFinite(a1)) return null;
      const show = (a) => (Number.isInteger(a) ? sT(a) : (a < 0 ? MINUS : '') + frac(Math.abs(Math.round(a * m)), m));
      const A1 = S(Aset(a1)), B1 = S(Bset(a1));
      if (same(A1, B1)) return null;
      return N(`두 집합 A = {${p}, ${q}, ${k}${va}}, B = {${q}, ${linH(m, s, va)}, ${linH(1, r, va)}}에 대하여 A = B일 때, 상수 ${va}의 값은?`, a0, {
        signed: true,
        explain: `${p} ∈ A이므로 ${p} ∈ B, 곧 ${linH(m, s, va)} = ${p} 또는 ${linH(1, r, va)} = ${p}이다. (i) ${linH(m, s, va)} = ${p}이면 ${va} = ${show(a1)}이고 이때 A와 B의 원소가 같지 않다. (ii) ${linH(1, r, va)} = ${p}이면 ${va} = ${sT(a0)}이고 A = B = {${listH(S(Aset(a0)))}}이다. 따라서 ${va} = ${sT(a0)}이다.`,
        facts: { calc: [[solveS(1, r, p), 0]] }
      });
    }),
    T('sub-incl', 'A ⊂ B가 되는 미지수의 값', '①33', (d) => {
      // A = {a² − P, K}, B = {Z, a² − Qv, a + R}: K = a² − Qv 에서 a = a0(양수), 함정 a1 = K − R
      const a0 = d.int(2, 5), K = d.int(1, 6), Qv = a0 * a0 - K, R = K - d.int(1, a0 - 1), P = d.int(Qv + 1, Qv + 9), Z = a0 * a0 - P;
      if (Qv <= 0 || R === 0 || Z === K) return null;
      const Aset = (a) => [a * a - P, K], Bset = (a) => [Z, a * a - Qv, a + R];
      // 원소끼리 같아지는 경우에서 나오는 양수 a 를 모두 넣어 본다: a² − P = Z, K = a² − Qv, K = a + R, a² − P = a + R
      const disc = 1 + 4 * (P + R), cands = [Math.sqrt(Z + P), Math.sqrt(K + Qv), K - R].concat(disc >= 0 ? [(1 + Math.sqrt(disc)) / 2, (1 - Math.sqrt(disc)) / 2] : []).filter((a) => Number.isFinite(a) && a > 0);
      const near = (list) => list.map((x) => Math.round(x * 1e6));
      const sols = [...new Set(cands.map((a) => Math.round(a * 1e6)))].map((a) => a / 1e6).filter((a) => inside(near(Aset(a)), near(Bset(a))));
      if (sols.length !== 1 || Math.abs(sols[0] - a0) > 1e-9) return null;
      const a1 = K - R;
      if (a1 <= 0 || a1 === a0 || inside(Aset(a1), Bset(a1))) return null;
      const sq = (c) => (c === 0 ? `${va}<sup>2</sup>` : `${va}<sup>2</sup> ${c > 0 ? MINUS + ' ' + c : '+ ' + -c}`);
      return N(`두 집합 A = {${sq(P)}, ${K}}, B = {${sT(Z)}, ${sq(Qv)}, ${linH(1, R, va)}}에 대하여 A ⊂ B를 만족시키는 양수 ${va}의 값은?`, a0, {
        explain: `${K} ∈ A이므로 ${K} ∈ B이다. ${linH(1, R, va)} = ${K}이면 ${va} = ${a1}이고, 이때 ${sq(P)} = ${sT(a1 * a1 - P)}${jo(sT(a1 * a1 - P), '이/가')} B의 원소가 아니다. ${sq(Qv)} = ${K}이면 ${va}<sup>2</sup> = ${a0 * a0}에서 양수 ${va} = ${a0}이고, 이때 A = {${listH(S(Aset(a0)))}}, B = {${listH(S(Bset(a0)))}}이므로 A ⊂ B이다.`,
        facts: { rule: 'incl-sq' }
      });
    }),
    T('sub-interval', '실수 범위의 집합의 포함 관계와 미지수', '①34', (d, n) => {
      if (n === 0) {
        const p = d.int(-6, 0), q = p + d.int(3, 8), cA = [d.bool(), d.bool()], cB = [d.bool(), d.bool()];
        const lt = (closed) => (closed ? '≤' : '&lt;');
        const hA = `${sT(p)} ${lt(cA[0])} ${X} ${lt(cA[1])} ${sT(q)}`, hB = `${va} ${lt(cB[0])} ${X} ${lt(cB[1])} ${vb}`;
        // a 쪽: A가 p 를 포함하고 B 가 열려 있으면 a < p, 아니면 a ≤ p. b 쪽도 같다.
        const relA = cA[0] && !cB[0] ? '<' : '<=', relB = cA[1] && !cB[1] ? '>' : '>=';
        const MARK = { '<': '&lt;', '<=': '≤', '>': '&gt;', '>=': '≥' };
        return inline(`두 집합 A = ${bset(hA)}, B = ${wj(bset(hB), '에/에')} 대하여 A ⊂ B가 성립하도록 하는 실수 ${va}, ${vb}의 값의 범위는?`, `${va} {0} {1}, ${vb} {2} {3}`,
          [{ rel: true, answer: relA }, { answer: p, signed: true }, { rel: true, answer: relB }, { answer: q, signed: true }], {
            shown: `${va} ${MARK[relA]} ${sT(p)}, ${vb} ${MARK[relB]} ${sT(q)}`,
            explain: `A ⊂ B이려면 수직선에서 A의 범위가 B의 범위 안에 들어야 한다. 왼쪽 끝: ${cA[0] ? `A에 ${sT(p)}${jo(sT(p), '이/가')} 들고 B는 ${cB[0] ? '끝을 포함하므로' : '끝을 포함하지 않으므로'}` : `A에 ${sT(p)}${jo(sT(p), '이/가')} 들지 않으므로`} ${va} ${MARK[relA]} ${sT(p)}. 오른쪽 끝: ${cA[1] ? `A에 ${sT(q)}${jo(sT(q), '이/가')} 들고 B는 ${cB[1] ? '끝을 포함하므로' : '끝을 포함하지 않으므로'}` : `A에 ${sT(q)}${jo(sT(q), '이/가')} 들지 않으므로`} ${vb} ${MARK[relB]} ${sT(q)}.`,
            facts: { calc: [[p < 0 ? `0-${-p}` : `${p}`, 1], [q < 0 ? `0-${-q}` : `${q}`, 3]], rule: 'interval-range' }
          });
      }
      const p = d.int(-5, 1), q = p + d.int(3, 7), lo = p - d.int(1, 3), s = d.int(-3, 3), closedQ = d.bool();
      const need = closedQ ? q - s + 1 : q - s;
      const hA = `${sT(p)} &lt; ${X} ${closedQ ? '≤' : '&lt;'} ${sT(q)}`, hB = `${sT(lo)} &lt; ${X} &lt; ${linH(1, s, va)}`;
      return N(`두 집합 A = ${bset(hA)}, B = ${wj(bset(hB), '에/에')} 대하여 A ⊂ B가 성립하도록 하는 정수 ${va}의 최솟값은?`, need, {
        signed: true,
        explain: `A ⊂ B이려면 ${closedQ ? `A에 ${sT(q)}${jo(sT(q), '이/가')} 들고 B는 오른쪽 끝을 포함하지 않으므로 ${linH(1, s, va)} &gt; ${sT(q)}, 곧 ${va} &gt; ${sT(q - s)}` : `A에 ${sT(q)}${jo(sT(q), '이/가')} 들지 않으므로 ${linH(1, s, va)} ≥ ${sT(q)}, 곧 ${va} ≥ ${sT(q - s)}`}이어야 한다. 따라서 정수 ${va}의 최솟값은 ${sT(need)}이다.`,
        facts: { calc: [[`${q < 0 ? '(' + q + ')' : q}-(${s})${closedQ ? '+1' : ''}`, 0]], rule: 'interval-min' }
      });
    }, { count: 2 })
  ];
  // 집합 하나를 원소 하나만 바꾼 것(같지 않은 짝을 만들 때)
  function nearSet(d, set) {
    const pool = rng(Math.min(...set) - 2, Math.max(...set) + 2).filter((x) => !set.includes(x));
    return d.bool() && set.length >= 2 ? set.slice(0, -1) : S(set.slice(1).concat([d.pick(pool)]));
  }

  // ════════════════════════════════════════════════════════════════
  // 다. 합집합과 교집합, 연산 법칙
  // ════════════════════════════════════════════════════════════════
  // 원소나열·조건제시가 섞인 두 집합
  function twoSets(d) {
    const pickC = () => d.pick(CAT.filter((c) => c.set.length >= 2 && c.set.length <= 6));
    for (let i = 0; i < 200; i += 1) {
      const c1 = pickC(), c2 = pickC();
      if (c1.key === c2.key || !cap(c1.set, c2.set).length || cup(c1.set, c2.set).length > 9) continue;
      return [{ h: d.bool() ? setH(c1.set) : c1.h, set: c1.set }, { h: c2.h, set: c2.set }];
    }
    return null;
  }
  const multSay = (k) => `${k}의 배수의 집합`;
  const unionTypes = [
    T('uni-calc', '합집합과 교집합 구하기', '①36', (d) => {
      const two = twoSets(d); if (!two) return null;
      const [A, Bs] = two.map((s) => s.set), U = cup(A, Bs), I = cap(A, Bs);
      const pairH = (u, i) => `A∪B = ${setH(u)}, A∩B = ${setH(i)}`;
      const rows = [[pairH(U, I), true], [pairH(I, U), false], [pairH(U, sub(A, Bs).length ? sub(A, Bs) : U.slice(1)), false], [pairH(cup(U, [Math.max(...U) + 1]), I), false], [pairH(U, I.length > 1 ? I.slice(1) : cup(I, [d.pick(sub(U, I))])), false], [pairH(sub(U, I), I), false]];
      return choose(d, `두 집합 A = ${two[0].h}, B = ${wj(two[1].h, '에/에')} 대하여 A∪B와 A∩B를 바르게 구한 것은?`, [rows[0]].concat(d.shuffle(rows.slice(1)).slice(0, 4)), {
        explain: `A = ${setH(A)}, B = ${wj(setH(Bs), '이므로/이므로')} A∪B = ${setH(U)}, A∩B = ${setH(I)}이다.`
      });
    }),
    T('uni-disjoint', '서로소인 두 집합 고르기', '①37', (d) => {
      const mk = (kind) => {
        if (kind === 0) { const a = S(pickN(d, ['a', 'b', 'c', 'd', 'e', 'f'], 3)), b = S(pickN(d, ['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3)); return [`A = ${setH(a)}, B = ${setH(b)}`, !cap(a, b).length]; }
        if (kind === 1) { const r = d.int(2, 6), b = S(d.shuffle([-2 * r, 2 * r, r * r, r + 1, -(r + 1), 2 * r + 1]).slice(0, 2).concat(d.bool() ? [r] : [])); return [`A = ${bset(`${X}<sup>2</sup> ${MINUS} ${r * r} = 0`)}, B = ${setH(b)}`, !cap([-r, r], b).length]; }
        if (kind === 2) { const m = d.int(8, 13), b = S(pickN(d, rng(1, 10).filter(odd), 3)); return [`A = ${bset(`${X}는 ${m} 이하의 소수`)}, B = ${setH(b)}`, !cap(primesTo(m), b).length]; }
        const [p, q] = S(pickN(d, rng(-3, 4), 2)), [s, t] = S(pickN(d, rng(-3, 5), 2)); return [`A = ${bset(`${rootsH(p, q)} = 0`)}, B = ${bset(`${rootsH(s, t)} = 0`)}`, !cap([p, q], [s, t]).length];
      };
      const rows = d.shuffle([0, 1, 2, 3]).slice(0, 3).map(mk);
      if (rows.every((r) => !r[1])) return null;
      return combo(d, '다음 보기에서 두 집합 A, B가 서로소인 것을 모두 고른 것은?', rows, {
        explain: `공통인 원소가 하나도 없을 때(A∩B = ∅) 서로소이다. 원소나열법으로 고쳐 공통인 원소를 찾아보면 서로소인 것은 ${HAN.slice(0, rows.length).filter((_, i) => rows[i][1]).join(', ')}이다.`
      });
    }),
    T('uni-disjsub', '주어진 집합과 서로소인 집합', '①38', (d, n) => {
      if (n === 0) {
        const A = someNums(d, 3, 1, 9), outs = rng(1, 9).filter((x) => !A.includes(x)), useEmpty = d.bool();
        const good = useEmpty ? [] : S(pickN(d, outs, d.int(1, 2)));
        const bads = [0, 1, 2, 3].map(() => S(pickN(d, A, 1).concat(pickN(d, outs, d.int(0, 1)))));
        return choose(d, `다음 중 집합 A = ${wj(setH(A), '과/와')} 서로소인 집합은?`, [[setH(good), true]].concat(bads.map((b) => [setH(b), false])), {
          explain: `A와 공통인 원소가 없는 집합을 찾는다. ${useEmpty ? '∅은 원소가 없으므로 어떤 집합과도 서로소이다.' : `${setH(good)}${jo(setH(good), '은/는')} A의 원소를 하나도 갖지 않는다.`} 나머지는 A의 원소를 갖는다.`,
          facts: { rule: 'disj-pick' }
        });
      }
      const m = d.int(5, 8), U = rng(1, m), Bs = someNums(d, d.int(2, 3), 1, m), free = m - Bs.length;
      return N(`집합 A = ${bset(`${X}는 ${m} 이하의 자연수`)}의 부분집합 가운데 집합 B = ${wj(setH(Bs), '과/와')} 서로소인 집합의 개수는?`, 2 ** free, {
        explain: `B와 서로소이려면 ${wj(listH(Bs), '을/를')} 원소로 갖지 않아야 한다. 나머지 원소 ${free}개로 만드는 부분집합이므로 2<sup>${free}</sup> = ${2 ** free}개이다(∅도 센다).`,
        facts: { calc: [[Array(free).fill('2').join('*'), 0]], derived: [2, free] }
      });
    }, { count: 2 }),
    T('uni-findB1', '서로소이고 합집합을 알 때 B', '①39', (d) => {
      const m = d.int(6, 9), U = rng(1, m), A = someNums(d, d.int(2, 4), 1, m), right = sub(U, A);
      return setChoice(d, `집합 A = ${wj(setH(A), '과/와')} 집합 B가 서로소이고 A∪B = ${wj(setH(U), '일/일')} 때, 집합 B는?`, right, [U, cup(right, [A[0]]), right.slice(1), A, cap(U, A)], {
        explain: `A∪B의 원소 가운데 A에 없는 것은 모두 B에 있고, 서로소이므로 A의 원소는 B에 없다. 따라서 B = ${setH(right)}이다.`
      });
    }),
    T('uni-findB2', '합집합과 교집합을 알 때 B', '①40', (d) => {
      const m = d.int(7, 9), A = someNums(d, 4, 1, m), I = S(pickN(d, A, 2)), onlyB = S(pickN(d, rng(1, m).filter((x) => !A.includes(x)), 2)), Bs = cup(I, onlyB), U = cup(A, Bs);
      return setChoice(d, `집합 A = ${wj(setH(A), '에/에')} 대하여 A∪B = ${setH(U)}, A∩B = ${wj(setH(I), '일/일')} 때, 집합 B는?`, Bs, [onlyB, U, cup(Bs, [d.pick(sub(A, I))]), sub(U, I), cup(onlyB, sub(A, I))], {
        explain: `B는 A∩B의 원소 ${wj(listH(I), '과/와')} A∪B의 원소 가운데 A에 없는 ${wj(listH(onlyB), '을/를')} 원소로 갖는다. 따라서 B = ${setH(Bs)}이다.`
      });
    }),
    T('uni-var-inter', '교집합이 주어질 때 미지수의 값', '①41', (d) => {
      // A = {p, q, f(a)}, B = {r, g(a), h(b)}, A∩B = {q, r}: f(a0) = r, g(a0) = q 가 아닐 수 있다 — h(b0) = q
      const [p, q, r] = d.shuffle(rng(1, 9)).slice(0, 3), a0 = d.int(-3, 5), b0 = d.int(-3, 5);
      const c1 = d.pick([1, 2, 3]), c3 = d.pick([2, 3]);
      const f = [c1, r - c1 * a0], g = [1, 0], h = [c3, q - c3 * b0];
      if (Math.abs(f[1]) > 12 || Math.abs(h[1]) > 12) return null;
      const Aset = (a) => [p, q, linV(f[0], f[1], a)], Bset = (a, b) => [r, linV(g[0], g[1], a), linV(h[0], h[1], b)];
      const want = S([q, r]), nums = [p, q, r];
      // a 는 f(a)·a 가 수나 서로와 같아지는 경우에서, b 는 h(b) 가 수·f(a)·a 와 같아지는 경우에서 나온다.
      const aC = meetAll([[f[0], f[1]], [1, 0]].concat(nums.map((t) => [0, t])));
      const sols = [];
      for (const a of aC) for (const b of [...new Set(nums.concat([linV(f[0], f[1], a), a]).map((t) => r9((t - h[1]) / h[0])))]) if (sameR(cap(S(Aset(a).map(r9)), S(Bset(a, b).map(r9))), want)) sols.push([a, b]);
      if (sols.length !== 1 || sols[0][0] !== a0 || sols[0][1] !== b0) return null;
      return valsQ(`두 집합 A = {${p}, ${q}, ${linH(f[0], f[1], va)}}, B = {${r}, ${va}, ${linH(h[0], h[1], vb)}}에 대하여 A∩B = {${listH(want)}}일 때, 상수 ${va}, ${vb}의 값은?`, [['a', a0], ['b', b0]], {
        explain: `${r} ∈ A이므로 ${linH(f[0], f[1], va)} = ${r}, 곧 ${va} = ${sT(a0)}이다. 이때 B = {${r}, ${sT(a0)}, ${linH(h[0], h[1], vb)}}이고 ${q} ∈ B이어야 하므로 ${linH(h[0], h[1], vb)} = ${q}, 곧 ${vb} = ${sT(b0)}이다. 확인하면 A∩B = {${listH(want)}}이다.`,
        facts: { calc: [[solveS(f[0], f[1], r), 0], [solveS(h[0], h[1], q), 1]] }
      });
    }),
    T('uni-var-union', '합집합이 주어질 때 미지수의 값', '①42', (d) => {
      // A = {p, a}, B = {q, r, c·a + e}, A∪B = {p, q, r, t}: c·a0 + e = t 이고 a0 ∈ {q, r}
      const [p, q, r] = d.shuffle(rng(1, 9)).slice(0, 3), a0 = d.pick([q, r]), c = d.pick([2, 3]), e = d.int(-3, 3), t = c * a0 + e;
      const Uw = S([p, q, r, t]);
      if (Uw.length !== 4 || t <= 0) return null;
      const sols = meetAll([[0, p], [1, 0], [0, q], [0, r], [c, e]].concat(Uw.map((t) => [0, t]))).filter((a) => sameR(cup([p, a], [q, r, c * a + e]), Uw));
      if (sols.length !== 1 || sols[0] !== a0) return null;
      const trap = t;
      return N(`두 집합 A = {${p}, ${va}}, B = {${q}, ${r}, ${linH(c, e, va)}}에 대하여 A∪B = ${wj(setH(Uw), '일/일')} 때, 상수 ${va}의 값은?`, a0, {
        signed: true,
        explain: `${t}${jo(String(t), '은/는')} A∪B의 원소이므로 ${va} = ${t} 또는 ${linH(c, e, va)} = ${t}이다. ${va} = ${trap}이면 ${linH(c, e, va)} = ${c * trap + e}${jo(String(c * trap + e), '이/가')} A∪B에 없으므로 맞지 않다. ${linH(c, e, va)} = ${t}이면 ${va} = ${sT(a0)}이고 A∪B = ${wj(setH(Uw), '이다/이다')}.`,
        facts: { calc: [[solveS(c, e, t), 0]] }
      });
    }),
    T('uni-jaccard', '두 집합의 유사도 n(A∩B) ÷ n(A∪B)', '①45', (d) => {
      const WORDS = ['봄', '여름', '가을', '겨울', '날씨', '바람', '하늘', '구름', '꽃', '눈', '비', '햇살', '산', '바다', '강'];
      const both = pickN(d, WORDS, d.int(1, 2)), rest = d.shuffle(WORDS.filter((w) => !both.includes(w))), A = both.concat(rest.slice(0, d.int(1, 3))), Bs = both.concat(rest.slice(3, 3 + d.int(1, 3)));
      const i = both.length, u = new Set(A.concat(Bs)).size, g = gcd(i, u);
      if (u <= i) return null;
      const wl = (list) => '{' + d.shuffle(list).join(', ') + '}';
      const wB = wl(Bs);
      return F(`두 문장에 쓰인 낱말의 집합을 각각 A = ${wl(A)}, B = ${wB}${jo(wB, '이라/라')} 하자. 두 문장의 유사도를 J = ${nOf('A∩B')} ÷ ${nOf('A∪B')}로 정할 때, J의 값은?`, i / g, u / g, {
        anyForm: true,
        explain: `A∩B = {${both.join(', ')}}이므로 ${nOf('A∩B')} = ${i}, A∪B의 원소는 ${u}개이므로 ${nOf('A∪B')} = ${u}이다. 따라서 J = ${frac(i, u)}${g > 1 ? ' = ' + frac(i / g, u / g) : ''}이다.`,
        facts: { value: `${i}/${u}`, derived: [i, u] }
      });
    }),
    T('uni-law', '세 집합의 연산식 가운데 값이 다른 하나', '①46', (d) => {
      const U = rng(1, 8), A = someNums(d, d.int(3, 4), 1, 8), Bs = someNums(d, d.int(3, 4), 1, 8), Cs = someNums(d, d.int(3, 4), 1, 8), env = { U, A, B: Bs, C: Cs };
      const FAM = [
        [['i', 'A', ['u', 'B', 'C']], ['u', ['i', 'A', 'B'], ['i', 'A', 'C']], ['i', ['u', 'C', 'B'], 'A'], ['u', ['i', 'C', 'A'], ['i', 'B', 'A']], ['u', ['i', 'A', 'B'], 'C'], ['i', ['u', 'A', 'B'], 'C']],
        [['u', 'A', ['i', 'B', 'C']], ['i', ['u', 'A', 'B'], ['u', 'A', 'C']], ['u', ['i', 'C', 'B'], 'A'], ['i', ['u', 'C', 'A'], ['u', 'B', 'A']], ['i', ['u', 'A', 'B'], 'C'], ['u', ['i', 'A', 'B'], 'C']],
        [['u', ['u', 'A', 'B'], 'C'], ['u', 'A', ['u', 'B', 'C']], ['u', ['u', 'C', 'A'], 'B'], ['u', 'B', ['u', 'A', 'C']], ['i', ['u', 'A', 'B'], 'C'], ['u', ['i', 'A', 'B'], 'C']],
        [['i', ['i', 'A', 'B'], 'C'], ['i', 'A', ['i', 'B', 'C']], ['i', ['i', 'C', 'A'], 'B'], ['i', 'B', ['i', 'C', 'A']], ['u', ['i', 'A', 'B'], 'C'], ['i', ['u', 'A', 'B'], 'C']]
      ];
      const fam = d.pick(FAM), eqs = fam.slice(0, 4), odds = fam.slice(4), lone = d.pick(odds.filter((e) => !same(exVal(e, env), exVal(eqs[0], env))));
      if (!lone || !eqs.every((e) => same(exVal(e, env), exVal(eqs[0], env)))) return null;
      const val = exVal(eqs[0], env);
      if (!val.length || !exVal(lone, env).length) return null;
      return choose(d, `세 집합 A = ${setH(A)}, B = ${setH(Bs)}, C = ${wj(setH(Cs), '에/에')} 대하여 다음 중 나머지 넷과 다른 집합은?`, eqs.map((e) => [exN(e), false]).concat([[exN(lone), true]]), {
        explain: `${exN(eqs[0])} = ${wj(setH(val), '이고/이고')}, 교환법칙·결합법칙·분배법칙에 따라 나머지 세 식도 같은 집합이다. ${exN(lone)} = ${wj(setH(exVal(lone, env)), '이므로/이므로')} 다르다.`
      });
    }),
    T('uni-lawuse', '모르는 집합 없이 연산 법칙으로 계산', '②1', (d, n) => {
      const U = rng(1, 9), A = someNums(d, d.int(2, 4), 1, 9), Bs = someNums(d, d.int(2, 4), 1, 9), Cs = someNums(d, d.int(2, 4), 1, 9), env = { U, A, B: Bs, C: Cs };
      const K = n === 0 ? d.pick([
        { g: [['u', 'A', 'B'], ['u', 'A', 'C']], ask: ['u', 'A', ['i', 'B', 'C']], law: '(A∪B)∩(A∪C)', wr: [['u', ['u', 'A', 'B'], ['u', 'A', 'C']], ['d', ['u', 'A', 'B'], ['u', 'A', 'C']]] },
        { g: [['i', 'A', 'C'], ['i', 'B', 'C']], ask: ['i', ['u', 'A', 'B'], 'C'], law: '(A∩C)∪(B∩C)', wr: [['i', ['i', 'A', 'C'], ['i', 'B', 'C']], ['d', ['i', 'A', 'C'], ['i', 'B', 'C']]] },
        { g: [['i', 'A', 'B'], ['i', 'A', 'C']], ask: ['i', 'A', ['u', 'B', 'C']], law: '(A∩B)∪(A∩C)', wr: [['i', ['i', 'A', 'B'], ['i', 'A', 'C']], ['d', ['i', 'A', 'B'], ['i', 'A', 'C']]] }
      ]) : d.pick([
        { g: [['u', 'A', 'B'], 'C'], ask: ['u', 'A', ['u', 'B', 'C']], law: '(A∪B)∪C', wr: [['i', ['u', 'A', 'B'], 'C'], ['d', ['u', 'A', 'B'], 'C']] },
        { g: [['i', 'A', 'B'], 'C'], ask: ['i', 'A', ['i', 'B', 'C']], law: '(A∩B)∩C', wr: [['u', ['i', 'A', 'B'], 'C'], ['d', 'C', ['i', 'A', 'B']]] }
      ]);
      const [g1, g2] = K.g.map((e) => exVal(e, env)), right = exVal(K.ask, env);
      if (right.length === 0 || same(g1, g2)) return null;
      const wrongs = K.wr.map((e) => exVal(e, env)).concat([g1, g2, cup(right, [d.pick(sub(U, right).length ? sub(U, right) : [10])])]);
      return setChoice(d, `세 집합 A, B, C에 대하여 ${exN(K.g[0])} = ${setH(g1)}, ${exN(K.g[1])} = ${wj(setH(g2), '일/일')} 때, 집합 ${wj(exN(K.ask), '은/는')}?`, right, wrongs, {
        explain: `${n === 0 ? '분배법칙' : '결합법칙'}에 따라 ${exN(K.ask)} = ${K.law}이다. 따라서 주어진 두 집합으로 셈하면 ${setH(right)}이다.`,
        facts: { rule: n === 0 ? 'law-dist' : 'law-assoc' }
      });
    }, { count: 2 }),
    T('uni-multi', '배수의 집합 사이의 관계', '①18', (d) => {
      const a = d.pick([2, 3, 4, 6]), b = d.pick([2, 3, 4, 5, 6, 9].filter((x) => x !== a && x % a !== 0 && a % x !== 0)), m = a * d.pick([2, 3]), l = lcm(a, b);
      const c = d.pick([4, 6, 8, 9, 10, 12].filter((x) => x !== a && gcd(a, x) > 1 && x % a !== 0 && a % x !== 0)), g = gcd(a, c), lc = lcm(a, c);
      if (!b || !c) return null;
      // 배수의 집합끼리: A_x ⊂ A_y ⇔ x 가 y 의 배수, A_x∩A_y = A_(최소공배수), A_x∪A_y 가 배수의 집합 하나이려면 한쪽이 다른 쪽을 포함해야 한다.
      const inc = (x, y) => x % y === 0, capIs = (x, y, k) => lcm(x, y) === k, cupIs = (x, y, k) => (inc(x, y) && k === y) || (inc(y, x) && k === x);
      const AK = (k) => `A<sub>${k}</sub>`;
      const ST = [
        [`${AK(a)} ⊂ ${AK(m)}`, inc(a, m), `${m}의 배수는 모두 ${a}의 배수이므로 ${AK(m)} ⊂ ${AK(a)}이고, ${wj(AK(a) + ' ⊂ ' + AK(m), '은/는')} 거짓이다`],
        [`${AK(m)} ⊂ ${AK(a)}`, inc(m, a), `${m}의 배수는 모두 ${a}의 배수이므로 참이다`],
        [`${AK(a)}∩${AK(b)} = ${AK(l)}`, capIs(a, b, l), `${josa(a, '과/와')} ${b}의 공배수는 최소공배수 ${l}의 배수이므로 참이다`],
        [`${AK(a)}∪${AK(b)} = ${AK(l)}`, cupIs(a, b, l), `${josa(a, '은/는')} ${AK(a)}∪${AK(b)}의 원소이지만 ${l}의 배수가 아니므로 거짓이다`],
        [`${AK(a)}∩${AK(m)} = ${AK(m)}`, capIs(a, m, m), `${AK(m)} ⊂ ${AK(a)}이므로 참이다`],
        [`${AK(a)}∪${AK(m)} = ${AK(m)}`, cupIs(a, m, m), `${AK(m)} ⊂ ${AK(a)}이므로 ${AK(a)}∪${AK(m)} = ${AK(a)}이고, 거짓이다`],
        [`(${AK(a)}∩${AK(c)}) ⊂ ${AK(g)}`, inc(lc, g), `${AK(a)}∩${AK(c)} = ${AK(lc)}이고 ${lc}의 배수는 모두 ${g}의 배수이므로 참이다`],
        [`${AK(a)}∩${AK(b)} = ${AK(a * b)}`, capIs(a, b, a * b), `${josa(a, '과/와')} ${b}의 최소공배수는 ${l}${l === a * b ? '이므로 참이다' : '이므로 거짓이다'}`]
      ];
      const rows = d.shuffle(ST).slice(0, 4);
      return combo(d, `자연수 ${vk}의 배수의 집합을 A<sub>${vk}</sub>라 할 때, 다음 보기에서 옳은 것을 모두 고른 것은?`, rows.map(([h, v]) => [nb(h), v]), {
        explain: rows.map((r, i) => `${HAN[i]}. ${r[2]}.`).join(' ')
      });
    }),
    T('uni-multiN', '배수의 집합의 연산을 A_n 하나로', '①19', (d) => {
      const b = d.pick([4, 6, 8, 9, 10, 12, 15, 18]), dd = d.pick([4, 6, 8, 9, 10, 12, 15].filter((x) => x !== b && lcm(x, b) !== x * b && lcm(x, b) <= 90 && x % b !== 0 && b % x !== 0));
      if (!dd) return null;
      const a = b * d.pick([2, 3, 4]), c = dd * d.pick([2, 3, 5]), l = lcm(b, dd);
      const AK = (k) => `A<sub>${k}</sub>`;
      return N(`자연수 ${vk}의 배수를 원소로 하는 집합을 A<sub>${vk}</sub>라 할 때, (${AK(a)}∪${AK(b)})∩(${AK(c)}∪${AK(dd)}) = A<sub>${vn()}</sub>을 만족시키는 자연수 ${vn()}의 값은?`, l, {
        explain: `${josa(a, '은/는')} ${b}의 배수이므로 ${AK(a)} ⊂ ${AK(b)}, 곧 ${AK(a)}∪${AK(b)} = ${AK(b)}이다. 같은 까닭으로 ${AK(c)}∪${AK(dd)} = ${AK(dd)}이다. ${wj(AK(b) + '∩' + AK(dd), '은/는')} ${josa(b, '과/와')} ${dd}의 공배수, 곧 최소공배수 ${l}의 배수의 집합이므로 ${vn()} = ${l}이다.`,
        facts: { calc: [[`${b}*${dd}/${gcd(b, dd)}`, 0]], derived: [gcd(b, dd)] }
      });
    }),
    T('uni-multiCount', '배수의 집합의 원소의 개수', '①20', (d, n) => {
      const top = d.pick([50, 60, 100]), AK = (k) => `A<sub>${k}</sub>`, cnt = (k) => Math.floor(top / k);
      const head = `전체집합 U = ${bset(`${X}는 ${top} 이하의 자연수`)}의 부분집합 A<sub>${vk}</sub>를 ${vk}의 배수의 집합이라 할 때, `;
      if (n === 0) {
        const [a, b] = d.pick([[2, 3], [2, 5], [3, 4], [4, 6], [6, 8], [3, 5], [4, 10]]), l = lcm(a, b);
        return N(head + `${nOf(AK(a) + '∩' + AK(b))}의 값은?`, cnt(l), {
          explain: `${wj(AK(a) + '∩' + AK(b), '은/는')} ${josa(a, '과/와')} ${b}의 공배수, 곧 ${l}의 배수의 집합이다. ${top} 이하의 ${l}의 배수는 ${cnt(l)}개이다.`,
          facts: { calc: [[`(${top}-${top}%${l})/${l}`, 0]], derived: [l] }
        });
      }
      const [a, b, c] = d.pick([[2, 3, 5], [12, 8, 6], [2, 3, 7], [6, 4, 9], [3, 4, 6], [4, 6, 10]]), p = lcm(a, b), q = lcm(a, c), r = lcm(p, q);
      const ans = cnt(p) + cnt(q) - cnt(r);
      return N(head + `${nOf(AK(a) + '∩(' + AK(b) + '∪' + AK(c) + ')')}의 값은?`, ans, {
        explain: `분배법칙에 따라 ${AK(a)}∩(${AK(b)}∪${AK(c)}) = (${AK(a)}∩${AK(b)})∪(${AK(a)}∩${AK(c)}) = ${AK(p)}∪${AK(q)}이다. ${nOf(AK(p))} = ${cnt(p)}, ${nOf(AK(q))} = ${cnt(q)}, ${nOf(AK(p) + '∩' + AK(q))} = ${nOf(AK(r))} = ${wj(String(cnt(r)), '이므로/이므로')} ${cnt(p)} + ${cnt(q)} ${MINUS} ${cnt(r)} = ${ans}이다.`,
        facts: { calc: [[`(${top}-${top}%${p})/${p}+(${top}-${top}%${q})/${q}-(${top}-${top}%${r})/${r}`, 0]], derived: [p, q, r] }
      });
    }, { count: 2 })
  ];
  function vn() { return V('n'); }

  B.addUnit({
    id: '10-2-4', grade: 10, semester: 2, no: 4, title: '집합', version: 1,
    groups: [
      { id: 'meaning', title: '집합의 뜻과 표현', standard: S1, types: meaningTypes },
      { id: 'subset', title: '집합 사이의 포함 관계', standard: S2, types: subsetTypes },
      { id: 'union', title: '합집합과 교집합', standard: S3, types: unionTypes }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
