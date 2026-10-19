// 고등학교 1학년 1학기(공통수학1) 7단원 경우의 수 — 단원 틀·단원 안의 도구와 앞쪽 묶음(합의 법칙, 곱의 법칙, 순열의 수와 계승, 순열의 활용 — 일렬로 세우기).
// 수집해 둔 천재 T셀파 공통수학1 두 종(홍진곤·전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 61꼴, 기본꼴 2: 49꼴, 심화꼴: 12꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/10-1-7/싣기_대조표.md 에 있다.
// (순열의 활용 — 수와 문자열, 조합의 수, 조합의 활용 — 뽑기·도형은 10-1-7b.js 에, 실력 문항은 10-1-7c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준: 10공수1-03-01(합의 법칙과 곱의 법칙), 10공수1-03-02(순열), 10공수1-03-03(조합). 묶음 차례는 교과서의 소단원 차례(합의 법칙과 곱의 법칙 → 순열 → 조합)를 따른다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(글·표·차림표·좌석 그림·영역 그림), 묻는 것(경우의 수·n·r·빈칸·고르기), 세는 법(더하기·곱하기·묶기·끼우기·
//    전체에서 빼기·겹친 것 빼기·나누어 더하기·고르고 나열하기)이 다를 때만 따로 싣는다. 소재와 수만 다른 것은 한 번만 싣는다.
//  - 사용자가 정한 것: 수학 실력에 필요해 보이는 꼴은 「지나치게 복잡한 문제는 다루지 않는다」 따위를 까닭으로 빼지 않고 실력에 싣는다.
//    빼는 것은 상위 학년 내용(중복순열·같은 것이 있는 순열·원순열·중복조합·이항정리·확률), 중학교 단원에 이미 있는 일을 그대로 묻는 것,
//    꼴 목록에 없는 꼴, 숫자·말만 바꾼 되풀이, 풀이를 써야만 채점되는 서술형뿐이다.
//  - 중학교 단원과 겹치는 것: 중2 「경우의 수」(8-2-6)에는 주사위·수 카드의 「또는」, 종류마다 하나씩 고르기, 길, 네 영역 칠하기, 지불 금액, 모두 한 줄로 세우기,
//    부모님이 양 끝, 두 사람이 이웃, 번갈아 서기, 카드로 수 만들기(0이 있는·없는, 짝수·홀수, 크기 조건), 크기 순으로 k번째, 회장·부회장·총무, 청소 당번 2명,
//    원 위의 점과 선분, 반원 위의 점과 삼각형, 리그전 경기 수가 이미 있고, 중1 7-1-1에 약수·공약수의 개수, 7-2-3에 다각형의 대각선의 개수가 있다.
//    이 꼴을 그대로 묻는 것은 싣지 않았고, 거기에 순열·조합으로만 셀 수 있는 조건(셋 이상의 묶음, 끼우기, 「적어도」, 두 조건을 함께)이 붙은 것은 실었다.
//  - 답: 경우의 수·개수·n·r 은 모두 수 칸(N, M)으로 받는다. 음수가 되는 답이 없으므로 부호 단추는 달지 않는다. 답은 9999 이하가 되게 수를 고른다
//    (원문의 33300·14400 같은 다섯 자리 답은 사람 수를 줄여 네 자리 안으로 맞추었다). 기호는 ₙPᵣ·ₙCᵣ(<sub>n</sub>P<sub>r</sub>), 계승은 n!.
//    식을 고르는 꼴, 증명 과정의 빈칸에 식을 넣는 꼴은 고르기로 낸다(빈칸에 수가 들어가는 것은 식 속에 끼워 넣는 칸으로 받는다).
//    원문의 「n + r의 값」「모든 n의 값의 합」처럼 따로 구한 값을 더하는 물음은 값을 따로 묻도록 바꾸었다.
//  - 답은 모두 코드가 셈한다. 검사 근거는 공식을 수로 적은 식(facts.calc), 모든 경우를 늘어놓아 가린 목록(facts.count),
//    n·r 을 거꾸로 구하는 문항은 □ 에 수를 넣어 등식이 맞는 것이 하나뿐인지 보는 식(facts.digit)이다. 만들 때 seal 이 같은 검사를 먼저 돌린다.
//    원문 답지의 잘못(전교 대단원 11의 정답 ③, 전차3의 ₁₀C₂ = 46)은 따르지 않는다.
//
// 뺀 것과 까닭(10-1-7b.js, 10-1-7c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 중2 8-2-6에 같은 일이 있음: ①1(or-kinds) ①2(or-dice·dice-sum) ①3(or-cards) ①9(event-digit-sum) ①11(and-kinds) ①24(road-direct) ①25(hard-roads4)
//    ①26(hard-color4) ①28(shape-color3) ①30(hard-pay-three) ①39(pick-roles·line-all) ①40(line-fixed) ①43(hard-neighbors) ①47(hard-alternate) ①54(hard-front)
//    ①55(line-all — 날을 나누어도 모두 일렬) ②1(number-make) ②2(number-zero) ②3(number-odd) ②4(hard-zero-even) ②5(hard-size3) ②7(hard-kth) ②24(pick-compare)
//    ②34(hard-same-kind·hard-pairs-groups) ②42(hard-chords·hard-arc-shapes).
//  - 중1에 같은 일이 있음: ①19 약수의 개수·①20 공약수의 개수(7-1-1), ②45 다각형의 대각선의 개수(7-2-3).
//  - 고2·3 확률과 통계: ②48(같은 색 공을 서로 다른 주머니에 나누어 넣기 — 중복조합), 심12(같은 종류를 구별하지 않고 꽃 고르기 — 중복조합).
//  - 서술형·활동·복습: ②49(문제 만들기, ₙCᵣ = ₙCₙ₋ᵣ 보이기, 원리 설명, 차이점 설명, 트라이 그림 그리기, 진단·준비 학습).
//  - 겹침(같은 일을 하는 다른 꼴에 실었다): 심1(②19·①34), 심2·심3(②22), 심4(①42), 심5(①46), 심6(②7 — 중2 hard-kth 라 뺌), 심8(②28), 심10(②37).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, table, lines, box, frac, N, M, C, inline } = B.kit;
  const { MINUS, range, V, nb, tail, ex, proc } = B.kit.mid;
  const { Board } = B.kit.mgeo;
  const UNIT = '10-1-7', S1 = '10공수1-03-01', S2 = '10공수1-03-02', S3 = '10공수1-03-03';

  // ── 세는 도구 ──
  const sum = (a) => a.reduce((s, v) => s + v, 0);
  const hits = (flags) => flags.filter(Boolean).length;
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
  const nPr = (n, r) => (r < 0 || r > n ? 0 : fact(n) / fact(n - r));
  const nCr = (n, r) => (r < 0 || r > n ? 0 : Math.round(nPr(n, r) / fact(r)));
  // list 에서 k 개를 골라 일렬로 늘어놓은 것 전부 / 차례 없이 k 개를 고른 것 전부 / 여러 목록에서 하나씩 고른 것 전부
  const perms = (list, k) => (k === 0 ? [[]] : list.reduce((all, x, i) => all.concat(perms(list.filter((_, j) => j !== i), k - 1).map((rest) => [x].concat(rest))), []));
  const combos = (list, k) => (k === 0 ? [[]] : list.length < k ? [] : combos(list.slice(1), k - 1).map((rest) => [list[0]].concat(rest)).concat(combos(list.slice(1), k)));
  const cart = (lists) => lists.reduce((acc, l) => acc.reduce((all, row) => all.concat(l.map((x) => row.concat([x]))), []), [[]]);
  const isPrime = (n) => n > 1 && range(2, n - 1).every((k) => n % k !== 0);
  const told = (list) => list.join(', ');
  const who = (d, k) => d.shuffle(NAMES).slice(0, k);

  // ── 검사 식 글 ──
  // n(n−1)…(n−r+1) → "7*6*5", n! → "5*4*3*2", ₙCᵣ → "(7*6*5)/(3*2)"
  const prodS = (n, r) => (r <= 0 ? '1' : range(0, r - 1).map((i) => n - i).join('*'));
  const factS = (n) => (n <= 1 ? '1' : prodS(n, n - 1));
  const combS = (n, r) => (r <= 0 ? '1' : `(${prodS(n, r)})/(${factS(r)})`);
  // □(0 이상의 정수, M − 1 이하)를 넣는 식. ind: x ≥ j 이면 1, 아니면 0 / permX: m(m−1)…(m−x+1) / factX: x! / combX: ₘCₓ
  const ind = (x, j, Mx) => `((${x}+${Mx - j})-(${x}+${Mx - j})%${Mx})/${Mx}`;
  const permX = (m, x) => range(1, m).map((j) => `(1+${ind(x, j, m + 1)}*${m - j})`).join('*');
  const factX = (x, Mx) => range(2, Mx - 1).map((j) => `(1+${ind(x, j, Mx)}*${j - 1})`).join('*');
  const combX = (m, x) => `(${permX(m, x)})/(${factX(x, m + 1)})`;
  // 검사 근거: lo~hi 의 정수를 □ 에 넣었을 때 식의 값이 v 가 되는 것은 답 하나뿐이다.
  const eqDigit = (expr, v, lo, hi) => ({ digit: { template: `${v - 1}<${expr}<${v + 1}`, lo, hi, ask: 'min' } });

  // ── 검사 근거 마무리(seal) ──
  // 검사가 하는 것을 만들 때 먼저 해 본다: 식의 값과 답, 센 목록과 답, □ 식의 해, 고르기의 근거. 식의 수 가운데 글·그림 설명·보기에 보이지 않는 수는 facts.unseen 에 밝힌다.
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function shownNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  const evalS = (s) => { if (!/^[\d+\-*\/%(). ]+$/.test(s)) throw new Error('검사 식이 아니다: ' + s); return Function('"use strict"; return (' + s + ');')(); };
  function seal(item) {
    const f = item.facts || {}, ans = (i) => item.inputs[i].answer;
    if (!item.choice) for (const input of item.inputs) if (!Number.isInteger(input.answer) || input.answer < 0 || input.answer > 9999) throw new Error('답이 0~9999 의 정수가 아니다: ' + input.answer);
    for (const [s, i] of f.calc || []) { const v = evalS(s); if (v !== ans(i) || !(v > 0)) throw new Error(`검사 식 ${s.slice(0, 80)} = ${v} 인데 답은 ${ans(i)}`); }
    if (f.count && (hits(f.count) !== ans(0) || f.count.every(Boolean) || !f.count.some(Boolean))) throw new Error(`센 목록 ${hits(f.count)} 와 답 ${ans(0)}`);
    if (f.digit) {
      const { template, lo, hi } = f.digit, ok = [];
      for (let x = lo; x <= hi; x += 1) {
        const parts = template.replace(/□/g, String(x)).split(/([<>])/); let good = true;
        for (let i = 1; i < parts.length; i += 2) { const l = evalS(parts[i - 1]), r = evalS(parts[i + 1]); if (!(parts[i] === '<' ? l < r : l > r)) good = false; }
        if (good) ok.push(x);
      }
      if (ok.length !== 1 || ok[0] !== ans(0)) throw new Error('□ 식을 만족하는 수: ' + ok.join(',') + ' / 답 ' + ans(0));
    }
    if (f.pick && (new Set(f.pick.options).size !== f.pick.options.length || f.pick.options[item.choice.answer] !== evalS(f.pick.expr))) throw new Error('pick 근거가 답과 다르다');
    if (f.choose) {
      const values = f.choose.exprs.map(evalS);
      if (!values.every((v) => v > 0) || values.filter((v) => v === f.choose.target).length !== 1 || values.indexOf(f.choose.target) !== item.choice.answer) throw new Error('choose 근거가 답과 다르다: ' + values.join(','));
    }
    if (f.truth && (f.truth.filter((t) => t === f.want).length !== 1 || f.truth[item.choice.answer] !== f.want)) throw new Error('참·거짓 근거가 답과 다르다');
    if (f.claimed) { const good = f.claimed.map(([s, said]) => evalS(s) === said); if (good.filter((g) => g === f.claimedWant).length !== 1 || good[item.choice.answer] !== f.claimedWant) throw new Error('claimed 근거가 답과 다르다'); }
    if (item.choice && new Set(item.choice.options.map(stripH)).size !== item.choice.options.length) throw new Error('보기가 겹친다');
    const shown = shownNumbers(item), hidden = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([s]) => s).concat(f.pick ? [f.pick.expr] : [], f.choose ? f.choose.exprs : []);
    for (const s of exprs) for (const n of s.match(/\d+(?:\.\d+)?/g) || []) if (!shown.has(n)) hidden.add(Number(n));
    if (hidden.size) f.unseen = [...hidden]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  const sourceOf = (ref) => '수집본 ' + (/[①②]/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: (d, n) => seal(make(d, n)) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: (d, n) => seal(make(d, n)) }, more || {});

  // 긴 식: 괄호·태그 밖의 「 = 」「 + 」「 − 」 뒤에서만 줄을 바꿀 수 있게 덩이로 나눈다(덩이마다 nb). 좁은 화면에서 풀이 식이 카드 밖으로 나가지 않게 한다.
  const eqn = (html) => {
    const parts = []; let cur = '', depth = 0, tags = 0;
    for (let i = 0; i < html.length; i += 1) {
      const ch = html[i];
      if (ch === '<') { const j = html.indexOf('>', i), tag = html.slice(i, j + 1); if (tag[1] === '/') tags -= 1; else if (!/\/>$/.test(tag) && !/^<(br|img|input|wbr)\b/i.test(tag)) tags += 1; cur += tag; i = j; continue; }
      if ('({['.includes(ch)) depth += 1; else if (')}]'.includes(ch)) depth -= 1;
      if (!depth && !tags && ch === ' ' && /^[=+−] /.test(html.slice(i + 1, i + 3))) { parts.push(cur + ' ' + html[i + 1]); cur = ''; i += 2; continue; }
      cur += ch;
    }
    parts.push(cur);
    return parts.map(nb).join(' ');
  };
  // ── 글 ──
  // ₙPᵣ·ₙCᵣ: n, r 은 수이거나 V('n') 같은 문자 글이다. 기호 뒤의 토씨는 r 을 읽는 소리(₈P₃은, ₈P₂는)에 맞춘다.
  const Pn = (n, r) => nb(`<sub>${n}</sub>P<sub>${r}</sub>`);
  const Cn = (n, r) => nb(`<sub>${n}</sub>C<sub>${r}</sub>`);
  const Pj = (n, r, pair) => Pn(n, r) + tail(r, pair);
  const Cj = (n, r, pair) => Cn(n, r) + tail(r, pair);
  const vn = V('n'), vr = V('r');
  // 영문자 뒤 토씨: L(엘)·M(엠)·N(엔)·R(알)은 받침이 있다.
  const lj = (ch, pair) => { const [withB, without] = pair.split('/'); return ch + ('LMNR'.includes(ch.slice(-1)) ? (pair === '으로/로' ? (ch.slice(-1) === 'L' || ch.slice(-1) === 'R' ? '로' : '으로') : withB) : without); };
  const isVowel = (ch) => 'AEIOU'.includes(ch);
  // 서로 다른 글자로 된 영어 낱말(Y 는 자음으로 센다)
  const WORDS = ['MIRACLE', 'FRIEND', 'PLANET', 'ORANGE', 'SPIDER', 'MOUSE', 'TIGER', 'MUSIC', 'LEMON', 'HOUSE', 'WATER', 'PIANO', 'SUNDAY', 'COUNTRY', 'THEORY', 'MONKEY', 'GARDEN', 'CANDLE', 'WINTER', 'FLOWER', 'DELIGHT', 'PICTURE'];

  // ── 그림 ──
  // 좌석 배치도: rows[i] 는 (i + 1)열의 좌석 수. 한 열의 좌석은 옆으로 붙어 있다.
  function seatsFig(rows) {
    const b = Board(), w = 32, h = 26, gap = 14;
    rows.forEach((k, i) => {
      const y = i * (h + gap);
      b.text([-24, y + h / 2], (i + 1) + '열', { plain: true });
      for (let j = 0; j < k; j += 1) b.poly([[j * w, y], [(j + 1) * w, y], [(j + 1) * w, y + h], [j * w, y + h]], 'fill:#e8f0fe');
    });
    return b.svg(`좌석 배치도: ${rows.map((k, i) => `${i + 1}열에 좌석 ${k}개`).join(', ')}가 있다. 한 열의 좌석은 옆으로 붙어 한 줄로 놓여 있고, 열과 열 사이는 떨어져 있다.`);
  }
  // 차림표: 종류마다 이름을 늘어놓는다.
  const menuFig = (rows) => '<div class="mb-lines" style="grid-template-columns:auto 1fr;column-gap:14px;align-items:start">' + rows.map(([kind, names]) => `<span style="font-weight:700;white-space:nowrap">${kind}</span><span style="word-break:keep-all">${names.join(', ')}</span>`).join('') + '</div>';

  // ════════════════ 합의 법칙 ════════════════
  const sumTypes = [
    T('sum-coprime', '어떤 수 이하에서 주어진 수와 서로소인 수의 개수', '①4', (d) => {
      const [p, q] = d.pick([[2, 3], [2, 5], [3, 5], [2, 7]]), k = p * q, N0 = d.until(() => d.int(50, 150), (v) => v % k !== 0);
      const a = Math.floor(N0 / p), b = Math.floor(N0 / q), c = Math.floor(N0 / k), ans = N0 - (a + b - c);
      return N(`${N0} 이하의 자연수 중에서 ${josa(k, '과/와')} 서로소인 수의 개수는?`, ans, {
        unit: '개',
        explain: `${josa(k, '과/와')} 서로소인 수는 ${p}의 배수도 ${q}의 배수도 아닌 수이다. ${N0} 이하에서 ${p}의 배수는 ${a}개, ${q}의 배수는 ${b}개이고, 두 사건에 모두 드는 ${k}의 배수는 ${c}개이므로 ${p}의 배수 또는 ${q}의 배수는 ${a} + ${b} − ${c} = ${a + b - c}(개)이다. 따라서 ${N0} − ${a + b - c} = ${ans}(개)이다.`,
        facts: { calc: [[`${N0}-((${N0}-${N0}%${p})/${p}+(${N0}-${N0}%${q})/${q}-(${N0}-${N0}%${k})/${k})`, 0]] }
      });
    }, { standard: S1 }),
    T('sum-eq3', '일차방정식을 만족시키는 자연수의 순서쌍(미지수 셋)', '①5', (d) => {
      const rowsOf = ([a, b, c]) => range(1, 20).map((z) => [z, range(1, 20).filter((y) => c - a * y - b * z >= 1).length]).filter(([, k]) => k > 0);
      const [a, b, c] = d.until(() => { const a0 = d.int(2, 3); return [a0, d.int(a0 + 1, 6), d.int(11, 21)]; }, (t) => { const r = rowsOf(t), tot = sum(r.map((x) => x[1])); return r.length >= 2 && tot >= 4 && tot <= 16; });
      const rows = rowsOf([a, b, c]), ans = sum(rows.map((x) => x[1])), X = V('x'), Y = V('y'), Z = V('z');
      return N(`방정식 ${nb(`${X} + ${a}${Y} + ${b}${Z} = ${c}`)}${tail(c, '을/를')} 만족시키는 자연수 ${X}, ${Y}, ${Z}의 순서쌍 (${X}, ${Y}, ${Z})의 개수는?`, ans, {
        unit: '개',
        explain: `계수가 가장 큰 ${Z}의 값으로 나누어 센다. ` + rows.map(([z, k]) => `${Z} = ${z}일 때 ${nb(`${X} + ${a}${Y} = ${c - b * z}`)}${tail(c - b * z, '을/를')} 만족시키는 자연수의 순서쌍 (${X}, ${Y})는 ${k}개`).join(', ')
          + `이다. 각 경우는 동시에 일어나지 않으므로 ${rows.map((x) => x[1]).join(' + ')} = ${ans}(개)이다.`,
        facts: { calc: [[rows.map(([z]) => `(${c}-${b}*${z}-1-(${c}-${b}*${z}-1)%${a})/${a}`).join('+'), 0]] }
      });
    }, { standard: S1 }),
    T('sum-range', '범위가 붙은 식을 만족시키는 순서쌍', '①6', (d, n) => {
      const X = V('x'), Y = V('y'), pair = `(${X}, ${Y})`;
      if (n === 0) {
        const a = d.int(3, 7), b = a + d.int(1, 2), grid = cart([range(1, b), range(1, b)]), flags = grid.map(([x, y]) => x + y >= a && x + y <= b), parts = range(a, b).map((s) => s - 1);
        return N(`부등식 ${nb(`${a} ≤ ${X} + ${Y} ≤ ${b}`)}${tail(b, '을/를')} 만족시키는 자연수 ${X}, ${Y}의 순서쌍 ${pair}의 개수는?`, hits(flags), {
          unit: '개',
          explain: range(a, b).map((s) => `${nb(`${X} + ${Y} = ${s}`)}인 순서쌍은 (1, ${s - 1})부터 (${s - 1}, 1)까지 ${s - 1}개`).join(', ') + `이다. 각 경우는 동시에 일어나지 않으므로 ${parts.join(' + ')} = ${sum(parts)}(개)이다.`,
          facts: { count: flags }
        });
      }
      if (n === 1) {
        const k = d.int(2, 3), c = d.int(8, 14), grid = cart([range(1, c), range(1, c)]), flags = grid.map(([x, y]) => x + k * y <= c);
        const ys = range(1, c).filter((y) => c - k * y >= 1);
        return N(`부등식 ${nb(`${X} + ${k}${Y} ≤ ${c}`)}${tail(c, '을/를')} 만족시키는 자연수 ${X}, ${Y}의 순서쌍 ${pair}의 개수는?`, hits(flags), {
          unit: '개',
          explain: `${Y}의 값으로 나누어 센다. ` + ys.map((y) => `${Y} = ${y}일 때 ${X}는 1부터 ${c - k * y}까지 ${c - k * y}개`).join(', ') + `이므로 ${ys.map((y) => c - k * y).join(' + ')} = ${hits(flags)}(개)이다.`,
          facts: { count: flags }
        });
      }
      if (n === 2) {
        const a = d.int(4, 10), b = a + 2, grid = cart([range(1, b), range(1, b)]), flags = grid.map(([x, y]) => x * y >= a && x * y <= b);
        const per = range(a, b).map((m) => grid.filter(([x, y]) => x * y === m));
        return N(`부등식 ${nb(`${a} ≤ ${X}${Y} ≤ ${b}`)}${tail(b, '을/를')} 만족시키는 자연수 ${X}, ${Y}의 순서쌍 ${pair}의 개수는?`, hits(flags), {
          unit: '개',
          explain: per.map((list, i) => `${nb(`${X}${Y} = ${a + i}`)}인 순서쌍은 ${list.map((p) => '(' + p.join(', ') + ')').join(', ')}의 ${list.length}개`).join(', ') + `이다. 따라서 ${per.map((l) => l.length).join(' + ')} = ${hits(flags)}(개)이다.`,
          facts: { count: flags }
        });
      }
      const a = d.int(2, 5), b = a + d.int(1, 2), grid = cart([range(0, b), range(0, b)]), flags = grid.map(([x, y]) => x + y === a || x + y === b);
      return N(`음이 아닌 정수 ${X}, ${Y}에 대하여 ${nb(`${X} + ${Y} = ${a}`)} 또는 ${nb(`${X} + ${Y} = ${b}`)}${tail(b, '을/를')} 만족시키는 순서쌍 ${pair}의 개수는?`, hits(flags), {
        unit: '개',
        explain: `0도 셈에 넣는다. ${nb(`${X} + ${Y} = ${a}`)}인 순서쌍은 (0, ${a})부터 (${a}, 0)까지 ${a + 1}개, ${nb(`${X} + ${Y} = ${b}`)}인 순서쌍은 (0, ${b})부터 (${b}, 0)까지 ${b + 1}개이다. 두 경우는 동시에 일어나지 않으므로 ${a + 1} + ${b + 1} = ${a + b + 2}(개)이다.`,
        facts: { count: flags }
      });
    }, { count: 4, standard: S1 }),
    T('sum-bags', '서로 다른 세 주머니에서 꺼낸 공에 적힌 수의 합', '①8', (d) => {
      const m = d.int(4, 6), s1 = d.int(4, 5), s2 = s1 + d.int(1, 2), all = cart([range(1, m), range(1, m), range(1, m)]), flags = all.map((t) => sum(t) === s1 || sum(t) === s2);
      // 합마다 세 수의 묶음(크기 차례)과 그 차례를 바꾼 가짓수
      const groupsOf = (s) => { const out = new Map(); for (const t of all) if (sum(t) === s) { const key = t.slice().sort((x, y) => x - y).join(', '); out.set(key, (out.get(key) || 0) + 1); } return [...out]; };
      const part = ([key, c]) => (c === 1 ? `${key}의 1가지` : `${key}의 차례를 바꾼 ${c}가지`);
      const say = (s) => { const g = groupsOf(s), k = sum(g.map((x) => x[1])); return g.length === 1 ? `합이 ${s}인 경우는 ${part(g[0])}` : `합이 ${s}인 경우는 ${g.map(part).join(', ')}로 ${k}가지`; };
      return N(`서로 다른 세 주머니에 1부터 ${m}까지의 자연수가 하나씩 적힌 공이 ${m}개씩 들어 있다. 각 주머니에서 공을 1개씩 꺼낼 때, 꺼낸 공에 적힌 세 수의 합이 ${s1} 또는 ${josa(s2, '이/가')} 되는 경우의 수는?`, hits(flags), {
        unit: '가지',
        explain: `주머니가 서로 다르므로 꺼낸 수를 순서쌍으로 센다. ${say(s1)}이고, ${say(s2)}이다. 두 경우는 동시에 일어나지 않으므로 ${hits(flags.filter((_, i) => sum(all[i]) === s1))} + ${hits(flags.filter((_, i) => sum(all[i]) === s2))} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }, { standard: S1 })
  ];

  // ════════════════ 곱의 법칙 ════════════════
  const COLORS = ['흰색', '회색', '검은색', '빨간색', '파란색', '남색', '갈색', '노란색'];
  const productTypes = [
    T('product-mix', '하나만 고르기와 종류마다 하나씩 고르기를 함께', '①12', (d) => {
      const ctx = d.pick([['소설책', '시집', '수필집', '권'], ['동화책', '만화책', '위인전', '권'], ['과자', '사탕', '초콜릿', '개'], ['연필', '볼펜', '지우개', '개']]);
      const [a, b, c] = [d.int(3, 6), d.int(2, 5), d.int(2, 5)], ans = a + b * c;
      return N(`서로 다른 ${ctx[0]} ${a}${ctx[3]}, 서로 다른 ${ctx[1]} ${b}${ctx[3]}, 서로 다른 ${ctx[2]} ${c}${josa(ctx[3], '이/가')} 있다. ${ctx[0]} 1${josa(ctx[3], '을/를')} 고르거나, ${josa(ctx[1], '과/와')} ${ctx[2]}에서 1${ctx[3]}씩 고르는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `${ctx[0]} 1${josa(ctx[3], '을/를')} 고르는 경우는 ${a}가지이다. ${josa(ctx[1], '과/와')} ${ctx[2]}에서 1${ctx[3]}씩 고르는 경우는 곱의 법칙에 의하여 ${b} × ${c} = ${b * c}(가지)이다. 두 경우는 동시에 일어나지 않으므로 합의 법칙에 의하여 ${a} + ${b * c} = ${ans}(가지)이다.`,
        facts: { calc: [[`${a}+${b}*${c}`, 0]] }
      });
    }, { standard: S1 }),
    T('product-differ', '서로 다른 색으로 하나씩 고르기', '①13', (d) => {
      const [outs, ins] = d.until(() => { const s = d.shuffle(COLORS); return [s.slice(0, d.int(3, 4)), d.shuffle(s.slice(d.int(1, 2), 6)).slice(0, d.int(3, 4))]; }, ([o, i]) => { const k = o.filter((c) => i.includes(c)).length; return k >= 1 && k <= 2; });
      const pairs = cart([outs, ins]), flags = pairs.map(([o, i]) => o !== i), same = outs.filter((c) => ins.includes(c));
      return N('어느 자동차는 외부 색과 실내 색을 다음 표에서 1가지씩 골라 주문한다. 외부 색과 실내 색을 서로 다른 색으로 고르는 경우의 수는?', hits(flags), {
        unit: '가지',
        figure: table(null, [['외부 색', told(outs)], ['실내 색', told(ins)]]),
        explain: `외부 색과 실내 색을 1가지씩 고르는 경우는 ${outs.length} × ${ins.length} = ${pairs.length}(가지)이다. 이 가운데 두 색이 같은 경우는 ${told(same)}의 ${same.length}가지이므로 ${pairs.length} − ${same.length} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }, { standard: S1 }),
    T('product-digits', '자리 숫자에 홀짝·소수 조건이 붙은 두 자리 수', '①14', (d, n) => {
      const tens = (v) => Math.floor(v / 10), ones = (v) => v % 10, PR = [2, 3, 5, 7];
      if (n === 0) {
        const all = range(10, 99);
        const [cond, test, say] = d.pick([
          ['십의 자리의 숫자와 일의 자리의 숫자의 곱이 홀수', (v) => (tens(v) * ones(v)) % 2 === 1, '곱이 홀수이려면 두 숫자가 모두 홀수이어야 한다. 십의 자리와 일의 자리에 올 수 있는 숫자는 각각 1, 3, 5, 7, 9의 5가지'],
          ['십의 자리의 숫자는 짝수이고 일의 자리의 숫자는 소수', (v) => tens(v) % 2 === 0 && PR.includes(ones(v)), '십의 자리에는 0이 올 수 없으므로 2, 4, 6, 8의 4가지, 일의 자리에는 2, 3, 5, 7의 4가지'],
          ['십의 자리의 숫자는 짝수이고 일의 자리의 숫자는 홀수', (v) => tens(v) % 2 === 0 && ones(v) % 2 === 1, '십의 자리에는 0이 올 수 없으므로 2, 4, 6, 8의 4가지, 일의 자리에는 1, 3, 5, 7, 9의 5가지'],
          ['십의 자리의 숫자는 소수이고 일의 자리의 숫자는 짝수', (v) => PR.includes(tens(v)) && ones(v) % 2 === 0, '십의 자리에는 2, 3, 5, 7의 4가지, 일의 자리에는 0, 2, 4, 6, 8의 5가지'],
          ['십의 자리의 숫자는 홀수이고 일의 자리의 숫자는 짝수', (v) => tens(v) % 2 === 1 && ones(v) % 2 === 0, '십의 자리에는 1, 3, 5, 7, 9의 5가지, 일의 자리에는 0, 2, 4, 6, 8의 5가지']
        ]);
        const flags = all.map(test), tc = range(1, 9).filter((t) => range(0, 9).some((o) => test(10 * t + o))).length, oc = hits(flags) / tc;
        return N(`두 자리의 자연수 중에서 ${cond}인 수의 개수는?`, hits(flags), { unit: '개', explain: `${say}이다. 따라서 곱의 법칙에 의하여 ${tc} × ${oc} = ${hits(flags)}(개)이다.`, facts: { count: flags } });
      }
      const k = d.int(6, 9), odd = d.bool(), all = range(1, k).reduce((acc, t) => acc.concat(range(0, k).map((o) => [t, o])), []), flags = all.map(([t, o]) => (t + o) % 2 === (odd ? 1 : 0));
      const ev = range(0, k).filter((v) => v % 2 === 0), od = range(0, k).filter((v) => v % 2 === 1), evT = ev.filter((v) => v > 0);
      const [p1, p2] = odd ? [[evT, od], [od, ev]] : [[evT, ev], [od, od]];
      return N(`0부터 ${k}까지의 숫자를 사용하여 두 자리의 자연수를 만들 때, 십의 자리의 숫자와 일의 자리의 숫자의 합이 ${odd ? '홀수' : '짝수'}인 수의 개수는? (단, 같은 숫자를 여러 번 사용할 수 있다.)`, hits(flags), {
        unit: '개',
        explain: `합이 ${odd ? '홀수' : '짝수'}이려면 두 숫자가 ${odd ? '(짝수, 홀수)이거나 (홀수, 짝수)' : '모두 짝수이거나 모두 홀수'}이어야 한다. 십의 자리에는 0이 올 수 없다. `
          + `(${odd ? '짝수, 홀수' : '짝수, 짝수'})인 수는 ${p1[0].length} × ${p1[1].length} = ${p1[0].length * p1[1].length}(개), (${odd ? '홀수, 짝수' : '홀수, 홀수'})인 수는 ${p2[0].length} × ${p2[1].length} = ${p2[0].length * p2[1].length}(개)이므로 모두 ${hits(flags)}개이다.`,
        facts: { count: flags }
      });
    }, { count: 2, standard: S1 }),
    T('product-range3', '범위·배수 조건이 붙은 세 자리 수(같은 숫자를 다시 써도 됨)', '①15', (d, n) => {
      if (n === 0) {
        const a = d.int(1, 5), b = d.int(a + 2, 9), [kind, per, step] = d.pick([['짝수', 5, 2], ['홀수', 5, 2], ['5의 배수', 2, 5]]), ans = (b - a) * 10 * per;
        return N(`${a}00 이상 ${b}00 미만인 자연수 중에서 ${kind}의 개수는?`, ans, {
          unit: '개',
          explain: `백의 자리에 올 수 있는 숫자는 ${range(a, b - 1).join(', ')}의 ${b - a}가지, 십의 자리에는 0부터 9까지 10가지, 일의 자리에는 ${kind === '짝수' ? '0, 2, 4, 6, 8' : kind === '홀수' ? '1, 3, 5, 7, 9' : '0, 5'}의 ${per}가지이다. 따라서 ${b - a} × 10 × ${per} = ${ans}(개)이다.`,
          facts: { calc: [[`(${b}00-${a}00)/${step}`, 0]] }
        });
      }
      const [m, t, s] = [d.pick([2, 5]), d.pick([4, 6, 8, 9]), d.pick([3, 4])], all = range(100, 999);
      const test = (v) => { const h = Math.floor(v / 100), te = Math.floor(v / 10) % 10; return v % m === 0 && t % te === 0 && te > 0 && (h + te) % s === 0; };
      const flags = all.map(test), teens = range(1, 9).filter((x) => t % x === 0), heads = (te) => range(1, 9).filter((h) => (h + te) % s === 0);
      return N(`다음 조건을 모두 만족시키는 세 자리의 자연수의 개수는?`, hits(flags), {
        unit: '개',
        figure: lines([`㈎ ${m}의 배수이다.`, `㈏ 십의 자리의 숫자는 ${t}의 약수이다.`, `㈐ 백의 자리의 숫자와 십의 자리의 숫자의 합은 ${s}의 배수이다.`]),
        explain: `㈎에서 일의 자리에 올 수 있는 숫자는 ${m === 2 ? '0, 2, 4, 6, 8의 5가지' : '0, 5의 2가지'}이다. ㈏에서 십의 자리의 숫자는 ${told(teens)}이고, ㈐에서 `
          + teens.map((te) => `십의 자리가 ${te}일 때 백의 자리는 ${told(heads(te))}의 ${heads(te).length}가지`).join(', ')
          + `이다. 따라서 (${teens.map((te) => heads(te).length).join(' + ')}) × ${m === 2 ? 5 : 2} = ${hits(flags)}(개)이다.`,
        facts: { count: flags }
      });
    }, { count: 2, standard: S1 }),
    T('product-dice3', '주사위를 세 번 던진 눈의 홀짝', '①16', (d, n) => {
      const [k, shape] = d.pick([[4, '정사면체'], [6, '정육면체'], [8, '정팔면체'], [12, '정십이면체']]), half = k / 2, all = cart([range(1, k), range(1, k), range(1, k)]);
      const die = k === 6 ? '주사위 한 개를' : `1부터 ${k}까지의 자연수가 각 면에 하나씩 적힌 ${shape} 모양의 주사위 한 개를`;
      if (n === 0) {
        const odd = d.bool(), flags = all.map((t) => sum(t) % 2 === (odd ? 1 : 0)), each = half * half * half;
        return N(`${die} 세 번 던질 때, 나오는 눈의 수의 합이 ${odd ? '홀수' : '짝수'}인 경우의 수는?`, hits(flags), {
          unit: '가지',
          explain: `합이 ${odd ? '홀수' : '짝수'}이려면 짝수의 눈이 ${odd ? '2번 나오거나 한 번도 나오지 않아야' : '1번 나오거나 3번 나와야'} 한다. 홀수의 눈과 짝수의 눈은 각각 ${half}가지이므로 (짝, 홀, 홀)처럼 차례를 정한 한 경우마다 ${half} × ${half} × ${half} = ${each}(가지)이다. `
            + `${odd ? '(짝, 짝, 홀), (짝, 홀, 짝), (홀, 짝, 짝), (홀, 홀, 홀)' : '(짝, 홀, 홀), (홀, 짝, 홀), (홀, 홀, 짝), (짝, 짝, 짝)'}의 4가지 차례가 있으므로 4 × ${each} = ${hits(flags)}(가지)이다.`,
          facts: { count: flags }
        });
      }
      const j = d.int(1, 2), flags = all.map((t) => t.filter((v) => v % 2 === 0).length === j), each = half * half * half;
      return N(`${die} 세 번 던질 때, 짝수의 눈이 ${j}번만 나오는 경우의 수는?`, hits(flags), {
        unit: '가지',
        explain: `짝수의 눈이 나오는 차례를 정하는 경우는 ${j === 1 ? '첫째, 둘째, 셋째 가운데 하나' : '셋 가운데 둘'}로 3가지이다. 그 각각에 대하여 눈이 나오는 경우는 ${half} × ${half} × ${half} = ${each}(가지)이므로 3 × ${each} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }, { count: 2, standard: S1 }),
    T('product-drinks', '여러 사람이 고르는 음료 — 「A 또는 B」와 C', '①18', (d) => {
      const n = d.int(3, 4), k = d.int(1, n - 1), ppl = who(d, n), all = cart(range(1, n).map(() => ['A', 'B', 'C'])), flags = all.map((t) => t.filter((x) => x === 'C').length === n - k);
      const pickC = nCr(n, n - k);
      return N(`${told(ppl)}의 ${n}명이 음료 A, B, C 가운데 하나씩 고를 때, A 또는 B를 고른 사람이 ${k}명이고 C를 고른 사람이 ${n - k}명인 경우의 수는?`, hits(flags), {
        unit: '가지',
        explain: `C를 고를 ${n - k}명을 정하는 경우는 ${pickC}가지이다. 그 각각에 대하여 ${k === 1 ? '나머지 1명은 A, B 가운데 하나를 고르므로 2가지이다' : `나머지 ${k}명은 A, B 가운데 하나씩 고르므로 ${range(1, k).map(() => 2).join(' × ')} = ${2 ** k}(가지)이다`}. 따라서 ${pickC} × ${2 ** k} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }, { standard: S1 }),
    T('product-divisor-power', '거듭제곱의 약수의 개수로 지수 구하기', '①21', (d) => {
      const [b, p, q, pe, qe] = d.pick([[18, 2, 3, 1, 2], [12, 2, 3, 2, 1], [50, 2, 5, 1, 2], [20, 2, 5, 2, 1], [45, 3, 5, 2, 1], [75, 3, 5, 1, 2], [28, 2, 7, 2, 1], [98, 2, 7, 1, 2]]);
      const n = d.int(3, 7), D = (n + 1) * (2 * n + 1), start = n - d.int(0, Math.min(3, n - 1)), exps = range(start, start + 4), at = exps.indexOf(n);
      const said = (e) => `(${pe === 1 ? e : 2 * e} + 1)(${qe === 1 ? e : 2 * e} + 1)`;
      return C(`${b}의 거듭제곱 중에서 양의 약수의 개수가 ${D}인 것은?`, exps.map((e) => `${b}<sup>${e}</sup>`), at, {
        explain: `${b} = ${pe === 1 ? p : p + '<sup>2</sup>'} × ${qe === 1 ? q : q + '<sup>2</sup>'}이므로 ${b}<sup>${V('n')}</sup>의 양의 약수의 개수는 곱의 법칙에 의하여 ${nb(`(${V('n')} + 1)(2${V('n')} + 1)`)}이다. ${nb(`(${V('n')} + 1)(2${V('n')} + 1) = ${D}`)}에서 ${V('n')} = ${n}이다. 실제로 ${b}<sup>${n}</sup>의 양의 약수의 개수는 ${said(n)} = ${D}이다.`,
        facts: { claimed: exps.map((e) => [`(${e}+1)*(2*${e}+1)`, D]), claimedWant: true }
      });
    }, { standard: S1 }),
    T('product-terms', '다항식의 전개식에서 서로 다른 항의 개수', '①23', (d) => {
      const pools = d.shuffle([['a', 'b', 'c', 'd'], ['p', 'q', 'r', 's'], ['x', 'y', 'z', 'w'], ['u', 'v']]), k = d.int(2, 3);
      const facs = pools.slice(0, k).map((pool) => pool.slice(0, d.int(2, pool.length)));
      const ans = facs.reduce((s, f) => s * f.length, 1);
      return N('다음 식을 전개할 때, 서로 다른 항의 개수는?', ans, {
        unit: '개',
        figure: ex(facs.map((f) => '(' + f.map((ch) => V(ch)).join(' <i>+</i> ') + ')').join('')),
        explain: `전개식의 항은 괄호마다 문자를 하나씩 골라 곱한 것이고, 괄호마다 문자가 모두 달라 같은 항이 생기지 않는다. 따라서 곱의 법칙에 의하여 ${facs.map((f) => f.length).join(' × ')} = ${ans}(개)이다.`,
        facts: { calc: [[facs.map((f) => f.length).join('*'), 0]] }
      });
    }, { standard: S1 }),
    T('product-price', '값이 정해지도록 더할 재료 고르기', '①31', (d) => {
      const [a, b] = d.pick([[2000, 3000], [1000, 2000], [1000, 3000], [2000, 5000]]), m = d.int(2, 3), k = d.int(2, 3), base = d.pick([8000, 10000, 12000]);
      const names = d.shuffle(['치즈', '햄', '라면', '유부', '소시지', '버섯', '어묵', '달걀']).slice(0, m + k), prices = names.map((_, i) => (i < m ? a : b));
      const subsets = range(0, 2 ** names.length - 1).map((mask) => names.map((_, i) => (mask >> i) & 1)), extra = (s) => sum(s.map((x, i) => x * prices[i]));
      const sums = [...new Set(subsets.map(extra))].filter((v) => v > 0);
      const [x1, x2] = d.until(() => d.shuffle(sums).slice(0, 2).sort((x, y) => x - y), ([u, w]) => u !== w);
      const flags = subsets.map((s) => extra(s) === x1 || extra(s) === x2), cnt = (x) => subsets.filter((s) => extra(s) === x).length;
      const how = (x) => { const out = []; for (let i = 0; i <= m; i += 1) for (let j = 0; j <= k; j += 1) if (i * a + j * b === x) out.push([i ? `${a}원짜리 ${i}개` : '', j ? `${b}원짜리 ${j}개` : ''].filter(Boolean).join('와 ')); return out.join(' 또는 '); };
      return N(`어느 분식집의 떡볶이는 기본 재료만 넣으면 ${base}원이고, 다음 표의 재료를 더하면 그 값만큼 비싸진다. 재료는 종류마다 한 번까지만 더할 수 있을 때, 값이 ${base + x1}원 또는 ${base + x2}원인 떡볶이는 모두 몇 가지인가?`, hits(flags), {
        unit: '가지',
        figure: table(['재료', '값(원)'], names.map((nm, i) => [nm, String(prices[i])])),
        explain: `더한 재료의 값이 ${x1}원이 되려면 ${how(x1)}를 더해야 하므로 ${cnt(x1)}가지이고, ${x2}원이 되려면 ${how(x2)}를 더해야 하므로 ${cnt(x2)}가지이다. 따라서 ${cnt(x1)} + ${cnt(x2)} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }, { standard: S1 }),
    T('product-order', '단계마다 고르는 주문의 가짓수', '①32', (d) => {
      const sizes = d.pick([['작은 컵', '큰 컵'], ['60 g', '120 g', '200 g'], ['작은 컵', '중간 컵', '큰 컵']]), syrups = d.shuffle(['꿀', '연유', '딸기잼', '초코 시럽', '블루베리잼']).slice(0, d.int(3, 4));
      const tops = d.shuffle(['시리얼', '그래놀라', '아몬드', '딸기', '바나나', '키위']).slice(0, d.int(3, 5)), k = d.int(1, 2);
      const subs = range(0, 2 ** tops.length - 1), cnt = (mask) => tops.filter((_, i) => (mask >> i) & 1).length;
      const all = cart([sizes, syrups, subs]), flags = all.map(([, , mask]) => cnt(mask) <= k), topWays = subs.filter((m0) => cnt(m0) <= k).length;
      return N(`다음은 어느 요구르트 가게의 주문 방법이다. 크기와 시럽은 하나씩 고르고, 토핑은 ${k === 1 ? '넣지 않거나 1개만 넣는다' : '넣지 않거나 서로 다른 것으로 2개까지 넣는다'}. 요구르트를 주문할 수 있는 모든 경우의 수는?`, hits(flags), {
        unit: '가지',
        figure: menuFig([['크기', sizes], ['시럽', syrups], ['토핑', tops]]),
        explain: `크기와 시럽을 고르는 경우는 ${sizes.length} × ${syrups.length} = ${sizes.length * syrups.length}(가지)이다. 토핑은 넣지 않는 1가지${k >= 1 ? `, 1개를 넣는 ${tops.length}가지` : ''}${k >= 2 ? `, 서로 다른 2개를 넣는 ${nCr(tops.length, 2)}가지` : ''}로 ${topWays}가지이다. 따라서 ${sizes.length * syrups.length} × ${topWays} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }, { standard: S1 }),
    T('product-league', '리그전과 토너먼트의 경기 수', '①33', (d, n) => {
      const LEAGUE = '리그전(모든 팀이 서로 한 번씩 경기)', CUP = '토너먼트(진 팀은 떨어지고 이긴 팀끼리 다시 경기)';
      if (n === 0) {
        const g = d.pick([2, 4, 8]), t = d.int(3, 5), lg = g * t * (t - 1) / 2, cup = 2 * g - 1, ans = lg + cup + 1;
        return N(`${g * t}개의 팀이 ${t}팀씩 ${g}개 조로 나뉘어 조마다 ${LEAGUE}을 한 다음, 각 조의 상위 2팀이 ${CUP}로 우승 팀을 가린다. 토너먼트의 준결승에서 진 두 팀은 3·4위전을 한 번 더 할 때, 치르는 경기는 모두 몇 경기인가?`, ans, {
          unit: '경기',
          explain: `한 조의 리그전은 ${t}팀 가운데 2팀을 고르는 경우의 수와 같으므로 ${t * (t - 1) / 2}경기이고, ${g}개 조이므로 ${lg}경기이다. 토너먼트에 오른 ${2 * g}팀은 한 경기마다 한 팀씩 떨어져 우승 팀만 남으므로 ${cup}경기이다. 3·4위전 1경기를 더하면 ${lg} + ${cup} + 1 = ${ans}(경기)이다.`,
          facts: { calc: [[`${g}*${t}*(${t}-1)/2+2*${g}`, 0]] }
        });
      }
      const m = d.int(6, 12), lg = m * (m - 1) / 2, ans = lg + 4;
      return N(`${m}개의 팀이 ${LEAGUE}을 한 다음, 상위 4팀이 ${CUP}로 우승 팀을 가린다. 토너먼트의 준결승에서 진 두 팀은 3·4위전을 한 번 더 할 때, 치르는 경기는 모두 몇 경기인가?`, ans, {
        unit: '경기',
        explain: `리그전은 ${m}팀 가운데 2팀을 고르는 경우의 수와 같으므로 ${m} × ${m - 1} ÷ 2 = ${lg}(경기)이다. 토너먼트는 준결승 2경기, 결승 1경기, 3·4위전 1경기로 4경기이다. 따라서 ${lg} + 4 = ${ans}(경기)이다.`,
        facts: { calc: [[`${m}*(${m}-1)/2+4`, 0]] }
      });
    }, { count: 2, standard: S1 })
  ];

  // ════════════════ 순열의 수와 계승 ════════════════
  const permTypes = [
    T('perm-value', '순열의 수와 계승의 값', '①34', (d, n) => {
      if (n === 0) {
        const a = d.int(6, 10), r = d.int(2, a >= 9 ? 3 : 4), m = d.int(4, 7), zero = d.bool(), second = zero ? 1 : fact(m);
        return M(`${Pj(a, r, '과/와')} ${Pn(m, zero ? 0 : m)}의 값을 차례로 구하시오.`, [{ label: Pn(a, r) + ' =', answer: nPr(a, r) }, { label: Pn(m, zero ? 0 : m) + ' =', answer: second }], {
          explain: `${Pn(a, r)} = ${range(0, r - 1).map((i) => a - i).join(' × ')} = ${nPr(a, r)}이다. ${zero ? `${Pn(m, 0)} = 1로 정한다.` : `${Pn(m, m)} = ${m}! = ${range(1, m).reverse().join(' × ')} = ${fact(m)}이다.`}`,
          facts: { calc: [[prodS(a, r), 0], [zero ? '1' : factS(m), 1]] }
        });
      }
      if (d.bool()) {
        const a = d.int(2, 4), m = d.int(4, 6), r = d.int(2, 3), ans = fact(a) * nPr(m, r);
        return N(`${a}! × ${Pn(m, r)}의 값은?`, ans, { explain: `${a}! = ${fact(a)}, ${Pn(m, r)} = ${range(0, r - 1).map((i) => m - i).join(' × ')} = ${nPr(m, r)}이므로 ${fact(a)} × ${nPr(m, r)} = ${ans}이다.`, facts: { calc: [[`${factS(a)}*${prodS(m, r)}`, 0]], rule: 'fact-perm' } });
      }
      const a = d.int(4, 7), ans = fact(a);
      return N(`${a}! × 0!의 값은?`, ans, { explain: `0! = 1로 정하므로 ${a}! × 0! = ${a}! × 1 = ${ans}이다.`, facts: { calc: [[factS(a), 0]], rule: 'fact-zero' } });
    }, { count: 2, standard: S2 }),
    T('perm-steps', '순열의 수를 차례로 세는 과정의 빈칸', '①35의 홍최2', (d) => {
      const [thing, act, unitW] = d.pick([['노래', '감상하는', '곡'], ['관광지', '방문하는', '곳'], ['전시관', '관람하는', '곳']]), n = d.int(5, 9);
      const blank = (s) => box(s);
      return M(`다음은 서로 다른 ${thing} ${n}${unitW} 가운데 3${unitW}을 골라 ${act} 차례를 정하는 경우의 수를 구하는 과정이다. ㈎, ㈏, ㈐, ㈑에 알맞은 수를 차례로 구하시오.`,
        [{ label: '㈎', answer: n }, { label: '㈏', answer: n - 1 }, { label: '㈐', answer: n - 2 }, { label: '㈑', answer: nPr(n, 3) }], {
          figure: lines([`첫 번째 ${josa(thing, '을/를')} 고르는 경우는 ${blank('㈎')}가지,`, `두 번째 ${josa(thing, '은/는')} 첫 번째 것을 뺀 ${blank('㈏')}가지,`, `세 번째 ${josa(thing, '은/는')} 앞의 두 개를 뺀 ${blank('㈐')}가지이다.`, `따라서 구하는 경우의 수는 ${Pn(n, 3)} = ${blank('㈑')}이다.`]),
          explain: `${josa(thing, '을/를')} 차례로 고르면 ${n}가지, ${n - 1}가지, ${n - 2}가지이므로 곱의 법칙에 의하여 ${Pn(n, 3)} = ${n} × ${n - 1} × ${n - 2} = ${nPr(n, 3)}이다.`,
          facts: { calc: [[String(n), 0], [`${n}-1`, 1], [`${n}-2`, 2], [prodS(n, 3), 3]] }
        });
    }, { standard: S2 }),
    T('perm-blank', 'ₙPᵣ = n!/(n − r)!의 빈칸', '①35', (d) => {
      const n = d.int(5, 9), r = d.int(2, n - 2);
      return inline('순열의 수를 계승을 사용하여 나타낸 다음 식에서 □ 안에 알맞은 수를 구하시오.', `${Pn(n, r)} = ${frac(n + '!', '{0}!')}`, [{ answer: n - r }], {
        shown: `${Pn(n, r)} = ${frac(n + '!', (n - r) + '!')}`,
        explain: `${Pn(n, r)} = ${frac(n + '!', `(${n} − ${r})!`)} = ${frac(n + '!', (n - r) + '!')}이므로 □ 안에 알맞은 수는 ${n - r}이다.`,
        facts: { calc: [[`${n}-${r}`, 0]] }
      });
    }, { standard: S2 }),
    T('perm-solve', 'ₙPᵣ = k, n! = k에서 n이나 r 구하기', '①36', (d, n) => {
      if (n === 0) {
        const r = d.int(2, 3), m = d.int(r + 2, r === 2 ? 15 : 10), k = nPr(m, r), poly = r === 2 ? '□*(□-1)' : '□*(□-1)*(□-2)';
        return N(`등식 ${Pn(vn, r)} = ${josa(k, '을/를')} 만족시키는 자연수 ${vn}의 값은?`, m, {
          explain: `${Pn(vn, r)} = ${r === 2 ? `${vn}(${vn} − 1)` : `${vn}(${vn} − 1)(${vn} − 2)`} = ${k}이고, ${k} = ${range(0, r - 1).map((i) => m - i).join(' × ')}이므로 ${vn} = ${m}이다.`,
          facts: eqDigit(poly, k, r - 1, 40)
        });
      }
      if (n === 1) {
        const m = d.int(5, 9), r = d.int(2, Math.min(4, m - 2)), k = nPr(m, r);
        if (d.bool()) {
          return N(`등식 ${Pn(m, vr)} = ${josa(k, '을/를')} 만족시키는 자연수 ${vr}의 값은?`, r, {
            explain: `${k} = ${range(0, r - 1).map((i) => m - i).join(' × ')}이고, ${m}부터 1씩 작아지는 수 ${r}개의 곱이므로 ${Pn(m, r)}이다. 따라서 ${vr} = ${r}이다.`,
            facts: eqDigit(permX(m, '□'), k, 0, m)
          });
        }
        const a = d.int(2, 4), K = k * fact(a);
        return N(`등식 ${Pn(m, vr)} × ${a}! = ${josa(K, '을/를')} 만족시키는 자연수 ${vr}의 값은?`, r, {
          explain: `${a}! = ${fact(a)}이므로 ${Pn(m, vr)} = ${K} ÷ ${fact(a)} = ${k}이다. ${k} = ${range(0, r - 1).map((i) => m - i).join(' × ')} = ${Pn(m, r)}이므로 ${vr} = ${r}이다.`,
          facts: eqDigit(`(${permX(m, '□')})*${factS(a)}`, K, 0, m)
        });
      }
      const m = d.int(4, 7), k = fact(m);
      return N(`등식 ${vn}! = ${josa(k, '을/를')} 만족시키는 자연수 ${vn}의 값은?`, m, {
        explain: `${k} = ${range(1, m).reverse().join(' × ')} = ${m}!이므로 ${vn} = ${m}이다.`,
        facts: eqDigit(factX('□', 10), k, 1, 9)
      });
    }, { count: 3, standard: S2 }),
    T('perm-equation', '순열의 수가 든 등식에서 n 구하기', '①37', (d, n) => {
      const fams = n === 0 ? ['A', 'B'] : ['C', 'D'], fam = d.pick(fams);
      if (fam === 'A') {
        const m = d.int(2, 7), k = 2 * (m + 1) * (m + 1);
        return N(`등식 ${Pn(nb(vn + '+2'), 2)} + ${Pn(nb(vn + '+1'), 2)} = ${josa(k, '을/를')} 만족시키는 자연수 ${vn}의 값은?`, m, {
          explain: `${eqn(`(${vn} + 2)(${vn} + 1) + (${vn} + 1)${vn} = ${k}`)}에서 ${eqn(`2(${vn} + 1)<sup>2</sup> = ${k}`)}, ${eqn(`(${vn} + 1)<sup>2</sup> = ${k / 2}`)}이다. ${vn}은 자연수이므로 ${vn} + 1 = ${m + 1}, ${vn} = ${m}이다.`,
          facts: eqDigit('(□+2)*(□+1)+(□+1)*□', k, 0, 30)
        });
      }
      if (fam === 'B') {
        const m = d.int(3, 9), k = 3 * m * (m - 1);
        return N(`등식 ${Pn(nb(vn + '+1'), 3)} = ${Pn(vn, 3)} + ${josa(k, '을/를')} 만족시키는 자연수 ${vn}의 값은?`, m, {
          explain: `${eqn(`(${vn} + 1)${vn}(${vn} − 1) − ${vn}(${vn} − 1)(${vn} − 2) = ${k}`)}에서 ${eqn(`${vn}(${vn} − 1){(${vn} + 1) − (${vn} − 2)} = 3${vn}(${vn} − 1) = ${k}`)}, ${eqn(`${vn}(${vn} − 1) = ${k / 3}`)}이다. 따라서 ${vn} = ${m}이다.`,
          facts: eqDigit('(□+1)*□*(□-1)-□*(□-1)*(□-2)', k, 2, 30)
        });
      }
      if (fam === 'C') {
        const t = d.int(2, 6), c = t * t - 1, m = 3 + t;
        return N(`등식 ${Pn(vn, 4)} = ${Pn(vn, 3)} + ${c} × ${Pn(vn, 2)}를 만족시키는 자연수 ${vn}의 값은?`, m, {
          explain: `${eqn(`${vn}(${vn} − 1)(${vn} − 2)(${vn} − 3) = ${vn}(${vn} − 1)(${vn} − 2) + ${c}${vn}(${vn} − 1)`)}이고 ${vn} ≥ 4이므로 양변을 ${eqn(`${vn}(${vn} − 1)`)}로 나누면 ${eqn(`(${vn} − 2)(${vn} − 3) = (${vn} − 2) + ${c}`)}, ${eqn(`${vn}<sup>2</sup> − 6${vn}${8 - c > 0 ? ` + ${8 - c}` : 8 - c < 0 ? ` − ${c - 8}` : ''} = 0`)}이다. 따라서 ${eqn(`${m === 6 ? vn : `(${vn} ${m > 6 ? '+' : '−'} ${Math.abs(m - 6)})`}(${vn} − ${m}) = 0`)}에서 ${vn} = ${m}이다.`,
          facts: eqDigit(`□*(□-1)*(□-2)*(□-3)-□*(□-1)*(□-2)-${c}*□*(□-1)`, 0, 3, 30)
        });
      }
      // D: ₙP₃ = ₙ₋₁P₃ + c × ₘP₂ (3(n − 1)(n − 2) = c·m(m − 1))
      const [m, c, mm] = d.until(() => { const m0 = d.int(5, 9), mm0 = d.int(2, 6), c0 = 3 * (m0 - 1) * (m0 - 2) / (mm0 * (mm0 - 1)); return [m0, c0, mm0]; }, ([m0, c0, mm0]) => Number.isInteger(c0) && c0 >= 2 && c0 <= 20 && mm0 !== m0 - 1);
      return N(`등식 ${Pn(vn, 3)} = ${Pn(nb(vn + '−1'), 3)} + ${c} × ${Pn(mm, 2)}를 만족시키는 자연수 ${vn}의 값은?`, m, {
        explain: `${eqn(`${vn}(${vn} − 1)(${vn} − 2) − (${vn} − 1)(${vn} − 2)(${vn} − 3) = 3(${vn} − 1)(${vn} − 2)`)}이고 ${c} × ${Pn(mm, 2)} = ${c * mm * (mm - 1)}이므로 ${eqn(`(${vn} − 1)(${vn} − 2) = ${c * mm * (mm - 1) / 3}`)}이다. 따라서 ${vn} = ${m}이다.`,
        facts: eqDigit(`□*(□-1)*(□-2)-(□-1)*(□-2)*(□-3)`, c * mm * (mm - 1), 3, 30)
      });
    }, { count: 2, standard: S2 }),
    T('perm-proof', '순열의 수의 성질 — 증명 과정의 빈칸과 나누어 세기', '①38', (d, n) => {
      const nm = MINUS, fr = (a, b) => frac(a, b), N1 = `(${vn}${nm}1)!`;
      const SAMPLES = [[5, 2], [6, 3], [7, 4], [8, 3], [6, 1], [9, 5]];
      if (n === 0) {
        // ₙ₋₁Pᵣ + r × ₙ₋₁Pᵣ₋₁ = (n−1)!/(n−1−r)! + r × ㈎ = ㈏ × (n−1)!/(n−r)! = ₙPᵣ
        const X = [[fr(N1, `(${vn}${nm}${vr})!`), (a, r) => fact(a - 1) / fact(a - r)], [fr(N1, `(${vn}${nm}${vr}${nm}1)!`), (a, r) => fact(a - 1) / fact(a - r - 1)], [fr(`${vn}!`, `(${vn}${nm}${vr})!`), (a, r) => fact(a) / fact(a - r)]];
        const Y = [[vn, (a) => a], [nb(`${vn}${nm}1`), (a) => a - 1], [vr, (a, r) => r]];
        const opts = d.shuffle(cart([[0, 1, 2], [0, 1, 2]])).filter(([i, j]) => !(i === 0 && j === 0)).slice(0, 3).concat([[0, 0]]);
        const shown = d.shuffle(opts), ok = ([i, j]) => SAMPLES.every(([a, r]) => X[i][1](a, r) === nPr(a - 1, r - 1) && Y[j][1](a, r) * fact(a - 1) / fact(a - r) === nPr(a, r));
        return C(`다음은 ${nb(`1 ≤ ${vr} &lt; ${vn}`)}일 때, 등식 ${nb(`${Pn(vn, vr)} = ${Pn(`${vn}${nm}1`, vr)} + ${vr} × ${Pn(`${vn}${nm}1`, `${vr}${nm}1`)}`)}이 성립함을 보이는 과정이다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`,
          shown.map(([i, j]) => `㈎ ${X[i][0]}, ㈏ ${Y[j][0]}`), shown.findIndex(([i, j]) => i === 0 && j === 0), {
            figure: proc([{ h: `${Pn(`${vn}${nm}1`, vr)} + ${vr} × ${Pn(`${vn}${nm}1`, `${vr}${nm}1`)}` }, { h: `${fr(N1, `{(${vn}${nm}1)${nm}${vr}}!`)} + ${vr} × ${box('㈎')}` }, { h: `${box('㈏')} × ${fr(N1, `(${vn}${nm}${vr})!`)}` }, { h: `${fr(`${vn}!`, `(${vn}${nm}${vr})!`)} = ${Pn(vn, vr)}` }]),
            explain: `${Pn(`${vn}${nm}1`, `${vr}${nm}1`)} = ${fr(N1, `(${vn}${nm}${vr})!`)}이 ㈎이다. 첫째 항은 ${fr(`(${vn}${nm}${vr}) × ${N1}`, `(${vn}${nm}${vr})!`)}이므로 두 항을 더하면 ${nb(`{(${vn}${nm}${vr}) + ${vr}}`)} × ${fr(N1, `(${vn}${nm}${vr})!`)}이고 ㈏는 ${vn}이다.`,
            facts: { truth: shown.map(ok), want: true }
          });
      }
      if (n === 1) {
        // n × ₙ₋₁Pᵣ₋₁ = n × (n−1)!/{(n−1)−(㈎)}! = n!/(㈏)! = ₙPᵣ
        const X = [[nb(`${vr}${nm}1`), (a, r) => r - 1], [vr, (a, r) => r], [nb(`${vr}+1`), (a, r) => r + 1]];
        const Y = [[nb(`${vn}${nm}${vr}`), (a, r) => a - r], [nb(`${vn}${nm}${vr}+1`), (a, r) => a - r + 1], [nb(`${vn}${nm}1`), (a) => a - 1]];
        const opts = d.shuffle(cart([[0, 1, 2], [0, 1, 2]])).filter(([i, j]) => !(i === 0 && j === 0)).slice(0, 3).concat([[0, 0]]);
        const shown = d.shuffle(opts), ok = ([i, j]) => SAMPLES.every(([a, r]) => a - 1 - X[i][1](a, r) === a - r && Y[j][1](a, r) === a - r);
        return C(`다음은 ${nb(`1 ≤ ${vr} ≤ ${vn}`)}일 때, 등식 ${nb(`${Pn(vn, vr)} = ${vn} × ${Pn(`${vn}${nm}1`, `${vr}${nm}1`)}`)}이 성립함을 보이는 과정이다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`,
          shown.map(([i, j]) => `㈎ ${X[i][0]}, ㈏ ${Y[j][0]}`), shown.findIndex(([i, j]) => i === 0 && j === 0), {
            figure: proc([{ h: `${vn} × ${Pn(`${vn}${nm}1`, `${vr}${nm}1`)}` }, { h: `${vn} × ${fr(N1, `{(${vn}${nm}1)${nm}(${box('㈎')})}!`)}` }, { h: `${fr(`${vn}!`, `(${box('㈏')})!`)} = ${Pn(vn, vr)}` }]),
            explain: `${Pn(`${vn}${nm}1`, `${vr}${nm}1`)}은 서로 다른 ${vn} − 1개에서 ${vr} − 1개를 택하는 순열의 수이므로 ㈎는 ${vr} − 1이다. 이때 ${nb(`(${vn} − 1) − (${vr} − 1) = ${vn} − ${vr}`)}이고 ${vn} × ${N1} = ${vn}!이므로 ㈏는 ${vn} − ${vr}이다.`,
            facts: { truth: shown.map(ok), want: true }
          });
      }
      const m = d.int(8, 20), nm0 = d.pick(NAMES);
      return M(`${name(nm0, '을/를')} 포함한 동아리 회원 ${m}명 가운데 회장, 부회장, 총무를 1명씩 뽑으려고 한다. ${name(nm0, '이/가')} 임원으로 뽑히지 않는 경우의 수와 뽑히는 경우의 수를 차례로 구하시오.`,
        [{ label: '뽑히지 않는 경우', answer: nPr(m - 1, 3), unit: '가지' }, { label: '뽑히는 경우', answer: 3 * nPr(m - 1, 2), unit: '가지' }], {
          explain: `${name(nm0, '이/가')} 뽑히지 않으면 나머지 ${m - 1}명에서 세 임원을 뽑으므로 ${Pn(m - 1, 3)} = ${nPr(m - 1, 3)}(가지)이다. ${name(nm0, '이/가')} 뽑히면 ${name(nm0, '이/가')} 맡을 임원을 정하는 3가지마다 나머지 두 임원을 ${m - 1}명에서 뽑으므로 3 × ${Pn(m - 1, 2)} = ${3 * nPr(m - 1, 2)}(가지)이다. 두 수의 합 ${josa(nPr(m, 3), '은/는')} ${Pj(m, 3, '과/와')} 같다.`,
          facts: { calc: [[prodS(m - 1, 3), 0], [`3*${prodS(m - 1, 2)}`, 1]] }
        });
    }, { count: 3, standard: S2 })
  ];

  // ════════════════ 순열의 활용 — 일렬로 세우기 ════════════════
  const lineTypes = [
    T('line-ends', '한 무리에서 골라 양 끝에 세우기', '①41', (d, n) => {
      if (n === 0) {
        const form = d.int(0, 2);
        let text, k, total, what;
        if (form === 0) {
          total = d.int(5, 7); const even = d.bool(); k = even ? Math.floor(total / 2) : Math.ceil(total / 2); what = even ? '짝수' : '홀수';
          text = `1부터 ${total}까지의 자연수 ${total}개를 한 번씩 사용하여 일렬로 나열할 때, 양 끝에 ${josa(what, '이/가')} 오도록 나열하는 경우의 수는?`;
        } else if (form === 1) {
          k = d.int(3, 4); const r = d.int(2, 3); total = k + r; what = '동물 인형';
          text = `서로 다른 동물 인형 ${k}개와 서로 다른 로봇 인형 ${r}개를 일렬로 진열할 때, 양 끝에 동물 인형을 진열하는 경우의 수는?`;
        } else {
          const w = d.pick(WORDS.filter((x) => x.length <= 7 && x.split('').filter(isVowel).length >= 2)); total = w.length; k = w.split('').filter(isVowel).length; what = '모음';
          text = `${w}에 있는 ${total}개의 문자를 모두 한 번씩 사용하여 일렬로 나열할 때, 양 끝에 모음이 오도록 나열하는 경우의 수는? (단, 모음은 A, E, I, O, U이다.)`;
        }
        const ans = nPr(k, 2) * fact(total - 2);
        return N(text, ans, {
          unit: '가지',
          explain: `${what} ${k}개 가운데 2개를 골라 양 끝에 놓는 경우는 ${Pn(k, 2)} = ${nPr(k, 2)}(가지)이다. 그 각각에 대하여 나머지 ${total - 2}개를 가운데에 일렬로 놓는 경우는 ${total - 2}! = ${fact(total - 2)}(가지)이므로 ${nPr(k, 2)} × ${fact(total - 2)} = ${ans}(가지)이다.`,
          facts: { calc: [[`${prodS(k, 2)}*${factS(total - 2)}`, 0]] }
        });
      }
      const a = d.int(3, 5), c = d.int(3, 5), tot = a + c, want = nPr(a, 2) * fact(tot - 2);
      const pool = [[`${Pn(a, 2)} × ${tot - 2}!`, want], [`${tot}!`, fact(tot)], [`2! × ${tot - 2}!`, 2 * fact(tot - 2)], [`${Pn(a, 2)} × ${c}!`, nPr(a, 2) * fact(c)], [`${a}! × ${c}!`, fact(a) * fact(c)], [`${Pn(tot, 2)} × ${tot - 2}!`, nPr(tot, 2) * fact(tot - 2)]];
      const opts = d.shuffle([pool[0]].concat(d.shuffle(pool.slice(1).filter(([, v]) => v !== want)).slice(0, 4)));
      return C(`어른 ${a}명과 어린이 ${c}명이 일렬로 설 때, 어른이 양 끝에 서는 경우의 수를 나타낸 것은?`, opts.map(([s]) => s), opts.findIndex(([s]) => s === pool[0][0]), {
        explain: `어른 ${a}명 가운데 2명을 골라 양 끝에 세우는 경우는 ${Pn(a, 2)}가지이고, 그 각각에 대하여 나머지 ${tot - 2}명을 가운데에 일렬로 세우는 경우는 ${tot - 2}!가지이다. 따라서 ${Pn(a, 2)} × ${tot - 2}!이다.`,
        facts: { truth: opts.map(([, v]) => v === want), want: true }
      });
    }, { count: 2, standard: S2 }),
    T('line-seats', '정해진 사람들이 정해진 번호의 의자에 앉기', '①42 심4', (d) => {
      const T0 = d.int(5, 7), odd = d.bool(), k = odd ? Math.ceil(T0 / 2) : Math.floor(T0 / 2), [p1, p2] = who(d, 2), ans = nPr(k, 2) * fact(T0 - 2);
      return N(`1부터 ${T0}까지의 번호가 하나씩 적힌 의자 ${T0}개가 일렬로 놓여 있다. ${josa(p1, '과/와')} ${josa(p2, '을/를')} 포함한 ${T0}명이 의자에 한 명씩 모두 앉을 때, ${josa(p1, '과/와')} ${name(p2, '이/가')} 모두 ${odd ? '홀수' : '짝수'} 번호가 적힌 의자에 앉는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `${odd ? '홀수' : '짝수'} 번호가 적힌 의자 ${k}개 가운데 2개를 골라 두 사람이 앉는 경우는 ${Pn(k, 2)} = ${nPr(k, 2)}(가지)이다. 그 각각에 대하여 나머지 ${T0 - 2}명이 남은 의자에 앉는 경우는 ${T0 - 2}! = ${fact(T0 - 2)}(가지)이므로 ${nPr(k, 2)} × ${fact(T0 - 2)} = ${ans}(가지)이다.`,
        facts: { calc: [[`${prodS(k, 2)}*${factS(T0 - 2)}`, 0]] }
      });
    }, { standard: S2 }),
    T('line-block', '셋 이상을 한 묶음으로 이웃하게 세우기', '①44', (d, n) => {
      if (n === 0) {
        const [ga, gb, unitW] = d.pick([['남학생', '여학생', '명'], ['어른', '어린이', '명'], ['수학책', '영어책', '권']]), a = d.int(3, 4), b = d.int(2, a === 4 ? 4 : 5), ans = fact(b + 1) * fact(a);
        return N(`${ga} ${a}${unitW}과 ${gb} ${b}${unitW}을 일렬로 ${unitW === '권' ? '꽂을' : '세울'} 때, ${ga}끼리 서로 이웃하도록 ${unitW === '권' ? '꽂는' : '세우는'} 경우의 수는?${unitW === '권' ? ' (단, 책은 모두 서로 다르다.)' : ''}`, ans, {
          unit: '가지',
          explain: `${ga} ${a}${unitW}을 한 묶음으로 생각하면 ${b + 1}개를 일렬로 놓는 경우는 ${b + 1}! = ${fact(b + 1)}(가지)이다. 그 각각에 대하여 묶음 안의 ${ga} ${a}${unitW}이 자리를 바꾸는 경우는 ${a}! = ${fact(a)}(가지)이므로 ${fact(b + 1)} × ${fact(a)} = ${ans}(가지)이다.`,
          facts: { calc: [[`${factS(b + 1)}*${factS(a)}`, 0]] }
        });
      }
      const m = d.int(2, 5), K = fact(m + 1) * 6;
      return N(`어른 3명과 아이 ${vn}명이 일렬로 설 때, 어른끼리 이웃하여 서는 경우의 수가 ${K}이다. 자연수 ${vn}의 값은?`, m, {
        explain: `어른 3명을 한 묶음으로 생각하면 ${nb(`(${vn} + 1)`)}개를 일렬로 세우는 경우는 ${nb(`(${vn} + 1)!`)}가지, 묶음 안에서 어른이 자리를 바꾸는 경우는 3! = 6(가지)이다. ${nb(`(${vn} + 1)! × 6 = ${K}`)}에서 ${nb(`(${vn} + 1)! = ${K / 6} = ${m + 1}!`)}이므로 ${vn} = ${m}이다.`,
        facts: eqDigit(`(${factX('(□+1)', 10)})*6`, K, 0, 8)
      });
    }, { count: 2, standard: S2 }),
    T('line-blocks', '묶음 여럿이 각각 이웃하게 세우기', '①45', (d, n) => {
      if (n === 0) {
        const sizes = d.until(() => [d.int(2, 3), d.int(2, 4), d.int(2, 3)], (s) => 6 * s.reduce((p, v) => p * fact(v), 1) <= 9999), ans = 6 * sizes.reduce((p, v) => p * fact(v), 1);
        return N(`1학년 ${sizes[0]}명, 2학년 ${sizes[1]}명, 3학년 ${sizes[2]}명을 일렬로 세울 때, 같은 학년 학생끼리 서로 이웃하도록 세우는 경우의 수는?`, ans, {
          unit: '가지',
          explain: `학년마다 한 묶음으로 생각하면 세 묶음을 일렬로 세우는 경우는 3! = 6(가지)이다. 그 각각에 대하여 묶음 안에서 자리를 바꾸는 경우는 ${sizes.map((s) => s + '!').join(' × ')} = ${sizes.reduce((p, v) => p * fact(v), 1)}(가지)이므로 6 × ${sizes.reduce((p, v) => p * fact(v), 1)} = ${ans}(가지)이다.`,
          facts: { calc: [[`3*2*${sizes.map(factS).join('*')}`, 0]] }
        });
      }
      const [c, s] = d.until(() => [d.int(2, 4), d.int(0, 2)], ([c0, s0]) => fact(c0 + s0) * 2 ** c0 <= 9999 && c0 + s0 >= 3), ans = fact(c + s) * 2 ** c;
      return N(`부부 ${c}쌍${s ? `과 혼자 온 ${s}명` : ''}이 일렬로 놓인 의자 ${2 * c + s}개에 모두 앉을 때, 부부끼리 서로 이웃하여 앉는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `부부마다 한 묶음으로 생각하면 ${c + s}개를 일렬로 놓는 경우는 ${c + s}! = ${fact(c + s)}(가지)이다. 그 각각에 대하여 부부마다 두 사람이 자리를 바꾸는 경우가 2가지씩이므로 ${range(1, c).map(() => 2).join(' × ')} = ${2 ** c}(가지)이다. 따라서 ${fact(c + s)} × ${2 ** c} = ${ans}(가지)이다.`,
        facts: { calc: [[`${factS(c + s)}*${range(1, c).map(() => 2).join('*')}`, 0]] }
      });
    }, { count: 2, standard: S2 }),
    T('line-apart', '이웃하지 않게 세우기(사이사이와 양 끝에 끼우기)', '①46 심5', (d) => {
      const [a, b] = d.until(() => [d.int(3, 5), d.int(2, 3)], ([a0, b0]) => b0 <= a0 + 1 && fact(a0) * nPr(a0 + 1, b0) <= 9999);
      const [ga, gb, verb, verbN, unitW] = d.pick([['소설책', '시집', '꽂으려고', '꽂는', '권'], ['남학생', '여학생', '세우려고', '세우는', '명'], ['어른', '어린이', '세우려고', '세우는', '명']]), ans = fact(a) * nPr(a + 1, b);
      return N(`${unitW === '권' ? '서로 다른 ' : ''}${ga} ${a}${unitW}과 ${unitW === '권' ? '서로 다른 ' : ''}${gb} ${b}${unitW}을 일렬로 ${verb} 한다. ${gb}끼리는 서로 이웃하지 않게 ${verbN} 경우의 수는?`, ans, {
        unit: '가지',
        explain: `먼저 ${ga} ${a}${unitW}을 일렬로 놓는 경우는 ${a}! = ${fact(a)}(가지)이다. 그 각각에 대하여 ${ga}의 사이사이와 양 끝의 ${a + 1}곳 가운데 ${b}곳을 골라 ${gb}을 하나씩 놓는 경우는 ${Pn(a + 1, b)} = ${nPr(a + 1, b)}(가지)이므로 ${fact(a)} × ${nPr(a + 1, b)} = ${ans}(가지)이다.`,
        facts: { calc: [[`${factS(a)}*${prodS(a + 1, b)}`, 0]] }
      });
    }, { standard: S2 }),
    T('line-between', '두 문자 사이에 정해진 개수의 문자가 오도록 나열하기', '①48', (d) => {
      const w = d.pick(WORDS.filter((x) => x.length >= 6 && x.length <= 7)), L = w.length, k = d.int(1, Math.min(3, L - 3));
      const [x, y] = d.shuffle(w.split('')).slice(0, 2), ans = nPr(L - 2, k) * fact(L - k - 1) * 2;
      return N(`${w}에 있는 ${L}개의 문자를 모두 한 번씩 사용하여 일렬로 나열할 때, ${lj(x, '과/와')} ${y} 사이에 ${k}개의 문자만 있도록 나열하는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `${lj(x, '과/와')} ${lj(y, '을/를')} 뺀 ${L - 2}개의 문자 가운데 ${k}개를 골라 두 문자 사이에 일렬로 놓는 경우는 ${Pn(L - 2, k)} = ${nPr(L - 2, k)}(가지)이다. ${x}, 사이의 문자, ${lj(y, '을/를')} 한 묶음으로 보면 ${L - k - 1}개를 일렬로 놓는 경우는 ${L - k - 1}! = ${fact(L - k - 1)}(가지)이고, ${lj(x, '과/와')} ${lj(y, '이/가')} 자리를 바꾸는 경우가 2가지이다. 따라서 ${nPr(L - 2, k)} × ${fact(L - k - 1)} × 2 = ${ans}(가지)이다.`,
        facts: { calc: [[`${prodS(L - 2, k)}*${factS(L - k - 1)}*2`, 0]] }
      });
    }, { standard: S2 }),
    T('line-ordered-block', '정해진 차례로 이웃하는 묶음', '①49', (d) => {
      const L = d.int(5, 7), letters = 'ABCDEFG'.slice(0, L).split(''), k = d.int(2, 3), chosen = d.shuffle(letters).slice(0, k), ans = fact(L - k + 1);
      return N(`${told(letters)}의 ${L}개의 문자를 일렬로 나열할 때, ${told(chosen)}가 서로 이웃하면서 ${told(chosen)}의 차례로 나열되는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `${told(chosen)}를 한 묶음으로 생각하면 ${L - k + 1}개를 일렬로 나열하는 경우는 ${L - k + 1}! = ${ans}(가지)이다. 묶음 안의 차례는 ${chosen.join('')}의 한 가지로 정해져 있으므로 ${ans} × 1 = ${ans}(가지)이다.`,
        facts: { calc: [[factS(L - k + 1), 0]] }
      });
    }, { standard: S2 }),
    T('line-ends-block', '양 끝 조건과 이웃 조건을 함께', '①50', (d) => {
      const [a, c] = d.until(() => [d.int(3, 5), d.int(2, 3)], ([a0, c0]) => nPr(a0, 2) * fact(a0 - 1) * fact(c0) <= 9999), ans = nPr(a, 2) * fact(a - 1) * fact(c);
      return N(`어른 ${a}명과 어린이 ${c}명이 일렬로 줄을 설 때, 맨 앞과 맨 뒤에 어른이 서고 어린이끼리 이웃하여 서는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `어른 ${a}명 가운데 2명을 골라 맨 앞과 맨 뒤에 세우는 경우는 ${Pn(a, 2)} = ${nPr(a, 2)}(가지)이다. 어린이 ${c}명을 한 묶음으로 생각하면 가운데에 남은 어른 ${a - 2}명과 묶음 하나를 일렬로 세우는 경우는 ${a - 1}! = ${fact(a - 1)}(가지), 묶음 안에서 어린이가 자리를 바꾸는 경우는 ${c}! = ${fact(c)}(가지)이다. 따라서 ${nPr(a, 2)} × ${fact(a - 1)} × ${fact(c)} = ${ans}(가지)이다.`,
        facts: { calc: [[`${prodS(a, 2)}*${factS(a - 1)}*${factS(c)}`, 0]] }
      });
    }, { standard: S2 }),
    T('line-front-apart', '맨 앞 자리 조건과 이웃하지 않기를 함께', '①51', (d) => {
      const [a, b] = d.until(() => [d.int(3, 5), d.int(2, 3)], ([a0, b0]) => b0 <= a0 - 1 && nPr(a0, 2) * fact(a0 - 2) * nPr(a0 - 1, b0) <= 9999), ans = nPr(a, 2) * fact(a - 2) * nPr(a - 1, b);
      return N(`남학생 ${a}명과 여학생 ${b}명을 일렬로 세울 때, 맨 앞의 두 자리에는 남학생을 세우고 여학생끼리는 서로 이웃하지 않게 세우는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `맨 앞의 두 자리에 남학생을 세우는 경우는 ${Pn(a, 2)} = ${nPr(a, 2)}(가지)이다. 남은 남학생 ${a - 2}명을 세우는 경우는 ${a - 2}! = ${fact(a - 2)}(가지)이고, 그 사이사이와 양 끝(맨 앞 두 자리 바로 뒤 포함) ${a - 1}곳 가운데 ${b}곳에 여학생을 세우는 경우는 ${Pn(a - 1, b)} = ${nPr(a - 1, b)}(가지)이다. 따라서 ${nPr(a, 2)} × ${fact(a - 2)} × ${nPr(a - 1, b)} = ${ans}(가지)이다.`,
        facts: { calc: [[`${prodS(a, 2)}*${factS(a - 2)}*${prodS(a - 1, b)}`, 0]] }
      });
    }, { standard: S2 }),
    T('line-seat-rows', '좌석 배치도에서 같은 열에 이웃하여 앉기', '①52', (d) => {
      const [rows, p] = d.until(() => [d.pick([[2, 2, 3], [3, 3], [2, 3, 3], [3, 4], [2, 2, 2], [2, 4]]), d.int(4, 5)], ([r, p0]) => { const S = sum(r); return p0 <= S - 1 && sum(r.map((k) => k - 1)) * 2 * nPr(S - 2, p0 - 2) <= 9999; });
      const S = sum(rows), pairs = sum(rows.map((k) => k - 1)), ans = pairs * 2 * nPr(S - 2, p - 2);
      return N(`그림과 같이 ${rows.length}개의 열에 좌석이 모두 ${S}개 있다. A, B를 포함한 ${p}명이 서로 다른 좌석에 한 명씩 앉을 때, A와 B가 같은 열에서 이웃하여 앉는 경우의 수는?`, ans, {
        unit: '가지',
        figure: seatsFig(rows),
        explain: `같은 열에서 이웃한 좌석 두 개는 ${rows.map((k, i) => `${i + 1}열에 ${k - 1}쌍`).join(', ')}으로 ${pairs}쌍이고, A와 B가 자리를 바꾸는 경우가 2가지이므로 ${pairs} × 2 = ${pairs * 2}(가지)이다. 그 각각에 대하여 나머지 ${p - 2}명이 남은 좌석 ${S - 2}개에 앉는 경우는 ${Pn(S - 2, p - 2)} = ${nPr(S - 2, p - 2)}(가지)이므로 ${pairs * 2} × ${nPr(S - 2, p - 2)} = ${ans}(가지)이다.`,
        facts: { calc: [[`(${rows.map((k) => k - 1).join('+')})*2*${prodS(S - 2, p - 2)}`, 0]] }
      });
    }, { standard: S2 }),
    T('line-at-least-end', '적어도 한쪽 끝에 오도록 나열하기(여사건)', '①53', (d) => {
      const w = d.pick(WORDS.filter((x) => x.length >= 5 && x.length <= 7 && x.split('').filter(isVowel).length >= 1 && x.split('').filter((ch) => !isVowel(ch)).length >= 2));
      const L = w.length, v = w.split('').filter(isVowel).length, c = L - v, ans = fact(L) - nPr(c, 2) * fact(L - 2);
      return N(`${w}에 있는 ${L}개의 문자를 모두 한 번씩 사용하여 일렬로 나열할 때, 적어도 한쪽 끝에 모음이 오는 경우의 수는? (단, 모음은 A, E, I, O, U이다.)`, ans, {
        unit: '가지',
        explain: `모든 경우는 ${L}! = ${fact(L)}(가지)이다. 양 끝에 모두 자음이 오는 경우는 자음 ${c}개 가운데 2개를 양 끝에 놓는 ${Pn(c, 2)} = ${nPr(c, 2)}(가지)에 나머지 ${L - 2}개를 나열하는 ${L - 2}! = ${fact(L - 2)}(가지)를 곱한 ${nPr(c, 2) * fact(L - 2)}가지이다. 따라서 ${fact(L)} − ${nPr(c, 2) * fact(L - 2)} = ${ans}(가지)이다.`,
        facts: { calc: [[`${factS(L)}-${prodS(c, 2)}*${factS(L - 2)}`, 0]] }
      });
    }, { standard: S2 }),
    T('line-rooms', '같은 층의 객실에 묵기', '①56', (d) => {
      const [k, g] = d.until(() => [d.int(3, 4), d.int(4, 5)], ([k0, g0]) => g0 <= 2 * k0 && 2 * nPr(k0, 2) * nPr(2 * k0 - 2, g0 - 2) <= 9999), ans = 2 * nPr(k, 2) * nPr(2 * k - 2, g - 2);
      return N(`어느 호텔의 2층과 3층에 빈 객실이 ${k}개씩 있다. A, B를 포함한 ${g}명이 서로 다른 객실에 한 명씩 묵을 때, A와 B가 같은 층의 객실에 묵는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `A와 B가 묵을 층을 정하는 경우는 2가지이고, 그 층의 객실 ${k}개 가운데 두 사람의 객실을 정하는 경우는 ${Pn(k, 2)} = ${nPr(k, 2)}(가지)이다. 나머지 ${g - 2}명이 남은 객실 ${2 * k - 2}개에 묵는 경우는 ${Pn(2 * k - 2, g - 2)} = ${nPr(2 * k - 2, g - 2)}(가지)이므로 2 × ${nPr(k, 2)} × ${nPr(2 * k - 2, g - 2)} = ${ans}(가지)이다.`,
        facts: { calc: [[`2*${prodS(k, 2)}*${prodS(2 * k - 2, g - 2)}`, 0]] }
      });
    }, { standard: S2 })
  ];

  // b·c 파일이 함께 쓰는 도구
  B.kit.m1017 = {
    UNIT, S1, S2, S3, sum, hits, fact, nPr, nCr, perms, combos, cart, isPrime, told, who, prodS, factS, combS, ind, permX, factX, combX, eqDigit,
    stripH, shownNumbers, evalS, seal, sourceOf, T, H, Pn, Cn, Pj, Cj, vn, vr, lj, isVowel, WORDS, seatsFig, menuFig, eqn
  };

  B.addUnit({
    id: '10-1-7', grade: 10, semester: 1, no: 7, title: '경우의 수', version: 1,
    groups: [
      { id: 'sum', title: '합의 법칙', standard: S1, types: sumTypes },
      { id: 'product', title: '곱의 법칙', standard: S1, types: productTypes },
      { id: 'perm', title: '순열의 수와 계승', standard: S2, types: permTypes },
      { id: 'line', title: '순열의 활용 — 일렬로 세우기', standard: S2, types: lineTypes }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
