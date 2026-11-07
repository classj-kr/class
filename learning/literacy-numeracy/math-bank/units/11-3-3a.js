// 고등학교 2학년 확률과 통계 3단원 확률의 개념과 활용 — 단원 틀·단원 안의 도구와 앞쪽 묶음(시행과 사건, 수학적 확률 — 주사위·동전,
// 수학적 확률 — 뽑기·나열·함수, 통계적 확률과 확률의 기본 성질).
// 수집해 둔 천재 T셀파 확률과 통계(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 32꼴, 기본꼴 2: 29꼴, 심화꼴: 7꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/11-3-3/싣기_대조표.md 에 있다.
// (확률의 덧셈정리, 여사건의 확률은 11-3-3b.js 에, 실력 문항은 11-3-3c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준: [12확통02-01] 확률의 개념과 기본 성질, [12확통02-02] 확률의 덧셈정리, [12확통02-03] 여사건의 확률. 묶음 차례는 교과서의 소단원 차례
// (시행과 사건 → 확률의 개념과 기본 성질 → 확률의 덧셈정리와 여사건의 확률)를 따른다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(글·표·풀이), 묻는 것(확률·개수·고르기·빈칸), 세는 법(순서쌍 나열·조합·순열·같은 것이 있는 순열·중복순열·
//    중복조합·사이사이에 넣기·겹친 것 빼기·여사건)이 다를 때만 따로 싣는다. 소재와 수만 다른 것은 한 번만 싣는다.
//  - 사용자가 정한 것: 내신 대비라 수학 실력에 필요해 보이는 꼴은 다 싣는다. 「지나치게 복잡한 문제」 따위의 정도를 말하는 줄은 빼는 까닭으로 삼지 않는다
//    (「세 사건 이상에서 서로 배반이거나 서로 독립임을 가정한 복잡한 문제는 다루지 않는다」도 정도의 줄이라 색마다 더하는 꼴(②44·②46)은 실었다).
//    학년이 다른 단원(중2 확률 8-2-7, 고1 경우의 수 10-1-7·집합 10-2-4)과 같은 일도 싣는다. 같은 과목의 다른 단원(11-3-4 조건부확률)의 몫만 뺀다.
//  - 답: 확률은 분수 칸(qAns — 크기가 같은 분수도 맞게 친다, 확률은 음수가 아니므로 부호 단추를 달지 않는다), 개수는 수 칸, 반올림한 확률은 소수 첫째 자리 칸.
//    사건(집합)·순서쌍 목록처럼 칸의 개수가 답을 흘리는 것, 까닭, 짝지은 것은 고르기로 받는다. 원문의 「10a의 값」「p + q의 값」은 확률을 바로 묻는다.
//    늘 같은 답이 나오는 원문(①19의 2/5, ①22의 5/12)은 수를 바꾸어 답이 달라지게 지었다.
//  - 답은 모두 코드가 셈한다. 검사 근거는 공식을 수로 적은 식(facts.value), 개수를 거꾸로 구하는 문항은 □ 에 수를 넣어 등식이 맞는 것이 하나뿐인지 보는 식(facts.digit),
//    고르기는 코드로 가린 참·거짓(facts.truth)과 「있는 대로 고른 것」의 묶음(facts.sets)이다. 만들 때 seal 이 같은 검사를 먼저 돌린다.
//    원문 답지의 잘못(소단원 평가 2-1-1 기본 1⑴ 정이십면체의 답 12 → 20, 발전 3 풀이의 9/20 → 9/50)은 따르지 않는다.
//
// 뺀 것과 까닭(11-3-3b.js, 11-3-3c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 같은 과목 다른 단원의 몫: ①26(불량품을 하나씩 검사해 k번째에 끝날 확률 — 교과서 자리대로 11-3-4 확률의 곱셈정리), 심6(동전 7번 — 독립시행 꼴, 11-3-4).
//  - 서술형·활동: ①1의 「배반인 두 사건의 예를 말하기」, 문제 만들기 ➋, 공학 탐구(통그라미), 윷짝 상대도수 그래프(본문 설명) — 꼴 목록에서 이미 세지 않은 것.
//    ①7(풀이의 잘못을 설명하기)은 까닭 고르기와 바른 확률로, ②39(식을 잇는 설명)는 빈칸 고르기로 바꾸어 실었다.
//  - 겹침: 심1(흰 공·검은 공을 종류별 개수로 뽑기 → ①14 pick-kinds 와 같은 일).
// 묻는 말: 확률이나 값은 「~은?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, table, NAMES, N, C, D } = B.kit;
  const { MINUS, Q, range, nb, tail, V } = B.kit.mid;
  const { ms, nC, nP, nPi, nH, pr, qAns } = B.kit.hs;
  const UNIT = '11-3-3', S1 = '12확통02-01', S2 = '12확통02-02', S3 = '12확통02-03';

  // ── 세는 도구 ──
  const sumA = (a) => a.reduce((s, v) => s + v, 0);
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
  const nPr = (n, r) => (r < 0 || r > n ? 0 : fact(n) / fact(n - r));
  const nCr = (n, r) => (r < 0 || r > n ? 0 : Math.round(nPr(n, r) / fact(r)));
  const perms = (list, k) => (k === 0 ? [[]] : list.reduce((all, x, i) => all.concat(perms(list.filter((_, j) => j !== i), k - 1).map((rest) => [x].concat(rest))), []));
  const combos = (list, k) => (k === 0 ? [[]] : list.length < k ? [] : combos(list.slice(1), k - 1).map((rest) => [list[0]].concat(rest)).concat(combos(list.slice(1), k)));
  const cart = (lists) => lists.reduce((acc, l) => acc.reduce((all, row) => all.concat(l.map((x) => row.concat([x]))), []), [[]]);
  const isPrime = (n) => n > 1 && range(2, n - 1).every((k) => n % k !== 0);
  const inter = (a, b) => a.filter((x) => b.includes(x));
  const union = (a, b) => [...new Set(a.concat(b))].sort((x, y) => x - y);
  const minus = (a, b) => a.filter((x) => !b.includes(x));
  const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

  // ── 검사 식 글 ──
  // n(n−1)…(n−r+1) → "(7*6*5)", ₙCᵣ → "((7*6)/(2*1))", ₙPᵣ → "(7*6)", n! → "(4*3*2*1)"
  const prodS = (n, r) => (r <= 0 ? '1' : range(0, r - 1).map((i) => n - i).join('*'));
  const combS = (n, r) => (r < 0 || r > n ? '0' : r === 0 ? '1' : `((${prodS(n, r)})/(${prodS(r, r)}))`);
  const permS = (n, r) => (r < 0 || r > n ? '0' : `(${prodS(n, r)})`);
  const factS = (n) => `(${prodS(n, n)})`;
  const qS = (q) => (q.q === 1 ? String(q.p) : `(${q.p}/${q.q})`);

  // ── 글 ──
  const fq = (q) => (q.q === 1 ? String(q.p) : frac(q.p, q.q));                        // 유리수(확률)를 분수 글로
  const fqj = (q, pair) => fq(q) + tail(q.p, pair);                                     // 분수 뒤 토씨는 분자의 끝소리(사분의 삼 → 삼)
  const eqF = (num, den) => { const q = Q(num, den); return frac(num, den) + (q.q !== den ? ' = ' + fq(q) : ''); };   // 12/21 = 4/7
  const roster = (list) => (list.length ? nb('{' + list.join(', ') + '}') : '∅');
  const pairs = (list) => nb('{' + list.map((p) => '(' + p.join(', ') + ')').join(', ') + '}');
  const A = 'A', Bn = 'B', Cn = 'C';
  // 영문자 뒤 토씨: L(엘)·M(엠)·N(엔)·R(알)은 받침이 있다.
  const lj = (ch, pair) => { const [w, wo] = pair.split('/'); const b = 'LMNR'.includes(ch.slice(-1)); return ch + (pair === '으로/로' ? (b && !'LR'.includes(ch.slice(-1)) ? '으로' : '로') : b ? w : wo); };
  const who = (d, k) => d.shuffle(NAMES).slice(0, k);

  // ── 시행의 소재 ──
  // 1부터 m까지의 수가 나오는 시행: intro(시행 글), what(확인하는 수 — 끝이 「수」라 토씨는 「가」)
  const TRIALS = {
    4: { intro: '각 면에 1부터 4까지의 자연수가 하나씩 적힌 정사면체 모양의 주사위 한 개를 던지는 시행', what: '바닥에 닿는 면에 적힌 수' },
    6: { intro: '한 개의 주사위를 던지는 시행', what: '나온 눈의 수' },
    8: { intro: '각 면에 1부터 8까지의 자연수가 하나씩 적힌 정팔면체 모양의 주사위 한 개를 던지는 시행', what: '나온 수' },
    9: { intro: '1부터 9까지의 자연수가 각각 하나씩 적힌 공 9개가 들어 있는 주머니에서 임의로 1개의 공을 꺼내는 시행', what: '꺼낸 공에 적힌 수' },
    10: { intro: '1부터 10까지의 자연수가 각각 하나씩 적힌 카드 10장 중에서 임의로 한 장을 뽑는 시행', what: '뽑은 카드에 적힌 수' },
    12: { intro: '각 면에 1부터 12까지의 자연수가 하나씩 적힌 정십이면체 모양의 주사위 한 개를 던지는 시행', what: '나온 수' }
  };
  // 수의 성질(사건): 이름은 「~인 사건」에 들어가는 말, set 은 1~m 에서 그 성질을 가진 수
  function props(m) {
    const S = range(1, m), out = [];
    const add = (name, f) => { const set = S.filter(f); if (set.length >= 2 && set.length <= m - 2) out.push({ name, set }); };
    add('짝수', (x) => x % 2 === 0); add('홀수', (x) => x % 2 === 1); add('소수', isPrime);
    for (const k of [3, 4, 5]) if (k * 2 <= m) add(k + '의 배수', (x) => x % k === 0);
    for (const k of [4, 5, 6, 8, 9, 10, 12]) if (k <= m) add(k + '의 약수', (x) => k % x === 0);
    for (let k = 3; k <= m - 2; k += 1) { add(k + ' 이상', (x) => x >= k); add(k + ' 이하', (x) => x <= k); }
    return out;
  }

  // ── 검사 근거 마무리(seal) ──
  // 검사가 하는 것을 만들 때 먼저 해 본다: 식의 값과 답, □ 식의 해, 고르기의 근거. 식의 수 가운데 글·그림 설명·보기에 보이지 않는 수는 facts.unseen 에 밝힌다.
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function shownNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  const evalS = (s) => { if (!/^[\d+\-*\/%(). ]+$/.test(s)) throw new Error('검사 식이 아니다: ' + s); return Function('"use strict"; return (' + s + ');')(); };
  const sameV = (x, y) => Math.abs(x - y) < 1e-9;
  function seal(item) {
    const f = item.facts || {}, ans = (i) => item.inputs[i].answer;
    if (!item.choice) for (const input of item.inputs) if (!input.decimal && (!Number.isInteger(input.answer) || input.answer < 0 || input.answer > 9999)) throw new Error('답이 0~9999 의 정수가 아니다: ' + input.answer);
    if (f.value !== undefined) {
      const v = evalS(f.value), a = item.inputs.map((input) => input.answer), got = item.fraction ? a[a.length - 2] / a[a.length - 1] : a[0];
      if (!sameV(v, got)) throw new Error(`검사 식 ${f.value.slice(0, 90)} = ${v} 인데 답은 ${got}`);
    }
    for (const [s, i] of f.calc || []) { const v = evalS(s); if (!(item.inputs[i].decimal ? Math.round(v * 1000) === Math.round(ans(i) * 1000) : v === ans(i)) || !(v > 0)) throw new Error(`검사 식 ${s.slice(0, 80)} = ${v} 인데 답은 ${ans(i)}`); }
    if (f.digit) {
      const { template, lo, hi } = f.digit, ok = [];
      for (let x = lo; x <= hi; x += 1) {
        const parts = template.replace(/□/g, String(x)).split(/([<>])/); let good = true;
        for (let i = 1; i < parts.length; i += 2) { const l = evalS(parts[i - 1]), r = evalS(parts[i + 1]); if (!(parts[i] === '<' ? l < r : l > r)) good = false; }
        if (good) ok.push(x);
      }
      if (ok.length !== 1 || ok[0] !== ans(0)) throw new Error('□ 식을 만족하는 수: ' + ok.join(',') + ' / 답 ' + ans(0));
    }
    if (f.truth && (f.truth.filter((t) => t === f.want).length !== 1 || f.truth[item.choice.answer] !== f.want)) throw new Error('참·거짓 근거가 답과 다르다: ' + f.truth.join(','));
    if (f.sets) {
      const right = f.sets.labels.filter((_, i) => f.sets.flags[i]), key = (s) => s.slice().sort().join();
      if (!right.length || right.length === f.sets.labels.length || f.sets.options.filter((o) => key(o) === key(right)).length !== 1 || key(f.sets.options[item.choice.answer]) !== key(right)) throw new Error('sets 근거가 답과 다르다');
    }
    if (item.choice && new Set(item.choice.options.map(stripH)).size !== item.choice.options.length) throw new Error('보기가 겹친다: ' + item.choice.options.map(stripH).join(' / '));
    const shown = shownNumbers(item), hidden = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([s]) => s).concat(f.value !== undefined ? [f.value] : []);
    for (const s of exprs) for (const n of s.match(/\d+(?:\.\d+)?/g) || []) if (!shown.has(n)) hidden.add(Number(n));
    if (hidden.size) f.unseen = [...hidden]; else delete f.unseen;
    if (!Object.keys(f).length) throw new Error('facts 가 없다');
    item.facts = f;
    return item;
  }
  const sourceOf = (ref) => '수집본 ' + (/[①②]/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: (d, n) => seal(make(d, n)) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: (d, n) => seal(make(d, n)) }, more || {});

  // ── 문항 꼴 ──
  // 확률 하나: num/den 을 분수 칸으로(0·1 이면 수 칸). value 는 공식을 수로 적은 검사 식.
  const probQ = (text, num, den, value, o) => qAns(text, [num, den], { figure: (o || {}).figure, explain: (o || {}).explain, facts: Object.assign({ value }, (o || {}).facts || {}) });
  // 하나 고르기: rows 는 { h 글, ok }. ok 가 want 인 것이 꼭 하나다.
  function oneQ(d, text, rows, want, o) {
    const opt = o || {}, list = opt.keep ? rows.slice() : d.shuffle(rows);
    if (list.filter((r) => r.ok === want).length !== 1) throw new Error('답이 하나가 아니다');
    const at = list.findIndex((r) => r.ok === want);
    return C(text, list.map((r) => r.h), at, { figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: list.map((r) => r.ok), want }, opt.rule ? { rule: opt.rule } : {}) });
  }
  // 「있는 대로 고른 것」: rows 는 { h 글, ok }. 옳은 묶음 하나와, 하나를 빼거나 더하거나 바꾼 틀린 묶음을 섞어 다섯.
  const GA = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'];
  const bogi = (list) => lines(list.map((h, i) => '<span class="mb-tag mb-tag-short">' + GA[i] + '.</span>' + h));
  function setsQ(d, text, rows, o) {
    const opt = o || {}, labels = GA.slice(0, rows.length), flags = rows.map((r) => Boolean(r.ok));
    if (!flags.some(Boolean) || flags.every(Boolean)) throw new Error('옳은 것이 없거나 모두 옳다');
    const key = (s) => s.join('|'), right = labels.filter((_, i) => flags[i]), near = [], far = [];
    labels.forEach((_, i) => { const t = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (t.length) near.push(t); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) near.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    for (let m = 1; m < (1 << labels.length); m += 1) far.push(labels.filter((_, k) => (m >> k) & 1));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(near).concat(d.shuffle(far))) { if (out.length === 5) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const sets = d.shuffle(out).sort((a, b) => a.length - b.length || key(a).localeCompare(key(b)));
    return C(text, sets.map((s) => s.join(', ')), sets.findIndex((s) => key(s) === key(right)), {
      figure: (opt.figure || '') + bogi(rows.map((r) => r.h)),
      explain: opt.explain + ` 따라서 고른 것은 ${right.join(', ')}이다.`,
      facts: { sets: { labels, flags, options: sets } }
    });
  }

  // 단원 안의 도구를 b·c 파일에 내보낸다.
  B.kit.u33x = {
    sumA, fact, nPr, nCr, perms, combos, cart, isPrime, inter, union, minus, sameSet,
    prodS, combS, permS, factS, qS, fq, fqj, eqF, roster, pairs, lj, who, TRIALS, props,
    seal, T, H, probQ, oneQ, setsQ, bogi, GA, S1, S2, S3
  };

  // ════════════════ 시행과 사건 ════════════════
  const eventTypes = [
    T('event-elem', '근원사건 고르기, 사건을 순서쌍으로 나타내기', '①1', (d, n) => {
      if (n === 0) {
        const m = d.pick([4, 6, 8]), S = range(1, m), k = d.int(1, m);
        const half = d.bool() ? S.filter((x) => x % 2 === 0) : S.filter((x) => x % 2 === 1);
        const two = d.until(() => [d.int(1, m), d.int(1, m)].sort((x, y) => x - y), (t) => t[0] < t[1] && !sameSet(t, half));
        const rows = [{ h: roster([k]), ok: true }, { h: roster(two), ok: false }, { h: roster(half), ok: false }, { h: '∅', ok: false }, { h: roster(S), ok: false }];
        return oneQ(d, `${TRIALS[m].intro}에서 다음 중 근원사건인 것은?`, rows, true, {
          explain: `근원사건은 한 개의 원소로 이루어진 사건이다. ${roster(two)}, ${roster(half)}, 표본공간 ${roster(S)}은 원소가 둘 이상이고 ∅은 원소가 없으므로 근원사건은 ${roster([k])}이다.`
        });
      }
      const k = d.int(3, 5), all = cart([range(1, k), range(1, k)]);
      const s = d.until(() => d.int(4, 2 * k - 2), (v) => all.filter(([x, y]) => x + y === v).length >= 3);
      const right = all.filter(([x, y]) => x + y === s), half = right.filter(([x, y]) => x <= y);
      const lower = all.filter(([x, y]) => x + y === s - 1), upper = all.filter(([x, y]) => x + y === s + 1);
      const rows = [{ h: pairs(right), ok: true }, { h: pairs(half), ok: false }, { h: pairs(lower), ok: false }, { h: pairs(upper), ok: false }];
      return oneQ(d, `서로 다른 두 주머니에 1부터 ${k}까지의 자연수가 하나씩 적힌 공이 ${k}개씩 들어 있다. 두 주머니에서 임의로 공을 1개씩 꺼내는 시행에서 꺼낸 두 공에 적힌 수의 합이 ${s}인 사건을 (첫째 주머니에서 꺼낸 수, 둘째 주머니에서 꺼낸 수)의 순서쌍으로 나타낸 것은?`, rows, true, {
        explain: `두 주머니는 서로 다르므로 (1, 2)와 (2, 1)은 다른 결과이다. 합이 ${s}인 순서쌍을 모두 적으면 ${pairs(right)}이다.`
      });
    }, { count: 2, standard: S1 }),
    T('event-count', '여러 개를 함께 던지는 시행의 근원사건의 개수', '①2', (d) => {
      const KINDS = [['동전', 2, ''], ['주사위', 6, ''], ['정사면체 모양의 주사위', 4, '정사면체'], ['정팔면체 모양의 주사위', 8, '정팔면체'], ['정십이면체 모양의 주사위', 12, '정십이면체'], ['정이십면체 모양의 주사위', 20, '정이십면체']];
      const parts = d.until(() => d.shuffle(KINDS).slice(0, 2).map((k) => k.concat([k[1] === 2 ? d.int(1, 3) : d.int(1, 2)])),
        (ps) => { const v = ps.reduce((s, p) => s * p[1] ** p[3], 1); return v >= 16 && v <= 2000 && ps.some((p) => p[3] > 1); });
      const ans = parts.reduce((s, p) => s * p[1] ** p[3], 1);
      const said = parts.map((p) => (p[3] > 1 ? `서로 다른 ${p[0]} ${p[3]}개` : `${p[0]} 1개`));
      const polys = parts.filter((p) => p[2]);
      return N(`${josa(said[0], '과/와')} ${said[1]}${'를'} 동시에 던지는 시행에서 근원사건의 개수는?` + (polys.length ? ` (단, ${polys.map((p) => `${p[2]} 모양의 주사위의 각 면에는 1부터 ${p[1]}까지의 자연수가 하나씩 적혀 있다`).join('. ')}.)` : ''), ans, {
        unit: '개',
        explain: `근원사건의 개수는 일어날 수 있는 모든 결과의 수이다. ${parts.map((p) => `${p[0]} 하나에서 나오는 결과는 ${p[1]}가지`).join(', ')}이므로 곱의 법칙에 의하여 ${parts.map((p) => Array(p[3]).fill(p[1]).join(' × ')).join(' × ')} = ${ans}(개)이다.`,
        facts: { value: parts.map((p) => Array(p[3]).fill(p[1]).join('*')).join('*') }
      });
    }, { standard: S1 }),
    T('event-ops', '두 사건의 곱사건·합사건·여사건을 원소로', '①3', (d, n) => {
      const m = d.pick([6, 8, 9, 10, 12]), S = range(1, m), P = props(m);
      const [pa, pb] = d.until(() => d.shuffle(P).slice(0, 2), ([a, b]) => { const i = inter(a.set, b.set); return i.length >= 1 && i.length < Math.min(a.set.length, b.set.length) && union(a.set, b.set).length < m; });
      const a = pa.set, b = pb.set;
      const cand = { cap: inter(a, b), cup: union(a, b), ac: minus(S, a), bc: minus(S, b), amb: minus(a, b), bma: minus(b, a), none: minus(S, union(a, b)) };
      const ask = ['cap', 'cup', 'bc'][n], said = { cap: `사건 ${ms('A∩B')}는?`, cup: `사건 ${ms('A∪B')}는?`, bc: `사건 B의 여사건 ${ms('B^C')}은?` }[ask];
      const right = cand[ask], others = d.shuffle(Object.keys(cand).filter((k) => k !== ask)).map((k) => cand[k]);
      const opts = [right];
      for (const o of others) { if (opts.length === 5) break; if (o.length && !opts.some((x) => sameSet(x, o))) opts.push(o); }
      const rows = opts.map((o, i) => ({ h: roster(o), ok: i === 0 }));
      const why = { cap: `두 사건에 모두 드는 원소를 모은 ${roster(right)}이다`, cup: `두 사건 가운데 어느 하나에라도 드는 원소를 모은 ${roster(right)}이다`, bc: `표본공간에서 B의 원소를 뺀 ${roster(right)}이다` }[ask];
      return oneQ(d, `${TRIALS[m].intro}에서 ${TRIALS[m].what}가 ${pa.name}인 사건을 A, ${pb.name}인 사건을 B라 할 때, ${said}`, rows, true, {
        explain: `표본공간은 ${roster(S)}이고 A = ${roster(a)}, B = ${roster(b)}이다. 구하는 사건은 ${why}.`
      });
    }, { count: 3, standard: S1 }),
    T('event-excl', '세 사건 가운데 서로 배반인 두 사건', '①4', (d) => {
      const m = d.pick([4, 6, 8, 10, 12]), P = props(m);
      const prime = P.find((p) => p.name === '소수'), even = P.find((p) => p.name === '짝수');
      const [pa, pb, pc] = d.until(() => { const base = d.bool() && prime && even ? d.shuffle([prime, even]) : []; const rest = d.shuffle(P.filter((p) => !base.includes(p))).slice(0, 3 - base.length); return d.shuffle(base.concat(rest)); },
        (ps) => new Set(ps.map((p) => p.name)).size === 3 && [[0, 1], [0, 2], [1, 2]].filter(([i, j]) => !inter(ps[i].set, ps[j].set).length).length === 1);
      const sets = [pa.set, pb.set, pc.set], names = ['A', 'B', 'C'], pairsIJ = [[0, 1], [0, 2], [1, 2]];
      const rows = pairsIJ.map(([i, j]) => ({ h: `${names[i]}와 ${names[j]}`, ok: !inter(sets[i], sets[j]).length }));
      const hit = pairsIJ.find(([i, j]) => !inter(sets[i], sets[j]).length);
      return oneQ(d, `${TRIALS[m].intro}에서 ${TRIALS[m].what}가 ${pa.name}인 사건을 A, ${pb.name}인 사건을 B, ${pc.name}인 사건을 C라 할 때, 세 사건 A, B, C 중 서로 배반인 두 사건은?`, rows, true, {
        keep: true,
        explain: `A = ${roster(pa.set)}, B = ${roster(pb.set)}, C = ${roster(pc.set)}이다. ` + pairsIJ.map(([i, j]) => { const c = inter(sets[i], sets[j]); return `${names[i]}∩${names[j]} = ${roster(c)}`; }).join(', ')
          + `이므로 교집합이 공집합인 ${names[hit[0]]}와 ${names[hit[1]]}가 서로 배반이다.`
      });
    }, { standard: S1 }),
    T('event-excl-all', '차집합·합집합으로 만든 사건까지 넣어 배반인 짝 모두 고르기', '①5', (d) => {
      const m = d.pick([10, 12]), S = range(1, m), P = props(m);
      const FORMS = [
        ['A와 B', (a, b, c) => [a, b]], ['B와 C', (a, b, c) => [b, c]], ['A와 C', (a, b, c) => [a, c]],
        [`A와 ${ms('B-C')}`, (a, b, c) => [a, minus(b, c)]], [`B와 ${ms('A-C')}`, (a, b, c) => [b, minus(a, c)]], [`C와 ${ms('A∪B')}`, (a, b, c) => [c, union(a, b)]],
        [`${ms('B^C')}과 C`, (a, b, c) => [minus(S, b), c]], [`${ms('A∩B')}와 C`, (a, b, c) => [inter(a, b), c]], [`A와 ${ms('C-B')}`, (a, b, c) => [a, minus(c, b)]]
      ];
      const pick = d.until(() => { const ps = d.shuffle(P).slice(0, 3); return { ps, forms: d.shuffle(FORMS).slice(0, 5) }; }, ({ ps, forms }) => {
        if (new Set(ps.map((p) => p.name)).size < 3) return false;
        const flags = forms.map(([, f]) => { const [x, y] = f(ps[0].set, ps[1].set, ps[2].set); return x.length > 0 && y.length > 0 && !inter(x, y).length; });
        const empty = forms.some(([, f]) => f(ps[0].set, ps[1].set, ps[2].set).some((s) => !s.length));
        return !empty && flags.some(Boolean) && !flags.every(Boolean);
      });
      const [a, b, c] = pick.ps.map((p) => p.set);
      const rows = pick.forms.map(([h, f]) => { const [x, y] = f(a, b, c); return { h, ok: !inter(x, y).length, x, y }; });
      return setsQ(d, `1부터 ${m}까지의 자연수가 각각 하나씩 적힌 카드 ${m}장 중에서 임의로 한 장을 뽑을 때, 뽑은 카드에 적힌 수가 ${pick.ps[0].name}인 사건을 A, ${pick.ps[1].name}인 사건을 B, ${pick.ps[2].name}인 사건을 C라 하자. 다음 보기에서 서로 배반인 두 사건을 짝지은 것만을 있는 대로 고른 것은?`, rows, {
        explain: `A = ${roster(a)}, B = ${roster(b)}, C = ${roster(c)}이다. ` + rows.map((r, i) => `${GA[i]}. ${roster(r.x)}, ${roster(r.y)}의 교집합은 ${roster(inter(r.x, r.y))}`).join(', ') + '이다. 교집합이 공집합인 짝만 서로 배반이다.'
      });
    }, { standard: S1 })
  ];

  // ════════════════ 수학적 확률 — 주사위·동전 ════════════════
  const D2 = cart([range(1, 6), range(1, 6)]);
  // 순서쌍이 많으면 첫째 수로 나누어 센다. lab(x): 「a = 1일 때」, 「첫째 주사위의 눈이 1일 때」
  const byFirst = (list, lab) => range(1, 6).map((x) => [x, list.filter((p) => p[0] === x).length]).filter(([, k]) => k > 0).map(([x, k]) => `${lab(x)} ${k}개`).join(', ');
  const tellPairs = (list, lab) => (list.length <= 8 ? list.map((p) => '(' + p.join(', ') + ')').join(', ') + `의 ${list.length}가지` : byFirst(list, lab) + `로 모두 ${list.length}가지`);
  const diceTypes = [
    T('dice-two', '서로 다른 두 주사위 — 두 눈의 수의 합·차·곱·대소', '①6', (d, n) => {
      const a = V('a'), b = V('b');
      const kinds = n === 0
        ? [['sum', d.int(3, 11)], ['diff', d.int(1, 4)], ['gt', d.int(0, 2)]]
        : [['summult', d.pick([3, 4, 5])], ['prododd', 0], ['prodmult', d.pick([3, 4, 6])]];
      const [kind, k] = d.pick(kinds);
      const test = { sum: ([x, y]) => x + y === k, diff: ([x, y]) => Math.abs(x - y) === k, gt: ([x, y]) => x - y > k, summult: ([x, y]) => (x + y) % k === 0, prododd: ([x, y]) => (x * y) % 2 === 1, prodmult: ([x, y]) => (x * y) % k === 0 }[kind];
      const hit = D2.filter(test);
      const lead = kind === 'gt' ? `한 개의 주사위를 두 번 던져 나온 눈의 수를 차례로 ${a}, ${b}라 할 때, ${nb(ms(`a - b > ${k}`))}일 확률은?`
        : `서로 다른 두 개의 주사위를 동시에 던질 때, 나오는 두 눈의 수의 ${{ sum: `합이 ${k}`, diff: `차가 ${k}`, summult: `합이 ${k}의 배수`, prododd: '곱이 홀수', prodmult: `곱이 ${k}의 배수` }[kind]}일 확률은?`;
      const extra = kind === 'summult' ? ` 합이 ${range(1, 4).map((t) => t * k).filter((v) => v >= 2 && v <= 12).join(', ')}인 경우로 나누어 센다.` : kind === 'prododd' ? ' 곱이 홀수이려면 두 눈이 모두 홀수여야 한다.' : '';
      return probQ(lead, hit.length, 36, `${hit.length}/(6*6)`, {
        explain: `일어날 수 있는 모든 경우는 6 × 6 = 36(가지)이다.${extra} 조건을 만족시키는 순서쌍은 ${tellPairs(hit, kind === 'gt' ? (x) => `${a} = ${x}일 때` : (x) => `첫째 주사위의 눈이 ${x}일 때`)}이므로 구하는 확률은 ${eqF(hit.length, 36)}이다.`
      });
    }, { count: 2, standard: S1 }),
    T('dice-wrong', '표본공간을 잘못 잡은 풀이 — 까닭과 바른 확률', '①7', (d, n) => {
      const s = d.pick([3, 4, 5, 6, 8, 9, 10, 11]), hit = D2.filter(([x, y]) => x + y === s);
      const figure = lines([`표본공간을 S, 두 눈의 수의 합이 ${s}인 사건을 A라 하면`, `S = ${roster(range(2, 12))}, A = ${roster([s])}이므로`, `${pr('A')} = ${frac(ms('n(A)'), ms('n(S)'))} = ${frac(1, 11)}`]);
      const head = `다음은 서로 다른 두 개의 주사위를 동시에 던질 때 나오는 두 눈의 수의 합이 ${s}일 확률을 구한 풀이이다.`;
      if (n === 0) {
        const rows = [
          { h: `합 2, 3, …, 12가 나올 가능성이 모두 같지는 않은데 이것을 근원사건으로 잡았다.`, ok: true },
          { h: '표본공간에 합이 1인 경우를 넣지 않았다.', ok: false },
          { h: '두 주사위를 구별해야 하므로 구한 확률에 2를 곱해야 한다.', ok: false },
          { h: `사건 A에 합이 ${s}보다 작은 경우까지 넣어야 한다.`, ok: false }
        ];
        return oneQ(d, head + ' 이 풀이가 틀린 까닭으로 옳은 것은?', rows, true, {
          figure, explain: `수학적 확률은 각 근원사건이 일어날 가능성이 모두 같을 때만 쓸 수 있다. 합 2는 (1, 1) 한 가지로만 나오지만 합 7은 여섯 가지로 나오므로 합을 근원사건으로 잡으면 안 된다. 순서쌍 36가지를 근원사건으로 잡아야 한다.`
        });
      }
      return probQ(head + ' 이 풀이를 바르게 고쳐 구한 확률은?', hit.length, 36, `${hit.length}/(6*6)`, {
        figure, explain: `두 눈의 수의 순서쌍 36가지가 근원사건이다. 합이 ${s}인 순서쌍은 ${hit.map((p) => '(' + p.join(', ') + ')').join(', ')}의 ${hit.length}가지이므로 구하는 확률은 ${eqF(hit.length, 36)}이다.`
      });
    }, { count: 2, standard: S1 }),
    T('coin-same', '동전 여러 번 — 모두 같은 면이 나올 확률', '①8', (d) => {
      const k = d.int(3, 6), face = d.pick(['앞면', '뒷면']);
      return probQ(`한 개의 동전을 ${k}번 던질 때, ${k}번 모두 ${face}이 나올 확률은?`, 1, 2 ** k, `1/2**${k}`, {
        explain: `일어날 수 있는 모든 경우는 ${Array(k).fill(2).join(' × ')} = ${2 ** k}(가지)이고, ${k}번 모두 ${face}인 경우는 1가지이므로 구하는 확률은 ${frac(1, 2 ** k)}이다.`
      });
    }, { standard: S1 }),
    T('dice-product', '주사위 세 번 — 세 눈의 수의 곱이 일정할 확률', '심2', (d) => {
      const all = cart([range(1, 6), range(1, 6), range(1, 6)]);
      const k = d.until(() => d.pick([4, 6, 8, 9, 10, 12, 16, 18, 20, 24, 30, 36]), (v) => { const c = all.filter((t) => t[0] * t[1] * t[2] === v).length; return c >= 3 && c <= 15; });
      const hit = all.filter((t) => t[0] * t[1] * t[2] === k), groups = [...new Set(hit.map((t) => t.slice().sort((x, y) => x - y).join(',')))].map((g) => g.split(',').map(Number));
      const ways = (g) => 6 / g.reduce((s, x, i) => s * (g.indexOf(x) === i ? fact(g.filter((y) => y === x).length) : 1), 1);
      return probQ(`한 개의 주사위를 세 번 던져서 나오는 눈의 수를 차례로 ${V('a')}, ${V('b')}, ${V('c')}라 할 때, ${nb(ms(`a × b × c = ${k}`))}일 확률은?`, hit.length, 216, `${hit.length}/(6**3)`, {
        explain: `${k}를 1부터 6까지의 세 수의 곱으로 나타내면 ${groups.map((g) => g.join(' × ')).join(', ')}이고, 세 수의 차례를 바꾸면 각각 ${groups.map(ways).join(', ')}가지이다. 조건을 만족시키는 순서쌍은 ${groups.map(ways).join(' + ')} = ${hit.length}(개)이고 모든 경우는 ${nb('6³ = 216')}(가지)이므로 구하는 확률은 ${eqF(hit.length, 216)}이다.`.replace(`${k}를`, josa(k, '을/를'))
      });
    }, { standard: S1 }),
    T('dice-minmax', '주사위 여러 번 — 나온 눈의 수의 최솟값·최댓값이 k', '①9', (d) => {
      const r = d.int(2, 3), isMin = d.bool(), k = d.int(2, 5);
      const up = isMin ? 7 - k : k, low = isMin ? 6 - k : k - 1, hit = up ** r - low ** r;
      const said = isMin ? `최솟값이 ${k}` : `최댓값이 ${k}`;
      return probQ(`한 개의 주사위를 ${r}번 던질 때, 나온 눈의 수의 ${said}일 확률은?`, hit, 6 ** r, `(${up}**${r}-${low}**${r})/6**${r}`, {
        explain: isMin
          ? `최솟값이 ${k}이려면 모두 ${k} 이상이면서 ${josa(k, '이/가')} 적어도 한 번 나와야 한다. 모두 ${k} 이상인 경우 ${up}<sup>${r}</sup>가지에서 모두 ${k + 1} 이상인 경우 ${low}<sup>${r}</sup>가지를 빼면 ${hit}가지이다. 모든 경우는 6<sup>${r}</sup>가지이므로 구하는 확률은 ${eqF(hit, 6 ** r)}이다.`
          : `최댓값이 ${k}이려면 모두 ${k} 이하이면서 ${josa(k, '이/가')} 적어도 한 번 나와야 한다. 모두 ${k} 이하인 경우 ${up}<sup>${r}</sup>가지에서 모두 ${k - 1} 이하인 경우 ${low}<sup>${r}</sup>가지를 빼면 ${hit}가지이다. 모든 경우는 6<sup>${r}</sup>가지이므로 구하는 확률은 ${eqF(hit, 6 ** r)}이다.`
      });
    }, { standard: S1 }),
    T('dice-peak', '주사위 세 개 — 가운데 눈이 양쪽보다 클(작을) 확률', '①10', (d) => {
      const m = d.pick([4, 6, 8]), big = d.bool(), a = V('a'), b = V('b'), c = V('c');
      const per = range(1, m).map((x) => (big ? (x - 1) ** 2 : (m - x) ** 2)), hit = sumA(per);
      const dice = m === 6 ? '서로 다른 세 개의 주사위를 동시에 던져서 나오는 눈의 수' : `각 면에 1부터 ${m}까지의 자연수가 하나씩 적힌 서로 다른 정${m === 4 ? '사' : '팔'}면체 모양의 주사위 세 개를 동시에 던져서 ${m === 4 ? '바닥에 닿는 면에 적힌 수' : '나오는 수'}`;
      const cond = big ? `${nb(ms('a < b'))}, ${nb(ms('c < b'))}` : `${nb(ms('a > b'))}, ${nb(ms('c > b'))}`;
      const used = range(1, m).filter((x) => per[x - 1] > 0);
      return probQ(`${dice}를 각각 ${a}, ${b}, ${c}라 할 때, ${cond}일 확률은?`, hit, m ** 3, `(${used.map((x) => (big ? `${x - 1}**2` : `${m - x}**2`)).join('+')})/${m}**3`, {
        explain: `${b}의 값으로 나누어 센다. ` + used.map((x) => `${b} = ${x}일 때 ${a}, ${c}는 각각 ${big ? x - 1 : m - x}가지씩 ${per[x - 1]}가지`).join(', ')
          + `이므로 조건을 만족시키는 경우는 ${used.map((x) => per[x - 1]).join(' + ')} = ${hit}(가지)이다. 모든 경우는 ${m}<sup>3</sup> = ${m ** 3}(가지)이므로 구하는 확률은 ${eqF(hit, m ** 3)}이다.`
      });
    }, { standard: S1 }),
    T('dice-root', '정수 계수를 뽑을 때 이차방정식이 실근을 가질 확률', '①12', (d) => {
      const [r1, r2] = d.until(() => [d.int(-3, 0), d.int(1, 4)], ([x, y]) => x + y !== 0);
      const L = d.int(4, 6), a = r1 + r2, b = -r1 * r2, real = d.bool(), p = V('p'), x = V('x');
      const all = range(-L, L), hit = all.filter((v) => (real ? (v - r1) * (v - r2) >= 0 : (v - r1) * (v - r2) < 0));
      const pTerm = a === 1 ? ' + p' : a === -1 ? ' - p' : a > 0 ? ` + ${a}p` : ` - ${-a}p`;
      const eq = ms(`x^2 + 2px${pTerm}${b ? ' + ' + b : ''} = 0`);
      const fac = (r) => (r === 0 ? p : r > 0 ? `(${p} ${MINUS} ${r})` : `(${p} + ${-r})`);
      const disc = `${p}<sup>2</sup> ${MINUS} (${ms(`${a === 1 ? '' : a === -1 ? '-' : a}p${b ? ' + ' + b : ''}`)}) = ${fac(r1)}${fac(r2)}`;
      return probQ(`${nb(ms(`-${L} <= p <= ${L}`))}인 정수 ${p} 중에서 임의로 하나를 택할 때, ${x}에 대한 이차방정식 ${nb(eq)}이 ${real ? '실근을 가질' : '실근을 갖지 않을'} 확률은?`.replace(ms(`-${L}`), MINUS + L), hit.length, 2 * L + 1, `${hit.length}/(${L}*2+1)`, {
        explain: `판별식을 ${V('D')}라 하면 ${nb(frac(V('D'), 4) + ' = ' + disc)}이다. ${real ? `실근을 가지려면 ${frac(V('D'), 4)} ≥ 0이어야 하므로 ${nb(ms(`p <= ${r1}`))} 또는 ${nb(ms(`p >= ${r2}`))}이다` : `실근을 갖지 않으려면 ${frac(V('D'), 4)} &lt; 0이어야 하므로 ${nb(ms(`${r1} < p < ${r2}`))}이다`}. ${MINUS}${L}부터 ${L}까지의 정수 ${2 * L + 1}개 가운데 이것을 만족시키는 정수는 ${hit.map((v) => (v < 0 ? MINUS + -v : v)).join(', ')}의 ${hit.length}개이므로 구하는 확률은 ${eqF(hit.length, 2 * L + 1)}이다.`
      });
    }, { standard: S1 })
  ];

  // ════════════════ 수학적 확률 — 뽑기·나열·함수 ════════════════
  const countTypes = [
    T('pick-who', '정해진 사람이 뽑히거나 빠질 확률(조합)', '①13', (d, n) => {
      const [p1, p2] = who(d, 2), total = d.int(6, 10), r = d.int(3, 4);
      const head = `${josa(p1, '과/와')} ${p2}${josa(p2, '을/를').slice(p2.length)} 포함한 ${total}명의 학생 중에서 임의로 대표 ${r}명을 뽑을 때,`;
      if (n === 0) {
        return probQ(`${head} ${josa(p1, '과/와')} ${p2}${josa(p2, '이/가').slice(p2.length)} 모두 대표로 뽑힐 확률은?`, nCr(total - 2, r - 2), nCr(total, r), `${combS(total - 2, r - 2)}/${combS(total, r)}`, {
          explain: `모든 경우는 ${nC(total, r)} = ${nCr(total, r)}(가지)이다. 두 사람을 먼저 뽑고 나머지 ${total - 2}명 중에서 ${r - 2}명을 뽑으면 되므로 ${nC(total - 2, r - 2)} = ${nCr(total - 2, r - 2)}(가지)이다. 따라서 구하는 확률은 ${eqF(nCr(total - 2, r - 2), nCr(total, r))}이다.`
        });
      }
      return probQ(`${head} ${josa(p1, '은/는')} 뽑히고 ${josa(p2, '은/는')} 뽑히지 않을 확률은?`, nCr(total - 2, r - 1), nCr(total, r), `${combS(total - 2, r - 1)}/${combS(total, r)}`, {
        explain: `모든 경우는 ${nC(total, r)} = ${nCr(total, r)}(가지)이다. ${josa(p1, '을/를')} 뽑고 ${josa(p2, '을/를')} 뺀 나머지 ${total - 2}명 중에서 ${r - 1}명을 뽑으면 되므로 ${nC(total - 2, r - 1)} = ${nCr(total - 2, r - 1)}(가지)이다. 따라서 구하는 확률은 ${eqF(nCr(total - 2, r - 1), nCr(total, r))}이다.`
      });
    }, { count: 2, standard: S1 }),
    T('pick-kinds', '종류별 개수를 정해 뽑을 확률', '①14 심1', (d) => {
      const [k1, k2, box0, item] = d.pick([['흰 공', '검은 공', '주머니', '공'], ['빨간 구슬', '파란 구슬', '상자', '구슬'], ['사과 맛 사탕', '포도 맛 사탕', '봉지', '사탕'], ['국어 문제 카드', '수학 문제 카드', '상자', '카드']]);
      const a = d.int(3, 6), b = d.int(3, 6), r = d.int(2, 4), x = d.int(1, r - 1);
      const top = nCr(a, x) * nCr(b, r - x), all = nCr(a + b, r);
      return probQ(`${k1} ${a}개, ${k2} ${b}개가 들어 있는 ${box0}에서 임의로 ${r}개의 ${item}을 동시에 꺼낼 때, ${k1} ${x}개와 ${k2} ${r - x}개가 나올 확률은?`.replace(`${item}을`, josa(item, '을/를')), top, all, `${combS(a, x)}*${combS(b, r - x)}/${combS(a + b, r)}`, {
        explain: `모든 경우는 ${nC(a + b, r)} = ${all}(가지)이다. ${k1} ${a}개 중에서 ${x}개, ${k2} ${b}개 중에서 ${r - x}개를 꺼내는 경우는 ${nC(a, x)} × ${nC(b, r - x)} = ${top}(가지)이므로 구하는 확률은 ${eqF(top, all)}이다.`
      });
    }, { standard: S1 }),
    T('pick-back', '모두 한 종류일 확률로 그 종류의 개수 구하기', '①15', (d) => {
      const [t, x] = d.until(() => { const t0 = d.int(8, 16); return [t0, d.int(3, t0 - 2)]; }, ([t0, x0]) => Q(nCr(x0, 2), nCr(t0, 2)).q <= 200);
      const q = Q(nCr(x, 2), nCr(t, 2)), V0 = q.p * t * (t - 1), X = V('x');
      return N(`빨간 공과 흰 공을 합하여 ${t}개가 들어 있는 주머니에서 임의로 2개의 공을 동시에 꺼낼 때, 2개 모두 빨간 공일 확률은 ${fq(q)}이다. 이 주머니에 들어 있는 빨간 공은 몇 개인가?`, x, {
        unit: '개',
        explain: `빨간 공의 개수를 ${X}라 하면 ${frac(nC('x', 2), nC(t, 2))} = ${fq(q)}이므로 ${nb(`${X}(${X} ${MINUS} 1) = ${x * (x - 1)}`)}이다. 2 ≤ ${X} ≤ ${t}인 자연수 가운데 이것을 만족시키는 것은 ${X} = ${x}이다.`,
        facts: { digit: { template: `${V0 - 1}<□*(□-1)*${q.q}<${V0 + 1}`, lo: 2, hi: t, ask: 'min' } }
      });
    }, { standard: S1 }),
    T('line-ends', '일렬로 세우기 — 양 끝·이웃 조건의 확률', '①16', (d, n) => {
      if (n === 0) {
        if (d.bool()) {
          const total = d.int(5, 7), [p1, p2] = who(d, 2), top = 2 * fact(total - 2);
          return probQ(`${josa(p1, '과/와')} ${p2}${josa(p2, '을/를').slice(p2.length)} 포함한 ${total}명이 나란히 놓인 의자 ${total}개에 임의로 한 명씩 앉을 때, ${josa(p1, '과/와')} ${p2}${josa(p2, '이/가').slice(p2.length)} 양 끝에 앉을 확률은?`, top, fact(total), `2*${factS(total - 2)}/${factS(total)}`, {
            explain: `모든 경우는 ${total}! = ${fact(total)}(가지)이다. 두 사람이 양 끝에 앉는 경우는 2!가지, 나머지 ${total - 2}명이 가운데에 앉는 경우는 ${total - 2}!가지이므로 ${2 * fact(total - 2)}가지이다. 따라서 구하는 확률은 ${eqF(top, fact(total))}이다.`
          });
        }
        const bo = d.int(2, 4), gi = d.int(2, 4), total = bo + gi, top = nPr(bo, 2) * fact(total - 2);
        return probQ(`남학생 ${bo}명과 여학생 ${gi}명이 임의로 일렬로 설 때, 양 끝에 남학생이 설 확률은?`, top, fact(total), `${permS(bo, 2)}*${factS(total - 2)}/${factS(total)}`, {
          explain: `모든 경우는 ${total}! = ${fact(total)}(가지)이다. 양 끝에 남학생 ${bo}명 중 2명을 세우는 경우는 ${nP(bo, 2)} = ${nPr(bo, 2)}(가지), 나머지 ${total - 2}명을 가운데에 세우는 경우는 ${total - 2}!가지이므로 ${top}가지이다. 따라서 구하는 확률은 ${eqF(top, fact(total))}이다.`
        });
      }
      if (d.bool()) {
        const total = d.int(5, 7), top = fact(total - 1) * 2;
        return probQ(`부모를 포함한 ${total}명의 가족이 임의로 일렬로 앉을 때, 부모가 서로 이웃하여 앉을 확률은?`, top, fact(total), `${factS(total - 1)}*2/${factS(total)}`, {
          explain: `모든 경우는 ${total}! = ${fact(total)}(가지)이다. 부모를 한 묶음으로 보면 ${total - 1}명을 일렬로 앉히는 ${total - 1}!가지에 부모끼리 자리를 바꾸는 2!가지를 곱해 ${top}가지이다. 따라서 구하는 확률은 ${eqF(top, fact(total))}이다.`
        });
      }
      const k = d.int(2, 3), others = d.int(3, 4), total = k + others, top = fact(total - k + 1) * fact(k);
      return probQ(`남자 ${k}명과 여자 ${others}명이 임의로 일렬로 설 때, 남자끼리 모두 이웃하여 설 확률은?`, top, fact(total), `${factS(total - k + 1)}*${factS(k)}/${factS(total)}`, {
        explain: `모든 경우는 ${total}! = ${fact(total)}(가지)이다. 남자 ${k}명을 한 묶음으로 보면 ${total - k + 1}개를 일렬로 세우는 ${total - k + 1}!가지에 묶음 안에서 남자끼리 자리를 바꾸는 ${k}!가지를 곱해 ${top}가지이다. 따라서 구하는 확률은 ${eqF(top, fact(total))}이다.`
      });
    }, { count: 2, standard: S1 }),
    T('line-same', '같은 것이 있는 나열 — 양 끝 조건의 확률', '①17', (d, n) => {
      const LET = ['a', 'b', 'c', 'd', 'e', 'f'];
      const counts = d.until(() => { const c = [d.int(2, 4), d.int(1, 3), d.int(1, 2), d.int(1, 2), d.int(0, 1)]; return c; }, (c) => sumA(c) >= 6 && sumA(c) <= 9 && c.filter((v) => v >= 2).length >= (n === 1 ? 2 : 1));
      const word = []; counts.forEach((k, i) => { for (let j = 0; j < k; j += 1) word.push(LET[i]); });
      const tot = word.length, multi = (cs) => fact(sumA(cs)) / cs.reduce((s, k) => s * fact(k), 1), all = multi(counts);
      const shown = word.map((ch) => V(ch)).join(', ');
      if (n === 0) {
        const at = 0, rest = counts.map((k, i) => (i === at ? k - 2 : k)), top = multi(rest);
        return probQ(`${tot}개의 문자 ${shown}를 모두 일렬로 나열할 때, 양 끝에 모두 ${V(LET[at])}가 올 확률은?`, top, all, `${top}/${all}`, {
          explain: `같은 것이 있는 순열의 수로 센다. 모든 경우는 ${frac(tot + '!', counts.filter((k) => k > 1).map((k) => k + '!').join(''))} = ${all}(가지)이다. 양 끝에 ${V(LET[at])}를 놓고 나머지 ${tot - 2}개를 나열하는 경우는 ${top}가지이므로 구하는 확률은 ${eqF(top, all)}이다.`
        });
      }
      const parts = counts.map((k, i) => (k >= 2 ? [LET[i], multi(counts.map((c, j) => (j === i ? c - 2 : c)))] : null)).filter(Boolean), top = sumA(parts.map((p) => p[1]));
      return probQ(`${tot}개의 문자 ${shown}를 모두 일렬로 나열할 때, 양 끝에 같은 문자가 올 확률은?`, top, all, `(${parts.map((p) => p[1]).join('+')})/${all}`, {
        explain: `모든 경우는 ${frac(tot + '!', counts.filter((k) => k > 1).map((k) => k + '!').join(''))} = ${all}(가지)이다. ` + parts.map(([ch, v]) => `양 끝에 ${V(ch)}가 오는 경우는 ${v}가지`).join(', ') + `이므로 구하는 확률은 ${frac(parts.map((p) => p[1]).join(' + '), all)} = ${fq(Q(top, all))}이다.`
      });
    }, { count: 2, standard: S1 }),
    T('num-size', '숫자를 모두 한 번씩 써서 만든 수의 크기 조건', '①18', (d, n) => {
      const digits = d.shuffle(range(1, 9)).slice(0, 5).sort((x, y) => x - y);
      if (n === 0) {
        const t = d.until(() => d.int(2, 9), (v) => { const k = digits.filter((x) => x >= v).length; return k >= 1 && k <= 4; }), k = digits.filter((x) => x >= t).length;
        return probQ(`다섯 개의 숫자 ${digits.join(', ')}를 모두 한 번씩 써서 다섯 자리 자연수를 하나 만들 때, 이 수가 ${t * 10000} 이상일 확률은?`.replace(`${digits[4]}를`, josa(digits[4], '을/를')), k * 24, 120, `${k}*${factS(4)}/${factS(5)}`, {
          explain: `만들 수 있는 수는 5! = 120(개)이다. ${t * 10000} 이상이려면 만의 자리 숫자가 ${digits.filter((x) => x >= t).join(', ')} 중 하나여야 하고, 나머지 네 자리는 4! = 24(가지)이므로 ${k} × 24 = ${k * 24}(개)이다. 따라서 구하는 확률은 ${eqF(k * 24, 120)}이다.`
        });
      }
      const d1 = d.pick(digits.slice(1)), rest = digits.filter((x) => x !== d1), d2 = d.pick(rest.slice(1));
      const k1 = digits.filter((x) => x < d1).length, k2 = rest.filter((x) => x < d2).length, top = k1 * 24 + k2 * 6, t = d1 * 10000 + d2 * 1000;
      return probQ(`다섯 개의 숫자 ${digits.join(', ')}를 모두 한 번씩 써서 다섯 자리 자연수를 하나 만들 때, 이 수가 ${t}보다 작을 확률은?`.replace(`${digits[4]}를`, josa(digits[4], '을/를')), top, 120, `(${k1}*${factS(4)}+${k2}*${factS(3)})/${factS(5)}`, {
        explain: `만들 수 있는 수는 5! = 120(개)이다. 만의 자리 숫자가 ${digits.filter((x) => x < d1).join(', ')}인 수는 ${k1} × 4! = ${k1 * 24}(개), 만의 자리 숫자가 ${d1}이고 천의 자리 숫자가 ${rest.filter((x) => x < d2).join(', ')}인 수는 ${k2} × 3! = ${k2 * 6}(개)이므로 ${top}개이다. 따라서 구하는 확률은 ${eqF(top, 120)}이다.`
      });
    }, { count: 2, standard: S1 }),
    T('num-repeat', '중복을 허용해 만든 수가 짝수(홀수)일 확률', '①19', (d) => {
      const digits = d.until(() => d.shuffle(range(1, 9)).slice(0, d.int(4, 6)).sort((x, y) => x - y), (ds) => { const e = ds.filter((x) => x % 2 === 0).length; return e >= 1 && e < ds.length; });
      const s = digits.length, k = d.int(3, 4), even = d.bool(), good = digits.filter((x) => (x % 2 === 0) === even);
      return probQ(`${s}개의 숫자 ${digits.join(', ')} 중에서 중복을 허용하여 ${k}개를 택해 ${k}자리 자연수를 만들 때, 그 수가 ${even ? '짝수' : '홀수'}일 확률은?`, good.length * s ** (k - 1), s ** k, `${good.length}*${s}**${k - 1}/${s}**${k}`, {
        explain: `만들 수 있는 수는 ${nPi(s, k)} = ${s}<sup>${k}</sup>(개)이다. ${even ? '짝수' : '홀수'}이려면 일의 자리 숫자가 ${good.join(', ')} 중 하나여야 하고 나머지 ${k - 1}자리는 ${s}가지씩이므로 ${good.length} × ${s}<sup>${k - 1}</sup>(개)이다. 따라서 구하는 확률은 ${eqF(good.length, s)}이다.`
      });
    }, { standard: S1 }),
    T('rps', '가위바위보 — 이긴 사람이 정해진 수일 확률', '①20', (d) => {
      const total = d.int(3, 5), k = d.int(1, total - 1), top = nCr(total, k) * 3;
      return probQ(`${total}명이 동시에 가위바위보를 한 번 할 때, 이긴 사람이 ${k}명일 확률은?`, top, 3 ** total, `${combS(total, k)}*3/3**${total}`, {
        explain: `모든 경우는 3<sup>${total}</sup> = ${3 ** total}(가지)이다. 이길 ${k}명을 고르는 경우는 ${nC(total, k)} = ${nCr(total, k)}(가지), 이긴 사람이 낸 것을 고르는 경우는 가위·바위·보의 3가지이고 그러면 나머지 사람이 낸 것은 정해진다. 따라서 구하는 확률은 ${eqF(top, 3 ** total)}이다.`
      });
    }, { standard: S1 }),
    T('two-times', '두 자리 자연수 두 개 — 한 수가 다른 한 수의 몇 배', '①21', (d) => {
      const m = d.pick([2, 3, 4, 5]), k = Math.floor(99 / m) - 9;
      return probQ(`두 자리 자연수 중에서 임의로 서로 다른 두 수를 뽑을 때, 한 수가 다른 한 수의 ${m}배일 확률은?`, k, 4005, `(${Math.floor(99 / m)}-9)/((90*89)/2)`, {
        explain: `두 자리 자연수는 90개이므로 모든 경우는 ${nC(90, 2)} = 4005(가지)이다. 두 수를 ${V('a')}, ${m}${V('a')}라 하면 ${nb(ms(`10 <= a`))}이고 ${nb(ms(`${m}a <= 99`))}이어야 하므로 ${V('a')}는 10부터 ${Math.floor(99 / m)}까지의 ${k}개이다. 따라서 구하는 확률은 ${eqF(k, 4005)}이다.`
      });
    }, { standard: S1 }),
    T('no-adjacent', '서로 이웃하지 않게(연속하지 않게) 고를 확률', '①22', (d, n) => {
      if (n === 0) {
        const [k, m] = d.until(() => [d.int(2, 4), d.int(4, 7)], ([a, b]) => b + 1 >= a + 1);
        const top = nCr(m + 1, k), all = nCr(m + k, k);
        return probQ(`어느 병원에서 한 간호사에게 ${m + k}주 동안의 근무를 배정하려고 한다. 야간 근무를 ${k}주, 주간 근무를 ${m}주 배정할 때, 이 간호사가 2주 이상 연속으로 야간 근무를 하지 않을 확률은? (단, 근무는 주 단위로 배정하고, 모든 배정 방법은 일어날 가능성이 같다.)`, top, all, `${combS(m + 1, k)}/${combS(m + k, k)}`, {
          explain: `모든 경우는 ${m + k}주 가운데 야간 근무 ${k}주를 고르는 ${nC(m + k, k)} = ${all}(가지)이다. 야간 근무가 이어지지 않으려면 주간 근무 ${m}주의 사이사이와 양 끝 ${m + 1}자리 중에서 ${k}자리를 골라야 하므로 ${nC(m + 1, k)} = ${top}(가지)이다. 따라서 구하는 확률은 ${eqF(top, all)}이다.`
        });
      }
      const N0 = d.int(7, 12), top = nCr(N0 - 2, 3), all = nCr(N0, 3);
      return probQ(`1부터 ${N0}까지의 자연수 중에서 임의로 서로 다른 세 수를 고를 때, 그중 어느 두 수도 연속하지 않을 확률은?`, top, all, `${combS(N0 - 2, 3)}/${combS(N0, 3)}`, {
        explain: `모든 경우는 ${nC(N0, 3)} = ${all}(가지)이다. 고르지 않는 ${N0 - 3}개의 수 사이사이와 양 끝 ${N0 - 2}자리 중에서 3자리를 고르면 어느 두 수도 연속하지 않으므로 ${nC(N0 - 2, 3)} = ${top}(가지)이다. 따라서 구하는 확률은 ${eqF(top, all)}이다.`
      });
    }, { count: 2, standard: S1 }),
    T('func-prob', '함수 하나를 고를 때 — 일대일대응·치역 조건의 확률', '①27', (d, n) => {
      const k = d.int(3, n === 0 ? 4 : 5), X = V('X'), f = V('f'), set = roster(range(1, k));
      if (n === 0) {
        return probQ(`집합 ${X} = ${set}에 대하여 ${X}에서 ${X}로의 함수 ${f} 중에서 임의로 하나를 택할 때, ${f}가 일대일대응일 확률은?`, fact(k), k ** k, `${factS(k)}/${k}**${k}`, {
          explain: `${X}에서 ${X}로의 함수는 ${nPi(k, k)} = ${k}<sup>${k}</sup> = ${k ** k}(개)이고, 일대일대응은 ${nP(k, k)} = ${k}! = ${fact(k)}(개)이다. 따라서 구하는 확률은 ${eqF(fact(k), k ** k)}이다.`
        });
      }
      const odd = range(1, k).filter((x) => x % 2 === 1);
      return probQ(`집합 ${X} = ${set}에 대하여 ${X}에서 ${X}로의 함수 ${f} 중에서 임의로 하나를 택할 때, ${f}의 치역의 모든 원소의 곱이 홀수일 확률은?`, odd.length ** k, k ** k, `${odd.length}**${k}/${k}**${k}`, {
        explain: `치역의 모든 원소의 곱이 홀수이려면 함숫값이 모두 홀수, 즉 ${roster(odd)}의 원소여야 한다. 이런 함수는 ${nPi(odd.length, k)} = ${odd.length ** k}(개)이고 모든 함수는 ${nPi(k, k)} = ${k ** k}(개)이므로 구하는 확률은 ${eqF(odd.length ** k, k ** k)}이다.`
      });
    }, { count: 2, standard: S1 }),
    T('func-mono', '함수 하나를 고를 때 — a < b이면 f(a) ≤ f(b)일 확률', '①28', (d) => {
      const [k, ys, of] = d.pick([[2, [1, 3, 9], 9], [2, [1, 2, 4, 8], 8], [3, [1, 3, 9], 9], [3, [1, 2, 4, 8], 8], [2, [1, 2, 4, 8, 16], 16], [3, [1, 2, 4, 8, 16], 16]]);
      const m = ys.length, top = nCr(m + k - 1, k), X = V('X'), Y = V('Y'), f = V('f'), x = V('x');
      return probQ(`두 집합 ${X} = ${roster(range(1, k))}, ${Y} = {${x} | ${x}는 ${of}의 약수}에 대하여 ${X}에서 ${Y}로의 함수 ${f} 중에서 임의로 하나를 택할 때, ${f}가 다음 조건을 만족시킬 확률은?`, top, m ** k, `${combS(m + k - 1, k)}/${m}**${k}`, {
        figure: lines([`${nb(ms('a ∈ X'))}, ${nb(ms('b ∈ X'))}에 대하여 ${nb(ms('a < b'))}이면 ${nb(ms('f(a) <= f(b)'))}`]),
        explain: `${Y} = ${roster(ys)}이므로 모든 함수는 ${nPi(m, k)} = ${m ** k}(개)이다. 조건을 만족시키는 함수는 ${Y}의 원소 중에서 중복을 허용하여 ${k}개를 골라 작은 것부터 차례로 대응시키면 되므로 ${nH(m, k)} = ${nC(m + k - 1, k)} = ${top}(개)이다. 따라서 구하는 확률은 ${eqF(top, m ** k)}이다.`
      });
    }, { standard: S1 }),
    T('subset-prob', '부분집합 하나를 고를 때 — 정해진 원소를 넣고 뺄 확률', '①29', (d) => {
      const n0 = d.int(5, 8), ins = d.int(1, 2), outs = d.int(1, 2), chosen = d.shuffle(range(1, n0)).slice(0, ins + outs);
      const inS = chosen.slice(0, ins).sort((a, b) => a - b), outS = chosen.slice(ins).sort((a, b) => a - b), k = ins + outs, nonempty = d.bool();
      const U = V('U'), X = V('X'), all = 2 ** n0 - (nonempty ? 1 : 0), top = 2 ** (n0 - k);
      const cond = inS.map((v) => nb(ms(`${v} ∈ X`))).concat(outS.map((v) => nb(ms(`${v} ∉ X`)))).join(', ');
      return probQ(`집합 ${U} = ${roster(range(1, n0))}의 ${nonempty ? '공집합이 아닌 ' : ''}부분집합 중에서 임의로 하나를 택하여 ${X}라 할 때, ${cond}일 확률은?`, top, all, `2**(${n0}-${k})/(2**${n0}${nonempty ? '-1' : ''})`, {
        explain: `${nonempty ? `공집합이 아닌 부분집합은 2<sup>${n0}</sup> ${MINUS} 1 = ${all}(개)이다` : `부분집합은 2<sup>${n0}</sup> = ${all}(개)이다`}. 조건을 만족시키는 ${X}는 ${inS.join(', ')}${josa(inS[inS.length - 1], '을/를').slice(String(inS[inS.length - 1]).length)} 넣고 ${outS.join(', ')}${josa(outS[outS.length - 1], '을/를').slice(String(outS[outS.length - 1]).length)} 뺀 나머지 ${n0 - k}개의 원소로 정하므로 2<sup>${n0 - k}</sup> = ${top}(개)${nonempty ? `이고, 넣는 원소가 있으므로 공집합은 들지 않는다` : '이다'}. 따라서 구하는 확률은 ${eqF(top, all)}이다.`
      });
    }, { standard: S1 })
  ];

  // ════════════════ 통계적 확률과 확률의 기본 성질 ════════════════
  const statTypes = [
    T('stat-ratio', '횟수의 비율로 통계적 확률', '①30', (d, n) => {
      if (n === 0) {
        const [tries, hits] = d.until(() => { const t = d.pick([200, 250, 300, 400, 500, 600]); return [t, d.int(Math.round(t * 0.2), Math.round(t * 0.7))]; }, ([t, h]) => Q(h, t).q >= 10);
        const [lead, ask] = d.pick([
          [`어떤 압정을 ${tries}번 던졌더니 평평한 면이 바닥에 닿은 것이 ${hits}번이었다.`, '이 압정을 한 번 던질 때 평평한 면이 바닥에 닿을'],
          [`어느 농구 선수가 3점 슛을 ${tries}번 시도하여 ${hits}번 넣었다.`, '이 선수가 3점 슛을 한 번 시도할 때 넣을'],
          [`어느 공장에서 만든 전구 ${tries}개를 검사하였더니 ${hits}개가 1000시간 넘게 켜졌다.`, '이 공장에서 만든 전구 한 개가 1000시간 넘게 켜질']
        ]);
        return probQ(`${lead} 이 결과로 구한, ${ask} 통계적 확률은?`, hits, tries, `${hits}/${tries}`, {
          explain: `시행 횟수 ${tries}번에 대한 상대도수 ${eqF(hits, tries)}를 통계적 확률로 본다.`.replace(`${fq(Q(hits, tries))}를`, fqj(Q(hits, tries), '을/를'))
        });
      }
      const [a1, h1, a2, h2] = d.until(() => { const x = d.pick([100, 120, 150, 200, 250, 300]), y = d.pick([100, 120, 150, 200, 250, 300]); return [x, d.int(Math.round(x * 0.2), Math.round(x * 0.6)), y, d.int(Math.round(y * 0.2), Math.round(y * 0.6))]; },
        ([x, p, y, q]) => x !== y && Q(p, x).q >= 5 && Q(q, y).q >= 5 && p * y !== q * x && Q(p, x).q * Q(q, y).q > 25);
      const pA = Q(h1, a1), pB = Q(h2, a2), aBig = h1 * a2 > h2 * a1;
      const rows = [['A', pA], ['A', pB], ['B', pA], ['B', pB]].map(([p, v]) => ({ h: `선수 ${p}, ${fq(v)}`, ok: (p === 'A') === aBig && v === (aBig ? pA : pB) }));
      return oneQ(d, '두 양궁 선수 A, B가 지금까지 화살을 쏜 횟수와 10점을 맞힌 횟수가 다음 표와 같다. 이 결과로 구한 통계적 확률로 볼 때, 화살 한 발을 쏘아 10점을 맞힐 확률이 더 큰 선수와 그 확률을 바르게 짝지은 것은?', rows, true, {
        figure: table(['선수', '쏜 횟수(회)', '10점 횟수(회)'], [['A', String(a1), String(h1)], ['B', String(a2), String(h2)]]),
        explain: `A가 10점을 맞힐 통계적 확률은 ${eqF(h1, a1)}, B는 ${eqF(h2, a2)}이다. 두 수를 비교하면 ${aBig ? 'A' : 'B'}의 확률 ${fqj(aBig ? pA : pB, '이/가')} 더 크다.`
      });
    }, { count: 2, standard: S1 }),
    T('stat-table', '표에서 통계적 확률(도수분포표·반올림)', '①31', (d, n) => {
      if (n === 0) {
        const bins = [10, 20, 30, 40, 50, 60], cnt = d.until(() => bins.slice(0, 5).map(() => d.int(2, 12) * 5), (c) => sumA(c) >= 80 && sumA(c) <= 200);
        const tot = sumA(cnt), i = d.int(0, 3), two = d.bool(), hit = two ? cnt[i] + cnt[i + 1] : cnt[i], hi = two ? bins[i + 2] : bins[i + 1];
        return probQ(`다음은 어느 전시회의 관람객 ${tot}명의 나이를 조사하여 나타낸 도수분포표이다. 이 관람객 중에서 임의로 한 명을 택할 때, 나이가 ${bins[i]}세 이상 ${hi}세 미만일 확률은?`, hit, tot, two ? `(${cnt[i]}+${cnt[i + 1]})/${tot}` : `${hit}/${tot}`, {
          figure: table(['나이(세)', '관람객 수(명)'], bins.slice(0, 5).map((b, j) => [`${b} 이상 ~ ${bins[j + 1]} 미만`, String(cnt[j])]).concat([['합계', String(tot)]])),
          explain: `나이가 ${bins[i]}세 이상 ${hi}세 미만인 관람객은 ${two ? `${cnt[i]} + ${cnt[i + 1]} = ${hit}` : hit}(명)이므로 구하는 확률은 ${eqF(hit, tot)}이다.`
        });
      }
      const days = ['월요일', '화요일', '수요일', '목요일', '금요일'];
      const [cnt, at] = d.until(() => [days.map(() => d.int(80, 420)), d.int(0, 4)], ([c, j]) => { const t = sumA(c), r = c[j] * 100 / t; return Math.abs(r % 10 - 5) > 0.6 && r > 6 && r < 94; });
      const tot = sumA(cnt), ans = Math.round(cnt[at] * 10 / tot) / 10;
      return D(`다음은 어느 도서관의 요일별 방문자 수를 조사하여 나타낸 표이다. 이 기간의 방문자 중에서 임의로 한 명을 택할 때, 이 방문자가 ${days[at]}에 방문했을 확률을 소수점 아래 둘째 자리에서 반올림하여 나타낸 값은?`, ans, {
        figure: table(['요일', '방문자 수(명)'], days.map((w, j) => [w, String(cnt[j])]).concat([['합계', String(tot)]])),
        explain: `구하는 확률은 ${frac(cnt[at], tot)} = ${(cnt[at] / tot).toFixed(3)}…이므로 소수점 아래 둘째 자리에서 반올림하면 ${ans}이다.`,
        facts: { calc: [[`((${cnt[at]}*10/${tot}+0.5)-(${cnt[at]}*10/${tot}+0.5)%1)/10`, 0]] }
      });
    }, { count: 2, standard: S1 }),
    T('stat-merge', '두 기간의 횟수를 합친 통계적 확률', '①32', (d) => {
      const [a1, h1, a2, h2] = d.until(() => { const x = d.int(8, 20) * 10, y = d.int(8, 20) * 10; return [x, d.int(Math.round(x * 0.2), Math.round(x * 0.45)), y, d.int(Math.round(y * 0.2), Math.round(y * 0.45))]; },
        ([x, p, y, q]) => x !== y && Q(p + q, x + y).q >= 5 && Q(p + q, x + y).q < 400 && p * y !== q * x);
      const [who0, s1, v, ask] = d.pick([['야구 선수 A', '타석에 나와', '출루했', '타석에 나왔을 때 출루할'], ['농구 선수 A', '자유투를 시도하여', '성공했', '자유투를 한 번 시도할 때 성공할']]);
      return probQ(`${who0}는 전반기에 ${a1}번 ${s1} ${h1}번 ${v}고, 후반기에 ${a2}번 ${s1} ${h2}번 ${v}다. 이 기록으로 구한, 선수 A가 ${ask} 통계적 확률은?`, h1 + h2, a1 + a2, `(${h1}+${h2})/(${a1}+${a2})`, {
        explain: `두 기간의 비율을 평균하지 않고 전체 횟수로 구한다. 모두 ${a1} + ${a2} = ${a1 + a2}(번) 가운데 ${h1} + ${h2} = ${h1 + h2}(번)이므로 구하는 확률은 ${eqF(h1 + h2, a1 + a2)}이다.`
      });
    }, { standard: S1 }),
    T('prop-certain', '확률이 0인 사건·1인 사건 고르기', '②33', (d, n) => {
      if (n === 0) {
        const want = d.pick([0, 1]);
        const EV = [['6 이하의 눈이 나온다', 6], ['7 이상의 눈이 나온다', 0], ['음수의 눈이 나온다', 0], ['자연수의 눈이 나온다', 6], ['소수의 눈이 나온다', 3], ['짝수의 눈이 나온다', 3], ['6의 약수의 눈이 나온다', 4], ['3의 배수의 눈이 나온다', 2], ['5 이상의 눈이 나온다', 2], ['1 이상의 눈이 나온다', 6], ['0의 눈이 나온다', 0]];
        const right = d.pick(EV.filter((e) => e[1] === want * 6)), wrong = d.shuffle(EV.filter((e) => e[1] !== want * 6)).slice(0, 3);
        const rows = [right].concat(wrong).map((e) => ({ h: e[0] + '.', ok: e[1] === want * 6 }));
        return oneQ(d, `한 개의 주사위를 던질 때, 다음 중 일어날 확률이 ${want}인 사건은?`, rows, true, {
          explain: want ? `반드시 일어나는 사건의 확률은 1이다. 주사위의 눈은 1부터 6까지이므로 ‘${right[0]}’는 반드시 일어난다.` : `절대로 일어나지 않는 사건의 확률은 0이다. 주사위의 눈은 1부터 6까지이므로 ‘${right[0]}’는 일어나지 않는다.`
        });
      }
      const r = d.int(2, 3), w = d.int(r + 1, 5), c = d.int(r + 1, w);
      const P = (test) => { const all = combos(range(1, r + w), c); return Q(all.filter((pick) => test(pick.filter((x) => x <= r).length, pick.filter((x) => x > r).length)).length, all.length); };
      const want = d.pick([0, 1]);
      const EV = [
        ['흰 공이 1개 이상 나온다', P((red, wh) => wh >= 1)], ['빨간 공이 1개 이상 나온다', P((red) => red >= 1)], [`흰 공이 ${c}개 나온다`, P((red, wh) => wh === c)],
        ['파란 공이 1개 이상 나온다', Q(0, 1)], [`빨간 공이 ${r + 1}개 나온다`, Q(0, 1)], [`흰 공이 ${c - 1}개 이하 나온다`, P((red, wh) => wh <= c - 1)], [`빨간 공이 ${r}개 이하 나온다`, Q(1, 1)]
      ];
      const right = d.pick(EV.filter((e) => e[1].p === want && e[1].q === 1)), wrong = d.shuffle(EV.filter((e) => !(e[1].p === want && e[1].q === 1))).slice(0, 3);
      const rows = [right].concat(wrong).map((e) => ({ h: e[0] + '.', ok: e[1].p === want && e[1].q === 1 }));
      return oneQ(d, `빨간 공 ${r}개, 흰 공 ${w}개가 들어 있는 주머니에서 임의로 ${c}개의 공을 동시에 꺼낼 때, 다음 중 일어날 확률이 ${want}인 사건은?`, rows, true, {
        explain: `빨간 공은 ${r}개뿐이므로 ${c}개를 꺼내면 흰 공이 적어도 ${c - r}개 섞이고, 빨간 공은 많아야 ${r}개 나온다. 주머니에 파란 공은 없다. ` + (want ? `반드시 일어나는 ‘${right[0]}’의 확률이 1이다.` : `절대로 일어나지 않는 ‘${right[0]}’의 확률이 0이다.`)
      });
    }, { count: 2, standard: S1 })
  ];

  B.addUnit({
    id: '11-3-3', grade: 11, semester: 3, no: 3, title: '확률의 개념과 활용', version: 1,
    groups: [
      { id: 'event', title: '시행과 사건', standard: S1, types: eventTypes },
      { id: 'dice', title: '수학적 확률 — 주사위·동전', standard: S1, types: diceTypes },
      { id: 'count', title: '수학적 확률 — 뽑기·나열·함수', standard: S1, types: countTypes },
      { id: 'stat', title: '통계적 확률과 확률의 기본 성질', standard: S1, types: statTypes }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
