// 중학교 1학년 2학기 5단원 자료의 정리와 해석 — 실력 문항.
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 7-2-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 중앙값을 자료가 적힌 차례의 가운데 값으로 고른다. 변량이 짝수 개일 때 가운데 두 값 가운데 하나를 고르고, 중앙값은 늘 자료에 있는 값이라고 여긴다.
//  - 값마다 횟수를 적은 표에서 가장 큰 횟수(도수)를 최빈값이라고 답하고, 표의 가운데 줄에 적힌 값을 중앙값이라고 답한다. 최빈값은 늘 하나라고 여긴다.
//  - 대푯값은 언제나 평균이 가장 알맞다고 여긴다. 다른 변량과 크게 차이 나는 값이 있거나 가장 많이 팔리는 치수를 알아보는 자료에서도 평균을 고른다.
//  - 값을 모르는 변량이 있으면 대푯값을 구할 수 없다고 여긴다(범위만 알아도 가운데 자리는 정해진다).
//  - 계급의 크기와 계급의 개수를 섞는다. 도수분포다각형에서는 가로축 위의 양 끝 점까지 계급으로 세고, 히스토그램에서는 도수가 0인 계급을 빼고 센다.
//  - 「30 이상 40 미만」의 경계인 30이 앞 계급(20 이상 30 미만)에 든다고 여기고, 「30 이하」인 수도 표에서 읽을 수 있다고 여긴다.
//  - 「n번째로 큰」을 표의 위쪽(작은 값 쪽)부터 세고, 기록이 작을수록 좋은 달리기에서도 큰 값 쪽부터 센다.
//  - 도수분포표와 히스토그램에서 가장 큰 변량·가장 작은 변량 같은 낱낱의 값을 읽을 수 있다고 여긴다(계급의 끝 값을 그 값으로 답한다).
//  - 직사각형의 넓이를 구하려면 길이를 재야 한다고 여긴다(넓이는 도수에 정비례하고, 넓이의 합은 계급의 크기 × 도수의 총합이다). 도수분포다각형의 넓이는 삼각형으로 쪼개어 구하려 한다.
//  - 상대도수의 총합을 도수의 총합이나 100으로 여긴다. 상대도수가 크면 도수도 크고, 상대도수가 같으면 도수도 같다고 여긴다(도수의 총합이 다른 두 집단).
//  - 찢어진 그래프에서 보이는 도수만 더한 것을 전체로 여긴다.
//  - 두 집단을 합할 때 상대도수끼리 더하거나 평균을 낸다. 도수의 비가 그대로 상대도수의 비라고 여긴다(도수의 총합으로 나누어야 한다).
//  - 최빈값이 하나로 정해지려면 그 값이 다른 어느 값보다도 여러 번 나와야 한다는 것을 놓친다(두 번씩 나온 값이 둘이면 최빈값도 둘이다).
//
// 실력에는 ① 문제의 자료·표·그림에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(조건 하나로 빠진 변량을 구한 다음 다른 대푯값 구하기,
// 찢어진 그래프에서 가려진 도수를 구한 다음 비율 구하기, 도수의 총합부터 거꾸로 구하기, 끝에서부터 도수를 쌓아 기준이 되는 값 찾기, 두 집단의 도수 견주기)만 실었다.
// 기본에서 하는 일을 고르기로 바꾼 것, 그래프에서 값 하나를 읽는 것은 싣지 않았다. 조건을 여럿 풀거나 경우를 갈라야 하는 것, 상대도수를 거꾸로 푸는 것은 처음에는 뺐다가 다시 실었다(실력 묶음 끝의 「다시 실은 꼴」. 까닭은 7-2-5a.js 머리 주석).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, numbers, tagged, N, M, C, D, inline } = B.kit;
  const { range, V, tail } = B.kit.mid;
  const K = B.kit.m725;
  const { STD1, STD2, STD3, sum, srt, median, modes, topCount, nth, modeAlt, many, isSorted, fx, nj, amt, ut, amtj, wj, pctOf, GC, freqs, grp, frameOf, newGrp, inside, introG, classOptions, dataFig, tbl, ftab, stemFig, stemData, STEMS,
    chart, histFig, polyFig, relFig, relFig2, r2, relGrp, relTab, introR, twoRels, PAIRS, BIG_PAIRS, pairLead, pairCount, uniqueMax } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②52' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const LT = '&lt;';
  // 기록이 작을수록 좋은 자료
  const RUN = { what: '100 m 달리기 기록', short: '기록', unit: '초', who: '학생', cnt: '명', big: '느린', small: '빠른', frames: [[13, 1], [14, 1]] };
  const SCORE = GC.find((c) => c.what === '수학 점수');
  // 도수를 한쪽 끝에서부터 쌓은 값
  const cumul = (f) => f.map((v, i) => sum(f.slice(0, i + 1)));

  B.addGroup('7-2-5', {
    id: 'hard', title: '실력 문제', standard: STD2,
    types: [
      // ══ 대푯값 ══
      // ── ① 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-table-reps', '값마다 횟수를 적은 표에서 최빈값과 중앙값', '심5 / 기본 ①6', (d, n) => {
        // 차례 0(최빈값) 함정: 가장 큰 횟수를 답하는 아이, 횟수 칸에 두 번 적힌 수를 「가장 많이 나온 값」이라고 답하는 아이. 최빈값은 횟수가 아니라 횟수가 가장 큰 「점수」이다.
        // 차례 1(중앙값) 함정: 점수 다섯 가지 가운데 한가운데 점수(표의 가운데 줄)를 답하는 아이. 변량은 횟수의 합만큼 있으므로 횟수를 쌓아 가운데 차례를 찾아야 한다.
        const scores = [6, 7, 8, 9, 10];
        if (n === 0) {
          const counts = d.until(() => many(d, 5, 2, 9), (f) => uniqueMax(f) && new Set(f).size === 4 && !f.includes(scores[f.indexOf(Math.max(...f))]) && f.indexOf(Math.max(...f)) !== 2);
          const at = counts.indexOf(Math.max(...counts)), total = sum(counts);
          return N(`다음은 어느 양궁 선수가 화살을 ${total}번 쏘아 얻은 점수를 조사하여 나타낸 표이다. 이 자료의 최빈값은?`, scores[at], { unit: '점', figure: tbl(['점수(점)', '횟수(회)'], scores.map((s, i) => [s, counts[i]])),
            explain: `최빈값은 가장 많이 나타나는 변량이다. ${scores[at]}점이 ${counts[at]}번으로 가장 많이 나왔으므로 최빈값은 ${scores[at]}점이다. 횟수 칸에 적힌 수는 변량이 아니라 그 점수가 나온 횟수이다.`, facts: { calc: [[String(modeAlt(scores.reduce((all, s, i) => all.concat(Array.from({ length: counts[i] }, () => s)), []))), 0]], rule: 'tableMode' } });
        }
        const total = d.pick([21, 23, 25, 27]), mid = (total + 1) / 2;
        const counts = d.until(() => freqs(d, 5, total, null, { flat: true, hi: 10 }), (f) => { const all = scores.reduce((a, s, i) => a.concat(Array.from({ length: f[i] }, () => s)), []); return nth(all, mid) !== 8 && cumul(f).every((c) => c !== mid - 1); });
        const all = scores.reduce((a, s, i) => a.concat(Array.from({ length: counts[i] }, () => s)), []), med = median(all), cs = cumul(counts);
        return N(`다음은 어느 양궁 선수가 화살을 ${total}번 쏘아 얻은 점수를 조사하여 나타낸 표이다. 이 자료의 중앙값은?`, med, { unit: '점', figure: tbl(['점수(점)', '횟수(회)'], scores.map((s, i) => [s, counts[i]])),
          explain: `변량은 모두 ${total}개이므로 중앙값은 작은 값부터 ${mid}번째 값이다. 낮은 점수부터 횟수를 차례로 더하면 ${cs.join(', ')}이므로 ${mid}번째 값은 ${med}점이다. 표의 가운데 줄에 적힌 8점이 중앙값인 것은 아니다.`, facts: { calc: [[String(nth(all, mid)), 0]], rule: 'tableMedian' } });
      }, { count: 2, standard: STD1 }),
      H('hard-median-newcomer', '변량 하나가 더해진 뒤의 중앙값', '심18', (d) => {
        // 함정: 새 변량이 들어와도 중앙값은 그대로라고 여기는 아이(처음 중앙값), 새 변량과 평균을 내는 아이. 변량이 7개가 되면 중앙값은 4번째 값 하나이다.
        const up = d.bool(), a3 = d.int(60, 74), gap = 2 * d.int(2, 5), a4 = a3 + gap, m = (a3 + a4) / 2, x = up ? a4 + d.int(2, 9) : a3 - d.int(2, 9), ans = up ? a4 : a3;
        return N(`어느 모둠 학생 6명의 수학 점수를 작은 값부터 크기순으로 늘어놓았더니 3번째 점수가 ${a3}점이고 중앙값이 ${m}점이었다. 이 모둠에 수학 점수가 ${x}점인 학생 한 명이 새로 들어올 때, 학생 7명의 수학 점수의 중앙값은?`, ans, { unit: '점',
          explain: `변량이 6개일 때 중앙값은 3번째 값과 4번째 값의 평균이므로 4번째 점수는 2 × ${m} − ${a3} = ${a4}(점)이다. ${x}점은 ${up ? `${a4}점보다 크므로 크기순으로 늘어놓으면 4번째 값은 그대로 ${a4}점이다` : `${a3}점보다 작으므로 크기순으로 늘어놓으면 처음의 3번째 값인 ${a3}점이 4번째 값이 된다`}. 변량이 7개이면 중앙값은 4번째 값이므로 ${ans}점이다.`,
          facts: up ? { calc: [[`2*${m}-${a3}`, 0]], unseen: [2] } : { calc: [[String(a3), 0]] } });
      }, { standard: STD1 }),
      H('hard-median-range', '중앙값 조건에 맞는 수의 범위', '심20', (d) => {
        // 함정: 중앙값과 같은 수는 될 수 없다고 여기는 아이(두 경계의 수를 고른다). 같은 수가 둘이어도 크기순으로 가운데 값이 중앙값이다.
        const p = d.int(4, 9), s = p - d.int(2, 3), q = p + d.int(4, 7), t = q + d.int(3, 5), mid = d.int(p + 1, q - 1), out = d.bool() ? q + d.int(1, 2) : p - 1;
        const options = d.shuffle([p, mid, q, out]), can = (v) => v >= p && v <= q;
        return C(`세 수 ${s}, ${p}, ${V('a')}의 중앙값이 ${p}이고, 세 수 ${q}, ${t}, ${V('a')}의 중앙값이 ${q}일 때, 다음 중 ${V('a')}의 값이 될 수 없는 것은?`, options.map(String), options.indexOf(out), {
          explain: `${s}, ${p}, ${V('a')}의 중앙값이 ${p}이려면 ${V('a')}는 ${nj(p, '과/와')} 같거나 ${p}보다 커야 한다. ${q}, ${t}, ${V('a')}의 중앙값이 ${q}이려면 ${V('a')}는 ${nj(q, '과/와')} 같거나 ${q}보다 작아야 한다. 따라서 ${V('a')}는 ${p} 이상 ${q} 이하인 수이고, ${nj(out, '은/는')} 될 수 없다.`,
          facts: { truth: options.map((v) => !can(v)), want: true } });
      }, { standard: STD1 }),
      H('hard-median-unknowns', '값을 모르는 변량이 있는 자료의 중앙값과 최빈값', '심25', (d) => {
        // 함정: 값을 모르는 변량이 있으면 대푯값을 구할 수 없다고 여기는 아이, x 와 y 를 빼고 남은 7개의 가운데 값(m)을 중앙값으로 답하는 아이.
        //  x, y 가 q 보다 작다는 것만으로 q 보다 작은 변량이 셋으로 정해지므로 5번째 값이 정해진다. x 와 y 는 서로 달라 어떤 값도 세 번 나오게 하지 못한다.
        const [p, q, r, m, t] = d.until(() => srt(many(d, 5, 3, 24)), (l) => new Set(l).size === 5 && l[1] - l[0] >= 2);
        const list = d.until(() => d.shuffle([p, q, r, m, m, m, t, V('x'), V('y')]), (l) => l[4] !== r);
        return M(`다음 자료에서 ${V('x')} ${LT} ${V('y')} ${LT} ${q}일 때, 이 자료의 중앙값과 최빈값은?`, [{ label: '중앙값', answer: r }, { label: '최빈값', answer: m }], { figure: numbers(list),
          explain: `${V('x')}, ${V('y')}는 ${q}보다 작으므로 ${q}보다 작은 변량은 ${p}, ${V('x')}, ${V('y')}의 3개이다. 따라서 4번째 값은 ${q}, 5번째 값은 ${r}이고, 변량이 9개이므로 중앙값은 5번째 값인 ${r}이다. ${nj(m, '은/는')} 3번 나오고 ${V('x')}와 ${V('y')}는 서로 다르므로 3번 넘게 나오는 값은 없다. 최빈값은 ${m}이다.`,
          facts: { calc: [[String(r), 0], [String(m), 1]] } });
      }, { standard: STD1 }),
      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-rep-then', '조건 하나로 빠진 변량을 구한 다음 중앙값 구하기', '심12·14 / 기본 ②5·6', (d, n) => {
        if (n === 0) {
          // 평균 → x → 중앙값
          const c = d.pick([{ what: '수학 점수', unit: '점', lo: 62, hi: 96 }, { what: '줄넘기 횟수', unit: '회', lo: 31, hi: 58 }, { what: '키', unit: 'cm', lo: 148, hi: 169 }]), u = c.unit;
          const full = d.until(() => many(d, 5, c.lo, c.hi), (l) => new Set(l).size === 5 && sum(l) % 5 === 0 && median(l) !== l[3] && !isSorted(l) && l[2] !== median(l)), x = full[3], mean = sum(full) / 5, known = full.filter((v, i) => i !== 3), med = median(full);
          return N(`다음은 학생 5명의 ${wj(c.what, '을/를')} 조사하여 나타낸 자료이다. 이 자료의 평균이 ${amt(mean, u)}일 때, 중앙값은?`, med, { unit: u, figure: dataFig(full.map((v, i) => (i === 3 ? V('x') : v)), u),
            explain: `변량의 총합은 ${mean} × 5 = ${mean * 5}이므로 ${V('x')} = ${mean * 5} − (${known.join(' + ')}) = ${x}이다. 변량을 크기순으로 늘어놓으면 ${srt(full).join(', ')}이므로 중앙값은 3번째 값인 ${amt(med, u)}이다.`, facts: { calc: [[String(nth(full, 3)), 0]], rule: 'meanThen' } });
        }
        // 최빈값 → x → 중앙값. 두 번씩 나온 값이 둘이므로 x 가 그 가운데 하나와 같아야 최빈값이 하나로 정해진다.
        const c = d.pick([{ what: '하루 동안 받은 문자 메시지의 수', unit: '개', lo: 2, hi: 16 }, { what: '턱걸이 횟수', unit: '회', lo: 1, hi: 14 }, { what: '일주일 동안 읽은 책의 수', unit: '권', lo: 1, hi: 12 }]), u = c.unit;
        const known = d.until(() => { const v = d.shuffle(range(c.lo, c.hi)).slice(0, 6); return d.shuffle(v.concat([v[0], v[1]])); }, (l) => { const m = modes(l), a = median(l.concat([m[0]])), b = median(l.concat([m[1]])); return a !== b; });
        const [m1, m2] = d.shuffle(modes(known)), at = d.int(1, 7), shown = known.slice(0, at).concat([V('x')], known.slice(at)), full = known.concat([m1]), med = median(full);
        return N(`다음은 학생 9명의 ${wj(c.what, '을/를')} 조사하여 나타낸 자료이다. 이 자료의 최빈값이 ${amt(m1, u)} 하나뿐일 때, 중앙값은?`, med, { unit: u, figure: dataFig(shown, u),
          explain: `${V('x')}를 뺀 자료에서 ${amt(m1, u)}${ut(u, '과/와')} ${amtj(m2, u, '이/가')} 2번씩 나온다. 최빈값이 ${amt(m1, u)} 하나뿐이려면 ${V('x')} = ${m1}이어야 한다. 변량을 크기순으로 늘어놓으면 ${srt(full).join(', ')}이므로 중앙값은 5번째 값인 ${amt(med, u)}이다.`, facts: { calc: [[String(nth(full, 5)), 0]], rule: 'modeThen' } });
      }, { count: 2, standard: STD1 }),
      H('hard-mean-equals', '평균이 다른 대푯값과 같을 때 빠진 변량 구하기', '심15·17 / 기본 ①10 ②17', (d, n) => {
        if (n === 0) {
          // 최빈값은 x 가 무엇이든 정해져 있다(세 번 나온 값). 평균 = 최빈값에서 x 를 구한다.
          const [mo, known, x] = d.until(() => { const m = d.int(6, 14), rest = d.shuffle(range(1, 22).filter((v) => v !== m)).slice(0, 4), k = d.shuffle([m, m, m].concat(rest)); return [m, k, 8 * m - sum(k)]; }, ([m, k, v]) => v >= 1 && v <= 25 && v !== m && !k.includes(v));
          const at = d.int(1, 6), shown = known.slice(0, at).concat([V('x')], known.slice(at));
          return N(`다음 8개의 변량의 평균과 최빈값이 서로 같을 때, ${V('x')}의 값은?`, x, { figure: numbers(shown),
            explain: `${nj(mo, '이/가')} 3번 나오고 나머지는 한 번씩 나오므로 ${V('x')}의 값에 관계없이 최빈값은 ${mo}이다. 평균도 ${mo}이므로 변량의 총합은 8 × ${mo} = ${8 * mo}이고, ${V('x')} = ${8 * mo} − (${known.join(' + ')}) = ${x}이다.`, facts: { calc: [[`8*${mo}-(${known.join('+')})`, 0]] } });
        }
        // 크기순으로 놓인 자료: 중앙값은 3번째 값과 4번째 값의 평균으로 정해져 있다. 평균 = 중앙값에서 x 를 구한다.
        const [known, med, x] = d.until(() => { const k = srt(d.shuffle(range(2, 20)).slice(0, 5)), m = (k[2] + k[3]) / 2; return [k, m, 6 * m - sum(k)]; }, ([k, m, v]) => Number.isInteger(m) && v > k[4] && v <= 32);
        return N(`다음은 변량 6개를 작은 값부터 크기순으로 늘어놓은 것이다. 이 자료의 평균과 중앙값이 서로 같을 때, ${V('x')}의 값은?`, x, { figure: numbers(known.concat([V('x')])),
          explain: `중앙값은 3번째 값과 4번째 값의 평균이므로 (${known[2]} + ${known[3]}) ÷ 2 = ${med}이다. 평균도 ${med}이므로 변량의 총합은 6 × ${med} = ${6 * med}이고, ${V('x')} = ${6 * med} − (${known.join(' + ')}) = ${x}이다.`, facts: { calc: [[`6*(${known[2]}+${known[3]})/2-(${known.join('+')})`, 0]], unseen: [2] } });
      }, { count: 2, standard: STD1 }),
      H('hard-median-missing', '크기순으로 놓이지 않은 자료에서 중앙값으로 빠진 변량 구하기', '기본 ①9', (d) => {
        // x 가 어느 자리에 오는지부터 따져야 한다: x 를 뺀 다섯 수의 3번째 값(a3)과 4번째 값(a4) 사이에 올 때만 중앙값이 (a3 + x) ÷ 2 가 된다.
        const k = d.until(() => srt(d.shuffle(range(2, 24)).slice(0, 5)), (l) => l[3] - l[2] >= 3), x = d.int(k[2] + 1, k[3] - 1), m = (k[2] + x) / 2;
        const shown = d.until(() => d.shuffle(k.concat([V('x')])), (l) => typeof l[0] === 'number' && typeof l[5] === 'number');
        return N(`다음 자료의 중앙값이 ${fx(m)}일 때, ${V('x')}의 값은?`, x, { figure: numbers(shown),
          explain: `${V('x')}를 뺀 변량을 크기순으로 늘어놓으면 ${k.join(', ')}이다. 변량이 6개이므로 중앙값은 3번째 값과 4번째 값의 평균이다. ${V('x')}가 ${k[2]} 이하이면 중앙값은 ${k[2]} 이하이고, ${V('x')}가 ${k[3]} 이상이면 중앙값은 (${k[2]} + ${k[3]}) ÷ 2 = ${fx((k[2] + k[3]) / 2)}이므로 ${V('x')}는 ${nj(k[2], '과/와')} ${k[3]} 사이의 수이다. (${k[2]} + ${V('x')}) ÷ 2 = ${fx(m)}에서 ${V('x')} = ${x}이다.`, facts: { calc: [[`2*${fx(m)}-${k[2]}`, 0]], unseen: [2] } });
      }, { standard: STD1 }),
      H('hard-median-merge', '중앙값으로 빠진 변량을 구한 다음 두 자료를 합한 자료의 중앙값 구하기', '심19', (d) => {
        const made = d.until(() => {
          const [p, q, r] = srt(d.shuffle(range(3, 26)).slice(0, 3)), a = d.int(q + 1, Math.max(q + 1, r - 1)), other = d.shuffle(range(2, 28).filter((v) => ![p, q, r, a].includes(v))).slice(0, 4);
          return { p, q, r, a, other, all: srt([p, q, r, a].concat(other)) };
        }, (x) => x.r - x.q >= 3 && x.a < x.r && [x.all[3], x.all[4]].includes(x.a) && (x.all[3] + x.all[4]) % 2 === 1);
        const { p, q, r, a, other, all } = made, mA = (q + a) / 2, nbr = all[3] === a ? all[4] : all[3], med = (all[3] + all[4]) / 2;
        const A = d.until(() => d.shuffle([p, q, r, V('a')]), (l) => typeof l[0] === 'number');
        return D(`자료 A의 중앙값이 ${fx(mA)}일 때, 두 자료 A, B를 합한 전체 자료의 중앙값은?`, med, { figure: tagged([A.join(', '), other.join(', ')], ['A', 'B']),
          explain: `자료 A에서 ${V('a')}를 뺀 수를 크기순으로 늘어놓으면 ${p}, ${q}, ${r}이다. 중앙값이 ${fx(mA)}이려면 ${V('a')}는 ${nj(q, '과/와')} ${r} 사이의 수이고 (${q} + ${V('a')}) ÷ 2 = ${fx(mA)}에서 ${V('a')} = ${a}이다. 두 자료를 합하여 크기순으로 늘어놓으면 ${all.join(', ')}이므로 중앙값은 4번째 값과 5번째 값의 평균인 (${all[3]} + ${all[4]}) ÷ 2 = ${fx(med)}이다.`,
          facts: { calc: [[`((2*${fx(mA)}-${q})+${nbr})/2`, 0]], unseen: [2] } });
      }, { standard: STD1 }),

      // ══ 줄기와 잎 그림 ══
      H('hard-stem-partial', '일부만 보이는 줄기와 잎 그림에서 전체 수를 구한 다음 비율 구하기', '심31 / 기본 ②35', (d) => {
        // ② 한 줄기의 잎의 수와 그 비율로 전체 수를 구한 다음, 보이는 부분에서 기준 미만인 수의 비율을 구한다. 보이는 잎만 센 수를 전체로 삼으면 틀린다.
        const c = d.pick(STEMS.filter((x) => x.stems[0] >= 1 && x.stems[0] < 10)), s0 = d.pick(c.stems), u = c.unit, [c3, q] = d.pick([[5, 4], [4, 5], [5, 5]]), total = c3 * q;
        const data = d.until(() => stemData(d, s0, [d.int(3, 4), d.int(4, 5), c3]), (x) => { const r = x.rows[1][1]; return r[2] > r[1] && r[1] > r[0] && x.values.length < total - 2; });
        const t = data.rows[1][0] * 10 + data.rows[1][1][2], below = data.values.filter((v) => v < t).length, p = pctOf(below, total), s3 = data.rows[2][0];
        return N(`다음은 어느 반 학생들의 ${wj(c.what, '을/를')} 조사하여 나타낸 줄기와 잎 그림인데 아래쪽이 찢어져 줄기가 ${s3}인 줄까지만 보인다. 줄기가 ${s3}인 학생이 전체의 ${frac(1, q)}일 때, ${wj(c.what, '이/가')} ${amt(t, u)} 미만인 학생은 전체의 몇 %인가?`, p, { unit: ' %', figure: stemFig(data.rows, { unit: u, torn: true }),
          explain: `줄기가 ${s3}인 학생은 잎의 수와 같은 ${c3}명이고 전체의 ${frac(1, q)}이므로 전체 학생은 ${c3} × ${q} = ${total}(명)이다. ${amt(t, u)} 미만인 학생은 ${below}명이므로 ${below} ÷ ${total} × 100 = ${p}(%)이다.`, facts: { calc: [[`100*${below}/(${c3}*${q})`, 0]], unseen: [100, below, c3] } });
      }, { standard: STD2 }),

      // ══ 도수분포표 ══
      H('hard-nth-class', '몇 번째인 변량이 속하는 계급', '심34 / 기본 ①34·42·51·74 ②47·66', (d, n) => {
        // ① 끝에서부터 도수를 쌓아야 한다. 함정 — 차례 0: 「n번째로 큰」을 표의 위쪽(작은 값 쪽)부터 세는 아이. 차례 1: 달리기 기록은 작을수록 빠른데 큰 값 쪽부터 세는 아이.
        //  차례 2: 상대도수를 도수로 바꾸지 않고 세는 아이(상대도수에 도수의 총합을 곱해야 학생 수가 된다).
        const pickRank = (f, fromBig) => { const order = fromBig ? f.slice().reverse() : f, cs = cumul(order), wrong = cumul(order.slice().reverse()); return range(4, Math.floor(sum(f) / 2)).filter((r) => { const a = cs.findIndex((v) => v >= r), b = f.length - 1 - wrong.findIndex((v) => v >= r); return a >= 1 && a !== b; }); };
        const classOf = (f, r, fromBig) => { const order = fromBig ? f.slice().reverse() : f, a = cumul(order).findIndex((v) => v >= r); return fromBig ? f.length - 1 - a : a; };
        if (n === 0) {
          const g = newGrp(d, { total: d.pick([30, 32, 35, 40]), ok: (f) => pickRank(f, true).length > 0 }), r = d.pick(pickRank(g.f, true)), at = classOf(g.f, r, true), back = g.f.slice().reverse(), cs = cumul(back);
          return C(`${introG(g, '도수분포표')} ${wj(g.c.what, '이/가')} ${r}번째로 ${g.c.big} 학생이 속하는 계급은?`, classOptions(g), at, { figure: ftab(g),
            explain: `${wj(g.c.what, '이/가')} ${g.c.big} 쪽 계급부터 도수를 차례로 더하면 ${cs.slice(0, g.k - at).join(', ')}이다. ${r}번째 학생은 ${g.cls(at)}인 계급에 속한다.`, facts: { truth: range(0, g.k - 1).map((i) => i === at), want: true } });
        }
        if (n === 1) {
          const g = newGrp(d, { c: RUN, k: 6, total: d.pick([28, 30, 32, 36]), hi: 11, ok: (f) => pickRank(f, false).length > 0 }), r = d.pick(pickRank(g.f, false)), at = classOf(g.f, r, false), cs = cumul(g.f);
          return C(`${introG(g, '도수분포다각형')} 기록이 ${r}번째로 빠른 학생이 속하는 계급은?`, classOptions(g), at, { figure: polyFig(g),
            explain: `달리기는 기록이 작을수록 빠르다. 기록이 작은 쪽 계급부터 도수를 차례로 더하면 ${cs.slice(0, at + 1).join(', ')}이므로 ${r}번째로 빠른 학생은 ${g.cls(at)}인 계급에 속한다.`, facts: { truth: range(0, g.k - 1).map((i) => i === at), want: true } });
        }
        const total = d.pick([50, 100]), ranks = (rr) => { const f = rr.map((v) => total * v / 100); return pickRank(f, false).filter((v) => v > f[0]); };
        const g = relGrp(d, { total, k: 6, ok: (rr) => rr[0] <= 10 && ranks(rr).length > 0 }), r = d.pick(ranks(g.r)), at = classOf(g.f, r, false), cs = cumul(g.f);
        return C(`${introR(g, '그래프')} ${wj(g.c.what, '이/가')} ${r}번째로 ${g.c.small} 학생이 속하는 계급은?`, classOptions(g), at, { figure: relFig(g, g.r),
          explain: `각 계급의 도수는 ${g.total} × (상대도수)이므로 ${wj(g.c.what, '이/가')} ${g.c.small} 쪽 계급부터 차례로 ${g.f.slice(0, at + 1).join(', ')}명이다. 이를 차례로 더하면 ${cs.slice(0, at + 1).join(', ')}이므로 ${r}번째 학생은 ${g.cls(at)}인 계급에 속한다.`, facts: { truth: range(0, g.k - 1).map((i) => i === at), want: true } });
      }, { count: 3, standard: STD2 }),
      H('hard-unknowable', '도수분포표·히스토그램에서 알 수 있는 것과 알 수 없는 것', '심32·38 / 기본 ①35·46', (d, n) => {
        // ① 표와 히스토그램에는 낱낱의 값이 남지 않는다. 함정: 마지막 계급의 끝 값을 가장 큰 변량이라고 여기는 아이, 「이하」도 「미만」처럼 셀 수 있다고 여기는 아이,
        //  계급 안의 한 값(가운데 값)을 가진 학생 수가 그 계급의 도수라고 여기는 아이.
        const g = newGrp(d, { total: d.pick([28, 30, 32, 36]), hi: 11, ctx: GC.filter((c) => c.frames.every((f) => f[1] >= 2)) }), c = g.c, u = g.u, what = wj(c.what, '이/가'), j = d.int(2, g.k - 2), t = g.at(j), v = inside(g, 1);
        const cant = [['가장 큰 변량', `가장 큰 변량이 ${g.cls(g.k - 1)}인 계급에 있다는 것만 알 수 있다.`], ['가장 작은 변량', `가장 작은 변량이 ${g.cls(0)}인 계급에 있다는 것만 알 수 있다.`], [`${what} ${amt(t, u)} 이하인 학생 수`, `${what} 꼭 ${amt(t, u)}인 학생이 몇 명인지 알 수 없으므로 ${amt(t, u)} 이하인 학생 수는 알 수 없다.`], [`${what} 꼭 ${amt(v, u)}인 학생 수`, `${amtj(v, u, '이/가')} 속하는 계급의 도수만 알 수 있다.`]];
        const can = [[`${what} ${amt(t, u)} 미만인 학생 수`, `${amt(t, u)} 미만인 학생은 ${g.f.slice(0, j).join(' + ')} = ${g.below(j)}(명)이다.`], [`${what} ${amt(v, u)}인 학생이 속하는 계급의 도수`, `${amtj(v, u, '은/는')} ${g.cls(1)}인 계급에 속하고 그 도수는 ${g.f[1]}명이다.`], ['계급의 크기', `계급의 크기는 ${amt(g.size, u)}이다.`], [`${what} ${amt(t, u)} 이상인 학생 수`, `${amt(t, u)} 이상인 학생은 ${g.f.slice(j).join(' + ')} = ${g.above(j)}(명)이다.`]];
        const rows = n === 0 ? d.shuffle(d.shuffle(can).slice(0, 3).map((r) => [r[0], false, r[1]]).concat([d.pick(cant)].map((r) => [r[0], true, r[1]]))) : d.shuffle(d.shuffle(cant).slice(0, 3).map((r) => [r[0], false, r[1]]).concat([d.pick(can.slice(0, 2))].map((r) => [r[0], true, r[1]])));
        const at = rows.findIndex((r) => r[1]);
        return C(n === 0 ? `${introG(g, '도수분포표')} 다음 중 이 표에서 알 수 없는 것은?` : `${introG(g, '히스토그램')} 다음 중 이 히스토그램에서 알 수 있는 것은?`, rows.map((r) => r[0]), at, { figure: n === 0 ? ftab(g) : histFig(g),
          explain: n === 0 ? `도수분포표에서는 각 계급에 속하는 변량의 개수만 알 수 있고 낱낱의 변량은 알 수 없다. ${rows[at][2]}` : `히스토그램에서는 각 계급에 속하는 변량의 개수만 알 수 있고 낱낱의 변량은 알 수 없다. ${rows[at][2]}`, facts: { truth: rows.map((r) => r[1]), want: true } });
      }, { count: 2, standard: STD2 }),
      H('hard-minmax-count', '계급 안의 값을 몰라 생기는 가장 많은 경우와 가장 적은 경우', '심37', (d) => {
        // ① 표에는 계급 안의 낱낱의 값이 남지 않는다. 기준이 계급의 가운데에 있으면 그 계급의 학생이 모두 기준 미만일 수도, 한 명도 아닐 수도 있다.
        const g = newGrp(d, { total: d.pick([25, 28, 30, 32]), ctx: GC.filter((c) => c.frames.every((f) => f[1] >= 5)) }), j = d.int(1, g.k - 2), v = g.at(j) + d.int(2, g.size - 2), u = g.u;
        return M(`${introG(g, '도수분포표')} ${wj(g.c.what, '이/가')} ${amt(v, u)} 미만인 학생은 가장 많을 때 몇 명이고, 가장 적을 때 몇 명인가?`, [{ label: '가장 많을 때', answer: g.below(j + 1), unit: '명' }, { label: '가장 적을 때', answer: g.below(j), unit: '명' }], { figure: ftab(g),
          explain: `${amtj(v, u, '은/는')} ${g.cls(j)}인 계급에 속한다. 이 계급의 ${g.f[j]}명이 모두 ${amt(v, u)} 미만이면 ${g.f.slice(0, j + 1).join(' + ')} = ${g.below(j + 1)}(명)으로 가장 많고, 모두 ${amt(v, u)} 이상이면 ${g.f.slice(0, j).join(' + ')}${j === 1 ? '' : ' = ' + g.below(j)}(명)으로 가장 적다.`, facts: { calc: [[g.f.slice(0, j + 1).join('+'), 0], [g.f.slice(0, j).join('+'), 1]] } });
      }, { standard: STD2 }),
      H('hard-regroup', '계급의 크기를 바꾸어 다시 정리하기', '기본 ①43 ②49', (d) => {
        // ② 이웃한 두 계급씩 묶어 도수를 더한 다음 가장 큰 것을 찾는다. 가장 높은 두 막대는 서로 다른 묶음에 든다(그 둘을 더하면 틀린다).
        const pairs = (f) => [f[0] + f[1], f[2] + f[3], f[4] + f[5]], best2 = (f) => Math.max(f[1] + f[2], f[3] + f[4]);
        const g = newGrp(d, { ctx: GC.filter((c) => c.frames.some((f) => f[1] >= 5)), k: 6, total: d.pick([30, 32, 36, 40]), hi: 12, ok: (f) => uniqueMax(pairs(f)) && best2(f) > Math.max(...pairs(f)) }), ps = pairs(g.f), at = ps.indexOf(Math.max(...ps)), u = g.u;
        return N(`${introG(g, '히스토그램')} 이 자료를 ${amt(g.lo, u)}부터 계급의 크기를 ${amtj(2 * g.size, u, '으로/로')} 하여 다시 정리할 때, 도수가 가장 큰 계급의 도수는?`, ps[at], { unit: '명', figure: histFig(g),
          explain: `계급의 크기가 ${amt(2 * g.size, u)}이면 계급은 ${range(0, 2).map((i) => `${amt(g.at(2 * i), u)} 이상 ${amt(g.at(2 * i + 2), u)} 미만`).join(', ')}이고, 도수는 차례로 ${range(0, 2).map((i) => `${g.f[2 * i]} + ${g.f[2 * i + 1]} = ${ps[i]}`).join(', ')}이다. 가장 큰 도수는 ${ps[at]}명이다.`, facts: { calc: [[`${g.f[2 * at]}+${g.f[2 * at + 1]}`, 0]] } });
      }, { standard: STD2 }),

      // ══ 히스토그램과 도수분포다각형 ══
      H('hard-class-count', '도수분포다각형과 도수가 0인 계급이 있는 히스토그램에서 계급의 개수', '기본 ①49 ②52·53·63·70', (d, n) => {
        // ① 함정 — 차례 0: 꺾은선의 점을 모두 세거나(양 끝의 가로축 위 점까지) 가로축에 적힌 수를 세는 아이. 차례 1: 직사각형의 수만 세어 도수가 0인 계급을 빠뜨리는 아이.
        if (n === 0) {
          const g = newGrp(d, { total: d.pick([24, 26, 30]), hi: 10 });
          return N(`${introG(g, '도수분포다각형')} 계급의 개수는?`, g.k, { unit: '개', figure: polyFig(g), explain: `계급은 ${g.cls(0)}부터 ${g.cls(g.k - 1)}까지 ${g.k}개이다. 꺾은선의 양 끝에 있는 가로축 위의 두 점은 그림을 그리려고 더한 도수가 0인 계급의 점이므로 세지 않는다.`, facts: { calc: [[String(g.k), 0]], unseen: [g.k], rule: 'polyCount' } });
        }
        const total = d.pick([20, 24, 26]), zero = d.int(2, 3), g = newGrp(d, { total, k: 6, lo: 0, hi: 10, flat: true, ok: (f) => f.filter((v) => v === 0).length === 1 && f[zero] === 0 });
        return N(`${introG(g, '히스토그램')} 계급의 개수는?`, g.k, { unit: '개', figure: histFig(g), explain: `${g.cls(zero)}인 계급은 도수가 0이어서 직사각형이 없지만 계급이다. 계급은 ${g.cls(0)}부터 ${g.cls(g.k - 1)}까지 ${g.k}개이다.`, facts: { calc: [[String(g.k), 0]], unseen: [g.k], rule: 'zeroCount' } });
      }, { count: 2, standard: STD2 }),
      H('hard-area', '히스토그램의 직사각형의 넓이와 도수분포다각형의 넓이', '심39·40·41 / 기본 ①45·53', (d, n) => {
        // ① 직사각형의 넓이는 도수에 정비례하고, 넓이의 합은 (계급의 크기) × (도수의 총합)이다. 도수분포다각형과 가로축으로 둘러싸인 넓이는 히스토그램의 넓이의 합과 같다.
        //  함정 — 넓이를 구하려면 길이를 자로 재야 한다고 여기는 아이, 도수의 총합만 답하는 아이(계급의 크기를 곱하지 않는다), 다각형을 삼각형으로 쪼개려는 아이.
        if (n === 3) {
          const size = d.pick([2, 4, 5, 10, 20]), total = d.pick([24, 28, 32, 34, 36, 45]);
          return N(`계급의 크기가 ${size}인 히스토그램에서 직사각형의 넓이의 합이 ${size * total}일 때, 도수의 총합은?`, total, { explain: `직사각형의 넓이의 합은 (계급의 크기) × (도수의 총합)이므로 도수의 총합은 ${size * total} ÷ ${size} = ${total}이다.`, facts: { calc: [[`${size * total}/${size}`, 0]] } });
        }
        if (n === 0) {
          const g = newGrp(d, { total: d.pick([24, 26, 28, 30]), hi: 10, ok: (f) => f.some((v, i) => f.some((w, j) => i !== j && w >= 2 && v > w && v % w === 0)) });
          const [a, b] = d.pick(range(0, g.k - 1).reduce((all, i) => all.concat(range(0, g.k - 1).filter((j) => i !== j && g.f[j] >= 2 && g.f[i] > g.f[j] && g.f[i] % g.f[j] === 0).map((j) => [i, j])), []));
          return N(`${introG(g, '히스토그램')} ${g.cls(a)}인 계급을 나타내는 직사각형의 넓이는 ${g.cls(b)}인 계급을 나타내는 직사각형의 넓이의 몇 배인가?`, g.f[a] / g.f[b], { unit: '배', figure: histFig(g),
            explain: `직사각형의 가로의 길이는 계급의 크기로 모두 같으므로 넓이는 세로의 길이인 도수에 정비례한다. 두 계급의 도수가 ${g.f[a]}, ${g.f[b]}이므로 넓이는 ${g.f[a]} ÷ ${g.f[b]} = ${g.f[a] / g.f[b]}(배)이다.`, facts: { calc: [[`${g.f[a]}/${g.f[b]}`, 0]] } });
        }
        const g = newGrp(d, { total: d.pick([20, 24, 25, 30]), k: 5, hi: 10 }), area = g.size * g.total, expr = `(${g.at(1)}-${g.at(0)})*(${g.f.join('+')})`;
        if (n === 1) return N(`${introG(g, '히스토그램', { noTotal: true })} 히스토그램의 직사각형의 넓이의 합은?`, area, { figure: histFig(g), explain: `직사각형의 가로의 길이는 계급의 크기인 ${g.size}이고 세로의 길이는 도수이므로 넓이의 합은 (계급의 크기) × (도수의 총합) = ${g.size} × (${g.f.join(' + ')}) = ${g.size} × ${g.total} = ${area}이다.`, facts: { calc: [[expr, 0]] } });
        return N(`${introG(g, '도수분포다각형', { noTotal: true })} 도수분포다각형과 가로축으로 둘러싸인 부분의 넓이는?`, area, { figure: polyFig(g), explain: `도수분포다각형과 가로축으로 둘러싸인 부분의 넓이는 히스토그램의 직사각형의 넓이의 합과 같다. 계급의 크기는 ${g.size}, 도수의 총합은 ${g.f.join(' + ')} = ${g.total}이므로 넓이는 ${g.size} × ${g.total} = ${area}이다.`, facts: { calc: [[expr, 0]] } });
      }, { count: 4, standard: STD2 }),
      H('hard-top-percent', '끝에서부터 쌓아 전체의 몇 % 이내에 드는 기준 찾기', '심42·63 / 기본 ②56·67·78', (d, n) => {
        // ② 백분율을 학생 수로 바꾸고(또는 상대도수의 합으로 보고), 좋은 쪽 끝에서부터 쌓아 기준이 되는 경계값을 찾는다. 차례 1은 기록이 작을수록 좋다.
        const cuts = (f, total, fromBig) => range(2, f.length - 2).filter((j) => { const part = fromBig ? sum(f.slice(j)) : sum(f.slice(0, j)); return [10, 20, 25, 30, 40].includes(pctOf(part, total)); });
        if (n === 0) {
          const total = d.pick([20, 40]), g = newGrp(d, { c: SCORE, k: 5, total, hi: total === 20 ? 9 : 16, ok: (f) => cuts(f, total, true).length > 0 }), j = d.pick(cuts(g.f, total, true)), part = g.f.slice(j), p = pctOf(sum(part), total);
          return N(`${introG(g, '히스토그램')} 수학 점수가 높은 쪽에서 전체의 ${p} % 이내에 들려면 적어도 몇 점이어야 하는가?`, g.at(j), { unit: '점', figure: histFig(g),
            explain: `전체의 ${p} %는 ${total} × ${p} ÷ 100 = ${sum(part)}(명)이다. 점수가 높은 쪽 계급부터 도수를 차례로 더하면 ${cumul(part.slice().reverse()).join(', ')}이므로 ${sum(part)}번째까지의 학생은 ${amt(g.at(j), '점')} 이상인 계급에 속한다. 따라서 적어도 ${g.at(j)}점이어야 한다.`, facts: { calc: [[String(g.at(j)), 0]], rule: 'topScore' } });
        }
        if (n === 1) {
          const total = d.pick([20, 40]), g = newGrp(d, { c: RUN, k: 6, total, hi: total === 20 ? 8 : 14, ok: (f) => cuts(f, total, false).length > 0 }), j = d.pick(cuts(g.f, total, false)), part = g.f.slice(0, j), p = pctOf(sum(part), total);
          return N(`${introG(g, '도수분포다각형')} 기록이 빠른 쪽에서 전체의 ${p} % 이내에 들려면 기록이 몇 초 미만이어야 하는가?`, g.at(j), { unit: '초', figure: polyFig(g),
            explain: `전체의 ${p} %는 ${total} × ${p} ÷ 100 = ${sum(part)}(명)이다. 달리기는 기록이 작을수록 빠르므로 기록이 작은 쪽 계급부터 도수를 차례로 더하면 ${cumul(part).join(', ')}이다. ${sum(part)}번째까지의 학생은 ${amt(g.at(j), '초')} 미만인 계급에 속하므로 기록이 ${g.at(j)}초 미만이어야 한다.`, facts: { calc: [[String(g.at(j)), 0]], rule: 'topRun' } });
        }
        const g = relGrp(d, { total: 50, k: 5, ok: (r) => [20, 24, 28, 30, 32, 36, 40].includes(r[3] + r[4]) && r[4] !== r[3] }), p = g.r[3] + g.r[4], u = g.u;
        return N(`${introR(g, '상대도수의 분포표', true)} ${wj(g.c.what, '이/가')} ${g.c.big} 쪽에서 전체의 ${p} % 이내에 들려면 ${wj(g.c.what, '이/가')} 적어도 얼마 이상이어야 하는가?`, g.at(3), { unit: u, figure: relTab(g),
          explain: `전체의 ${p} %는 상대도수의 합이 ${r2(p)}인 것과 같다. ${g.c.big} 쪽 계급부터 상대도수를 차례로 더하면 ${r2(g.r[4])}, ${r2(g.r[4])} + ${r2(g.r[3])} = ${r2(p)}이므로 ${amt(g.at(3), u)} 이상이어야 한다.`, facts: { calc: [[String(g.at(3)), 0]], rule: 'topRel' } });
      }, { count: 3, standard: STD2 }),
      H('hard-no-scale', '세로축의 눈금의 수가 없는 히스토그램', '심43', (d) => {
        // ② 직사각형의 높이(칸 수)는 도수에 정비례한다. 칸 수의 합이 도수의 총합에 해당하므로 한 칸이 나타내는 도수부터 구한다. 칸 수를 그대로 도수로 답하면 틀린다.
        const c = d.pick(GC), [lo, size] = frameOf(d, c, 5), h = freqs(d, 5, d.pick([15, 20, 25]), (f) => uniqueMax(f), { hi: 9 }), per = d.pick([2, 3, 4]), g = grp(c, lo, size, h), total = per * sum(h), top = Math.max(...h);
        return N(`다음은 어느 학교 학생 ${total}명의 ${wj(c.what, '을/를')} 조사하여 나타낸 히스토그램인데 세로축의 눈금의 수가 지워졌다. 도수가 가장 큰 계급의 도수는?`, per * top, { unit: '명', figure: chart({ g, bars: h, noScale: true }),
          explain: `직사각형의 높이는 차례로 ${h.join(', ')}칸이고 모두 ${sum(h)}칸이다. 높이는 도수에 정비례하므로 한 칸은 ${total} ÷ ${sum(h)} = ${per}(명)을 나타낸다. 가장 높은 직사각형은 ${top}칸이므로 그 도수는 ${per} × ${top} = ${per * top}(명)이다.`, facts: { calc: [[`${total}/(${h.join('+')})*${top}`, 0]] } });
      }, { standard: STD2 }),
      H('hard-torn-then-percent', '찢어진 도수분포다각형에서 가려진 도수를 구한 다음 비율 구하기', '기본 ①54 ②68', (d) => {
        // ② 도수의 총합에서 보이는 도수를 빼어 가려진 도수를 구한 다음, 가려진 계급이 낀 범위의 비율을 구한다.
        const total = d.pick([20, 25, 40, 50]), j = d.int(2, 3), g = newGrp(d, { total, k: 5, hi: total <= 25 ? 10 : 16, ok: (f) => f[j] >= 4 && Number.isInteger(pctOf(f[j - 1] + f[j], total)) }), rest = g.f.filter((v, i) => i !== j), p = pctOf(g.f[j - 1] + g.f[j], total), u = g.u;
        return N(`${introG(g, '도수분포다각형')} 그림의 일부가 찢어져 ${g.cls(j)}인 계급의 도수가 보이지 않는다. ${wj(g.c.what, '이/가')} ${amt(g.at(j - 1), u)} 이상 ${amt(g.at(j + 1), u)} 미만인 학생은 전체의 몇 %인가?`, p, { unit: ' %', figure: polyFig(g, { torn: [j] }),
          explain: `보이지 않는 도수는 ${total} − (${rest.join(' + ')}) = ${g.f[j]}(명)이다. ${amt(g.at(j - 1), u)} 이상 ${amt(g.at(j + 1), u)} 미만인 학생은 ${g.f[j - 1]} + ${g.f[j]} = ${g.f[j - 1] + g.f[j]}(명)이므로 ${g.f[j - 1] + g.f[j]} ÷ ${total} × 100 = ${p}(%)이다.`, facts: { calc: [[`100*(${g.f[j - 1]}+${total}-(${rest.join('+')}))/${total}`, 0]], unseen: [100] } });
      }, { standard: STD2 }),
      H('hard-torn-percent', '찢어진 그래프에서 비율로 한 도수를 구한 다음 나머지 도수 구하기', '심44 / 기본 ②58·69', (d) => {
        // ② 가려진 두 계급 가운데 하나를 전체에 대한 비율로 구하고, 도수의 총합에서 빼어 나머지 하나를 구한다.
        const total = d.pick([20, 25, 40, 50]), bar = d.bool(), g = newGrp(d, { total, k: 6, hi: total <= 25 ? 9 : 15, ok: (f) => f[2] >= 4 && f[3] >= 4 && f[2] !== f[3] && [10, 20, 24, 25, 30, 32, 36, 40].includes(pctOf(f[2], total)) }), vis = g.f.filter((v, i) => i !== 2 && i !== 3), p = pctOf(g.f[2], total);
        return N(`${introG(g, bar ? '히스토그램' : '도수분포다각형')} 그림의 일부가 찢어져 두 계급의 도수가 보이지 않는다. ${wj(g.c.what, '이/가')} ${g.cls(2)}인 학생이 전체의 ${p} %일 때, ${g.cls(3)}인 학생은 몇 명인가?`, g.f[3], { unit: '명', figure: (bar ? histFig : polyFig)(g, { torn: [2, 3] }),
          explain: `${g.cls(2)}인 학생은 ${total} × ${p} ÷ 100 = ${g.f[2]}(명)이다. 도수의 총합이 ${total}이므로 ${g.cls(3)}인 학생은 ${total} − (${vis.join(' + ')}) − ${g.f[2]} = ${g.f[3]}(명)이다.`, facts: { calc: [[`${total}-(${vis.join('+')})-${total}*${p}/100`, 0]], unseen: [100] } });
      }, { standard: STD2 }),
      H('hard-torn-total', '찢어진 그래프에서 비율로 도수의 총합부터 구하기', '심36·45 / 기본 ①47·56', (d, n) => {
        // ② 도수의 총합이 주어지지 않았다. 차례 0: 보이는 한 계급의 비율로 총합을 구한다. 차례 1: 「기준 이상」에 가려진 계급이 끼어 있으므로 보이는 「기준 미만」 쪽의 비율로 총합을 구한다.
        //  보이는 도수만 더한 것을 전체로 삼으면 틀린다.
        const total = d.pick([20, 25, 40, 50]);
        if (n === 0) {
          const g = newGrp(d, { total, k: 5, hi: total <= 25 ? 10 : 16, ok: (f) => f[2] >= 4 && [10, 20, 25, 40].includes(pctOf(f[1], total)) }), rest = g.f.filter((v, i) => i !== 2), p = pctOf(g.f[1], total);
          return N(`${introG(g, '도수분포다각형', { noTotal: true })} 그림의 일부가 찢어져 ${g.cls(2)}인 계급의 도수가 보이지 않는다. ${wj(g.c.what, '이/가')} ${g.cls(1)}인 학생이 전체의 ${p} %일 때, 보이지 않는 계급의 도수는?`, g.f[2], { unit: '명', figure: polyFig(g, { torn: [2] }),
            explain: `${g.cls(1)}인 학생 ${g.f[1]}명이 전체의 ${p} %이므로 전체 학생은 ${g.f[1]} × 100 ÷ ${p} = ${total}(명)이다. 보이지 않는 도수는 ${total} − (${rest.join(' + ')}) = ${g.f[2]}(명)이다.`, facts: { calc: [[`${g.f[1]}*100/${p}-(${rest.join('+')})`, 0]], unseen: [100] } });
        }
        const g = newGrp(d, { total, k: 5, hi: total <= 25 ? 10 : 16, ok: (f) => f[2] >= 4 && [50, 60, 75, 80].includes(pctOf(f[2] + f[3] + f[4], total)) }), low = g.f.slice(0, 2), rest = g.f.filter((v, i) => i !== 2), p = pctOf(sum(g.f.slice(2)), total), u = g.u;
        return N(`${introG(g, '히스토그램', { noTotal: true })} 그림의 일부가 찢어져 ${g.cls(2)}인 계급의 도수가 보이지 않는다. ${wj(g.c.what, '이/가')} ${amt(g.at(2), u)} 이상인 학생이 전체의 ${p} %일 때, 보이지 않는 계급의 도수는?`, g.f[2], { unit: '명', figure: histFig(g, { torn: [2] }),
          explain: `${amt(g.at(2), u)} 미만인 학생 ${low.join(' + ')} = ${sum(low)}(명)이 전체의 100 − ${p} = ${100 - p}(%)이므로 전체 학생은 ${sum(low)} × 100 ÷ ${100 - p} = ${total}(명)이다. 보이지 않는 도수는 ${total} − (${rest.join(' + ')}) = ${g.f[2]}(명)이다.`, facts: { calc: [[`(${low.join('+')})*100/(100-${p})-(${rest.join('+')})`, 0]], unseen: [100] } });
      }, { count: 2, standard: STD2 }),
      H('hard-torn-diff', '찢어진 그래프에서 가려진 두 도수의 관계로 도수 구하기', '심46·47 / 기본 ①57 ②59', (d, n) => {
        // ② 가려진 두 도수의 합을 도수의 총합에서 구한 다음, 둘 사이의 관계(차례 0: 차, 차례 1: 비) 하나로 나눈다.
        const total = d.pick([30, 35, 40]);
        if (n === 0) {
          const g = newGrp(d, { total, k: 6, hi: 14, ok: (f) => f[2] >= 4 && f[3] > f[2] && f[3] - f[2] <= 6 }), vis = g.f.filter((v, i) => i !== 2 && i !== 3), gap = g.f[3] - g.f[2], both = g.f[2] + g.f[3];
          return N(`${introG(g, '히스토그램')} 그림의 일부가 찢어져 두 계급의 도수가 보이지 않는다. ${wj(g.c.what, '이/가')} ${g.cls(3)}인 학생이 ${g.cls(2)}인 학생보다 ${gap}명 더 많을 때, ${g.cls(2)}인 학생은 몇 명인가?`, g.f[2], { unit: '명', figure: histFig(g, { torn: [2, 3] }),
            explain: `보이지 않는 두 계급의 도수의 합은 ${total} − (${vis.join(' + ')}) = ${both}(명)이다. 두 도수의 차가 ${gap}이므로 작은 쪽은 (${both} − ${gap}) ÷ 2 = ${g.f[2]}(명)이다.`, facts: { calc: [[`(${total}-(${vis.join('+')})-${gap})/2`, 0]], unseen: [2] } });
        }
        const gcd = (x, y) => (y ? gcd(y, x % y) : x), g = newGrp(d, { total, k: 6, hi: 15, ok: (f) => { const q = gcd(f[2], f[3]); return f[2] >= 4 && f[3] > f[2] && q >= 2 && f[2] / q >= 2 && f[3] / q <= 7; } }), q0 = gcd(g.f[2], g.f[3]), a = g.f[2] / q0, b = g.f[3] / q0, vis = g.f.filter((v, i) => i !== 2 && i !== 3), both = g.f[2] + g.f[3];
        return N(`${introG(g, '도수분포다각형')} 그림의 일부가 찢어져 두 계급의 도수가 보이지 않는다. ${wj(g.c.what, '이/가')} ${g.cls(2)}인 학생 수와 ${g.cls(3)}인 학생 수의 비가 ${a} : ${b}일 때, ${g.cls(2)}인 학생은 몇 명인가?`, g.f[2], { unit: '명', figure: polyFig(g, { torn: [2, 3] }),
          explain: `보이지 않는 두 계급의 도수의 합은 ${total} − (${vis.join(' + ')}) = ${both}(명)이다. 이것을 ${a} : ${nj(b, '으로/로')} 나누면 ${g.cls(2)}인 학생은 ${both} × ${frac(a, a + b)} = ${g.f[2]}(명)이다.`, facts: { calc: [[`(${total}-(${vis.join('+')}))*${a}/(${a}+${b})`, 0]] } });
      }, { count: 2, standard: STD2 }),
      H('hard-two-poly-top', '한 집단의 상위 몇 % 기준을 다른 집단에서 읽기', '심50 / 기본 ②71', (d) => {
        // ② 첫째 집단에서 비율 → 학생 수 → 기준 점수를 구한 다음, 둘째 집단에서 그 점수 이상인 학생 수 → 비율을 구한다. 두 집단의 총합이 달라 학생 수를 그대로 옮기면 틀린다.
        const names = d.pick(PAIRS), [A, Bn] = names, [ta, tb] = d.pick([[20, 25], [25, 20], [20, 40], [40, 25]]), [lo, size] = frameOf(d, SCORE, 5);
        const [a, b, j] = d.until(() => { const x = freqs(d, 5, ta, null, { hi: ta * 0.45 }), y = freqs(d, 5, tb, null, { hi: tb * 0.45 }); return [x, y, 3]; }, ([x, y, cut]) => [10, 20, 25, 30].includes(pctOf(sum(x.slice(cut)), ta)) && Number.isInteger(pctOf(sum(y.slice(cut)), tb)) && pctOf(sum(y.slice(cut)), tb) !== pctOf(sum(x.slice(cut)), ta) && sum(y.slice(cut)) !== sum(x.slice(cut)));
        const g = grp(SCORE, lo, size, a), p = pctOf(sum(a.slice(j)), ta), ans = pctOf(sum(b.slice(j)), tb), bTop = b.slice(j);
        return N(`다음은 ${pairCount(names, ta, tb)}의 수학 점수를 조사하여 나타낸 도수분포다각형이다. ${A}에서 수학 점수가 높은 쪽에서 ${A} 전체의 ${p} % 이내에 들려면 적어도 ㉠점이어야 한다. ${Bn}에서 수학 점수가 ㉠점 이상인 학생은 ${Bn} 전체의 몇 %인가?`, ans, { unit: ' %', figure: chart({ g, lines: [{ values: a, name: A }, { values: b, name: Bn }] }),
          explain: `${A} 전체의 ${p} %는 ${ta} × ${p} ÷ 100 = ${sum(a.slice(j))}(명)이고, ${A}에서 ${amt(g.at(j), '점')} 이상인 학생이 ${a.slice(j).length > 1 ? a.slice(j).join(' + ') + ' = ' + sum(a.slice(j)) + '(명)' : sum(a.slice(j)) + '명'}이므로 ㉠ = ${g.at(j)}이다. ${Bn}에서 ${amt(g.at(j), '점')} 이상인 학생은 ${bTop.length > 1 ? bTop.join(' + ') + ' = ' + sum(bTop) + '(명)' : sum(bTop) + '명'}이므로 ${Bn} 전체의 ${sum(bTop)} ÷ ${tb} × 100 = ${ans}(%)이다.`, facts: { calc: [[`100*(${bTop.join('+')})/(${b.join('+')})`, 0]], unseen: [100] } });
      }, { standard: STD2 }),

      // ══ 상대도수 ══
      H('hard-rel-total-then', '한 계급의 도수와 상대도수로 도수의 총합을 구한 다음 다른 계급의 도수 구하기', '심52·57 / 기본 ①68·73 ②77·85', (d, n) => {
        // ② (도수의 총합) = (도수) ÷ (상대도수)로 총합부터 구하고, 다른 계급(범위)의 상대도수를 곱한다.
        if (n === 0) {
          const g = relGrp(d, { total: d.pick([40, 50, 80, 200]), ok: (r) => new Set(r).size >= 4 }), [i, j] = d.until(() => d.shuffle(range(0, g.k - 1)).slice(0, 2), ([x, y]) => g.r[x] !== g.r[y] && g.r[x] !== 50);
          return N(`다음은 어느 중학교 학생들의 ${wj(g.c.what, '을/를')} 조사하여 나타낸 상대도수의 분포표인데 도수가 일부만 적혀 있다. ㉠에 알맞은 수는?`, g.f[j], { figure: ftab(g, { cells: g.f.map((v, x) => (x === i ? v : x === j ? box('㉠') : '')), total: '', more: [{ head: '상대도수', cells: g.r.map(r2), total: '1' }] }),
            explain: `도수가 ${g.f[i]}인 계급의 상대도수가 ${r2(g.r[i])}이므로 도수의 총합은 ${g.f[i]} ÷ ${r2(g.r[i])} = ${g.total}이다. ㉠ = ${g.total} × ${r2(g.r[j])} = ${g.f[j]}이다.`, facts: { value: `${g.f[i]}/${r2(g.r[i])}*${r2(g.r[j])}` } });
        }
        const g = relGrp(d, { total: d.pick([50, 100, 200]), k: 6, ok: (r) => r[0] <= 10 }), part = g.r.slice(-2), ans = g.total * sum(part) / 100, u = g.u;
        return N(`${introR(g, '그래프', true)} ${wj(g.c.what, '이/가')} ${g.cls(0)}인 학생이 ${g.f[0]}명일 때, ${wj(g.c.what, '이/가')} ${amt(g.at(g.k - 2), u)} 이상인 학생은 모두 몇 명인가?`, ans, { unit: '명', figure: relFig(g, g.r),
          explain: `${g.cls(0)}인 계급의 상대도수가 ${r2(g.r[0])}이므로 전체 학생은 ${g.f[0]} ÷ ${r2(g.r[0])} = ${g.total}(명)이다. ${amt(g.at(g.k - 2), u)} 이상인 계급의 상대도수의 합은 ${part.map(r2).join(' + ')} = ${r2(sum(part))}이므로 학생 수는 ${g.total} × ${r2(sum(part))} = ${ans}(명)이다.`, facts: { value: `${g.f[0]}/${r2(g.r[0])}*(${part.map(r2).join('+')})` } });
      }, { count: 2, standard: STD3 }),
      H('hard-rel-torn', '찢어진 상대도수 그래프에서 가려진 계급의 도수 구하기', '심58 / 기본 ①76·77 ②86', (d) => {
        // ① 상대도수의 총합은 1이다. 이 뜻을 대야 가려진 점의 높이가 정해진다. 함정: 상대도수의 총합을 도수의 총합이나 100으로 여기는 아이.
        const g = relGrp(d, { total: d.pick([40, 50, 200]), k: 6, ok: (r) => r[2] >= 16 || r[3] >= 16 }), j = g.r[2] >= g.r[3] ? 2 : 3, rest = g.r.filter((v, i) => i !== j).map(r2);
        return N(`${introR(g, '그래프')} 그림의 일부가 찢어져 ${g.cls(j)}인 계급의 상대도수가 보이지 않는다. 이 계급에 속하는 학생은 몇 명인가?`, g.f[j], { unit: '명', figure: relFig(g, g.r, { torn: [j] }),
          explain: `상대도수의 총합은 1이므로 보이지 않는 계급의 상대도수는 1 − (${rest.join(' + ')}) = ${r2(g.r[j])}이다. 이 계급의 학생 수는 ${g.total} × ${r2(g.r[j])} = ${g.f[j]}(명)이다.`, facts: { value: `${g.total}*(1-(${rest.join('+')}))`, unseen: [1] } });
      }, { standard: STD3 }),
      H('hard-freq-vs-rel', '도수는 모든 계급에서 크지만 상대도수는 그렇지 않은 두 집단', '심60', (d) => {
        // ① 함정: 도수가 크면 상대도수도 크다고 여기는 아이(모든 계급에서 남학생의 도수가 크므로 고를 수 없다). 남학생의 총합이 여학생의 2배이므로
        //  남학생의 도수가 여학생의 도수의 2배보다 큰 계급만 상대도수가 크다.
        const c = d.pick(GC), k = 5, [lo, size] = frameOf(d, c, k);
        const [a, b] = d.until(() => [freqs(d, k, 50, null, { hi: 20 }), freqs(d, k, 25, null, { hi: 10 })], ([x, y]) => x.every((v, i) => v > y[i]) && x.filter((v, i) => v > 2 * y[i]).length === 1), g = grp(c, lo, size, a), at = a.findIndex((v, i) => v > 2 * b[i]);
        return C(`다음은 어느 중학교 1학년 남학생 50명과 여학생 25명의 ${wj(c.what, '을/를')} 조사하여 나타낸 도수분포표이다. 남학생의 상대도수가 여학생의 상대도수보다 큰 계급은?`, classOptions(g), at, { figure: ftab(g, { head: '남학생', more: [{ head: '여학생', cells: b, total: 25 }], note: '명' }),
          explain: `도수는 모든 계급에서 남학생이 더 크지만 도수의 총합이 다르므로 상대도수로 비교한다. ${g.cls(at)}인 계급의 상대도수는 남학생이 ${a[at]} ÷ 50 = ${fx(a[at] / 50)}, 여학생이 ${b[at]} ÷ 25 = ${nj(b[at] / 25, '으로/로')} 남학생이 더 크다. 나머지 계급에서는 남학생의 도수가 여학생의 도수의 2배를 넘지 않으므로 남학생의 상대도수가 더 크지 않다.`,
          facts: { truth: a.map((v, i) => v / 50 > b[i] / 25), want: true } });
      }, { standard: STD3 }),
      H('hard-two-graph-freq', '두 집단의 상대도수 그래프에서 같은 계급의 도수 견주기', '심62 / 기본 ①82 ②92', (d) => {
        // ② 그래프에서 상대도수를 읽고, 집단마다 도수의 총합을 곱해 학생 수를 구한 다음 견준다. 상대도수는 둘째 집단이 크지만 학생 수는 첫째 집단이 많다.
        //  보기: 상대도수가 큰 쪽이 학생 수도 많다고 여기는 아이(둘째 집단 쪽을 고른다), 한 집단의 총합만 두 상대도수의 차에 곱하는 아이(틀린 학생 수).
        const c = d.pick(GC), k = 5, [lo, size] = frameOf(d, c, k), names = d.pick(BIG_PAIRS), [A, Bn] = names, [ta, tb] = d.pick([[200, 100], [300, 100], [400, 200]]);
        const [a, b] = twoRels(d, k, 5, (x, y) => range(1, 3).some((i) => x[i] < y[i] && ta * x[i] > tb * y[i] && ta * x[i] - tb * y[i] !== (y[i] - x[i]) * tb)), g = grp(c, lo, size, a);
        const j = d.pick(range(1, 3).filter((i) => a[i] < b[i] && ta * a[i] > tb * b[i] && ta * a[i] - tb * b[i] !== (b[i] - a[i]) * tb)), na = ta * a[j] / 100, nb = tb * b[j] / 100, right = na - nb, wrong = (b[j] - a[j]) * tb / 100;
        const options = d.shuffle([[A, right, true], [Bn, right, false], [A, wrong, false], [Bn, wrong, false]]);
        return C(`다음은 ${pairCount(names, ta, tb)}의 ${wj(c.what, '을/를')} 조사하여 상대도수의 분포를 나타낸 그래프이다. ${wj(c.what, '이/가')} ${g.cls(j)}인 학생 수를 바르게 비교한 것은?`, options.map((x) => `${wj(x[0], '이/가')} ${x[1]}명 더 많다.`), options.findIndex((x) => x[2]), { figure: relFig2(g, a, b, names),
          explain: `${g.cls(j)}인 계급의 상대도수는 ${wj(A, '이/가')} ${r2(a[j])}, ${wj(Bn, '이/가')} ${r2(b[j])}이다. 학생 수는 ${A}: ${ta} × ${r2(a[j])} = ${na}(명), ${Bn}: ${tb} × ${r2(b[j])} = ${nb}(명)이므로 ${wj(A, '이/가')} ${right}명 더 많다. 상대도수가 크다고 도수가 큰 것은 아니다.`, facts: { truth: options.map((x) => x[2]), want: true } });
      }, { standard: STD3 }),
      H('hard-two-graph-claims', '도수의 총합이 다른 두 집단의 상대도수 그래프에 대한 설명 가리기', '심61 / 기본 ①84 ②90', (d) => {
        // ① 틀린 보기는 저마다 한 가지 잘못에서 나온다 — 상대도수가 크면 학생 수도 많다고 여기는 아이, 상대도수가 같으면 학생 수도 같다고 여기는 아이,
        //  다른 집단의 총합을 곱하는 아이, 그래프가 왼쪽으로 치우친 쪽의 값이 크다고 여기는 아이.
        const c = d.pick(GC), k = 5, [lo, size] = frameOf(d, c, k), names = d.pick(BIG_PAIRS), [A, Bn] = names, [ta, tb] = d.pick([[200, 100], [400, 200]]), u = c.unit;
        const [a, b] = twoRels(d, k, 5, (x, y) => x.filter((v, i) => v === y[i]).length === 1 && range(0, k - 1).some((i) => x[i] < y[i] && 2 * x[i] > y[i])), g = grp(c, lo, size, a);
        const same = a.findIndex((v, i) => v === b[i]), j = d.pick(range(0, k - 1).filter((i) => a[i] < b[i] && 2 * a[i] > b[i])), over = a[k - 1] + a[k - 2], useCount = d.bool(), what = wj(c.what, '이/가');
        const rows = d.shuffle([
          [`${what} ${g.cls(j)}인 학생은 ${Bn}에 더 많다.`, false, `${g.cls(j)}인 학생은 ${A}에 ${ta} × ${r2(a[j])} = ${ta * a[j] / 100}(명), ${Bn}에 ${tb} × ${r2(b[j])} = ${tb * b[j] / 100}(명)이므로 ${A}에 더 많다.`],
          [`${g.cls(same)}인 계급의 상대도수가 같으므로 이 계급에 속하는 학생 수도 같다.`, false, `${g.cls(same)}인 학생은 ${A}에 ${ta * a[same] / 100}명, ${Bn}에 ${tb * b[same] / 100}명이다.`],
          [`${A}에서 ${what} ${amt(g.at(k - 2), u)} 이상인 학생은 ${(useCount ? ta : tb) * over / 100}명이다.`, useCount, useCount ? '' : `${A}에서 ${amt(g.at(k - 2), u)} 이상인 학생은 ${ta} × ${r2(over)} = ${ta * over / 100}(명)이다.`],
          [`${useCount ? A : Bn}의 그래프가 오른쪽으로 더 치우쳐 있으므로 ${useCount ? A : Bn} 학생들의 ${what} 상대적으로 ${c.big} 편이다.`, !useCount, useCount ? `오른쪽으로 더 치우친 것은 ${Bn}의 그래프이다.` : '']
        ]), at = rows.findIndex((r) => r[1]);
        return C(`다음은 ${pairCount(names, ta, tb)}의 ${wj(c.what, '을/를')} 조사하여 상대도수의 분포를 나타낸 그래프이다. 이 그래프에 대한 설명으로 옳은 것은?`, rows.map((r) => r[0]), at, { figure: relFig2(g, a, b, names),
          explain: rows.filter((r) => !r[1]).map((r) => r[2]).join(' ') + ' 도수의 총합이 다르면 상대도수의 크기와 도수의 크기는 다를 수 있다.', facts: { truth: rows.map((r) => r[1]), want: true } });
      }, { standard: STD3 }),
      H('hard-two-graph-total', '두 집단의 도수의 차로 한 집단의 도수의 총합 구하기', '기본 ②93', (d) => {
        // ② 첫째 집단의 학생 수를 구하고(총합 × 상대도수의 합), 차를 더해 둘째 집단의 학생 수를 구한 다음, (도수의 총합) = (도수) ÷ (상대도수)로 둘째 집단의 총합을 구한다.
        const c = d.pick(GC), k = 5, [lo, size] = frameOf(d, c, k), names = d.pick(PAIRS), [A, Bn] = names, ta = d.pick([20, 40]), tb = d.until(() => d.pick([20, 40, 60]), (v) => v !== ta), u = c.unit;
        const [a, b] = twoRels(d, k, 5, (x, y) => tb * (y[3] + y[4]) > ta * (x[3] + x[4])), g = grp(c, lo, size, a), sa = a[3] + a[4], sb = b[3] + b[4], na = ta * sa / 100, nb = tb * sb / 100, gap = nb - na;
        return N(`다음은 ${pairLead(names)}의 ${wj(c.what, '을/를')} 조사하여 상대도수의 분포를 나타낸 그래프이다. ${A} 학생은 ${ta}명이고, ${wj(c.what, '이/가')} ${amt(g.at(3), u)} 이상인 학생은 ${wj(Bn, '이/가')} ${A}보다 ${gap}명 더 많다. ${Bn} 학생은 모두 몇 명인가?`, tb, { unit: '명', figure: relFig2(g, a, b, names),
          explain: `${A}에서 ${amt(g.at(3), u)} 이상인 계급의 상대도수의 합은 ${r2(a[3])} + ${r2(a[4])} = ${r2(sa)}이므로 학생 수는 ${ta} × ${r2(sa)} = ${na}(명)이다. ${Bn}에서는 ${na} + ${gap} = ${nb}(명)이고 상대도수의 합이 ${r2(b[3])} + ${r2(b[4])} = ${r2(sb)}이므로 ${Bn} 학생은 모두 ${nb} ÷ ${r2(sb)} = ${tb}(명)이다.`, facts: { value: `(${ta}*(${r2(a[3])}+${r2(a[4])})+${gap})/(${r2(b[3])}+${r2(b[4])})` } });
      }, { standard: STD3 }),

      // ══ 다시 실은 꼴 ══
      // 처음 지을 때 「조건을 여럿 풀어야 한다」「경우를 갈라 맞춰 보아야 한다」「상대도수는 간단히 다룬다」는 까닭으로 뺀 꼴을 다시 보고 실었다(2026-10-13. 수학 실력에 필요한 문제는 싣는다).
      // 「간단히 다루고」는 다루는 정도를 말한 것이지 금지가 아니다. 상위 학년 내용이 있어야 풀리는 것, 초등에서 한 일 그대로인 것, 뜻 없는 합, 서술형은 그대로 빼 두었다(7-2-5a.js 머리 주석).
      // ── 대푯값 ──
      H('hard-mean-median-cases', '평균과 중앙값이 같아지는 변량을 경우를 나누어 모두 구하기', '심16', (d) => {
        // ② x 가 어느 자리에 오는지에 따라 중앙값이 달라진다. x 가 2번째 값 이하이면 중앙값은 2번째 값, 3번째 값 이상이면 3번째 값, 그 사이이면 x 자신이다.
        //  경우마다 평균의 식을 풀고, 구한 x 가 그 경우에 맞는지 확인한다. 한 경우만 따지면 답 하나를 놓친다.
        const k = d.until(() => srt(d.shuffle(range(3, 24)).slice(0, 4)), (l) => { const s = sum(l); return s % 4 !== 0 && 4 * l[1] < s && s < 4 * l[2] && 5 * l[1] - s >= 1 && 5 * l[2] - s <= 40; });
        const s = sum(k), lo = 5 * k[1] - s, hi = 5 * k[2] - s, x = V('x');
        const shown = d.until(() => d.shuffle(k.concat([x])), (l) => !isSorted(l.filter((v) => typeof v === 'number')) && l[4] !== x);
        const between = k[2] - k[1] === 1 ? `${k[1]}보다 크고 ${k[2]}보다 작은 자연수는 없다.` : `${x}가 ${k[1]}보다 크고 ${k[2]}보다 작으면 중앙값은 ${x}이므로 (${s} + ${x}) ÷ 5 = ${x}에서 ${x} = ${fx(s / 4)}인데, 이것은 자연수가 아니다.`;
        return M(`다음 자료의 평균과 중앙값이 서로 같도록 하는 자연수 ${x}의 값 가운데 가장 작은 수와 가장 큰 수는?`, [{ label: '가장 작은 수', answer: lo }, { label: '가장 큰 수', answer: hi }], { figure: numbers(shown),
          explain: `${x}를 뺀 변량을 크기순으로 늘어놓으면 ${k.join(', ')}이고 그 합은 ${s}이다. 변량이 5개이므로 중앙값은 3번째 값이다. ${x}가 ${k[1]} 이하이면 중앙값은 ${k[1]}이므로 (${s} + ${x}) ÷ 5 = ${k[1]}에서 ${x} = ${lo}이다. ${x}가 ${k[2]} 이상이면 중앙값은 ${k[2]}이므로 (${s} + ${x}) ÷ 5 = ${k[2]}에서 ${x} = ${hi}이다. ${between} 따라서 ${x}의 값은 ${lo}, ${hi}이다.`,
          facts: { calc: [[`5*${k[1]}-(${k.join('+')})`, 0], [`5*${k[2]}-(${k.join('+')})`, 1]], unseen: [5] } });
      }, { standard: STD1 }),
      H('hard-mean-mode-self', '나머지 변량이 모두 다른 자료에서 평균과 최빈값이 같아지는 변량 구하기', '심17 / 기본 ②17', (d) => {
        // ① 나머지 변량이 모두 다르므로 최빈값이 하나뿐이려면 x 가 그 가운데 하나와 같아야 하고, 그때 최빈값은 x 자신이다.
        //  함정: 최빈값을 정할 수 없다고 여기는 아이, 자료에 적힌 수 가운데 하나를 최빈값으로 미리 정해 놓고 평균을 맞추는 아이.
        const x = V('x');
        const [xv, known] = d.until(() => { const v = d.int(6, 20), o = d.shuffle(range(1, 34).filter((w) => w !== v)).slice(0, 3); return [v, o.concat([4 * v - sum(o), v])]; }, ([v, o]) => o[3] >= 1 && o[3] <= 36 && new Set(o).size === 5);
        const list = d.shuffle(known), at = d.int(1, 4), shown = list.slice(0, at).concat([x], list.slice(at)), s = sum(list);
        return N(`다음 6개의 변량의 최빈값이 하나뿐이고 그 값이 평균과 같을 때, ${x}의 값은?`, xv, { figure: numbers(shown),
          explain: `${x}를 뺀 변량 5개가 모두 다르므로 최빈값이 하나뿐이려면 ${x}가 그 가운데 하나와 같아야 하고, 이때 최빈값은 ${x}이다. 평균도 ${x}이므로 (${s} + ${x}) ÷ 6 = ${x}에서 ${s} = 5 × ${x}, ${x} = ${xv}이다. ${nj(xv, '은/는')} 자료에 있는 값이므로 조건에 맞는다.`,
          facts: { calc: [[`(${list.join('+')})/5`, 0]], unseen: [5] } });
      }, { standard: STD1 }),
      H('hard-median-two-spots', '문자가 두 자리에 든 자료에서 중앙값으로 문자의 값 구하기', '기본 ②16', (d) => {
        // ② 중앙값은 나머지 변량에 없는 수이므로 a 이거나 a + (차)이다. 두 경우를 모두 크기순으로 늘어놓아 4번째 값이 되는지 확인해야 한다(한 경우는 버려진다).
        //  어느 경우가 맞는지는 문항마다 다르다: a 가 중앙값인 문항도 있고 a + (차)가 중앙값인 문항도 있다.
        const upper = d.bool(), gap = d.int(4, 8), a = V('a');
        const made = d.until(() => { const m = d.int(14, 40), below = upper ? 3 : 2; return { m, known: d.shuffle(range(m - 13, m - 1)).slice(0, below).concat(d.shuffle(range(m + 1, m + 13)).slice(0, 5 - below)) }; },
          (v) => ![v.m - gap, v.m + gap].some((w) => v.known.includes(w)) && (median(v.known.concat([v.m, v.m + gap])) === v.m) === upper && (median(v.known.concat([v.m - gap, v.m])) === v.m) === !upper);
        const { m, known } = made, ans = upper ? m : m - gap, caseA = srt(known.concat([m, m + gap])), caseB = srt(known.concat([m - gap, m]));
        const shown = d.until(() => d.shuffle(known.concat(['A', 'B'])), (l) => l.indexOf('A') < l.indexOf('B') && l[0] !== 'A').map((v) => (v === 'A' ? a : v === 'B' ? `${a} + ${gap}` : v));
        return N(`다음 7개의 변량의 중앙값이 ${m}일 때, ${a}의 값은?`, ans, { figure: numbers(shown),
          explain: `${a}, ${a} + ${gap}${tail(gap, '을/를')} 뺀 변량을 크기순으로 늘어놓으면 ${srt(known).join(', ')}이다. 변량이 7개이므로 중앙값은 4번째 값이고, ${nj(m, '은/는')} 이 다섯 수에 없으므로 ${a} = ${m}이거나 ${a} + ${gap} = ${m}이다. ${a} = ${m}이면 변량은 ${caseA.join(', ')}이므로 4번째 값은 ${caseA[3]}이다. ${a} + ${gap} = ${m}이면 ${a} = ${m - gap}이고 변량은 ${caseB.join(', ')}이므로 4번째 값은 ${caseB[3]}이다. 중앙값이 ${nj(m, '이/가')} 되는 것은 ${a} = ${ans}일 때이다.`,
          facts: { calc: [[upper ? String(m) : `${m}-${gap}`, 0]] } });
      }, { standard: STD1 }),
      H('hard-median-unique-mode', '중앙값 조건과 「최빈값은 하나뿐」으로 변량 정하기', '기본 ②18·19', (d, n) => {
        const a = V('a');
        if (n === 0) {
          // ② 중앙값으로 a 의 범위를 좁힌 다음, 두 번씩 나온 두 값 가운데 어느 쪽이 세 번이 되어야 최빈값이 하나가 되는지 가른다.
          //  답이 두 값 가운데 큰 쪽인 문항도 있고 작은 쪽인 문항도 있다.
          const high = d.bool(), gap = d.pick([1, 2]), p = d.int(9, 24), q = p + gap;
          const known = d.shuffle(range(p - 8, p - 1)).slice(0, high ? 3 : 2).concat([p, p, q, q], d.shuffle(range(q + 1, q + 8)).slice(0, high ? 2 : 3)), ans = high ? q : p, med = (p + q) / 2;
          const shown = d.until(() => d.shuffle(known.concat([a])), (l) => l[0] !== a && l[9] !== a && !isSorted(l.filter((v) => typeof v === 'number')));
          return N(`다음 10개의 변량의 중앙값이 ${fx(med)}이고 최빈값이 하나뿐일 때, 이 자료의 최빈값은?`, ans, { figure: numbers(shown),
            explain: `${a}를 뺀 변량을 크기순으로 늘어놓으면 ${srt(known).join(', ')}이다. 변량이 10개이므로 중앙값은 5번째 값과 6번째 값의 평균이다. 이것이 (${p} + ${q}) ÷ 2 = ${fx(med)}이려면 5번째 값이 ${p}, 6번째 값이 ${q}이어야 하므로 ${a}는 ${high ? q + ' 이상' : p + ' 이하'}이다. ${a}를 뺀 자료에서 ${nj(p, '과/와')} ${nj(q, '이/가')} 2번씩 나오므로 최빈값이 하나뿐이려면 ${a} = ${ans}이어야 한다. 따라서 최빈값은 ${ans}이다.`,
            facts: { calc: [[String(ans), 0]] } });
        }
        // ② 두 번씩 나온 두 값이 있으므로 최빈값이 하나뿐이려면 a 나 a + (차)가 그 가운데 하나와 같아야 한다. 그런 경우를 모두 찾아 중앙값과 최빈값의 차가 맞는 것을 고른다.
        const gap = d.pick([2, 3]);
        const made = d.until(() => {
          const vals = d.shuffle(range(6, 19)).slice(0, 6), [p, q] = srt(vals.slice(0, 2)), known = vals.slice(2).concat([p, p, q, q]);
          const cands = range(1, 22).map((v) => { const full = known.concat([v, v + gap]); return { v, mo: modes(full), med: median(full) }; }).filter((c) => c.mo.length === 1);
          const diffs = cands.map((c) => Math.abs(c.med - c.mo[0]));
          return { p, q, known, cands, good: cands.filter((c, i) => Number.isInteger(diffs[i]) && diffs[i] >= 1 && diffs.filter((x) => x === diffs[i]).length === 1) };
        }, (v) => v.cands.length >= 2 && v.good.length >= 1);
        const { p, q, known, cands } = made, hit = d.pick(made.good), diff = Math.abs(hit.med - hit.mo[0]);
        const shown = d.until(() => d.shuffle(known.concat(['A', 'B'])), (l) => l.indexOf('A') < l.indexOf('B') && l[0] !== 'A').map((v) => (v === 'A' ? a : v === 'B' ? `${a} + ${gap}` : v));
        return N(`다음 10개의 변량의 최빈값이 하나뿐이고 중앙값과 최빈값의 차가 ${diff}일 때, ${a}의 값은?`, hit.v, { figure: numbers(shown),
          explain: `${a}, ${a} + ${gap}${tail(gap, '을/를')} 뺀 자료에서 ${nj(p, '과/와')} ${nj(q, '이/가')} 2번씩 나오고 나머지는 한 번씩 나온다. 최빈값이 하나뿐이려면 ${a} 또는 ${a} + ${gap}${tail(gap, '이/가')} ${p} 또는 ${nj(q, '과/와')} 같아서 그 값만 3번 나와야 한다. 그런 경우는 ${cands.map((c) => `${a} = ${c.v}일 때(최빈값 ${c.mo[0]}, 중앙값 ${fx(c.med)})`).join(', ')}이다. 이 가운데 중앙값과 최빈값의 차가 ${diff}인 것은 ${a} = ${hit.v}일 때이다.`,
          facts: { calc: [[hit.v === p || hit.v === q ? String(hit.v) : hit.v + gap === p ? `${p}-${gap}` : `${q}-${gap}`, 0]] } });
      }, { count: 2, standard: STD1 }),
      H('hard-two-unknowns', '조건 여럿으로 모르는 변량을 모두 구한 다음 중앙값 구하기', '심22·24 / 기본 ②20', (d, n) => {
        if (n === 0) {
          // ② 평균으로 두 수의 합을 구하고 → 최빈값으로 하나를 정하고 → 나머지를 구해 → 크기순으로 늘어놓는다.
          const x = V('x'), y = V('y');
          const made = d.until(() => { const known = d.shuffle(range(3, 20)).slice(0, 5), mo = d.pick(known), mean = d.int(7, 14); return { known, mo, mean, w: 7 * mean - sum(known) - mo }; }, (v) => v.w >= 1 && v.w <= 24 && !v.known.includes(v.w) && Math.abs(v.w - v.mo) >= 2);
          const { known, mo, mean, w } = made, full = known.concat([mo, w]), med = median(full), [small, big] = srt([mo, w]);
          const shown = d.until(() => d.shuffle(known.concat(['X', 'Y'])), (l) => l.indexOf('X') < l.indexOf('Y') && l[0] !== 'X').map((v) => (v === 'X' ? x : v === 'Y' ? y : v));
          return N(`다음 7개의 변량의 평균이 ${mean}이고 최빈값이 ${mo}일 때, 이 자료의 중앙값은? (단, ${x} ${LT} ${y})`, med, { figure: numbers(shown),
            explain: `변량의 총합은 7 × ${mean} = ${7 * mean}이므로 ${x} + ${y} = ${7 * mean} − (${known.join(' + ')}) = ${mo + w}이다. ${x}, ${y}를 뺀 변량이 모두 다르므로 최빈값이 ${mo}이려면 ${x}, ${y} 가운데 하나가 ${mo}이고, 다른 하나는 ${mo + w} − ${mo} = ${w}이다. ${x} ${LT} ${y}이므로 ${x} = ${small}, ${y} = ${big}이다. 변량을 크기순으로 늘어놓으면 ${srt(full).join(', ')}이므로 중앙값은 4번째 값인 ${med}이다.`,
            facts: { calc: [[med === w ? `7*${mean}-(${known.join('+')})-${mo}` : String(med), 0]] } });
        }
        // ② 말로 준 조건 셋(가장 작은 값, 평균, 2번 나타나는 최빈값)으로 변량 4개를 되살린 다음 중앙값을 구한다.
        const c = d.pick([{ who: '어느 모둠 학생 4명', what: '수학 점수', unit: '점', least: '가장 낮은 점수', lo: 60, hi: 96 }, { who: '어느 동아리 회원 4명', what: '나이', unit: '살', least: '가장 적은 나이', lo: 13, hi: 32 }, { who: '학생 4명', what: '1분 동안의 줄넘기 횟수', unit: '회', least: '가장 적은 횟수', lo: 30, hi: 72 }]), u = c.unit;
        const [lo, w, mo] = d.until(() => srt(d.shuffle(range(c.lo, c.hi)).slice(0, 3)), ([p, q, r]) => (p + q + 2 * r) % 4 === 0 && (q + r) % 2 === 1 && r - q >= 3 && q - p >= 2 && r - p <= 20);
        const mean = (lo + w + 2 * mo) / 4, med = (w + mo) / 2;
        return D(`${c.who}의 ${wj(c.what, '을/를')} 조사하였더니 ${c.least}는 ${amt(lo, u)}, 평균은 ${amt(mean, u)}이고, 최빈값은 ${amtj(mo, u, '으로/로')} 2번 나타났다. 이 자료의 중앙값은?`, med, { unit: u,
          explain: `변량의 총합은 4 × ${mean} = ${4 * mean}이고 ${amtj(mo, u, '이/가')} 2번 나타나므로 나머지 한 변량은 ${4 * mean} − ${lo} − 2 × ${mo} = ${amt(w, u)}이다. 변량을 크기순으로 늘어놓으면 ${[lo, w, mo, mo].join(', ')}이므로 중앙값은 2번째 값과 3번째 값의 평균인 (${w} + ${mo}) ÷ 2 = ${amt(med, u)}이다.`,
          facts: { calc: [[`(4*${mean}-${lo}-2*${mo}+${mo})/2`, 0]] } });
      }, { count: 2, standard: STD1 }),
      H('hard-three-unknowns', '최빈값과 다른 대푯값으로 모르는 변량 셋 정하기', '심23 / 기본 ①11', (d, n) => {
        const a = V('a'), b = V('b'), c = V('c');
        if (n === 0) {
          // ② 두 번 나온 값이 있으므로 최빈값이 되려면 그 값이 세 번 이상 나와야 한다 → 모르는 셋 가운데 둘이 최빈값. 셋 모두이면 중앙값이 어긋난다 → 나머지 하나가 4번째 값(중앙값)이다.
          const [l1, l2, m, mo] = d.until(() => srt(d.shuffle(range(2, 26)).slice(0, 4)), (v) => v[2] - v[1] >= 2 && v[3] - v[2] >= 2);
          return N(`다음 7개의 변량의 중앙값이 ${m}, 최빈값이 ${mo}일 때, ${a} + ${b} + ${c}의 값은?`, 2 * mo + m, { figure: numbers([a, b, c].concat(d.shuffle([l1, l2, l2, mo]))),
            explain: `${a}, ${b}, ${c}를 뺀 자료에서 ${nj(l2, '이/가')} 2번 나오므로 최빈값이 ${mo}이려면 ${nj(mo, '이/가')} 3번 이상 나와야 한다. ${a}, ${b}, ${c}가 모두 ${mo}이면 크기순으로 4번째 값인 중앙값이 ${nj(mo, '이/가')} 되어 조건에 맞지 않으므로 셋 가운데 둘만 ${mo}이다. 나머지 하나는 ${nj(l2, '과/와')} ${mo} 사이에 있어야 4번째 값이 되고, 그 값이 중앙값이므로 ${m}이다. 따라서 ${a} + ${b} + ${c} = ${mo} + ${mo} + ${m} = ${2 * mo + m}이다.`,
            facts: { calc: [[`${mo}+${mo}+${m}`, 0]] } });
        }
        // ② 최빈값으로 둘을 정하고(셋 모두이면 평균이 어긋난다) → 평균으로 나머지 하나를 구한다. 그 값이 가장 큰 수이므로 중앙값 조건에도 맞는다.
        const made = d.until(() => { const [l1, l2, mo] = srt(d.shuffle(range(2, 20)).slice(0, 3)), mean = d.int(mo - 4, mo + 3); return { l1, l2, mo, mean, w: 5 * mean - l1 - l2 - 2 * mo }; }, (v) => v.mean >= 3 && v.w >= v.mo + 2 && v.w <= 32);
        const { l1, l2, mo, mean, w } = made;
        return N(`다음 5개의 변량의 중앙값과 최빈값이 모두 ${mo}이고 평균이 ${mean}일 때, 세 수 ${a}, ${b}, ${c} 가운데 가장 큰 수는?`, w, { figure: numbers(d.shuffle([l1, l2]).concat([a, b, c])),
          explain: `${l1}, ${nj(l2, '은/는')} 한 번씩 나오므로 최빈값이 ${mo}이려면 ${a}, ${b}, ${c} 가운데 둘 이상이 ${mo}이다. 변량의 총합은 5 × ${mean} = ${5 * mean}이므로 ${a} + ${b} + ${c} = ${5 * mean} − (${l1} + ${l2}) = ${2 * mo + w}이다. 셋이 모두 ${mo}이면 합이 ${nj(3 * mo, '이/가')} 되어 맞지 않으므로 둘만 ${mo}이고, 나머지 하나는 ${2 * mo + w} − 2 × ${mo} = ${w}이다. 크기순으로 늘어놓으면 ${l1}, ${l2}, ${mo}, ${mo}, ${w}이므로 중앙값도 ${mo}이다. 가장 큰 수는 ${w}이다.`,
          facts: { calc: [[`5*${mean}-(${l1}+${l2})-2*${mo}`, 0]], unseen: [2] } });
      }, { count: 2, standard: STD1 }),
      H('hard-two-medians', '두 자료의 중앙값 조건으로 두 수 정하기', '심21', (d) => {
        // ② 자료 A 에서 a 를 정하고(b 가 중앙값이면 그보다 작은 변량이 셋이 되어 어긋난다) → 자료 B 에서 b 가 어느 두 값 사이에 오는지 따져 b 를 구한다.
        const a = V('a'), b = V('b');
        const made = d.until(() => {
          const m1 = d.int(6, 14), lows = srt(d.shuffle(range(1, m1 - 1)).slice(0, 2)), k3 = m1 + d.int(1, 5);
          const j = d.shuffle(range(2, 30).filter((v) => v !== m1)).slice(0, 4), s = srt(j.concat([m1]));
          return { m1, lows, k3, j, s, bv: d.int(s[2] + 1, s[2] + 6) };
        }, (v) => v.bv < v.s[3] && v.bv > v.m1 && (v.s[2] + v.bv) % 2 === 0 && v.bv !== v.k3);
        const { m1, lows, k3, j, s, bv } = made, m2 = (s[2] + bv) / 2;
        const withAB = (list) => { const l = d.shuffle(list), at = d.int(1, l.length - 1); return l.slice(0, at).concat([a, b], l.slice(at)); };
        return M(`두 자연수 ${a}, ${b}에 대하여 자료 A의 중앙값이 ${m1}이고 자료 B의 중앙값이 ${m2}일 때, ${a}, ${b}의 값은? (단, ${a} ${LT} ${b})`, [{ label: a, answer: m1 }, { label: b, answer: bv }], { figure: tagged([withAB(lows.concat([k3])).join(', '), withAB(j).join(', ')], ['A', 'B']),
          explain: `자료 A는 변량이 5개이므로 중앙값은 3번째 값이다. ${nj(m1, '은/는')} 나머지 변량 ${lows[0]}, ${lows[1]}, ${k3}에 없으므로 ${a}, ${b} 가운데 하나가 ${m1}이다. ${b} = ${m1}이면 ${m1}보다 작은 변량이 3개가 되어 ${nj(m1, '은/는')} 4번째 값이 되므로 ${a} = ${m1}이다. 자료 B에서 ${b}를 뺀 변량을 크기순으로 늘어놓으면 ${s.join(', ')}이고, 변량이 6개이므로 중앙값은 3번째 값과 4번째 값의 평균이다. ${b}가 ${s[2]} 이하이면 중앙값은 ${s[2]} 이하이고, ${b}가 ${s[3]} 이상이면 중앙값은 (${s[2]} + ${s[3]}) ÷ 2 = ${fx((s[2] + s[3]) / 2)}이므로 ${b}는 ${nj(s[2], '과/와')} ${s[3]} 사이의 수이다. (${s[2]} + ${b}) ÷ 2 = ${m2}에서 ${b} = ${bv}이다.`,
          facts: { calc: [[String(m1), 0], [`2*${m2}-${s[2]}`, 1]], unseen: [2] } });
      }, { standard: STD1 }),
      H('hard-mean-transform', '변량을 모두 몇 배 하고 같은 수를 더한(뺀) 자료의 평균', '심26', (d) => {
        // ① 평균은 변량의 총합을 개수로 나눈 값이다. 변량마다 같은 수를 빼면 총합에서는 그 수가 개수만큼 빠지고, 개수로 나누면 평균에서는 한 번만 빠진다.
        //  보기: (p)m ∓ (개수 × q) → 총합에서 빠진 수를 개수로 나누지 않은 아이. m ∓ q → 변량을 몇 배 한 것을 빠뜨린 아이. (p)m → 더하고 뺀 수는 평균과 관계없다고 여기는 아이.
        const n = d.pick([3, 4]), names = ['a', 'b', 'c', 'd'].slice(0, n).map(V), word = n === 3 ? '세' : '네', p = d.pick([2, 3]), q = d.pick([4, 5, 10, 20, 30]), minus = d.bool(), op = minus ? '−' : '+', m = V('m');
        const term = (x) => `${p}${x} ${op} ${q}`, ex = (coef, k) => `${coef === 1 ? '' : coef}${m}${k ? ` ${op} ${k}` : ''}`;
        const options = d.shuffle([[ex(p, q), true], [ex(p, n * q), false], [ex(1, q), false], [ex(p, 0), false]]);
        return Object.assign(C(`${word} 수 ${names.join(', ')}의 평균이 ${m}일 때, ${word} 수 ${names.map(term).join(', ')}의 평균을 ${m}을 사용한 식으로 나타낸 것은?`, options.map((x) => x[0]), options.findIndex((x) => x[1]), {
          explain: `${names.join(', ')}의 평균이 ${m}이므로 ${names.join(' + ')} = ${n}${m}이다. ${names.map(term).join(', ')}의 총합은 ${p} × (${names.join(' + ')}) ${op} ${q} × ${n} = ${p * n}${m} ${op} ${q * n}이므로 평균은 (${p * n}${m} ${op} ${q * n}) ÷ ${n} = ${ex(p, q)}이다. 변량마다 ${minus ? '뺀' : '더한'} 수는 총합에서는 ${n}번 ${minus ? '빠지지만' : '더해지지만'} 평균에서는 한 번만 ${minus ? '빠진다' : '더해진다'}.`,
          facts: { truth: options.map((x) => x[1]), want: true } }), { shown: ex(p, q) });   // 틀렸을 때 답 줄에 식을 수식 글꼴 그대로 보인다
      }, { standard: STD1 }),

      // ── 도수분포표·히스토그램·도수분포다각형 ──
      H('hard-two-tables', '계급의 크기를 달리하여 정리한 두 도수분포표의 빈칸', '기본 ②49', (d) => {
        // ② 같은 자료이므로 두 표에서 같은 범위에 드는 도수의 합은 같다. 두 표의 계급이 함께 끊기는 값까지 도수를 더해 맞대어 본다.
        //  계급 하나씩은 서로 맞대어 볼 수 없다(둘째 표의 한 계급은 첫째 표의 한 계급 반에 걸친다).
        const c = Object.assign({ who: '학생', cnt: '명' }, d.pick([{ what: '하루 운동 시간', short: '운동 시간', unit: '분', size: 30 }, { what: '통학 시간', short: '통학 시간', unit: '분', size: 10 }, { what: '일주일 동안의 독서 시간', short: '독서 시간', unit: '시간', size: 2 }, { what: '하루 동안의 컴퓨터 사용 시간', short: '사용 시간', unit: '분', size: 20 }])), u = c.unit, size = c.size, wide = size * 3 / 2, cut = amt(3 * size, u);
        const total = d.pick([40, 50, 60]), f = freqs(d, 6, total, (v) => v[1] >= 4 && v[4] >= 3, { hi: Math.round(total * 0.3) });
        const u1 = d.int(1, f[1] - 1), u4 = d.int(1, f[4] - 1), first = f[0] + u1, av = f[1] - u1 + f[2], third = f[3] + u4, bv = f[4] - u4 + f[5], low = f[0] + f[1] + f[2], high = f[3] + f[4] + f[5];
        return M(`다음은 어느 중학교 학생 ${total}명의 ${wj(c.what, '을/를')} 조사하여 계급의 크기를 ${amt(size, u)}${ut(u, '과/와')} ${amtj(wide, u, '으로/로')} 달리하여 정리한 두 도수분포표이다. ${V('A')}, ${V('B')}의 값은?`, [{ label: 'A', answer: av }, { label: 'B', answer: bv }], {
          figure: `<div style="display:grid;gap:10px;max-width:100%">${ftab(grp(c, 0, size, f))}${ftab(grp(c, 0, wide, [first, av, third, bv]), { cells: [first, V('A'), third, V('B')] })}</div>`,
          explain: `두 표는 같은 자료를 정리한 것이므로 같은 범위에 드는 학생 수는 같다. ${cut} 미만인 학생은 첫째 표에서 ${f[0]} + ${f[1]} + ${f[2]} = ${low}(명), 둘째 표에서 ${first} + ${V('A')}(명)이므로 ${V('A')} = ${low} − ${first} = ${av}이다. ${cut} 이상인 학생은 첫째 표에서 ${f[3]} + ${f[4]} + ${f[5]} = ${high}(명), 둘째 표에서 ${third} + ${V('B')}(명)이므로 ${V('B')} = ${high} − ${third} = ${bv}이다.`,
          facts: { calc: [[`${f[0]}+${f[1]}+${f[2]}-${first}`, 0], [`${f[3]}+${f[4]}+${f[5]}-${third}`, 1]] } });
      }, { standard: STD2 }),
      H('hard-torn-two-conds', '찢어진 그래프에서 조건 둘로 가려진 도수 구하기', '심48 / 기본 ②59', (d, n) => {
        if (n === 0) {
          // ② 도수의 총합이 주어지지 않았다. 보이는 한 계급의 비율로 총합을 구하고 → 가려진 두 도수의 합을 구하고 → 두 도수의 차로 가른다.
          const total = d.pick([20, 25, 32, 40]), g = newGrp(d, { total, k: 6, hi: total <= 25 ? 9 : 14, ok: (v) => v[2] >= 3 && v[3] >= 3 && v[2] !== v[3] && Math.abs(v[2] - v[3]) <= 8 && [10, 20, 25, 40].includes(pctOf(v[1], total)) });
          const f = g.f, vis = f.filter((v, i) => i !== 2 && i !== 3), both = f[2] + f[3], big = f[2] > f[3] ? 2 : 3, small = 5 - big, gap = f[big] - f[small], p = pctOf(f[1], total), what = wj(g.c.what, '이/가');
          return N(`${introG(g, '도수분포다각형', { noTotal: true })} 그림의 일부가 찢어져 두 계급의 도수가 보이지 않는다. ${what} ${g.cls(1)}인 학생이 전체의 ${p} %이고, ${g.cls(big)}인 학생이 ${g.cls(small)}인 학생보다 ${gap}명 더 많을 때, ${what} ${g.cls(big)}인 학생은 몇 명인가?`, f[big], { unit: '명', figure: polyFig(g, { torn: [2, 3] }),
            explain: `${g.cls(1)}인 학생 ${f[1]}명이 전체의 ${p} %이므로 전체 학생은 ${f[1]} × 100 ÷ ${p} = ${total}(명)이다. 보이지 않는 두 계급의 도수의 합은 ${total} − (${vis.join(' + ')}) = ${both}(명)이고 두 도수의 차가 ${gap}이므로 큰 쪽은 (${both} + ${gap}) ÷ 2 = ${f[big]}(명)이다.`,
            facts: { calc: [[`(${f[1]}*100/${p}-(${vis.join('+')})+${gap})/2`, 0]], unseen: [100, 2] } });
        }
        // ② 「기준 이상」과 「기준 미만」의 합(도수의 총합)과 차를 함께 써서 한쪽의 학생 수를 구한 다음, 보이는 도수를 빼어 가려진 도수를 구한다.
        const total = d.pick([30, 36, 40]), g = newGrp(d, { total, k: 6, hi: 14, ok: (v) => { const lower = sum(v.slice(0, 3)), upper = total - lower; return v[2] >= 4 && v[3] >= 4 && v[2] !== v[3] && lower !== upper && Math.abs(upper - lower) <= 10; } });
        const f = g.f, lower = sum(f.slice(0, 3)), upper = total - lower, more = upper > lower, gap = Math.abs(upper - lower), u = g.u, cut = amt(g.at(3), u), what = wj(g.c.what, '이/가');
        return N(`${introG(g, '히스토그램')} 그림의 일부가 찢어져 두 계급의 도수가 보이지 않는다. ${what} ${cut} ${more ? '이상' : '미만'}인 학생이 ${cut} ${more ? '미만' : '이상'}인 학생보다 ${gap}명 더 많을 때, ${what} ${g.cls(2)}인 학생은 몇 명인가?`, f[2], { unit: '명', figure: histFig(g, { torn: [2, 3] }),
          explain: `${cut} 미만인 학생과 ${cut} 이상인 학생은 모두 ${total}명이고 그 차가 ${gap}명이므로 ${cut} 미만인 학생은 (${total} ${more ? '−' : '+'} ${gap}) ÷ 2 = ${lower}(명)이다. 따라서 ${g.cls(2)}인 학생은 ${lower} − (${f[0]} + ${f[1]}) = ${f[2]}(명)이다.`,
          facts: { calc: [[`(${total}${more ? '-' : '+'}${gap})/2-(${f[0]}+${f[1]})`, 0]], unseen: [2] } });
      }, { count: 2, standard: STD2 }),

      // ── 상대도수 ──
      H('hard-rel-torn-total', '도수의 총합을 모르는 상대도수의 분포에서 가려진 계급을 거쳐 도수 구하기', '심58·64 / 기본 ①77 ②79·92', (d, n) => {
        if (n === 0) {
          // ② 보이는 한 계급의 도수 ÷ 상대도수 = 도수의 총합 → 가려진 계급의 상대도수(1에서 뺀다) → 그 계급의 도수.
          const g = relGrp(d, { total: d.pick([40, 50, 200]), k: 6, ok: (r) => (r[2] >= 16 || r[3] >= 16) && new Set(r).size >= 4 }), j = g.r[2] >= g.r[3] ? 2 : 3, i = d.pick(range(0, 5).filter((x) => x !== j && g.r[x] !== g.r[j])), rest = g.r.filter((v, x) => x !== j).map(r2), what = wj(g.c.what, '이/가');
          return N(`${introR(g, '그래프', true)} 그림의 일부가 찢어져 ${g.cls(j)}인 계급의 상대도수가 보이지 않는다. ${what} ${g.cls(i)}인 학생이 ${g.f[i]}명일 때, ${what} ${g.cls(j)}인 학생은 몇 명인가?`, g.f[j], { unit: '명', figure: relFig(g, g.r, { torn: [j] }),
            explain: `${g.cls(i)}인 계급의 상대도수가 ${r2(g.r[i])}이므로 전체 학생은 ${g.f[i]} ÷ ${r2(g.r[i])} = ${g.total}(명)이다. 상대도수의 총합은 1이므로 보이지 않는 계급의 상대도수는 1 − (${rest.join(' + ')}) = ${r2(g.r[j])}이다. 따라서 이 계급의 학생은 ${g.total} × ${r2(g.r[j])} = ${g.f[j]}(명)이다.`,
            facts: { value: `${g.f[i]}/${r2(g.r[i])}*(1-(${rest.join('+')}))`, unseen: [1] } });
        }
        if (n === 1) {
          // ② 빈칸의 상대도수(1에서 뺀다) → 그 계급의 도수 ÷ 상대도수 = 도수의 총합 → 물은 범위의 도수.
          const g = relGrp(d, { total: d.pick([20, 40, 50]), k: 5, ok: (r) => new Set(r).size >= 4 }), j = d.int(1, 2), rest = g.r.filter((v, x) => x !== j).map(r2), part = g.r.slice(-2), ans = g.total * sum(part) / 100, u = g.u, what = wj(g.c.what, '이/가');
          return N(`${introR(g, '상대도수의 분포표', true)} 상대도수가 ${V('A')}인 계급의 학생이 ${g.f[j]}명일 때, ${what} ${amt(g.at(3), u)} 이상인 학생은 모두 몇 명인가?`, ans, { unit: '명', figure: relTab(g, g.r.map((v, x) => (x === j ? V('A') : r2(v)))),
            explain: `상대도수의 총합은 1이므로 ${V('A')} = 1 − (${rest.join(' + ')}) = ${r2(g.r[j])}이다. 이 계급의 학생이 ${g.f[j]}명이므로 전체 학생은 ${g.f[j]} ÷ ${r2(g.r[j])} = ${g.total}(명)이다. ${amt(g.at(3), u)} 이상인 계급의 상대도수의 합은 ${part.map(r2).join(' + ')} = ${r2(sum(part))}이므로 학생 수는 ${g.total} × ${r2(sum(part))} = ${ans}(명)이다.`,
            facts: { value: `${g.f[j]}/(1-(${rest.join('+')}))*(${part.map(r2).join('+')})`, unseen: [1] } });
        }
        // ② 집단마다 (범위의 학생 수) ÷ (상대도수의 합)으로 도수의 총합을 구하고 → 가려진 계급의 상대도수를 구해 → 도수로 바꾼 다음 더한다.
        const c = d.pick(GC), k = 5, [lo, size] = frameOf(d, c, k), names = d.pick(BIG_PAIRS), [A, Bn] = names, [ta, tb] = d.pick([[120, 160], [200, 120], [160, 200], [100, 140], [140, 100], [200, 160]]), u = c.unit, what = wj(c.what, '이/가');
        const [a, b] = twoRels(d, k, 5), g = grp(c, lo, size, a), pa = ta * (a[0] + a[1]) / 100, pb = tb * (b[0] + b[1]) / 100, la = ta * a[4] / 100, lb = tb * b[4] / 100, seen = (r) => r.slice(0, 4).map(r2);
        return N(`다음은 ${pairLead(names)}의 ${wj(c.what, '을/를')} 조사하여 상대도수의 분포를 나타낸 그래프인데 일부가 찢어져 ${g.cls(4)}인 계급의 상대도수가 보이지 않는다. ${what} ${amt(g.at(2), u)} 미만인 학생이 ${A}에서는 ${pa}명, ${Bn}에서는 ${pb}명일 때, ${what} ${amt(g.at(4), u)} 이상인 학생은 ${wj(A, '과/와')} ${Bn}에서 모두 몇 명인가?`, la + lb, { unit: '명', figure: relFig2(g, a, b, names, { torn: [4] }),
          explain: `${A}에서 ${amt(g.at(2), u)} 미만인 계급의 상대도수의 합은 ${r2(a[0])} + ${r2(a[1])} = ${r2(a[0] + a[1])}이므로 전체 학생은 ${pa} ÷ ${r2(a[0] + a[1])} = ${ta}(명)이다. 보이지 않는 계급의 상대도수는 1 − (${seen(a).join(' + ')}) = ${r2(a[4])}이므로 그 학생 수는 ${ta} × ${r2(a[4])} = ${la}(명)이다. ${Bn}에서는 전체 학생이 ${pb} ÷ ${r2(b[0] + b[1])} = ${tb}(명)이고, 보이지 않는 계급의 상대도수가 1 − (${seen(b).join(' + ')}) = ${r2(b[4])}이므로 그 학생 수는 ${tb} × ${r2(b[4])} = ${lb}(명)이다. 따라서 모두 ${la} + ${lb} = ${la + lb}(명)이다.`,
          facts: { value: `${pa}/(${r2(a[0])}+${r2(a[1])})*(1-(${seen(a).join('+')}))+${pb}/(${r2(b[0])}+${r2(b[1])})*(1-(${seen(b).join('+')}))`, unseen: [1] } });
      }, { count: 3, standard: STD3 }),
      H('hard-rel-torn-two', '상대도수의 분포에서 조건으로 가려진 두 계급 가르기', '심55·59 / 기본 ②87', (d, n) => {
        const gcd = (x, y) => (y ? gcd(y, x % y) : x);
        if (n === 0) {
          // ② (보이는 범위의 학생 수) ÷ (상대도수의 합) = 도수의 총합 → 가려진 두 계급의 상대도수의 합(1에서 뺀다) → 그 학생 수를 주어진 배로 가른다.
          const RATIOS = [[2, 1], [3, 1], [3, 2]], fits = (r) => RATIOS.find(([x, y]) => r[2] * y === r[3] * x || r[3] * y === r[2] * x);
          const g = relGrp(d, { total: d.pick([40, 60, 80, 100, 200]), k: 6, ok: (r) => Boolean(fits(r)) }), r = g.r, [num, den] = fits(r), hi = r[2] > r[3] ? 2 : 3, lo = 5 - hi, u = g.u, what = wj(g.c.what, '이/가');
          const under = g.f[0] + g.f[1], vis = [0, 1, 4, 5].map((x) => r2(r[x])), both = g.f[2] + g.f[3];
          return N(`${introR(g, '그래프', true)} 그림의 일부가 찢어져 두 계급의 상대도수가 보이지 않는다. ${what} ${amt(g.at(2), u)} 미만인 학생이 ${under}명이고, ${g.cls(hi)}인 학생 수가 ${g.cls(lo)}인 학생 수의 ${den === 1 ? num : frac(num, den)}배일 때, ${what} ${g.cls(lo)}인 학생은 몇 명인가?`, g.f[lo], { unit: '명', figure: relFig(g, r, { torn: [2, 3] }),
            explain: `${amt(g.at(2), u)} 미만인 계급의 상대도수의 합이 ${r2(r[0])} + ${r2(r[1])} = ${r2(r[0] + r[1])}이므로 전체 학생은 ${under} ÷ ${r2(r[0] + r[1])} = ${g.total}(명)이다. 보이지 않는 두 계급의 상대도수의 합은 1 − (${vis.join(' + ')}) = ${r2(r[2] + r[3])}이므로 두 계급의 학생은 모두 ${g.total} × ${r2(r[2] + r[3])} = ${both}(명)이다. 두 계급의 학생 수의 비가 ${num} : ${den}이므로 ${g.cls(lo)}인 학생은 ${both} × ${frac(den, num + den)} = ${g.f[lo]}(명)이다.`,
            facts: { value: `${under}/(${r2(r[0])}+${r2(r[1])})*(1-(${vis.join('+')}))*${den}/(${num}+${den})`, unseen: [1] } });
        }
        if (n === 1) {
          // ② 도수와 상대도수가 함께 적힌 줄로 도수의 총합을 구하고 → 비어 있는 두 도수의 합을 구하고 → 비로 가른 다음 → 물은 범위의 학생 수를 구한다.
          const g = relGrp(d, { total: d.pick([40, 50, 60, 80]), k: 5, ok: (r) => { const q = gcd(r[1], r[3]); return r[1] !== r[3] && r[1] / q <= 7 && r[3] / q <= 7; } });
          const f = g.f, q = gcd(f[1], f[3]), a = f[1] / q, b = f[3] / q, u = g.u, what = wj(g.c.what, '이/가'), blank = f[1] + f[3];
          return N(`다음은 어느 중학교 학생들의 ${wj(g.c.what, '을/를')} 조사하여 나타낸 상대도수의 분포표인데 도수와 상대도수가 일부만 적혀 있다. ${what} ${g.cls(1)}인 학생 수와 ${g.cls(3)}인 학생 수의 비가 ${a} : ${b}일 때, ${what} ${amt(g.at(2), u)} 미만인 학생은 모두 몇 명인가?`, f[0] + f[1], { unit: '명',
            figure: ftab(g, { cells: [f[0], '', f[2], '', f[4]], total: '', more: [{ head: '상대도수', cells: ['', '', r2(g.r[2]), '', ''], total: '1' }] }),
            explain: `도수가 ${f[2]}인 계급의 상대도수가 ${r2(g.r[2])}이므로 도수의 총합은 ${f[2]} ÷ ${r2(g.r[2])} = ${g.total}이다. 비어 있는 두 도수의 합은 ${g.total} − (${f[0]} + ${f[2]} + ${f[4]}) = ${blank}이고, 이것을 ${a} : ${nj(b, '으로/로')} 나누면 ${g.cls(1)}인 학생은 ${blank} × ${frac(a, a + b)} = ${f[1]}(명)이다. 따라서 ${amt(g.at(2), u)} 미만인 학생은 ${f[0]} + ${f[1]} = ${f[0] + f[1]}(명)이다.`,
            facts: { value: `${f[0]}+(${f[2]}/${r2(g.r[2])}-(${f[0]}+${f[2]}+${f[4]}))*${a}/(${a}+${b})` } });
        }
        // ① 한 집단에서는 도수가 같으면 상대도수도 같다 → 가려진 한 계급의 상대도수는 보이는 범위의 상대도수의 합과 같다 → 나머지 하나는 1에서 뺀다.
        const g = relGrp(d, { total: d.pick([50, 100, 200]), k: 6, ok: (v) => v[1] === v[4] + v[5] && v[2] >= 10 }), r = g.r, u = g.u, what = wj(g.c.what, '이/가'), ends = r[4] + r[5];
        return N(`${introR(g, '그래프')} 그림의 일부가 찢어져 두 계급의 상대도수가 보이지 않는다. ${what} ${g.cls(1)}인 학생 수가 ${amt(g.at(4), u)} 이상인 학생 수와 같을 때, ${what} ${g.cls(2)}인 학생은 몇 명인가?`, g.f[2], { unit: '명', figure: relFig(g, r, { torn: [1, 2] }),
          explain: `한 집단에서 도수가 같으면 상대도수도 같으므로 ${g.cls(1)}인 계급의 상대도수는 ${amt(g.at(4), u)} 이상인 계급의 상대도수의 합인 ${r2(r[4])} + ${r2(r[5])} = ${r2(ends)}이다. 상대도수의 총합은 1이므로 ${g.cls(2)}인 계급의 상대도수는 1 − (${r2(r[0])} + ${r2(ends)} + ${r2(r[3])} + ${r2(r[4])} + ${r2(r[5])}) = ${r2(r[2])}이다. 따라서 학생 수는 ${g.total} × ${r2(r[2])} = ${g.f[2]}(명)이다.`,
          facts: { value: `${g.total}*(1-(${r2(r[0])}+${r2(r[3])}+${r2(r[4])}+${r2(r[5])})-(${r2(r[4])}+${r2(r[5])}))`, unseen: [1] } });
      }, { count: 3, standard: STD3 }),
      H('hard-rel-no-scale', '세로축의 눈금의 수가 없는 두 집단의 상대도수 그래프', '기본 ①85', (d) => {
        // ② 상대도수의 총합은 1이므로 한 집단의 점의 높이(칸 수)를 모두 더한 것이 1에 해당한다. 한 칸의 크기를 구하고 → 가려진 계급이 낀 범위의 상대도수를 구하고 → 도수의 총합을 곱한다.
        //  칸 수를 그대로 학생 수나 상대도수로 읽으면 틀린다. 한 칸이 0.05인 문항도 있고 0.04인 문항도 있다.
        const c = d.pick(GC), k = 5, [lo, size] = frameOf(d, c, k), names = d.pick(PAIRS), [A, Bn] = names, step = d.pick([5, 4]), tb = step === 5 ? d.pick([20, 40]) : d.pick([25, 50]), u = c.unit, what = wj(c.what, '이/가');
        const [a, b] = d.until(() => [K.rels(d, k, step), K.rels(d, k, step)], ([x, y]) => x[3] - y[3] >= 2 * step && uniqueMax(x) && uniqueMax(y));
        const g = grp(c, lo, size, a), au = a.map((v) => v / step), bu = b.map((v) => v / step), all = sum(au), one = 1 / all, under = sum(bu.slice(0, 3)), ans = tb * (b[3] + b[4]) / 100;
        return N(`다음은 ${pairLead(names)}의 ${wj(c.what, '을/를')} 조사하여 상대도수의 분포를 나타낸 그래프인데 세로축의 눈금의 수가 지워지고 얼룩이 묻어 ${Bn}의 그래프의 일부가 보이지 않는다. ${Bn} 학생이 ${tb}명일 때, ${Bn}에서 ${what} ${amt(g.at(3), u)} 이상인 학생은 몇 명인가?`, ans, { unit: '명',
          figure: chart({ g, rel: true, lines: [{ values: a, name: A }, { values: b, name: Bn }], ystep: step, ymajor: 5, noScale: true, blot: [1, 3] }),
          explain: `상대도수의 총합은 1이다. ${A}의 그래프에서 점의 높이는 차례로 ${au.join(', ')}칸으로 모두 ${all}칸이므로 한 칸은 1 ÷ ${all} = ${nj(one, '을/를')} 나타낸다. ${Bn}의 그래프에서 ${amt(g.at(3), u)} 미만인 계급의 점의 높이는 ${bu.slice(0, 3).join(', ')}칸으로 모두 ${under}칸이므로 상대도수의 합은 ${fx(one)} × ${under} = ${fx(one * under)}이고, ${amt(g.at(3), u)} 이상인 계급의 상대도수의 합은 1 − ${fx(one * under)} = ${fx(1 - one * under)}이다. 따라서 학생 수는 ${tb} × ${fx(1 - one * under)} = ${ans}(명)이다.`,
          facts: { value: `${tb}*((${au.join('+')})-(${bu.slice(0, 3).join('+')}))/(${au.join('+')})` } });
      }, { standard: STD3 }),
      H('hard-rel-ratio', '도수의 총합의 비와 도수의 비로 상대도수의 비 구하기', '심66', (d) => {
        // ① 상대도수는 도수를 도수의 총합으로 「나눈」 값이다. 함정: 도수의 비가 그대로 상대도수의 비라고 여기는 아이, 총합의 비를 곱하는 아이(나누어야 한다).
        const gcd = (x, y) => (y ? gcd(y, x % y) : x), byCount = d.bool();
        const [ta, tb, p, q] = d.until(() => (byCount ? d.pick([[45, 30], [20, 30], [40, 25], [24, 36], [30, 25], [32, 24]]) : [d.int(2, 7), d.int(2, 7)]).concat([d.int(2, 7), d.int(2, 7)]), ([x, y, v, w]) => x !== y && v !== w && gcd(v, w) === 1 && (byCount || gcd(x, y) === 1) && v * y !== w * x);
        const g0 = gcd(p * tb, q * ta), ra = p * tb / g0, rb = q * ta / g0;
        const text = byCount ? `A 반과 B 반의 학생 수는 각각 ${ta}명, ${tb}명이다. 어떤 계급에 속하는 A 반과 B 반의 학생 수의 비가 ${p} : ${q}일 때, 이 계급의 A 반과 B 반의 상대도수의 비를 가장 간단한 자연수의 비로 나타내시오.` : `두 집단 A, B의 도수의 총합의 비가 ${ta} : ${tb}이고 어떤 계급의 도수의 비가 ${p} : ${q}일 때, 이 계급의 상대도수의 비를 가장 간단한 자연수의 비로 나타내시오.`;
        return inline(text, '{0} : {1}', [{ answer: ra }, { answer: rb }], { shown: `${ra} : ${rb}`,
          explain: `상대도수는 도수를 도수의 총합으로 나눈 값이다. 두 집단의 도수를 ${p}, ${q}, 도수의 총합을 ${ta}, ${nj(tb, '으로/로')} 놓아도 비는 같으므로 상대도수의 비는 ${frac(p, ta)} : ${frac(q, tb)}이다. 두 수에 ${ta} × ${tb}${tail(tb, '을/를')} 곱하면 (${p} × ${tb}) : (${q} × ${ta}) = ${p * tb} : ${q * ta}${g0 > 1 ? ` = ${ra} : ${rb}` : ''}이다.`,
          facts: { calc: [[`${p}*${tb}/${g0}`, 0], [`${q}*${ta}/${g0}`, 1]], unseen: [g0] } });
      }, { standard: STD3 }),
      H('hard-rel-merge', '여러 집단을 합한 전체에서의 상대도수', '심67·68', (d, n) => {
        // ① 상대도수끼리 더하거나 평균을 내면 안 된다(집단마다 도수의 총합이 다르다). 집단마다 도수로 되돌려 더한 다음 전체 도수의 총합으로 나눈다.
        const c = d.pick(GC), k = 5, [lo, size] = frameOf(d, c, k), what = wj(c.what, '이/가');
        if (n === 0) {
          const [ta, tb] = d.pick([[20, 30], [30, 20], [40, 60], [60, 40]]), stepOf = (t) => (t % 20 === 0 ? 5 : 10);
          const [a, b, j] = d.until(() => [K.rels(d, k, stepOf(ta)), K.rels(d, k, stepOf(tb)), d.int(1, 3)], ([x, y, at]) => x[at] !== y[at]);
          const g = grp(c, lo, size, a), na = ta * a[j] / 100, nb = tb * b[j] / 100, merged = (na + nb) / (ta + tb);
          return D(`다음은 어느 중학교 1학년 남학생 ${ta}명과 여학생 ${tb}명의 ${wj(c.what, '을/를')} 조사하여 나타낸 상대도수의 분포표이다. 남학생과 여학생을 합한 전체 학생에 대하여 ${g.cls(j)}인 계급의 상대도수는?`, merged, { figure: ftab(g, { noCount: true, more: [{ head: '남학생', cells: a.map(r2), total: '1' }, { head: '여학생', cells: b.map(r2), total: '1' }] }),
            explain: `${g.cls(j)}인 학생은 남학생이 ${ta} × ${r2(a[j])} = ${na}(명), 여학생이 ${tb} × ${r2(b[j])} = ${nb}(명)이므로 모두 ${na + nb}명이다. 전체 학생은 ${ta} + ${tb} = ${ta + tb}(명)이므로 상대도수는 ${na + nb} ÷ ${ta + tb} = ${fx(merged)}이다. 남학생 수와 여학생 수가 다르므로 두 상대도수를 더하거나 평균을 내면 안 된다.`,
            facts: { value: `(${ta}*${r2(a[j])}+${tb}*${r2(b[j])})/(${ta}+${tb})` } });
        }
        // 보기: (x + y + z) ÷ 3 → 세 상대도수의 평균을 내는 아이. x + y + z → 그대로 더하는 아이. (비로 곱한 합) ÷ 3 → 학생 수의 합이 아니라 학년의 수로 나누는 아이.
        const [p, q, r] = d.pick([[4, 5, 6], [2, 3, 5], [3, 4, 5], [2, 3, 4], [3, 5, 7], [5, 6, 7]]), s = p + q + r, x = V('x'), y = V('y'), z = V('z'), t = V('a'), top = `${p}${x} + ${q}${y} + ${r}${z}`;
        const g = grp(c, lo, size, [1, 1, 1, 1, 1]), j = d.int(1, 3);
        const options = d.shuffle([[frac(top, s), true], [frac(`${x} + ${y} + ${z}`, 3), false], [`${x} + ${y} + ${z}`, false], [frac(top, 3), false]]);
        return Object.assign(C(`어느 중학교 1학년, 2학년, 3학년의 학생 수의 비는 ${p} : ${q} : ${r}이다. ${what} ${g.cls(j)}인 계급의 상대도수가 세 학년에서 차례로 ${x}, ${y}, ${z}일 때, 세 학년을 합한 전체 학생에 대한 이 계급의 상대도수를 ${x}, ${y}, ${z}를 사용한 식으로 나타낸 것은?`, options.map((o) => o[0]), options.findIndex((o) => o[1]), {
          explain: `세 학년의 학생 수를 ${p}${t}명, ${q}${t}명, ${r}${t}명이라 하면 이 계급에 속하는 학생은 차례로 ${p}${t}${x}명, ${q}${t}${y}명, ${r}${t}${z}명이고 전체 학생은 ${s}${t}명이다. 따라서 상대도수는 ${frac(`${p}${t}${x} + ${q}${t}${y} + ${r}${t}${z}`, `${s}${t}`)} = ${frac(top, s)}이다. 학년마다 학생 수가 다르므로 세 상대도수를 더하거나 평균을 내면 안 된다.`,
          facts: { truth: options.map((o) => o[1]), want: true } }), { shown: frac(top, s) });   // 틀렸을 때 답 줄에 분수 꼴 그대로 보인다(글로 옮기면 분자와 분모가 한 줄에 풀린다)
      }, { count: 2, standard: STD3 }),
      H('hard-rel-fraction-total', '분수로 나타낸 상대도수에서 도수의 총합이 될 수 있는 수', '심56', (d) => {
        // ① 도수 = (도수의 총합) × (상대도수)는 자연수이다. 그러려면 도수의 총합이 상대도수의 분모들의 공배수여야 한다.
        //  보기: 분모 가운데 몇 개의 배수이기만 한 수 → 한두 계급만 따져 보는 아이가 고른다.
        const gcd = (x, y) => (y ? gcd(y, x % y) : x), lcm = (x, y) => x * y / gcd(x, y), denOf = (w, all) => all / gcd(w, all);
        const c = d.pick(GC), [lo, size] = frameOf(d, c, 5), L = d.pick([12, 20, 24, 30, 36]);
        const f = freqs(d, 5, L, (v) => { const dens = v.map((w) => denOf(w, L)); return dens.reduce(lcm, 1) === L && dens.every((x) => x >= 2 && x <= 12) && new Set(dens).size >= 3; }, { hi: Math.floor(L / 2) });
        const dens = srt([...new Set(f.map((w) => denOf(w, L)))]), right = L * d.pick(range(1, 4).filter((m) => L * m >= 24 && L * m <= 84));
        // 틀린 보기는 분모 가운데 몇 개의 배수인 수에서 고른다(여러 분모의 배수인 것부터). 정답이 크기순으로 어느 자리에 올지 먼저 정하고 그보다 작은 수·큰 수를 채운다.
        const near = (from, to) => range(from, to).filter((v) => v % L !== 0).map((v) => [v, dens.filter((x) => v % x === 0).length]).filter((x) => x[1] >= 1), below = near(Math.max(12, right - 40), right - 1), above = near(right + 1, right + 40);
        const at = d.until(() => d.int(0, 3), (k) => below.length >= k && above.length >= 3 - k), best = (pool, n) => d.shuffle(pool).sort((x, y) => y[1] - x[1]).slice(0, n).map((x) => x[0]);
        const options = srt(best(below, at).concat([right], best(above, 3 - at))), g = grp(c, lo, size, f);
        return C(`다음은 어느 중학교 1학년 학생들의 ${wj(c.what, '을/를')} 조사하여 나타낸 상대도수의 분포표인데 상대도수를 분수로 나타내었다. 다음 중 조사한 학생 수가 될 수 있는 것은?`, options.map((v) => v + '명'), options.indexOf(right), {
          figure: ftab(g, { noCount: true, more: [{ head: '상대도수', cells: f.map((w) => frac(w / gcd(w, L), denOf(w, L))), total: '1' }] }),
          explain: `각 계급의 도수는 (도수의 총합) × (상대도수)이고 자연수이어야 한다. 그러려면 도수의 총합이 분모 ${dens.join(', ')}의 공배수, 곧 ${L}의 배수이어야 한다. 보기 가운데 ${L}의 배수는 ${right}뿐이다.`,
          facts: { truth: options.map((v) => f.every((w) => Number.isInteger(v * (w / gcd(w, L)) / denOf(w, L)))), want: true } });
      }, { standard: STD3 })
      // ══ 여기까지 다시 실은 꼴 ══
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('7-2-5', 'rep', [
    TB('rep-fit-pair', '자료에 알맞은 대푯값을 골라 구하기', '심11 / 기본 ②21·23·24', (d, n) => {
      if (n === 0) {
        // 함정: 다른 변량과 크게 차이 나는 값이 하나 있고, 가장 많이 나온 값은 자료의 한쪽 끝(가장 큰 값)이다.
        //  평균 → 대푯값은 늘 평균이라고 여기는 아이(평균은 크게 작은 값에 끌려 내려간다). 최빈값 → 가장 많이 나온 값이면 된다고 여기는 아이(가장 큰 값이라 가운데를 나타내지 못한다).
        //  틀린 중앙값 → 크기순으로 놓지 않고 적힌 차례의 5번째·6번째 값으로 구한 아이.
        const c = d.pick([{ what: '1분 동안의 윗몸 말아 올리기 횟수', unit: '회', lo: 28, hi: 42, far: [2, 5] }, { what: '1분 동안의 줄넘기 횟수', unit: '회', lo: 60, hi: 78, far: [4, 9] }, { what: '제기차기 기록', unit: '개', lo: 12, hi: 24, far: [1, 2] }]), u = c.unit;
        const list = d.until(() => { const top = d.int(c.hi - 3, c.hi), rest = many(d, 6, c.lo, top - 1); return d.shuffle([d.int(c.far[0], c.far[1]), top, top, top].concat(rest)); }, (l) => { const s = srt(l), wrong = (l[4] + l[5]) / 2; return new Set(l).size === 8 && wrong !== median(l) && new Set([fx(sum(l) / 10), fx(median(l)), fx(s[9]), fx(wrong)]).size === 4 && sum(l) / 10 <= median(l) - 1; });
        const s = srt(list), mean = sum(list) / 10, med = median(list), mo = s[9], wrong = (list[4] + list[5]) / 2;
        const options = d.shuffle([[`평균, ${amt(mean, u)}`, false], [`중앙값, ${amt(med, u)}`, true], [`최빈값, ${amt(mo, u)}`, false], [`중앙값, ${amt(wrong, u)}`, false]]);
        return C(`다음은 학생 10명의 ${wj(c.what, '을/를')} 조사하여 나타낸 자료이다. 평균, 중앙값, 최빈값 가운데 이 자료의 대푯값으로 가장 알맞은 것과 그 값을 바르게 짝 지은 것은?`, options.map((x) => x[0]), options.findIndex((x) => x[1]), { figure: dataFig(list, u),
          explain: `${amtj(s[0], u, '은/는')} 다른 변량과 크게 차이 나는 값이다. 평균 ${amtj(mean, u, '은/는')} 이 값의 영향을 받아 나머지 변량 9개 가운데 ${s.slice(1).filter((v) => v > mean).length}개보다 작고, 최빈값 ${amtj(mo, u, '은/는')} 가장 큰 값이어서 자료의 가운데를 나타내지 못한다. 크기순으로 늘어놓으면 ${s.join(', ')}이므로 중앙값은 (${s[4]} + ${s[5]}) ÷ 2 = ${amt(med, u)}이고, 이 값이 대푯값으로 가장 알맞다.`, facts: { truth: options.map((x) => x[1]), want: true } });
      }
      // 함정: 가장 많이 팔리는 크기를 알아보는 자료. 평균과 중앙값은 실제로 있는 크기도 아니다.
      //  평균·중앙값 → 대푯값을 셈으로만 구하는 아이. 「최빈값, 가장 큰 크기」 → 최빈값을 가장 큰 값으로 아는 아이.
      const sizes = range(0, 7).map((i) => 230 + 5 * i);
      const list = d.until(() => d.shuffle(Array.from({ length: 12 }, () => d.pick(sizes))), (l) => { const s = srt(l); return modes(l).length === 1 && topCount(l) >= 4 && sum(l) % 30 === 0 && (sum(l) / 30) % 2 === 1 && s[5] !== s[6] && sum(l) / 12 !== median(l) && modes(l)[0] !== s[11] && l[0] !== modes(l)[0]; });
      const s = srt(list), mean = sum(list) / 12, med = median(list), mo = modes(list)[0];
      const options = d.shuffle([[`평균, ${amt(mean, 'mm')}`, false], [`중앙값, ${amt(med, 'mm')}`, false], [`최빈값, ${amt(mo, 'mm')}`, true], [`최빈값, ${amt(s[11], 'mm')}`, false]]);
      return C('다음은 어느 가게에서 하루 동안 팔린 운동화 12켤레의 크기를 조사하여 나타낸 자료이다. 이 가게에서 가장 많이 준비해 두어야 할 운동화의 크기를 정하려고 할 때, 가장 알맞은 대푯값과 그 값을 바르게 짝 지은 것은?', options.map((x) => x[0]), options.findIndex((x) => x[1]), { figure: dataFig(list, 'mm'),
        explain: `가장 많이 팔린 크기를 알아야 하므로 최빈값이 알맞다. ${amtj(mo, 'mm', '이/가')} ${topCount(list)}켤레로 가장 많이 팔렸으므로 최빈값은 ${amt(mo, 'mm')}이다. 평균 ${amt(mean, 'mm')}와 중앙값 ${amt(med, 'mm')}는 실제로 파는 크기가 아니다.`, facts: { truth: options.map((x) => x[1]), want: true } });
    }, { count: 2, standard: STD1 })
  ]);
  B.addTypes('7-2-5', 'table', [
    TB('tab-boundary', '계급의 경계에 놓인 변량이 속하는 계급', '기본 ①27 ②44', (d) => {
      // ① 함정: 30을 「20 이상 30 미만」인 계급에 넣는 아이(앞 계급의 도수를 답한다). 「30 미만」에는 30이 들지 않고 「30 이상」에 30이 든다.
      const g = newGrp(d, { total: d.pick([26, 28, 30, 32, 34]), ok: (f) => new Set(f).size === f.length }), j = d.int(1, g.k - 2), b = g.at(j), u = g.u;
      return N(`${introG(g, '도수분포표')} ${wj(g.c.what, '이/가')} ${amt(b, u)}인 학생이 속하는 계급의 도수는?`, g.f[j], { unit: '명', figure: ftab(g),
        explain: `「${amt(b, u)} 미만」은 ${amt(b, u)}보다 작은 것이므로 ${amtj(b, u, '은/는')} ${g.cls(j - 1)}인 계급에 속하지 않는다. 「${amt(b, u)} 이상」은 ${amt(b, u)}${ut(u, '과/와')} 같거나 큰 것이므로 ${amtj(b, u, '은/는')} ${g.cls(j)}인 계급에 속하고, 그 도수는 ${g.f[j]}명이다.`, facts: { calc: [[String(g.f[j]), 0]], rule: 'boundary' } });
    }, { standard: STD2 })
  ]);
  // ── 다시 실은 꼴 가운데 기본에 둔 것 ──
  // 처음 지을 때 뺀 꼴을 다시 보고 실은 것 가운데 두 단계 안팎으로 풀리는 것(실력 묶음의 「다시 실은 꼴」과 같은 날 실었다).
  B.addTypes('7-2-5', 'rep', [
    TB('rep-mean-letter', '변량이 문자를 사용한 식인 자료의 평균으로 문자의 값 구하기', '기본 ①8', (d) => {
      // 평균 × 개수 = 총합으로 식을 세우고 일차방정식을 푼다(일차방정식은 1학기 내용이다). 변량 하나만 모르는 꼴(초등)과 달리 모든 변량에 문자가 들어 있다.
      const a = V('a');
      const made = d.until(() => ({ av: d.int(3, 9), k: d.pick([2, 3]), cs: [d.int(1, 6) * d.pick([-1, 1]), d.int(1, 7), d.int(1, 7) * d.pick([-1, 1])] }), (v) => ((3 + v.k) * v.av + sum(v.cs)) % 4 === 0 && v.cs.every((x) => v.av + x >= 1) && new Set(v.cs.map(Math.abs)).size === 3 && sum(v.cs) !== 0);
      const { av, k, cs } = made, rest = sum(cs), mean = ((3 + k) * av + rest) / 4, shown = d.shuffle(cs.map((x) => `${a} ${x < 0 ? '−' : '+'} ${Math.abs(x)}`).concat([`${k}${a}`]));
      return N(`다음 4개의 변량의 평균이 ${mean}일 때, ${a}의 값은?`, av, { figure: numbers(shown),
        explain: `변량의 총합은 4 × ${mean} = ${4 * mean}이다. 네 변량을 더하면 ${3 + k}${a} ${rest < 0 ? '−' : '+'} ${Math.abs(rest)}이므로 ${3 + k}${a} ${rest < 0 ? '−' : '+'} ${Math.abs(rest)} = ${4 * mean}에서 ${3 + k}${a} = ${4 * mean - rest}, ${a} = ${av}이다.`,
        facts: { calc: [[`(4*${mean}-(${cs.map((x) => (x < 0 ? '-' : '+') + Math.abs(x)).join('')}))/(1+1+1+${k})`, 0]], unseen: [1] } });
    }, { standard: STD1 })
  ]);
  B.addTypes('7-2-5', 'relg', [
    TB('two-rel-table-blank', '범위의 학생 수로 두 집단의 상대도수의 분포표의 빈칸 채우기', '심65', (d) => {
      // 거꾸로 한 번: (범위의 학생 수) ÷ (도수의 총합) = (그 범위의 상대도수의 합) → 적혀 있는 칸을 뺀다. 집단마다 한 칸이 더 지워져 있어 「총합은 1」로는 구할 수 없다.
      const c = d.pick(GC), k = 5, [lo, size] = frameOf(d, c, k), names = d.pick(BIG_PAIRS), [ta, tb] = d.pick([[200, 300], [100, 200], [200, 400], [300, 200]]), u = c.unit;
      const [a, b] = d.until(() => [K.rels(d, k, 2), K.rels(d, k, 2)], ([x, y]) => x[1] !== y[1] && x[0] !== x[1] && y[0] !== y[1]);
      const g = grp(c, lo, size, a), pa = ta * (a[0] + a[1]) / 100, pb = tb * (b[0] + b[1]) / 100, ea = d.int(2, 4), eb = d.int(2, 4);
      const col = (r, label, gone) => r.map((v, i) => (i === 1 ? box(label) : i === gone ? '' : r2(v)));
      return M(`다음은 ${pairCount(names, ta, tb)}의 ${wj(c.what, '을/를')} 조사하여 나타낸 상대도수의 분포표인데 일부가 지워졌다. ${wj(c.what, '이/가')} ${amt(g.at(2), u)} 미만인 학생이 ${wj(names[0], '은/는')} ${pa}명, ${wj(names[1], '은/는')} ${pb}명일 때, ㉠, ㉡에 알맞은 수는?`, [{ label: '㉠', answer: a[1] / 100, decimal: true }, { label: '㉡', answer: b[1] / 100, decimal: true }], {
        figure: ftab(g, { noCount: true, more: [{ head: names[0], cells: col(a, '㉠', ea), total: '1' }, { head: names[1], cells: col(b, '㉡', eb), total: '1' }] }),
        explain: `${names[0]}에서 ${amt(g.at(2), u)} 미만인 계급의 상대도수의 합은 ${pa} ÷ ${ta} = ${r2(a[0] + a[1])}이므로 ㉠ = ${r2(a[0] + a[1])} − ${r2(a[0])} = ${r2(a[1])}이다. ${names[1]}에서는 ${pb} ÷ ${tb} = ${r2(b[0] + b[1])}이므로 ㉡ = ${r2(b[0] + b[1])} − ${r2(b[0])} = ${r2(b[1])}이다.`,
        facts: { calc: [[`${pa}/${ta}-${r2(a[0])}`, 0], [`${pb}/${tb}-${r2(b[0])}`, 1]] } });
    }, { standard: STD3 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
