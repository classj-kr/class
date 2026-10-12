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
//
// 실력에는 ① 문제의 자료·표·그림에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(조건 하나로 빠진 변량을 구한 다음 다른 대푯값 구하기,
// 찢어진 그래프에서 가려진 도수를 구한 다음 비율 구하기, 도수의 총합부터 거꾸로 구하기, 끝에서부터 도수를 쌓아 기준이 되는 값 찾기, 두 집단의 도수 견주기)만 실었다.
// 기본에서 하는 일을 고르기로 바꾼 것, 그래프에서 값 하나를 읽는 것은 싣지 않았다. 조건을 여럿 풀어야 하는 것은 7-2-5a.js 의 「뺀 것과 까닭」에 적었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, numbers, tagged, N, M, C, D } = B.kit;
  const { range, V } = B.kit.mid;
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
      }, { standard: STD3 })
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
})(typeof window !== 'undefined' ? window : globalThis);
