// 5학년 1학기 1단원 자연수의 혼합 계산 — 단원 틀, 식 도구, 섞인 연산마다의 다섯 묶음(계산·계산 순서·계산 과정·문장제).
// 수집해 둔 교과서 10종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 131·82·97꼴, 심화꼴 85꼴)을 처음부터 끝까지 대조하여,
// 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 따져서 실었다.
// (계산 순서 따지기·잘못된 계산·( )의 구실·결과 비교·□·말과 식, 실력 문항은 5-1-1b.js 에 있다. 꼴마다의 대조표는 references/textbooks/수학/_분석/5-1-1/싣기_대조표.md)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 싣는 기준
//  - 식은 자바스크립트 꼴의 글('48-(15+9)/3*2')로 다루고, 한 번에 한 연산씩 교과서 차례로 계산해 간다(run):
//    ( ) 안 → 곱셈·나눗셈(앞에서부터) → 덧셈·뺄셈(앞에서부터). 검사는 같은 글을 자바스크립트로 다시 셈해 답과 견준다.
//  - 수는 틀('a-b*c+d')에 맞춰 뽑는다(G). 계산 도중과 결과가 언제나 1 이상의 자연수이고 나눗셈은 모두 나누어떨어진다.
//    곱셈은 (두 자리)×(12까지), 나눗셈은 (세 자리까지)÷(두 자리까지)이고 한 식에 같은 수가 두 번 나오지 않는다. 식은 연산 넷까지만 쓴다(휴대폰 너비).
//  - 구조마다 따로 싣는다: 섞인 연산(＋－ / ×÷ / ＋－× / ＋－÷ / 넷 모두), ( )가 있는가와 ( )의 자리(앞·가운데·끝, ( ) 안의 연산이 하나·둘),
//    연산의 수(둘·셋·넷), 곱셈·나눗셈이 붙어 있는가 떨어져 있는가. 글 꼴이 같은 계산 문항은 facts.rule 에 틀의 이름을 단다.
//  - 나타내는 방법이 다르면 따로 싣는다: 계산 결과, 가장 먼저 계산해야 하는 부분, 계산하는 순서(연산 기호 아래에 ㉠㉡㉢), 계산 과정의 빈칸.
//    (계산 순서 그림 tree 는 5-1-1b.js 의 순서 그림 고르기·그림의 빈칸에서 쓴다.)
//    「가장 먼저」 문항은 다른 연산부터 시작해도 같은 값이 나오는 길이 없는 식만 쓰고(72 − 6 + 9 ÷ 3 × 7 의 72 − 6 처럼 먼저 계산해도 되는 부분이 보기에 오지 않게),
//    순서 문항의 틀린 보기는 그 차례로 계산하면 값이 달라지거나 계산할 수 없는 것만 쓴다. 떨어져 있는 곱셈과 나눗셈은 교과서대로 앞의 것을 먼저 계산한다.
//  - 문장제는 얼개마다 따로 싣고 답만 수로 받는다(식을 쓰게 하지 않는다). 식을 고르는 문항은 5-1-1b.js 의 「말과 식」 묶음에 있다.
// 뺀 것과 까닭(꼴 번호는 기본꼴 ①②③, 심화꼴 「심」)
//  - 작도·서술형: 계산 순서를 식에 나타내고 계산하기(①9·18·28·37의 변형 ②22 ③25 심5 — 값만 물으면 계산 문항과 같다). 문제 만들기(①102 변형 ②59 ③75 심52)와
//    잘못된 까닭 쓰기(①59 변형 ②27 변형 ③34 심22의 일부)는 고르기로 바꾸어 실었고, ( )가 있으면 값이 다른 까닭 쓰기(③38 변형 심20 변형)는 뺐다.
//  - 휴대폰 너비: 연산이 다섯인 식(①45)
//  - 범위 밖: 계산 결과가 0인 식(②9 변형), 도중에 0보다 작아지는 식(①97 변형 ③53 변형), ( )를 지운 식이 0보다 작아지거나 나누어떨어지지 않는 보기(②33의 일부),
//    1 g의 값으로 가는 견주기(①112, 비율), 인분 수에 맞추어 늘리고 줄이기(①127 변형 ②76 변형, 비례), 한 사람씩 나누면 소수가 되는 달 무게(③95 변형), 일의 양(심62)
//  - 꼬임(경우 따지기·퍼즐): 연산 기호 여러 칸(①86·87 ②53의 여러 칸 ③60·61 심40·41·43), 수 카드 여러 칸(①92 ②54·55 ③62·63 심44~49), 같은 수 넷으로 목표 수(③64 심42),
//    ( )를 넣어 가장 큰 값·나올 수 없는 값·크기 비교 맞추기(①84 ②36 심26·27), 새로 약속한 기호(①93 ②56 ③65·66 심50), 조건 넷을 이어 푸는 장사(심81),
//    세 자리 수 만들어 넣기(심85), 테이프 수십 장(심69 변형)
//  - 뜻 없는 셈: 서로 다른 두 식의 계산 결과의 합·차(①80 ②43 ③49 ③50 변형 심18의 합 심19), □에 들어갈 수의 합(②49 변형 심35), 설명한 수와 5의 곱(심51 변형)
//  - 답이 하나로 정해지지 않는 것: ( ) 없이 두 식을 하나의 식으로 나타내기(①98 ③71 — 식을 쓰게 할 수 없고, 고르기로 내면 18 + 29 − 15 와 18 + (29 − 15) 가 모두 맞다),
//    먼저 계산해도 되는 부분이 둘인 식에서 「가장 먼저」 고르기(①27 변형 ①47 변형 — 3 + 4 × 7 − (6 + 2) 의 4 × 7, 50 ÷ 5 − 2 × 3 + 7 의 2 × 3)
//  - 수가 큰 것: 판 돈 견주기(심64 — 몇천을 두 자리 수에 곱해 다섯 자리 수끼리 견준다)
//  - 놀이·읽을거리: 계산 결과로 암호·글자 찾기(②30 ③37), 3~4학년 셈 되짚기
//  - 같은 문제: 식과 답을 함께 쓰기·식의 빈칸 채우기(①103 변형 ②58)는 문장제와, 빈칸에 순서 번호 쓰기(③20 변형)는 순서 고르기와,
//    계산기에 먼저 넣을 식(①8 변형)은 가장 먼저 계산해야 하는 부분과, 값을 보기에서 고르기(②12 변형 ③11 변형)·세 자리 수만 다른 계산(②8 변형)은 같은 틀의 계산과,
//    잘못 말한 사람 찾기(③35)는 잘못 계산한 식 찾기와 같다. 덜고 더 산 묶음(①114)·저울(①122)·다른 그릇에 옮겨 담기(심84)·절반 받기(②75 변형)·세 배보다 적게 더하기(②71 변형)는
//    같은 얼개의 문장제(am-word-packs, ad-word-pour, hd-word-box-more, ad-word-unit-price, am-word-age)와 수와 상황만 다르다.
//  - 그림이 필요해 미룬 것: 길 그림에서 겹치는 구간 빼기(②62 변형 심58 — 뽑은 글에 그림이 없어 길의 모양과 수를 알 수 없다), 수평 저울의 구슬(②80 — 그림 모름)
// 묻는 말: 수나 값은 "~은?/~는?", 양은 "몇 ~인가?/얼마인가?".
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, lines, tagged, table, tapes, N, M, C } = B.kit;
  const STD = '6수01-01';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const labelled = (answers) => answers.map((answer, i) => ({ label: LABELS[i], answer }));

  // ── 식 도구(5-1-1b.js 도 단원의 tools 로 받아 쓴다) ─────────────────
  const SIGN = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  const apply = (a, op, b) => (op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b);
  // 식 글을 화면 글로: '48-(15+9)/3*2' → '48 − (15 + 9) ÷ 3 × 2'
  const fmt = (s) => String(s).replace(/[-+*/]/g, (ch) => ' ' + SIGN[ch] + ' ');
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  const show = (s) => lines([ex(fmt(s))]);
  // 토막: 수 { n, src(그 수가 된 식) }, 연산 기호 { op, id(앞에서부터 센 번호) }, 괄호 { p }
  const lex = (s) => { let k = 0; return String(s).match(/\d+|[-+*/()]/g).map((x) => (/\d/.test(x) ? { n: Number(x), src: x } : x === '(' || x === ')' ? { p: x } : { op: x, id: k++ })); };
  // 토막을 화면 글로. 이름표(label)가 붙은 수는 빈칸으로 적는다.
  const write = (list) => list.map((t) => (t.p ? t.p : t.op ? ' ' + SIGN[t.op] + ' ' : t.label !== undefined ? box(t.label) : t.n)).join('');
  // 다음에 계산할 연산 기호의 자리(교과서 차례): ( ) 안 → 곱셈·나눗셈(앞에서부터) → 덧셈·뺄셈(앞에서부터)
  function nextAt(list) {
    let lo = 0, hi = list.length, at = -1;
    const open = list.findIndex((t) => t.p === '(');
    if (open >= 0) { lo = open + 1; hi = list.findIndex((t) => t.p === ')'); }
    for (let i = lo; i < hi && at < 0; i += 1) if (list[i].op === '*' || list[i].op === '/') at = i;
    for (let i = lo; i < hi && at < 0; i += 1) if (list[i].op) at = i;
    return at;
  }
  // at 자리의 연산 하나를 계산한다. 양옆이 수가 아니거나(아직 계산하지 않은 ( )), 값이 자연수가 아니면 null.
  function stepAt(list, at) {
    const a = list[at - 1], b = list[at + 1];
    if (!a || !b || a.n === undefined || b.n === undefined) return null;
    const op = list[at].op, v = apply(a.n, op, b.n);
    if (!Number.isInteger(v) || v < 1) return null;
    const made = { n: v, src: '(' + a.src + op + b.src + ')' }, i = at - 1;
    let out = list.slice(0, i).concat([made], list.slice(at + 2));
    if (out[i - 1] && out[i - 1].p === '(' && out[i + 1] && out[i + 1].p === ')') out = out.slice(0, i - 1).concat([made], out.slice(i + 2));
    return { list: out, made, id: list[at].id, a: a.n, op, b: b.n, v };
  }
  // 한 번에 한 연산씩 끝까지 계산한다. order(연산 기호 번호의 차례)를 주지 않으면 교과서 차례를 따른다.
  function run(s, order) {
    let list = lex(s); const steps = [];
    while (list.length > 1) {
      const at = order ? list.findIndex((t) => t.op && t.id === order[steps.length]) : nextAt(list), r = at > 0 ? stepAt(list, at) : null;
      if (!r) return null;
      steps.push(r); list = r.list;
    }
    return { value: list[0].n, steps, order: steps.map((st) => st.id) };
  }
  const val = (s) => { const r = run(s); return r ? r.value : null; };
  // 계산 과정을 등호로 이은 글
  const chain = (s, order) => [fmt(s)].concat(run(s, order).steps.map((st) => write(st.list))).join(' = ');
  const unparen = (s) => String(s).replace(/[()]/g, '');
  const numbersOf = (s) => String(s).match(/\d+/g).map(Number);
  const ids = (s) => (String(s).match(/[-+*/]/g) || []).map((_, i) => i);
  const perms = (list) => (list.length <= 1 ? [list] : list.reduce((all, x, i) => all.concat(perms(list.slice(0, i).concat(list.slice(i + 1))).map((p) => [x].concat(p))), []));
  // 곱셈은 (두 자리)×(12까지), 나눗셈은 (세 자리까지)÷(30까지)이고 몫은 2 이상, 도중의 수는 999까지
  const tidy = (r) => r.steps.every((st) => st.v <= 999 && (st.op === '*' ? Math.min(st.a, st.b) >= 2 && Math.min(st.a, st.b) <= 12 && Math.max(st.a, st.b) <= 99 : st.op !== '/' || (st.b >= 2 && st.b <= 30 && st.v >= 2)));
  // 그 차례로 계산해도 값이 같은가(다른 차례가 답이 되는 일을 막는다)
  const sameBy = (s, order) => { const r = run(s, order); return Boolean(r) && r.value === val(s); };
  // 교과서 차례와 다르고, 그 차례로 계산하면 값이 달라지거나 계산할 수 없는 차례들
  const wrongOrders = (s) => { const right = run(s).order.join(); return perms(ids(s)).filter((p) => p.join() !== right && !sameBy(s, p)); };
  // 가장 먼저 계산할 수 있는 연산이 교과서 차례의 첫 연산 하나뿐인가
  const soleFirst = (s) => { const first = run(s).order[0]; return perms(ids(s)).every((p) => p[0] === first || !sameBy(s, p)); };
  // 연산 기호 양옆의 수로 적은 부분: '18 × 4'
  const part = (list, at) => { const near = (i, step) => { while (list[i].n === undefined) i += step; return list[i].n; }; return near(at - 1, -1) + ' ' + SIGN[list[at].op] + ' ' + near(at + 1, 1); };
  const parts = (s) => { const list = lex(s); return list.map((t, i) => (t.op ? part(list, i) : null)).filter(Boolean); };

  // 틀의 글자(a, b, c …) 자리에 수를 뽑아 넣는다. 나눗셈은 몫부터 정해 나누어떨어지게 하고, 빼는 수는 빼어지는 수보다 작게 한다.
  function parse(tpl) {
    const t = tpl.match(/\d+|[a-z]|[-+*/()]/g); let i = 0;
    const atom = () => { if (t[i] === '(') { i += 1; const node = sum(); i += 1; return node; } const x = t[i++]; return /\d/.test(x) ? { fixed: Number(x) } : { leaf: x }; };
    const term = () => { let node = atom(); while (t[i] === '*' || t[i] === '/') { const op = t[i++]; node = { op, l: node, r: atom() }; } return node; };
    const sum = () => { let node = term(); while (t[i] === '+' || t[i] === '-') { const op = t[i++]; node = { op, l: node, r: term() }; } return node; };
    return sum();
  }
  const NO = { no: true };
  const divisorsOf = (x, hi) => { const out = []; for (let k = 2; k <= hi && k * 2 <= x; k += 1) if (x % k === 0) out.push(k); return out; };
  function fill(d, node, o, env) {
    const go = (child) => fill(d, child, o, env), set = (leaf, v) => { env[leaf.leaf] = v; return v; };
    if (node.fixed) return node.fixed;
    if (node.leaf) return set(node, d.int(o.lo, o.hi));
    const { op, l, r } = node;
    if (op === '+') { const x = go(l); return x + go(r); }
    if (op === '-') {
      if (l.leaf) { const y = go(r); return set(l, y + d.int(o.gap[0], o.gap[1])) - y; }
      const x = go(l);
      if (!r.leaf) { const y = go(r); if (x <= y) throw NO; return x - y; }
      if (x - 1 < o.lo) throw NO;
      return x - set(r, d.int(o.lo, Math.min(x - 1, o.hi * 2)));
    }
    if (op === '*') {
      if (l.leaf && r.leaf) { const small = d.int(2, 9), other = d.int(2, o.mul), flip = d.bool(); set(l, flip ? small : other); set(r, flip ? other : small); return small * other; }
      if (l.leaf || r.leaf) { const leaf = l.leaf ? l : r, x = go(l.leaf ? r : l); if (x > 50) throw NO; return x * set(leaf, x <= 9 ? d.int(2, o.mul) : x <= 25 ? d.int(2, 9) : d.int(2, 5)); }
      const x = go(l); return x * go(r);
    }
    if (r.leaf) {
      if (l.leaf) { const y = d.int(2, o.div), q = d.int(2, o.quo); set(l, y * q); set(r, y); return q; }
      const x = go(l), list = divisorsOf(x, o.div);
      if (!list.length) throw NO;
      return x / set(r, d.pick(list));
    }
    const y = go(r);
    if (y < 2 || y > o.den) throw NO;
    if (l.leaf) { const q = d.int(2, o.quo); set(l, y * q); return q; }
    const x = go(l);
    if (x % y !== 0 || x === y) throw NO;
    return x / y;
  }
  const evalNode = (node, env) => (node.fixed ? node.fixed : node.leaf ? env[node.leaf] : apply(evalNode(node.l, env), node.op, evalNode(node.r, env)));
  // 맨 바깥 덧셈·뺄셈의 한쪽 수를 고쳐 계산 결과를 hit 에 맞춘다(값이 같거나 가까운 식을 지을 때). 맞출 수 없는 수가 나오면 다시 뽑는다.
  function aim(tree, env, hit) {
    const { op, l, r } = tree;
    if (op === '+' && r.leaf) env[r.leaf] = hit - evalNode(l, env);
    else if (op === '+' && l.leaf) env[l.leaf] = hit - evalNode(r, env);
    else if (op === '-' && l.leaf) env[l.leaf] = hit + evalNode(r, env);
    else if (op === '-' && r.leaf) env[r.leaf] = evalNode(l, env) - hit;
    else throw new Error('값을 맞출 수 없는 틀이다.');
    if (!Object.keys(env).every((key) => Number.isInteger(env[key]) && env[key] >= 2)) throw NO;
  }
  // o: lo·hi(따로 놓인 수의 범위), gap(빼어지는 수가 빼는 수보다 큰 만큼), mul(곱하는 두 자리 수의 끝), div(나누는 수의 끝), quo(몫의 끝),
  //    den(나누는 수가 ( )일 때 그 값의 끝), cap(식에 적히는 가장 큰 수), min·max(계산 결과의 범위), hit(계산 결과를 이 값으로 맞춘다),
  //    same(같은 수가 두 번 나와도 된다), test(식 글, 계산 과정)
  function G(d, tpl, options) {
    const o = Object.assign({ lo: 3, hi: 30, gap: [2, 35], mul: 12, div: 9, quo: 12, den: 15, cap: 150, min: 1, max: 999 }, options || {}), tree = parse(tpl);
    return d.until(() => { const env = {}; try { fill(d, tree, o, env); if (o.hit) aim(tree, env, o.hit); } catch (e) { if (e !== NO) throw e; return null; } return tpl.replace(/[a-z]/g, (ch) => env[ch]); }, (s) => {
      if (!s) return false;
      const r = run(s), list = numbersOf(s);
      return Boolean(r) && tidy(r) && r.value >= o.min && r.value <= o.max && list.every((v) => v >= 2 && v <= o.cap) && (o.same || new Set(list).size === list.length) && (!o.test || o.test(s, r));
    });
  }
  const BIG = { lo: 11, hi: 60, gap: [3, 45], cap: 99 };        // 덧셈·뺄셈만 있는 식: 두 자리 수
  const MD = { mul: 25, div: 12, quo: 24, den: 30, cap: 250 };            // 곱셈·나눗셈만 있는 식
  // 틀이 여럿일 때: 그냥 배열이면 하나를 뽑고, each() 로 묶은 배열이면 차례 n 의 틀을 쓴다(유형의 count 만큼 서로 다른 구조의 문항이 된다).
  const each = (list) => Object.assign(list.slice(), { each: true });
  const pickTpl = (d, tpls, n) => (!Array.isArray(tpls) ? tpls : tpls.each ? tpls[n || 0] : d.pick(tpls));

  // ── 그림 ─────────────────────────────────────────────────────
  // 연산 기호 바로 아래에 이름표(㉠㉡㉢)를 적은 식
  function marked(s, tags) {
    const list = lex(s), cells = [];
    list.forEach((t, i) => { if (t.op) cells.push([SIGN[t.op], (tags || LABELS)[t.id]]); else if (!t.p) cells.push([(list[i - 1] && list[i - 1].p === '(' ? '(' : '') + t.n + (list[i + 1] && list[i + 1].p === ')' ? ')' : ''), '']); });
    const row = (k, style) => '<tr>' + cells.map((c) => '<td style="padding:0 3px;text-align:center;' + style + '">' + c[k] + '</td>').join('') + '</tr>';
    return '<table style="border-collapse:collapse;font-size:1.2rem;font-variant-numeric:tabular-nums;white-space:nowrap">' + row(0, '') + row(1, 'font-size:0.82em;line-height:1.25') + '</table>';
  }
  // 계산 순서 그림: 식 아래에서, 계산하는 두 수를 꺾은선으로 묶어 내려간다. order: 계산하는 차례대로 적은 연산 기호 번호.
  // o.blanks 를 주면 묶은 곳마다 계산한 값(이름표가 있는 곳은 빈칸)을 적고, 주지 않으면 계산하는 차례 ①②③…을 적는다.
  // 차례가 틀린 그림도 그릴 수 있게 ( )와 상관없이 양옆의 수(또는 앞서 묶은 값)를 묶는다.
  function tree(s, order, o) {
    const list = lex(s), blanks = o && o.blanks, top = 19, gapY = 27, RANK = ['①', '②', '③', '④'];
    let x = 6, out = '';
    for (const t of list) { const w = t.p ? 7 : t.op ? 21 : String(t.n).length * 10.5 + 5; t.x = x + w / 2; x += w; out += '<text x="' + t.x.toFixed(1) + '" y="' + top + '" text-anchor="middle" style="font-size:17px;fill:#1f2933">' + (t.p || (t.op ? SIGN[t.op] : t.n)) + '</text>'; }
    let row = list.filter((t) => !t.p).map((t) => (t.op ? t : { n: t.n, x: t.x, y: top + 6 }));
    const told = [];
    order.forEach((id, k) => {
      const at = row.findIndex((t) => t.op && t.id === id), a = row[at - 1], b = row[at + 1], y = top + 17 + k * gapY, mid = (a.x + b.x) / 2, v = apply(a.n, row[at].op, b.n), tag = blanks ? blanks[k] : undefined;
      out += '<path d="M' + a.x.toFixed(1) + ' ' + a.y + 'V' + y + 'H' + b.x.toFixed(1) + 'V' + b.y + '" style="fill:none;stroke:#64748b;stroke-width:1.3"/>';
      if (blanks && tag) out += '<rect x="' + (mid - 12).toFixed(1) + '" y="' + (y + 3) + '" width="24" height="17" rx="3" style="fill:#fff;stroke:#1f2933;stroke-width:1.4"/><text x="' + mid.toFixed(1) + '" y="' + (y + 16) + '" text-anchor="middle" style="font-size:12px;fill:#1f2933">' + tag + '</text>';
      else out += '<text x="' + mid.toFixed(1) + '" y="' + (y + 16) + '" text-anchor="middle" style="font-size:' + (blanks ? 15 : 14) + 'px;fill:' + (blanks ? '#1f2933' : '#1d4ed8') + ';font-weight:600">' + (blanks ? v : RANK[k]) + '</text>';
      told.push(blanks ? (tag ? '□' : v) : part(list, list.findIndex((t) => t.op && t.id === id)));
      row = row.slice(0, at - 1).concat([{ n: v, x: mid, y: y + 21 }], row.slice(at + 2));
    });
    const width = Math.ceil(x + 6), height = top + 17 + (order.length - 1) * gapY + 26;
    return '<svg class="mb-geo" viewBox="0 0 ' + width + ' ' + height + '" width="' + width + '" role="img" aria-label="계산 순서 그림: ' + fmt(s) + ' / ' + (blanks ? '차례로 계산한 값 ' : '묶은 차례 ') + told.join(', ') + '">' + out + '</svg>';
  }

  // ── 풀이 글 ──────────────────────────────────────────────────
  const ruleOf = (s) => (/\(/.test(s) ? '( ) 안을 가장 먼저 계산한다.' : /[*/]/.test(s) && /[-+]/.test(s) ? (/\*/.test(s) && /\//.test(s) ? '곱셈과 나눗셈을' : /\*/.test(s) ? '곱셈을' : '나눗셈을') + ' 덧셈, 뺄셈보다 먼저 계산한다.' : '앞에서부터 차례로 계산한다.');
  const why = (s) => ruleOf(s) + ' ' + chain(s);

  // ── 문항 틀 ──────────────────────────────────────────────────
  // 계산 결과
  const calc = (tpls, o) => (d, n) => { const tpl = pickTpl(d, tpls, n), s = G(d, tpl, o); return N('다음을 계산하시오.', val(s), { figure: show(s), explain: why(s), facts: { calc: [[s, 0]], rule: tpl } }); };
  // 가장 먼저 계산해야 하는 부분(다른 부분부터 계산해도 값이 같은 식은 쓰지 않는다)
  const firstOf = (tpls, o) => (d, n) => {
    const tpl = pickTpl(d, tpls, n), s = G(d, tpl, Object.assign({}, o, { test: soleFirst })), list = parts(s), first = run(s).order[0];
    return C('다음 식에서 가장 먼저 계산해야 하는 부분은?', list, first, { figure: show(s), explain: `${ruleOf(s)} 가장 먼저 계산해야 하는 부분은 ${list[first]}이다.`, facts: { truth: list.map((_, i) => i === first), want: true, rule: 'first:' + tpl } });
  };
  // 계산하는 순서: 연산 기호 아래에 ㉠㉡㉢을 붙이고 차례를 고른다. 「앞에서부터 차례로」와 「뒤에서부터」는 틀린 보기로 꼭 넣는다.
  const arrow = (order) => order.map((id) => LABELS[id]).join(' → ');
  const orderOf = (tpls, o) => (d, n) => {
    const tpl = pickTpl(d, tpls, n), s = G(d, tpl, Object.assign({}, o, { test: (x, r) => wrongOrders(x).length >= 3 && (!o || !o.test || o.test(x, r)) })), right = run(s).order, all = ids(s), bad = wrongOrders(s), has = (p) => bad.some((w) => w.join() === p.join());
    const must = [all, all.slice().reverse()].filter(has), rest = d.shuffle(bad.filter((w) => !must.some((p) => p.join() === w.join())));
    const options = d.shuffle([right].concat(must, rest).slice(0, 4));
    return C('다음 식을 계산하는 순서대로 기호를 바르게 쓴 것은?', options.map(arrow), options.findIndex((p) => p.join() === right.join()), {
      figure: marked(s), explain: `${ruleOf(s)} ${arrow(right)}의 차례로 계산한다. ${chain(s)}`, facts: { sequence: { ranks: all.map((id) => right.indexOf(id)), options }, rule: 'order:' + tpl }
    });
  };
  // 계산 과정의 빈칸: 한 줄에 한 연산씩 계산해 가고, 계산한 값마다 ㉠㉡㉢을 붙인다.
  const stepsOf = (tpls, o) => (d, n) => {
    const tpl = pickTpl(d, tpls, n), s = G(d, tpl, o), r = run(s), tags = LABELS.slice(0, r.steps.length);
    r.steps.forEach((st, k) => { st.made.label = tags[k]; });
    return M(`다음은 식을 계산하는 과정이다. ${tags.join(', ')}에 알맞은 수는?`, labelled(r.steps.map((st) => st.v)), {
      figure: lines([ex(fmt(s))].concat(r.steps.map((st) => ex('= ' + write(st.list))))), explain: why(s), facts: { calc: r.steps.map((st, k) => [st.made.src, k]), rule: 'steps:' + tpl }
    });
  };
  // 문장제: 글, 식(검사가 다시 셈한다), 단위. more: { lead(풀이 앞말), unseen(글에 숫자로 없는 수), figure }
  const story = (text, s, unit, more) => { const m = more || {}; return N(text, val(s), { unit, figure: m.figure, explain: (m.lead ? m.lead + ' ' : '') + chain(s), facts: Object.assign({ calc: [[s, 0]] }, m.unseen ? { unseen: m.unseen } : {}) }); };
  const two = (d) => d.shuffle(NAMES).slice(0, 2);
  // 낼 돈: 값보다 큰 가장 가까운 지폐 묶음
  const payFor = (cost) => [1000, 2000, 3000, 5000, 10000, 20000].find((bill) => bill > cost);
  const tools = { STD, SIGN, apply, fmt, ex, show, lex, write, nextAt, stepAt, run, val, chain, unparen, numbersOf, ids, perms, tidy, sameBy, wrongOrders, soleFirst, part, parts, G, BIG, MD, each, pickTpl, marked, tree, ruleOf, why, arrow, story, two, payFor, labelled };

  B.addUnit({
    id: '5-1-1', grade: 5, semester: 1, no: 1, title: '자연수의 혼합 계산', version: 1, tools,
    groups: [
      {
        id: 'as', title: '덧셈과 뺄셈이 섞여 있는 식', standard: STD,
        types: [
          T('as-sub-add', '뺄셈 뒤에 덧셈이 있는 식', '①1 ②1 ③1 심7', calc('a-b+c', BIG)),
          T('as-add-sub', '덧셈 뒤에 뺄셈이 있는 식', '①2 ②1 ③1 심7', calc('a+b-c', BIG)),
          T('as-sub-sub', '뺄셈이 두 번 있는 식', '①3', calc('a-b-c', BIG)),
          T('as-paren-add', '두 수의 합을 빼는 식', '①4 ②3 ③2 심7', calc('a-(b+c)', BIG)),
          T('as-paren-sub', '두 수의 차를 빼는 식', '①5 ③2', calc('a-(b-c)', BIG)),
          T('as-paren-plus', '두 수의 차를 더하는 식', '①6 ②3 ③2 심7', calc('a+(b-c)', BIG)),
          T('as-three', '연산이 셋인 덧셈과 뺄셈', '①7 ②2 ③3', calc(['a+b-c-d', 'a-b+c-d'], BIG)),
          T('as-three-paren', '연산이 셋이고 ( )가 있는 덧셈과 뺄셈', '①7 ②3 ③3', calc(['a-(b+c)-d', 'a-(b+c)+d'], BIG)),
          T('as-hundreds', '몇백몇십의 덧셈과 뺄셈', '①10 ②1·3', (d) => {
            // 1000 − (620 + 130), 400 + 350 − 200
            const paren = d.bool(), b = d.int(11, 48) * 10, c = d.until(() => d.int(11, 39) * 10, (v) => v !== b), a = paren ? (Math.floor((b + c) / 100) + d.int(1, 3)) * 100 : d.until(() => d.int(21, 65) * 10, (v) => v !== b && v !== c && v + b > c + 100);
            const s = paren ? `${a}-(${b}+${c})` : `${a}+${b}-${c}`;
            return N('다음을 계산하시오.', val(s), { figure: show(s), explain: why(s), facts: { calc: [[s, 0]], rule: 'hundreds' } });
          }),
          T('as-first', '덧셈과 뺄셈에서 가장 먼저 계산해야 하는 부분', '①8 ②14 ③16', firstOf('a-b-c+d', BIG)),
          T('as-first-paren', '( )가 있는 덧셈과 뺄셈에서 가장 먼저 계산해야 하는 부분', '①8 ②15 ③18 심1', firstOf('a-(b+c)+d', BIG)),
          T('as-first-pair', '( )가 없는 식과 있는 식에서 먼저 계산해야 하는 부분', '②15 ③18', (d) => {
            const s = G(d, 'a-(b+c)', BIG), [a, b, c] = numbersOf(s), p = `${a} − ${b}`, q = `${b} + ${c}`, rows = d.shuffle([[p, q], [q, p], [p, p], [q, q]]);
            return C('두 식에서 가장 먼저 계산해야 하는 부분을 차례로 쓴 것은?', rows.map(([x, y]) => `㉠ ${x}, ㉡ ${y}`), rows.findIndex(([x, y]) => x === p && y === q), {
              figure: tagged([ex(fmt(unparen(s))), ex(fmt(s))]), explain: `덧셈과 뺄셈이 섞여 있는 식은 앞에서부터 차례로 계산하므로 ㉠은 ${a} − ${josa(b, '을/를')} 먼저 계산한다. ( )가 있으면 ( ) 안을 먼저 계산하므로 ㉡은 ${b} + ${josa(c, '을/를')} 먼저 계산한다.`,
              facts: { truth: rows.map(([x, y]) => x === p && y === q), want: true, rule: 'pair:as' }
            });
          }),
          T('as-order', '( )가 있는 덧셈과 뺄셈의 계산 순서', '①9', orderOf(['a+b-(c+d)', 'a-(b-c)+d'], Object.assign({}, BIG, { test: (s, r) => !r.steps.some((st) => numbersOf(s).includes(st.v)) }))),
          T('as-steps', '덧셈과 뺄셈의 계산 과정', '①10 ②23 ③26 심6', stepsOf(['a+b-c', 'a-b+c'], BIG)),
          T('as-steps-paren', '( )가 있는 덧셈과 뺄셈의 계산 과정', '①10 ②23 ③26', stepsOf('a-(b+c)', BIG)),
          T('as-steps3', '연산이 셋인 덧셈과 뺄셈의 계산 과정', '②24', stepsOf('a+b-c-d', BIG)),
          T('as-talk', '( )가 있는 식에 대한 설명', '①11', (d) => {
            // 참인 말은 하나: 먼저 계산하는 부분, ( )를 푼 식, 계산 결과 가운데 한 자리만 참으로 둔다.
            const s = G(d, 'a-(b+c)', BIG), [a, b, c] = numbersOf(s), v = val(s), hit = d.int(0, 2);
            const rows = d.shuffle([
              hit === 0 ? [`${b} + ${josa(c, '을/를')} 가장 먼저 계산한다.`, true] : [`${a} − ${josa(b, '을/를')} 가장 먼저 계산한다.`, false],
              hit === 1 ? [`${a} − ${b} − ${josa(c, '과/와')} 계산 결과가 같다.`, true] : [`${a} − ${b} + ${josa(c, '과/와')} 계산 결과가 같다.`, false],
              hit === 2 ? [`계산 결과는 ${v}이다.`, true] : [`계산 결과는 ${a - b + c}이다.`, false],
              ['앞에서부터 차례로 계산한다.', false]
            ]);
            return C('다음 식에 대한 설명으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: show(s), explain: `( ) 안의 ${b} + ${josa(c, '을/를')} 먼저 계산한다. ${chain(s)}이다. ${josa(b, '과/와')} ${josa(c, '을/를')} 차례로 빼는 ${a} − ${b} − ${josa(c, '과/와')} 계산 결과가 같고, ${a} − ${b} + ${c} = ${josa(a - b + c, '과/와')}는 다르다.`,
              facts: { truth: rows.map((row) => row[1]), want: true }
            });
          }),
          T('as-word-bus', '문장제: 내리고 탄 사람', '①104 ②60 ③76 심55', (d) => {
            const a = d.int(21, 45), b = d.int(6, 15), c = d.until(() => d.int(4, 18), (v) => v !== b);
            return story(`버스에 ${a}명이 타고 있었다. 이번 정류장에서 ${b}명이 내리고 ${c}명이 탔다. 지금 버스에 타고 있는 사람은 몇 명인가?`, `${a}-${b}+${c}`, '명', { lead: '내린 사람 수를 빼고 탄 사람 수를 더한다.' });
          }),
          T('as-word-collect', '문장제: 두 가지를 모았다가 덜기', '①105 ②60 ③77', (d) => {
            const a = d.int(24, 58), b = d.until(() => d.int(13, 39), (v) => v !== a), c = d.until(() => d.int(8, 19), (v) => v !== a && v !== b);
            return story(`학급 문고에 동화책이 ${a}권, 과학책이 ${b}권 있었다. 그 가운데 ${c}권을 친구들이 빌려 갔다. 학급 문고에 남아 있는 책은 몇 권인가?`, `${a}+${b}-${c}`, '권', { lead: '두 가지 책의 수를 더한 다음 빌려 간 책의 수를 뺀다.' });
          }),
          T('as-word-take-two', '문장제: 전체에서 두 가지를 덜기', '①106 ②61 ③78 심56', (d) => {
            const b = d.int(14, 32), c = d.until(() => d.int(12, 29), (v) => v !== b), a = b + c + d.int(11, 35);
            return story(`색종이 ${a}장 가운데 어제 ${b}장, 오늘 ${c}장을 사용하였다. 남은 색종이는 몇 장인가?`, `${a}-(${b}+${c})`, '장', { lead: '어제와 오늘 사용한 색종이의 수를 더하여 전체에서 뺀다.' });
          }),
          T('as-word-change', '문장제: 세 가지를 산 거스름돈', '①107 심56', (d) => {
            const [p, q, r] = d.until(() => [d.int(15, 35) * 100, d.int(8, 19) * 100, d.int(5, 14) * 100], (list) => new Set(list).size === 3), cost = p + q + r, pay = payFor(cost);
            return story(`${p}원짜리 필통, ${q}원짜리 공책, ${r}원짜리 풀을 한 개씩 사고 ${pay}원을 냈다. 거스름돈은 얼마인가?`, `${pay}-(${p}+${q}+${r})`, '원', { lead: '산 물건의 값을 모두 더하여 낸 돈에서 뺀다.' });
          }),
          T('as-word-derived', '문장제: 한쪽 값을 먼저 구해 빼기', '①108 심57', (d) => {
            const who = d.pick(NAMES), a = d.int(33, 42), b = d.int(12, 22), f = a + b + d.int(8, 22);
            return story(`${nick(who)}네 가족이 몸무게를 재었다. ${nick(who)}의 몸무게는 ${a} kg이고, 어머니는 ${nick(who)}보다 ${b} kg 더 무겁다. 아버지의 몸무게가 ${f} kg일 때, 아버지는 어머니보다 몇 kg 더 무거운가?`, `${f}-(${a}+${b})`, 'kg', { lead: `어머니의 몸무게는 ${a} + ${b}이다.` });
          }),
          T('as-word-versus', '문장제: 더 받은 뒤 비교하기', '③77', (d) => {
            const a = d.int(12, 28), b = d.until(() => d.int(5, 14), (v) => v !== a), c = d.until(() => d.int(11, a + b - 3), (v) => v !== a && v !== b);
            return story(`빨간 구슬 ${a}개를 가지고 있었는데 ${b}개를 더 받았다. 파란 구슬은 ${c}개 가지고 있다. 빨간 구슬은 파란 구슬보다 몇 개 더 많은가?`, `${a}+${b}-${c}`, '개', { lead: '빨간 구슬의 수를 구한 다음 파란 구슬의 수를 뺀다.' });
          }),
          T('as-word-ledger', '문장제: 용돈 기입장', '②62 심55', (d) => {
            const who = d.pick(NAMES), a = d.int(3, 6) * 1000, b = d.int(4, 9) * 100, c = d.int(1, 2) * 1000 + 500, e = d.until(() => d.int(11, 24) * 100, (v) => v !== c && v !== b * 2);
            return story(`${nick(who)}의 용돈 기입장이다. 처음에 가진 돈이 없었다면 지금 남은 돈은 얼마인가?`, `${a}-${b}+${c}-${e}`, '원', {
              figure: table(['내용', '들어온 돈', '나간 돈'], [['용돈', a + '원', ''], ['공책', '', b + '원'], ['심부름', c + '원', ''], ['간식', '', e + '원']]), lead: '들어온 돈은 더하고 나간 돈은 뺀다.'
            });
          }),
          T('as-word-tape', '문장제: 겹쳐 이은 색 테이프 두 장', '②62 심59', (d) => {
            const a = d.int(18, 34), b = d.until(() => d.int(15, 32), (v) => v !== a), c = d.int(3, 8);
            return story(`길이가 ${a} cm, ${b} cm인 색 테이프 두 장을 ${c} cm만큼 겹쳐서 한 줄로 이어 붙였다. 이어 붙인 색 테이프의 전체 길이는 몇 cm인가?`, `${a}+${b}-${c}`, 'cm', { figure: tapes(a + ' cm', b + ' cm', c + ' cm'), lead: '두 장의 길이를 더하면 겹친 부분을 두 번 더한 것이므로 겹친 길이를 한 번 뺀다.' });
          })
        ]
      },
      {
        id: 'md', title: '곱셈과 나눗셈이 섞여 있는 식', standard: STD,
        types: [
          T('md-mul-div', '곱셈 뒤에 나눗셈이 있는 식', '①12 ②4 ③4 심8', calc('a*b/c', Object.assign({}, MD, { test: (s) => { const [, b, c] = numbersOf(s); return b % c !== 0; } }))),
          T('md-div-mul', '나눗셈 뒤에 곱셈이 있는 식', '①13 ②4 ③4 심8', calc('a/b*c', MD)),
          T('md-paren-mul', '두 수의 곱으로 나누는 식', '①14 ②5 ③5 심8', calc('a/(b*c)', Object.assign({}, MD, { mul: 6 }))),
          T('md-paren-div', '두 수의 몫을 곱하는 식', '①15 ②5 ③5', calc('a*(b/c)', MD)),
          T('md-div-div', '나눗셈이 두 번 있는 식', '①16', calc('a/b/c', MD)),
          T('md-paren-div-div', '두 수의 몫으로 나누는 식', '①16', calc('a/(b/c)', MD)),
          T('md-three', '연산이 셋인 곱셈과 나눗셈', '①16', calc('a/b*c/d', Object.assign({}, MD, { test: (s) => { const [, , c, e] = numbersOf(s); return c % e !== 0; } }))),
          T('md-three-paren', '연산이 셋이고 ( )가 있는 곱셈과 나눗셈', '③6', calc('a/(b*c)*d', Object.assign({}, MD, { mul: 6 }))),
          T('md-first', '곱셈과 나눗셈에서 가장 먼저 계산해야 하는 부분', '①17 ②14 ③16', firstOf('a/b*c/d', MD)),
          T('md-first-pair', '( )가 없는 식과 있는 식에서 먼저 계산해야 하는 부분(곱셈과 나눗셈)', '①17 ③18', (d) => {
            const s = G(d, 'a/(b*c)', Object.assign({}, MD, { mul: 6, test: (x) => val(unparen(x)) !== null })), [a, b, c] = numbersOf(s), p = `${a} ÷ ${b}`, q = `${b} × ${c}`, rows = d.shuffle([[p, q], [q, p], [p, p], [q, q]]);
            return C('두 식에서 가장 먼저 계산해야 하는 부분을 차례로 쓴 것은?', rows.map(([x, y]) => `㉠ ${x}, ㉡ ${y}`), rows.findIndex(([x, y]) => x === p && y === q), {
              figure: tagged([ex(fmt(unparen(s))), ex(fmt(s))]), explain: `곱셈과 나눗셈이 섞여 있는 식은 앞에서부터 차례로 계산하므로 ㉠은 ${a} ÷ ${josa(b, '을/를')} 먼저 계산한다. ( )가 있으면 ( ) 안을 먼저 계산하므로 ㉡은 ${b} × ${josa(c, '을/를')} 먼저 계산한다.`,
              facts: { truth: rows.map(([x, y]) => x === p && y === q), want: true, rule: 'pair:md' }
            });
          }),
          T('md-order', '( )가 있는 곱셈과 나눗셈의 계산 순서', '①16·18', orderOf('a/(b*c)*d', Object.assign({}, MD, { mul: 6 }))),
          T('md-steps', '곱셈과 나눗셈의 계산 과정', '①19 ②23 ③26', stepsOf(['a*b/c', 'a/b*c'], MD)),
          T('md-steps-paren', '( )가 있는 곱셈과 나눗셈의 계산 과정', '①19', stepsOf(['a*(b/c)', 'a/(b*c)'], Object.assign({}, MD, { mul: 6 }))),
          T('md-word-share', '문장제: 묶음을 모아 똑같이 나누기', '①109 ②63 ③79 심60', (d) => {
            const [a, b, c] = d.until(() => [d.pick([12, 15, 16, 18, 20, 24, 25, 30]), d.int(2, 6), d.int(3, 9)], ([x, y, z]) => (x * y) % z === 0 && z !== y && x % z !== 0 && x * y / z >= 4);
            return story(`한 상자에 ${a}개씩 들어 있는 귤 ${b}상자를 ${c}명이 똑같이 나누어 가지려고 한다. 한 명이 갖는 귤은 몇 개인가?`, `${a}*${b}/${c}`, '개', { lead: '귤의 수를 모두 구한 다음 사람 수로 나눈다.' });
          }),
          T('md-word-teams', '문장제: 줄지어 선 사람을 모둠으로 묶기', '①109 ②63 ③79', (d) => {
            const [a, b, c] = d.until(() => [d.int(6, 9), d.int(3, 8), d.int(4, 12)], ([x, y, z]) => (x * y) % z === 0 && x !== y && z !== x && z !== y && x * y / z >= 3);
            return story(`한 줄에 ${a}명씩 ${b}줄로 서 있던 학생들이 ${c}명씩 모둠을 만들었다. 모둠은 몇 모둠인가?`, `${a}*${b}/${c}`, '모둠', { lead: '학생 수를 모두 구한 다음 한 모둠의 학생 수로 나눈다.' });
          }),
          T('md-word-per-team', '문장제: 나눈 모둠마다 몇 개씩', '①110 ②64 ③80 심61', (d) => {
            const b = d.int(3, 6), q = d.int(4, 9), c = d.until(() => d.int(2, 8), (v) => v !== b && v !== q);
            return story(`학생 ${b * q}명이 ${b}명씩 모둠을 만들었다. 모둠마다 색 도화지를 ${c}장씩 나누어 주려면 색 도화지는 모두 몇 장 필요한가?`, `${b * q}/${b}*${c}`, '장', { lead: '모둠의 수를 구한 다음 한 모둠에 주는 수를 곱한다.' });
          }),
          T('md-word-unit', '문장제: 한 개의 양을 구해 여러 개의 양 구하기', '②64 ③80', (d) => {
            const b = d.int(3, 8), w = d.until(() => d.int(6, 15), (v) => v !== 10), c = d.until(() => d.int(2, 12), (v) => v !== b && b * w !== v && v !== w);
            return story(`무게가 같은 구슬 ${b}개의 무게가 ${b * w} g이다. 이 구슬 ${c}개의 무게는 몇 g인가?`, `${b * w}/${b}*${c}`, 'g', { lead: '구슬 한 개의 무게를 구한 다음 구슬의 수를 곱한다.' });
          }),
          T('md-word-box', '문장제: 한 판에 담는 수로 나누기', '①111 ②65 ③81', (d) => {
            const [b, c] = d.until(() => [d.int(3, 6), d.int(2, 5)], ([x, y]) => x !== y), q = d.until(() => d.int(3, 9), (v) => v !== b && v !== c);
            return story(`달걀을 한 판에 ${b}개씩 ${c}줄로 담는다. 달걀 ${b * c * q}개를 모두 담으려면 판은 몇 개 필요한가?`, `${b * c * q}/(${b}*${c})`, '개', { lead: '한 판에 담는 달걀의 수를 먼저 구하여 전체를 나눈다.' });
          })
        ]
      },
      {
        id: 'am', title: '덧셈, 뺄셈, 곱셈이 섞여 있는 식', standard: STD,
        types: [
          T('am-two', '연산이 둘인 덧셈(뺄셈)과 곱셈', '①20 ③7', calc(['a+b*c', 'a-b*c'])),
          T('am-mid', '곱셈이 가운데에 있는 식', '①21 ②6 ③7 심9', calc(['a-b*c+d', 'a+b*c-d'])),
          T('am-end', '곱셈이 맨 뒤에 있는 식', '①22 ②6 ③7', calc('a-b+c*d')),
          T('am-front', '곱셈이 맨 앞에 있는 식', '①22 ②6 ③7', calc('a*b-c+d')),
          T('am-paren-two', '( )가 있고 연산이 둘인 식(곱셈)', '②7', calc(['(a+b)*c', 'a*(b-c)'])),
          T('am-paren-front', '( )가 맨 앞에 있는 식(곱셈)', '①23 ②7 ③8', calc(['(a+b)*c-d', '(a-b)*c+d'])),
          T('am-paren-times', '( )가 곱하는 수 자리에 있는 식', '①24 ②7 ③8', calc(['a*(b-c)+d', 'a*(b+c)-d'])),
          T('am-paren-mid', '( )가 가운데에 있는 식(곱셈)', '①24 ②7 ③8', calc(['a+(b-c)*d', 'a-(b+c)*d'])),
          T('am-paren-end', '( )가 맨 뒤에 있는 식(곱셈)', '①24 ②7 ③8 심9', calc(['a-b*(c+d)', 'a+b*(c-d)'])),
          T('am-paren-apart', '곱셈과 ( )가 떨어져 있는 식', '①25 ②7', calc('a*b-(c+d)')),
          T('am-inner-as', '( ) 안에 덧셈과 뺄셈이 있는 식', '①26', calc('(a+b-c)*d')),
          T('am-inner-mul', '( ) 안에 곱셈이 있는 식', '①26', calc('a-(b+c*d)')),
          T('am-first', '덧셈, 뺄셈, 곱셈에서 가장 먼저 계산해야 하는 부분', '①27 ②14 ③17', firstOf('a-b*c+d')),
          T('am-first-paren', '( )와 곱셈이 있는 식에서 가장 먼저 계산해야 하는 부분', '①27 ③18', firstOf('a-b*(c+d)')),
          T('am-order', '덧셈, 뺄셈, 곱셈의 계산 순서', '①28 ②16 ③19', orderOf('a-b*c+d')),
          T('am-order-paren', '( )와 곱셈이 있는 식의 계산 순서', '①28 ②16 ③19', orderOf(each(['a*(b+c)-d', 'a+(b-c)*d'])), { count: 2 }),
          T('am-order-inner', '( ) 안에 곱셈과 덧셈이 있는 식의 계산 순서', '①26', orderOf('a-(b+c*d)')),
          T('am-steps', '덧셈, 뺄셈, 곱셈의 계산 과정', '①29 ②24 ③27', stepsOf(each(['a+b*c-d', 'a-b+c*d'])), { count: 2 }),
          T('am-steps-paren', '( )와 곱셈이 있는 식의 계산 과정', '①29', stepsOf('a*(b+c)-d')),
          T('am-word-left', '문장제: 날마다 읽고 남은 쪽수', '①113', (d) => {
            const b = d.int(12, 28), c = d.int(3, 7), a = b * c + d.int(15, 60);
            return story(`전체가 ${a}쪽인 책을 하루에 ${b}쪽씩 ${c}일 동안 읽었다. 남은 쪽수는 몇 쪽인가?`, `${a}-${b}*${c}`, '쪽', { lead: '읽은 쪽수를 곱셈으로 구하여 전체 쪽수에서 뺀다.' });
          }),
          T('am-word-give-get', '문장제: 몇 개씩 나누어 주고 더 얻기', '①113 ②66 ③82', (d) => {
            const [b, c] = d.until(() => [d.int(4, 9), d.int(2, 5)], ([x, y]) => x !== y), a = b * c + d.int(6, 20), e = d.until(() => d.int(4, 12), (v) => v !== b && v !== c);
            return story(`지우개 ${a}개를 가지고 있었다. 친구 ${b}명에게 ${c}개씩 나누어 주고, ${e}개를 더 샀다. 지금 가지고 있는 지우개는 몇 개인가?`, `${a}-${b}*${c}+${e}`, '개', { lead: '나누어 준 지우개의 수를 곱셈으로 먼저 구한다.' });
          }),
          T('am-word-packs', '문장제: 몇 묶음과 낱개에서 덜기', '①114 ②67 ③84', (d) => {
            const a = d.int(12, 25), b = d.int(3, 6), c = d.until(() => d.int(5, 11), (v) => v !== b), e = d.until(() => d.int(4, 18), (v) => v !== c && v !== b);
            return story(`한 봉지에 ${a}개씩 들어 있는 사탕 ${b}봉지와 낱개 ${c}개가 있었다. 그 가운데 ${e}개를 먹었다면 남은 사탕은 몇 개인가?`, `${a}*${b}+${c}-${e}`, '개', { lead: '봉지에 든 사탕의 수를 곱셈으로 먼저 구한다.' });
          }),
          T('am-word-bundle', '문장제: 한 묶음에 두 가지', '①115', (d) => {
            const [a, b] = d.until(() => [d.int(3, 8), d.int(2, 7)], ([x, y]) => x !== y), c = d.until(() => d.int(4, 9), (v) => v !== a && v !== b), e = d.int(11, (a + b) * c - 8);
            return story(`빨간 색종이 ${a}장과 노란 색종이 ${b}장을 한 묶음으로 하여 ${c}묶음을 만들었다. 그 가운데 ${e}장을 사용하였다면 남은 색종이는 몇 장인가?`, `(${a}+${b})*${c}-${e}`, '장', { lead: '한 묶음의 색종이 수를 ( )로 묶어 먼저 계산한다.' });
          }),
          T('am-word-two-groups', '문장제: 두 무리에게 같은 수씩 주고 남은 것', '①116 ②68 ③83 심66', (d) => {
            const [b, c] = d.until(() => [d.int(3, 8), d.int(2, 7)], ([x, y]) => x !== y), e = d.until(() => d.int(3, 6), (v) => v !== b && v !== c), a = (b + c) * e + d.int(5, 20);
            return story(`딸기 ${a}개를 남학생 ${b}명과 여학생 ${c}명이 ${e}개씩 먹었다. 남은 딸기는 몇 개인가?`, `${a}-(${b}+${c})*${e}`, '개', { lead: '학생 수를 ( )로 묶어 먼저 계산한다.' });
          }),
          T('am-word-change1', '문장제: 한 가지를 여러 개 산 거스름돈', '②69 심80', (d) => {
            const p = d.int(5, 9) * 100, n = d.int(2, 5), q = d.until(() => d.int(6, 15) * 100, (v) => v !== p), pay = payFor(p * n + q);
            return story(`${p}원짜리 음료수 ${n}병과 ${q}원짜리 과자 한 봉지를 사고 ${pay}원을 냈다. 거스름돈은 얼마인가?`, `${pay}-(${p}*${n}+${q})`, '원', { lead: '산 물건의 값을 ( )로 묶어 낸 돈에서 뺀다.' });
          }),
          T('am-word-change2', '문장제: 두 가지를 여러 개 산 거스름돈', '①117 ③86', (d) => {
            const [p, q] = d.until(() => [d.int(5, 9) * 100, d.int(4, 9) * 100], ([x, y]) => x !== y), [n, m] = d.until(() => [d.int(2, 5), d.int(2, 5)], ([x, y]) => x !== y), pay = payFor(p * n + q * m);
            return story(`${p}원짜리 볼펜 ${n}자루와 ${q}원짜리 공책 ${m}권을 사고 ${pay}원을 냈다. 거스름돈은 얼마인가?`, `${pay}-(${p}*${n}+${q}*${m})`, '원', { lead: '볼펜 값과 공책 값을 각각 곱셈으로 구하여 더하고, 낸 돈에서 뺀다.' });
          }),
          T('am-word-age', '문장제: 합의 몇 배보다 적은 나이', '①118 ②71 ③85 심65', (d) => {
            const who = d.pick(NAMES), a = d.int(10, 12), b = d.int(2, 5), c = d.int(3, 4), e = d.until(() => d.int(2, 9), (v) => v !== b && v !== c);
            return story(`${name(who, '은/는')} ${a}살이다. 사촌은 ${nick(who)}보다 ${b}살 많고, 어머니의 나이는 사촌 나이의 ${c}배보다 ${e}살 적다. 어머니는 몇 살인가?`, `(${a}+${b})*${c}-${e}`, '살', { lead: `사촌의 나이는 ${a} + ${b}이다.` });
          }),
          T('am-word-two-products', '문장제: 두 곱의 차', '②70 심66', (d) => {
            const [who, other] = two(d), [a, b, c, e] = d.until(() => [d.int(6, 12) * 10, d.int(5, 9), d.int(6, 12) * 10, d.int(4, 9)], ([p, q, r, s]) => p !== r && q !== s && p * q - r * s >= 30 && p * q - r * s <= 300);
            return story(`줄넘기를 ${name(who, '은/는')} 하루에 ${a}번씩 ${b}일 동안 하였고, ${name(other, '은/는')} 하루에 ${c}번씩 ${e}일 동안 하였다. ${name(who, '은/는')} ${nick(other)}보다 줄넘기를 몇 번 더 많이 하였는가?`, `${a}*${b}-${c}*${e}`, '번', { lead: '두 사람이 한 횟수를 각각 곱셈으로 구하여 뺀다.' });
          }),
          T('am-word-fees', '문장제: 두 가지 요금', '심67', (d) => {
            const [p, q] = d.until(() => [d.int(6, 9) * 500, d.int(3, 6) * 500], ([x, y]) => x > y), [n, m] = d.until(() => [d.int(2, 4), d.int(2, 5)], ([x, y]) => x !== y), e = d.pick([1000, 1500, 2000]);
            return story(`놀이공원 입장료는 어른이 ${p}원, 어린이가 ${q}원이다. 어른 ${n}명과 어린이 ${m}명이 들어가면서 ${e}원을 깎아 주는 할인권 한 장을 썼다. 낸 돈은 모두 얼마인가?`, `${p}*${n}+${q}*${m}-${e}`, '원', { lead: '어른 입장료와 어린이 입장료를 각각 곱셈으로 구하여 더한 다음 깎아 준 돈을 뺀다.' });
          }),
          T('am-word-sum-times', '문장제: 두 무리의 합에 곱하기', '②81', (d) => {
            const [a, b] = d.until(() => [d.int(11, 16), d.int(9, 15)], ([x, y]) => x !== y), c = d.int(3, 6);
            return story(`연필을 남학생 ${a}명과 여학생 ${b}명에게 ${c}자루씩 나누어 주려고 한다. 연필은 모두 몇 자루 필요한가?`, `(${a}+${b})*${c}`, '자루', { lead: '학생 수를 ( )로 묶어 먼저 계산한다.' });
          })
        ]
      },
      {
        id: 'ad', title: '덧셈, 뺄셈, 나눗셈이 섞여 있는 식', standard: STD,
        types: [
          T('ad-two', '연산이 둘인 덧셈(뺄셈)과 나눗셈', '①30 ②8 ③9', calc(['a+b/c', 'a-b/c'])),
          T('ad-mid', '나눗셈이 가운데에 있는 식', '①31 ②8 ③9 심10', calc(['a-b/c+d', 'a+b/c-d'])),
          T('ad-front', '나눗셈이 맨 앞에 있는 식', '①32 ②8 ③9', calc(['a/b+c-d', 'a/b-c+d'])),
          T('ad-end', '나눗셈이 맨 뒤에 있는 식', '①32 ③9', calc('a-b+c/d')),
          T('ad-paren-two', '( )가 있고 연산이 둘인 식(나눗셈)', '②9', calc(each(['(a+b)/c', 'a/(b-c)'])), { count: 2 }),
          T('ad-paren-front', '( )가 나누어지는 수이고 맨 앞에 있는 식', '①33 ②9 ③10 심10', calc(['(a+b)/c-d', '(a-b)/c+d'])),
          T('ad-paren-mid', '( )가 나누어지는 수이고 가운데에 있는 식', '①33 ②9 ③10', calc(['a+(b-c)/d', 'a-(b+c)/d'])),
          T('ad-divisor-front', '( )가 나누는 수이고 나눗셈이 맨 앞에 있는 식', '①34 ②9', calc(['a/(b-c)+d', 'a/(b+c)-d'])),
          T('ad-divisor-end', '( )가 나누는 수이고 맨 뒤에 있는 식', '①34 ②9 ③10 심10', calc(['a-b/(c+d)', 'a+b/(c-d)'])),
          T('ad-paren-apart', '나눗셈과 ( )가 떨어져 있는 식', '①35 ③10', calc(each(['a/b+(c-d)', '(a+b)-c/d'])), { count: 2 }),
          T('ad-paren-four', '( )가 나누는 수이고 연산이 넷인 식', '①34', calc('a/(b+c)+d-e')),
          T('ad-first', '덧셈, 뺄셈, 나눗셈에서 가장 먼저 계산해야 하는 부분', '①36 ②14 ③17', firstOf('a-b/c+d')),
          T('ad-first-paren', '( )와 나눗셈이 있는 식에서 가장 먼저 계산해야 하는 부분', '①36 ③18 심1', firstOf(['a-b/(c+d)', 'a/(b-c)+d'])),
          T('ad-order', '덧셈, 뺄셈, 나눗셈의 계산 순서', '①37 ②16 ③19', orderOf('a-b/c+d')),
          T('ad-order-paren', '( )와 나눗셈이 있는 식의 계산 순서', '①37 ②16', orderOf(['a-b/(c+d)', 'a+b/(c-d)'])),
          T('ad-second', '두 번째로 계산해야 하는 곳', '②16', (d) => {
            // 나눗셈 다음에 덧셈부터 하면 값이 달라지는 식만 쓴다(a − b ÷ c + d).
            const s = G(d, 'a-b/c+d', { test: (x) => wrongOrders(x).length === 5 }), r = run(s);
            return C('다음 식을 계산할 때 두 번째로 계산해야 하는 곳의 기호는?', LABELS.slice(0, 3), r.order[1], { figure: marked(s), explain: `나눗셈을 먼저 계산한 다음, 덧셈과 뺄셈은 앞에서부터 차례로 계산한다. ${arrow(r.order)}의 차례이다. ${chain(s)}`, facts: { truth: [0, 1, 2].map((id) => id === r.order[1]), want: true } });
          }),
          T('ad-steps', '덧셈, 뺄셈, 나눗셈의 계산 과정', '①38 ②24 ③27', stepsOf(each(['a-b+c/d', 'a+b/c-d'])), { count: 2 }),
          T('ad-steps-paren', '( )와 나눗셈이 있는 식의 계산 과정', '①38 ②24', stepsOf(each(['a-b/(c-d)', 'a+(b-c)/d'])), { count: 2 }),
          T('ad-word-sum-share', '문장제: 합쳐서 똑같이 나누기', '②72 심63', (d) => {
            const c = d.int(4, 12), q = d.int(6, 12), a = d.until(() => d.int(21, c * q - 15), (v) => v % c !== 0);
            return story(`빨간 구슬 ${a}개와 파란 구슬 ${c * q - a}개를 섞어서 ${c}상자에 똑같이 나누어 담으려고 한다. 한 상자에 담는 구슬은 몇 개인가?`, `(${a}+${c * q - a})/${c}`, '개', { lead: '구슬의 수를 ( )로 묶어 먼저 더한 다음 상자 수로 나눈다.' });
          }),
          T('ad-word-among', '문장제: 두 무리에게 똑같이 나누어 주기', '②72', (d) => {
            const [b, c] = d.until(() => [d.int(3, 8), d.int(2, 7)], ([x, y]) => x !== y), q = d.until(() => d.int(3, 9), (v) => v !== b && v !== c), a = (b + c) * q;
            return story(`사탕 ${a}개를 남학생 ${b}명과 여학생 ${c}명에게 똑같이 나누어 주려고 한다. 한 명이 받는 사탕은 몇 개인가?`, `${a}/(${b}+${c})`, '개', { lead: '학생 수를 ( )로 묶어 먼저 더한다.' });
          }),
          T('ad-word-share-less', '문장제: 합쳐 나눈 몫에서 덜기', '②73 ③88', (d) => {
            const who = d.pick(NAMES), c = d.int(3, 6), q = d.int(7, 12), a = d.until(() => d.int(11, c * q - 9), (v) => v % c !== 0), e = d.until(() => d.int(2, 5), (v) => v !== c);
            return story(`사탕 ${a}개에 ${c * q - a}개를 더 사서 ${c}명이 똑같이 나누어 가졌다. 그 가운데 한 명인 ${name(who, '이/가')} 사탕 ${e}개를 먹었다면 ${nick(who)}에게 남은 사탕은 몇 개인가?`, `(${a}+${c * q - a})/${c}-${e}`, '개', { lead: '사탕의 수를 ( )로 묶어 먼저 더한 다음 사람 수로 나눈다.' });
          }),
          T('ad-word-among-less', '문장제: 두 무리가 나누어 가진 뒤 먹고 남은 것', '③88 심73', (d) => {
            const [b, c] = d.until(() => [d.int(3, 8), d.int(2, 7)], ([x, y]) => x !== y), q = d.until(() => d.int(4, 9), (v) => v !== b && v !== c), e = d.until(() => d.int(1, q - 2), (v) => v !== b && v !== c), a = (b + c) * q;
            return story(`초콜릿 ${a}개를 남학생 ${b}명과 여학생 ${c}명이 똑같이 나누어 가졌다. 모두 ${e}개씩 먹었다면 한 명에게 남은 초콜릿은 몇 개인가?`, `${a}/(${b}+${c})-${e}`, '개', { lead: '학생 수를 ( )로 묶어 한 명이 가진 수를 먼저 구한다.' });
          }),
          T('ad-word-net', '문장제: 상자의 무게를 빼고 나누기', '②74', (d) => {
            const c = d.int(4, 9), w = d.int(35, 80), b = d.int(3, 9) * 10;
            return story(`무게가 같은 컵 ${c}개가 들어 있는 상자의 무게가 ${c * w + b} g이다. 빈 상자의 무게가 ${b} g일 때, 컵 한 개의 무게는 몇 g인가?`, `(${c * w + b}-${b})/${c}`, 'g', { lead: '컵만의 무게를 ( )로 묶어 먼저 구한 다음 컵의 수로 나눈다.' });
          }),
          T('ad-word-rest-pack', '문장제: 남은 것을 몇 개씩 묶기', '③89', (d) => {
            const c = d.int(4, 9), q = d.int(4, 9), b = d.until(() => d.int(5, 16), (v) => v !== c && v % c !== 0);
            return story(`구슬 ${c * q + b}개 가운데 ${b}개를 동생에게 주고, 남은 구슬을 한 봉지에 ${c}개씩 담았다. 구슬을 담은 봉지는 몇 봉지인가?`, `(${c * q + b}-${b})/${c}`, '봉지', { lead: '남은 구슬의 수를 ( )로 묶어 먼저 구한다.' });
          }),
          T('ad-word-pour', '문장제: 남은 것을 나누어 담고 더 넣기', '①122 심73', (d) => {
            const c = d.int(3, 6), q = d.int(8, 16) * 10, b = d.int(6, 18) * 10, e = d.int(2, 5) * 10;
            return story(`주스 ${c * q + b} mL 가운데 ${b} mL를 마시고, 남은 주스를 컵 ${c}개에 똑같이 나누어 담았다. 컵마다 물을 ${e} mL씩 더 부었다면 컵 한 개에 담긴 양은 몇 mL인가?`, `(${c * q + b}-${b})/${c}+${e}`, 'mL', { lead: '남은 주스의 양을 ( )로 묶어 먼저 구한다.' });
          }),
          T('ad-word-share-add', '문장제: 나누어 받은 몫을 더하고 덜기', '③87', (d) => {
            const who = d.pick(NAMES), c = d.int(3, 6), q = d.int(4, 9), a = d.until(() => d.int(6, 15), (v) => v !== c && v !== q), e = d.until(() => d.int(3, 9), (v) => v !== c && v !== q && v !== a);
            return story(`${name(who, '은/는')} 색종이를 ${a}장 가지고 있었다. 선생님이 색종이 ${c * q}장을 ${nick(who)}네 모둠 ${c}명에게 똑같이 나누어 주었다. 그 뒤 ${name(who, '이/가')} 색종이 ${e}장을 사용하였다면 ${nick(who)}에게 남은 색종이는 몇 장인가?`, `${a}+${c * q}/${c}-${e}`, '장', { lead: '선생님께 받은 색종이의 수를 나눗셈으로 먼저 구한다.' });
          }),
          T('ad-word-unit-price', '문장제: 낱개 값을 구해 더하고 빼기', '②75 ③90', (d) => {
            const n = d.int(3, 6), u = d.int(6, 15) * 100, q = d.until(() => d.int(15, 35) * 100, (v) => v !== n * u), has = d.until(() => d.int(1, 4) * 1000, (v) => v < u + q && u + q - v >= 300 && v !== n * u && v !== q);
            return story(`초콜릿은 ${n}개에 ${n * u}원이고 아이스크림은 한 개에 ${q}원이다. 초콜릿 한 개와 아이스크림 한 개를 사려고 하는데 가진 돈이 ${has}원뿐이다. 모자라는 돈은 얼마인가?`, `${n * u}/${n}+${q}-${has}`, '원', { lead: '초콜릿 한 개의 값을 나눗셈으로 먼저 구한다.' });
          }),
          T('ad-word-change-unit', '문장제: 낱개 값을 구해 거스름돈 구하기', '①120 ③90 심75·77', (d) => {
            const n = d.int(3, 6), u = d.int(6, 12) * 100, q = d.until(() => d.int(5, 14) * 100, (v) => v !== u && v !== n * u), pay = payFor(u + q + 300);
            return story(`공책은 ${n}권에 ${n * u}원이고 지우개는 한 개에 ${q}원이다. 공책 한 권과 지우개 한 개를 사고 ${pay}원을 냈다. 거스름돈은 얼마인가?`, `${pay}-(${n * u}/${n}+${q})`, '원', { lead: '공책 한 권의 값을 나눗셈으로 구하고, 산 물건의 값을 ( )로 묶어 낸 돈에서 뺀다.' });
          }),
          T('ad-word-read', '문장제: 모아서 남기고 똑같이 나누기', '①121', (d) => {
            const e = d.int(5, 9), q = d.int(16, 28), c = d.int(1, 4) * 10, a = d.until(() => d.int(3, 12) * 10, (v) => e * q + c - v >= 30 && e * q + c - v !== v && v !== c);
            return story(`${a}쪽짜리 동화책과 ${e * q + c - a}쪽짜리 과학책을 ${e}일 동안 날마다 같은 쪽수씩 읽어서 ${c}쪽만 남기려고 한다. 하루에 몇 쪽씩 읽어야 하는가?`, `(${a}+${e * q + c - a}-${c})/${e}`, '쪽', { lead: '읽어야 하는 쪽수를 ( )로 묶어 먼저 구한다.' });
          }),
          T('ad-word-day', '문장제: 하루 몫에서 한 만큼 빼기', '①123 심74', (d) => {
            const b = d.int(5, 9), q = d.int(9, 16), c = d.int(2, 5), e = d.until(() => d.int(2, 5), (v) => v !== c && c + v < q - 1);
            return story(`${b * q}쪽짜리 문제집을 ${b}일 동안 날마다 같은 쪽수씩 풀기로 하였다. 첫날 오전에 ${c}쪽, 오후에 ${e}쪽을 풀었다면 첫날 더 풀어야 하는 쪽수는 몇 쪽인가?`, `${b * q}/${b}-(${c}+${e})`, '쪽', { lead: '하루에 풀어야 하는 쪽수를 나눗셈으로 구하고, 첫날 푼 쪽수를 ( )로 묶어 뺀다.' });
          }),
          T('ad-word-teams', '문장제: 두 몫의 합', '②82 심72', (d) => {
            const [b, e] = d.until(() => [d.int(3, 6), d.int(3, 6)], ([x, y]) => x !== y), [p, q] = d.until(() => [d.int(3, 7), d.int(3, 7)], ([x, y]) => x !== y && b * x !== e * y);
            return story(`남학생 ${b * p}명은 ${b}명씩, 여학생 ${e * q}명은 ${e}명씩 모둠을 만들었다. 모둠은 모두 몇 모둠인가?`, `${b * p}/${b}+${e * q}/${e}`, '모둠', { lead: '남학생 모둠 수와 여학생 모둠 수를 각각 나눗셈으로 구하여 더한다.' });
          }),
          T('ad-word-unit-diff', '문장제: 낱개 값의 차', '심71', (d) => {
            const [b, e] = d.until(() => [d.int(3, 6), d.int(4, 8)], ([x, y]) => x !== y), [u, w] = d.until(() => [d.int(5, 12) * 100, d.int(4, 11) * 100], ([x, y]) => x > y && b * x !== e * y);
            return story(`㉮ 가게에서는 지우개 ${b}개를 ${b * u}원에 팔고, ㉯ 가게에서는 같은 지우개 ${e}개를 ${e * w}원에 판다. 지우개 한 개의 값은 ㉮ 가게가 ㉯ 가게보다 얼마나 더 비싼가?`, `${b * u}/${b}-${e * w}/${e}`, '원', { lead: '두 가게의 지우개 한 개의 값을 각각 나눗셈으로 구하여 뺀다.' });
          })
        ]
      },
      {
        id: 'all', title: '덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식', standard: STD,
        types: [
          T('all-apart', '곱셈과 나눗셈이 떨어져 있는 식', '①39 ②10 ③11 심11', calc(each(['a+b*c-d/e', 'a/b+c*d-e', 'a*b-c+d/e'])), { count: 3 }),
          T('all-apart3', '두 곱·몫의 차', '②10', calc(['a*b-c/d', 'a/b+c*d'])),
          T('all-joined', '곱셈과 나눗셈이 이어져 있는 식', '①40 ②11 ③12 심11', calc(each(['a-b/c*d+e', 'a+b-c*d/e'])), { count: 2 }),
          T('all-joined3', '덧셈(뺄셈) 하나와 이어진 곱셈·나눗셈', '①46 ②11', calc(['a+b/c*d', 'a-b*c/d'])),
          T('all-joined-front', '이어진 곱셈·나눗셈이 맨 앞에 있는 식', '②11 ③12', calc(['a*b/c-d+e', 'a/b*c-d+e'])),
          T('all-paren-apart', '( )가 있고 곱셈과 나눗셈이 떨어져 있는 식', '①41 ②12 ③13 심11', calc(each(['a/b+(c-d)*e', '(a+b)*c-d/e', 'a/(b+c)-d*e'])), { count: 3 }),
          T('all-paren-joined', '( )가 있고 곱셈과 나눗셈이 이어져 있는 식', '①42 ②12 ③13 심11', calc(each(['a+b*(c-d)/e', 'a-b/(c+d)*e'])), { count: 2 }),
          T('all-paren-three', '( )와 이어진 곱셈·나눗셈', '①46 ③13', calc(each(['a/(b-c)*d', '(a+b)/c*d'])), { count: 2 }),
          T('all-paren-mul', '( ) 안이 곱셈인 식', '①43 ②13 ③14', calc(each(['a-b/(c*d)+e', 'a/(b*c)+d-e']), { mul: 6 }), { count: 2 }),
          T('all-inner', '( ) 안에 나눗셈과 덧셈이 있는 식', '①44', calc('a-(b+c/d)*e')),
          T('all-two-parens', '( )가 둘인 식', '③15', calc('(a+b)/(c*d)', { mul: 6 })),
          T('all-first', '네 가지 연산이 섞인 식에서 가장 먼저 계산해야 하는 부분', '①47 ②14 ③17', firstOf('a-b/c*d+e')),
          T('all-first-inner', '( ) 안에 곱셈이 있는 식에서 가장 먼저 계산해야 하는 부분', '①47', firstOf('a+(b-c*d)/e')),
          T('all-first-paren', '( )와 이어진 곱셈·나눗셈에서 가장 먼저 계산해야 하는 부분', '②15 ③18', firstOf(['a+b/(c-d)*e', 'a-b*(c+d)/e'])),
          T('all-order', '네 가지 연산이 섞인 식의 계산 순서', '①48 ②17 ③20 심2', orderOf(['a-b/c+d*e', 'a+b*c-d/e'])),
          T('all-order-paren', '( )가 있고 네 가지 연산이 섞인 식의 계산 순서', '①48 ②17 ③20 심2', orderOf(each(['a-(b+c)/d*e', 'a+b*(c-d)/e'])), { count: 2 }),
          T('all-last', '마지막에 계산해야 하는 곳', '심1', (d) => {
            // 마지막 연산이 하나로 정해지는 식만 쓴다(a − b × c ÷ d + e: 덧셈을 뺄셈보다 먼저 하면 값이 달라진다).
            const s = G(d, 'a-b*c/d+e', { test: (x) => { const last = run(x).order[3]; return perms(ids(x)).every((p) => p[3] === last || !sameBy(x, p)); } }), r = run(s);
            return C('다음 식을 계산할 때 가장 마지막에 계산해야 하는 곳의 기호는?', LABELS, r.order[3], { figure: marked(s), explain: `곱셈과 나눗셈을 앞에서부터 차례로 계산한 다음, 덧셈과 뺄셈을 앞에서부터 차례로 계산한다. ${arrow(r.order)}의 차례이다. ${chain(s)}`, facts: { truth: [0, 1, 2, 3].map((id) => id === r.order[3]), want: true } });
          }),
          T('all-steps', '네 가지 연산이 섞인 식의 계산 과정', '①49 ②25 ③27 심6', stepsOf(['a+b/c*d-e', 'a-b*c/d+e'])),
          T('all-steps-apart', '곱셈과 나눗셈이 떨어져 있는 식의 계산 과정', '심6', stepsOf(['a-b*c+d/e', 'a/b+c*d-e'])),
          T('all-steps-paren', '( )가 있고 네 가지 연산이 섞인 식의 계산 과정', '①49 ②25 ③27', stepsOf(each(['a-(b+c)*d/e', 'a/b+(c-d)*e'])), { count: 2 }),
          T('all-word-change', '문장제: 낱개 값을 구해 여러 개를 산 거스름돈', '②77 ③91', (d) => {
            const p = d.int(3, 8) * 100, n = d.int(2, 4), m = d.until(() => d.int(3, 6), (v) => v !== n), u = d.until(() => d.int(4, 9) * 100, (v) => v !== p), pay = payFor(p * n + u + 200);
            return story(`${p}원짜리 지우개 ${n}개와 ${m}자루에 ${m * u}원인 색연필 한 자루를 사고 ${pay}원을 냈다. 거스름돈은 얼마인가?`, `${pay}-(${p}*${n}+${m * u}/${m})`, '원', { lead: '색연필 한 자루의 값은 나눗셈으로 구하고, 산 물건의 값을 ( )로 묶어 낸 돈에서 뺀다.' });
          }),
          T('all-word-unit-sum', '문장제: 낱개 값을 구해 여러 개 값 더하기', '①128 ②76', (d) => {
            const p = d.int(6, 12) * 100, m = d.int(4, 8), u = d.until(() => d.int(3, 6) * 100, (v) => v !== p), k = d.until(() => d.int(2, 5), (v) => v !== m);
            return story(`공책 한 권은 ${p}원이고 연필은 ${m}자루에 ${m * u}원이다. 공책 한 권과 연필 ${k}자루의 값은 모두 얼마인가?`, `${p}+${m * u}/${m}*${k}`, '원', { lead: '연필 한 자루의 값을 구한 다음 연필의 수를 곱하고 공책 값을 더한다.' });
          }),
          T('all-word-share-less', '문장제: 똑같이 나눈 한 몫에서 몇 묶음 덜기', '①124 ②78 심74', (d) => {
            const b = d.int(4, 6), [c, e] = d.until(() => [d.int(2, 4), d.int(2, 4)], ([x, y]) => x !== y), f = d.until(() => d.int(2, 5), (v) => v !== c && v !== e), q = (c + e) * f + d.int(3, 12);
            return story(`귤 ${b * q}개를 ${b}모둠에 똑같이 나누어 주었다. 그 가운데 한 모둠의 여학생 ${c}명과 남학생 ${e}명이 귤을 ${f}개씩 먹었다면 이 모둠에 남은 귤은 몇 개인가?`, `${b * q}/${b}-(${c}+${e})*${f}`, '개', { lead: '한 모둠이 받은 귤의 수를 나눗셈으로 구하고, 먹은 귤의 수를 뺀다.' });
          }),
          T('all-word-two-packs', '문장제: 두 가지 묶음을 합쳐 똑같이 나누기', '①125', (d) => {
            const [a, b, c, e, f] = d.until(() => [d.int(6, 16), d.int(3, 8), d.int(6, 16), d.int(3, 8), d.int(4, 9)], ([p, q, r, s, t]) => new Set([p, q, r, s, t]).size === 5 && (p * q + r * s) % t === 0 && (p * q) % t !== 0);
            return story(`한 봉지에 ${a}개씩 든 사탕 ${b}봉지와 한 봉지에 ${c}개씩 든 초콜릿 ${e}봉지를 모두 모아 ${f}명이 똑같이 나누어 가지려고 한다. 한 명이 갖는 것은 몇 개인가?`, `(${a}*${b}+${c}*${e})/${f}`, '개', { lead: '사탕과 초콜릿의 수를 각각 곱셈으로 구하여 더하고, ( )로 묶어 사람 수로 나눈다.' });
          }),
          T('all-word-split-bill', '문장제: 음식값을 똑같이 나누어 내기', '①126 심79', (d) => {
            const [p, n, q, m, f] = d.until(() => [d.int(4, 7) * 500, d.int(2, 5), d.int(5, 9) * 500, d.int(2, 3), d.int(3, 6)], ([x, y, z, w, t]) => x !== z && y !== w && t !== y && t !== w && (x * y + z * w) % (t * 100) === 0);
            return story(`${p}원짜리 김밥 ${n}줄과 ${q}원짜리 떡볶이 ${m}인분을 먹고, 음식값을 ${f}명이 똑같이 나누어 내려고 한다. 한 명이 내야 하는 돈은 얼마인가?`, `(${p}*${n}+${q}*${m})/${f}`, '원', { lead: '음식값을 모두 구하여 ( )로 묶고 사람 수로 나눈다.' });
          }),
          T('all-word-discount', '문장제: 두 가지 값의 합에서 깎아 준 돈 빼기', '③92', (d) => {
            const m = d.int(3, 6), u = d.int(4, 8) * 100, p = d.until(() => d.int(5, 9) * 100, (v) => v !== u), n = d.until(() => d.int(2, 4), (v) => v !== m), e = d.pick([300, 500, 1000]);
            return story(`연필은 ${m}자루에 ${m * u}원이고 공책은 한 권에 ${p}원이다. 연필 한 자루와 공책 ${n}권을 사는데 ${e}원을 깎아 주었다. 내야 하는 돈은 얼마인가?`, `${m * u}/${m}+${p}*${n}-${e}`, '원', { lead: '연필 한 자루의 값은 나눗셈으로, 공책 값은 곱셈으로 구하여 더한 다음 깎아 준 돈을 뺀다.' });
          }),
          T('all-word-pocket', '문장제: 나누어 갖고 쓰고 받기', '③93', (d) => {
            const who = d.pick(NAMES), k = d.int(2, 4), share = d.int(4, 6) * 1000, p = d.int(4, 9) * 100, n = d.until(() => d.int(2, 4), (v) => v !== k), e = d.int(1, 3) * 1000 + 500;
            return story(`${k * share}원을 ${k}명이 똑같이 나누어 가졌다. 그 가운데 한 명인 ${name(who, '은/는')} ${p}원짜리 지우개 ${n}개를 사고, 용돈 ${e}원을 받았다. ${name(who, '이/가')} 지금 가진 돈은 얼마인가?`, `${k * share}/${k}-${p}*${n}+${e}`, '원', { lead: '나누어 가진 돈은 나눗셈으로, 지우개 값은 곱셈으로 먼저 구한다.' });
          }),
          T('all-word-plate', '문장제: 묶음과 낱개를 나누어 담은 뒤 덜기', '③94', (d) => {
            const [a, b, c, e] = d.until(() => [d.int(8, 15), d.int(3, 6), d.int(3, 9), d.int(4, 8)], ([p, q, r, s]) => new Set([p, q, r, s]).size === 4 && (p * q + r) % s === 0 && (p * q) % s !== 0 && (p * q + r) / s >= 6), f = d.until(() => d.int(2, 4), (v) => v !== b && v !== c && v !== e);
            return story(`한 봉지에 ${a}개씩 든 초콜릿 ${b}봉지와 낱개 ${c}개를 접시 ${e}개에 똑같이 나누어 담았다. 한 접시에서 ${f}개를 먹었다면 그 접시에 남은 초콜릿은 몇 개인가?`, `(${a}*${b}+${c})/${e}-${f}`, '개', { lead: '초콜릿의 수를 ( )로 묶어 먼저 구한 다음 접시 수로 나눈다.' });
          }),
          T('all-word-among', '문장제: 묶음을 두 무리가 똑같이 나누기', '심63', (d) => {
            const [a, b, c, e] = d.until(() => [d.pick([12, 15, 16, 18, 20, 24, 28, 30]), d.int(2, 6), d.int(2, 6), d.int(2, 6)], ([x, y, z, w]) => z !== w && y !== z && y !== w && (x * y) % (z + w) === 0 && x % (z + w) !== 0 && x * y / (z + w) >= 4);
            return story(`한 상자에 ${a}개씩 든 과자 ${b}상자를 남학생 ${c}명과 여학생 ${e}명이 똑같이 나누어 가졌다. 한 명이 갖는 과자는 몇 개인가?`, `${a}*${b}/(${c}+${e})`, '개', { lead: '과자의 수는 곱셈으로 구하고, 학생 수는 ( )로 묶어 나눈다.' });
          }),
          T('all-word-formula', '문장제: 말로 준 공식에 넣기', '②79 ③95 심82', (d) => {
            const f = d.pick([41, 50, 59, 68, 77, 86, 95, 104]);
            return story(`화씨온도에서 ${josa(32, '을/를')} 뺀 수에 ${josa(5, '을/를')} 곱하고 ${josa(9, '으로/로')} 나누면 섭씨온도가 된다. 화씨온도가 ${f} ℉일 때 섭씨온도는 몇 ℃인가?`, `(${f}-32)*5/9`, '℃', { lead: '먼저 빼는 부분을 ( )로 묶는다.' });
          }),
          T('all-word-sandwich', '문장제: 여러 재료의 무게', '심76', (d) => {
            const b = d.int(4, 8), u = d.int(3, 6) * 10, c = d.pick([10, 15, 20]), e = d.until(() => d.int(2, 3), (v) => v !== b), f = d.until(() => d.int(5, 8) * 10, (v) => v !== u && v !== b * u), g = d.until(() => d.pick([5, 10, 15]), (v) => v !== c);
            return story(`치즈 ${b * u} g을 똑같이 ${b}조각으로 나눈 것 가운데 한 조각, 한 장에 ${c} g인 햄 ${e}장, ${f} g짜리 식빵으로 샌드위치를 만들었다. 식빵의 가장자리 ${g} g을 잘라 냈다면 샌드위치의 무게는 몇 g인가?`, `${b * u}/${b}+${c}*${e}+${f}-${g}`, 'g', { lead: '치즈 한 조각의 무게는 나눗셈으로, 햄의 무게는 곱셈으로 먼저 구한다.' });
          })
        ]
      },
      { id: 'order', title: '계산 순서와 잘못된 계산', standard: STD, types: [] },
      { id: 'paren', title: '( )가 있는 식과 없는 식', standard: STD, types: [] },
      { id: 'compare', title: '계산 결과의 크기 비교', standard: STD, types: [] },
      { id: 'box', title: '□가 있는 식', standard: STD, types: [] },
      { id: 'say', title: '말과 식', standard: STD, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
