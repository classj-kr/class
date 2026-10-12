// 5학년 2학기 6단원 평균과 가능성 — 가능성 그림 도구, 「가능성」의 기본 문항(말로 표현하기, 비교하기, 수로 나타내기, 자료를 보고 예상하기)과 실력 문항.
// 꼴 목록(기본꼴 1~3의 가능성 묶음, 심화꼴 64꼴)을 번호마다 따져 실었다. 꼴마다의 판정은 수집본의 _분석/5-2-6/싣기_대조표.md 에 있다.
//
// 싣는 기준(가능성)
//  - 가능성을 나타내는 말은 교육과정의 다섯 가지만 쓴다: 「불가능하다」「~아닐 것 같다」「반반이다」「~일 것 같다」「확실하다」.
//  - 가능성을 수로 답하는 문항의 답은 0, 1/2, 1뿐이다(교육과정: 「가능성이 직관적으로 파악되는 생활 속의 간단한 사건에 대하여 그 가능성을 0, 1/2, 1 등과 같은 수로 표현하게 한다」).
//    경우의 수를 세어 1/4·2/5 같은 분수로 나타내는 문항은 없다. 답 칸은 세 수 가운데 고르기이고, 개수를 묻는 문항만 수를 적는다.
//  - 답이 갈리지 않는 사건만 쓴다: 주사위, 동전, 주머니 속 구슬, 수 카드, 제비, 회전판, 달력·시계·셈의 사실. 날씨나 생활 습관처럼 사람마다 달리 답할 수 있는 글감은 쓰지 않는다.
//  - 「~일 것 같다」「~아닐 것 같다」는 가능성이 반보다 뚜렷이 크거나 작은 사건(전체의 3분의 2 이상, 3분의 1 이하)에만 쓴다(clear).
//  - 말과 수는 손으로 적지 않고 「맞는 것의 수 k와 전체의 수 n」으로 셈한다(level, claim5, claim3). 검사는 k와 n으로 답을 다시 셈한다.
//  - 회전판·주머니·가능성 띠는 이 파일의 작은 함수로 그린다. 회전판의 칸은 각도대로 그리고, 색 이름을 칸 안에 글자로도 적는다(색을 가리지 못해도 풀 수 있게). 그림 속 수는 aria-label 에 적는다.
//  - 그리는 꼴(작도)은 고르기·수 답으로 바꾸었다: 수직선에 ↓ 그리기 → 화살표를 그릴 자리 고르기, 회전판 색칠하기 → 조건에 맞는 회전판 고르기·색마다 칠할 칸 수.
//  - 자료를 보고 예상하는 문항은 실험 횟수가 같은 것끼리만 견준다(횟수가 다른 두 실험은 비율로 견주어야 하므로 6학년).
//
// 실력 문항의 잣대: 기본에서 이미 하는 일(평균 한 번 구하기, 가능성 말 하나 고르기)을 고르기로 바꾸고 틀린 보기에 흔한 실수 답을 넣은 것은 실력이 아니다. 둘만 싣는다.
//   ① 문제의 상황·그림에 장치가 있어 뜻을 정확히 대야 풀리는 문제
//      이 단원에서 아이들이 흔히 잘못 아는 것: 자료 수가 다른 두 모둠을 합계로 견준다 / 0인 자료나 적히지 않은 날을 자료의 수에서 뺀다 / 두 집단을 합친 평균을 두 평균의 가운데로 안다 /
//      새 자료가 들어온 뒤의 평균을 (처음 평균 + 새 값) ÷ 2로 구한다 / 평균을 1 올리는 데 드는 양을 1로 안다 / 칸 수가 반이면 가능성도 반이라고 본다(칸의 넓이를 보지 않는다) /
//      구슬 수가 많으면 가능성도 높다고 본다(전체에서 차지하는 몫을 보지 않는다) / 앞에서 한쪽이 여러 번 나왔으니 다음에는 다른 쪽이 나올 것이라고 본다 / 꺼낸 뒤에도 처음 개수로 따진다
//   ② 두 번 넘게 생각해야 풀리는 문제(평균에서 거꾸로 구하기를 이어 하기, 가능성에서 거꾸로 개수 구하기)
//
// 뺀 것과 까닭(가능성)
//  - 중학교 확률·경우의 수: 동전·주사위를 여러 번 던져 모두 같은 결과(①36 ②37의 글감 ③38), 두 회전판을 함께 돌린 결과(②49), 색칠하는 방법의 수(②61),
//    경우를 모두 늘어놓아야 아는 가능성(심57), 꺼낸 개수가 홀수일 가능성(②58 ③58의 변형 — 개수마다 가능성이 같다는 근거가 없다)
//  - 비둘기 집 따지기: 생일이 같은 사람(②39의 변형 심58)
//  - 뜻 없는 셈: 두 가능성의 수를 더하기(①51 심51 — 1 1/2은 가능성으로 뜻이 없다)
//  - 6학년 비율: 횟수가 다른 두 실험 견주기(①61), 횟수의 비로 색깔별 개수 가르기(③72), 넓이가 전체의 1/4·몇 배인 조건으로 색 정하기(①53 심46의 변형)
//  - 답이 갈리는 글감: 날씨·옷차림·일기 예보(①30의 일부 ①37 ②70 ③42), 신호등(심50의 변형), ○× 문제의 정답(①45의 변형 ③56의 글감 심50의 변형)
//  - 서술형·활동: 가능성에 맞는 일 쓰기(①38 ②47 ③44·65 심45), 직접 해 보기(②71), 까닭 쓰기 — 고쳐 쓰기(②46 ③45·46 심44)는 바르게 고친 것 고르기로 바꾸어 실었다.
//  - 같은 일: 일 여럿과 말 여럿 잇기(③43)는 주사위 조건의 말 고르기를 여러 번 하는 것이고, 수로 잘못 말한 사람 찾기(③66)는 말로 잘못 말한 사람 찾기·가능성이 1(0)인 일 찾기와,
//    한 통의 세 사건 차례(③54)는 주사위 조건의 차례와, 결과에 맞는 주사위 전개도 고르기(①60)는 결과에 맞는 주머니 고르기와 하는 일이 같다(전개도 자체는 5-2-5의 일이다).
//    10회 결과로 더 나올 색(③71)은 막대그래프에서 가장 많이 나온 색 찾기와 같다.
// 묻는 말: 수나 값을 물으면 "~은?/~는?", 양을 물으면 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, frac, table, lines, tagged, cards, barChart, N, M, C } = B.kit;
  const { AVG, SAY, NUM, JUDGE, sum, mean, top, low, distinct, plus, E, worked, who, data, DAYS5, TAGS, tab, rowsTab, truthOf, barsWith } = B.kit.avg526;
  const U = '5-2-6';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣', '㉤'];

  // ── 가능성의 말과 수 ─────────────────────────────────────────
  const W5 = ['불가능하다', '~아닐 것 같다', '반반이다', '~일 것 같다', '확실하다'], W3 = ['불가능하다', '반반이다', '확실하다'];
  const HALF = frac(1, 2), N3 = ['0', HALF, '1'];
  // 전체 n 가운데 k 가 맞을 때의 가능성: 0 불가능하다, 1 ~아닐 것 같다, 2 반반이다, 3 ~일 것 같다, 4 확실하다
  const level = (k, n) => (k === 0 ? 0 : k === n ? 4 : 2 * k === n ? 2 : 2 * k < n ? 1 : 3);
  // 말이 갈리지 않는 가능성: 없음·전부·꼭 반이거나, 반보다 뚜렷이 적거나(3분의 1 이하) 많은(3분의 2 이상) 것
  const clear = (k, n) => k === 0 || k === n || 2 * k === n || 3 * k <= n || 3 * k >= 2 * n;
  // 검사가 k 와 n 으로 답의 자리를 다시 셈한다. 다섯 말의 자리 = (k > 0) + (2k ≥ n 인 만큼) + (2k > n) 을 몫으로 적은 식.
  const idx = (k, n) => `(${k}+${n}-1-(${k}+${n}-1)%${n})/${n}+(2*${k}-(2*${k})%${n})/${n}+((2*${k}-1)-(2*${k}-1)%${n})/${n}`;
  const claim5 = (k, n) => { if (!clear(k, n)) throw new Error(`말이 갈리는 가능성: ${n} 가운데 ${k}`); return { claimed: W5.map((_, i) => [idx(k, n), i]), claimedWant: true }; };
  // 세 보기(0·불가능하다, 1/2·반반이다, 1·확실하다)의 자리
  const claim3 = (k, n) => ({ claimed: [[`${k}+1`, 1], [`${k}*2`, n], [String(k), n]], claimedWant: true });
  const three = (k, n) => (k === 0 ? 0 : 2 * k === n ? 1 : 2);
  const amount = (k, unit) => josa(`${k}${unit}`, '으로/로');
  const because = (k, n, unit) => [
    '일어날 수 없는 일이므로 가능성은 「불가능하다」이다.',
    `${n}${unit} 가운데 ${amount(k, unit)} 반보다 적으므로 가능성은 「~아닐 것 같다」이다.`,
    `${n}${unit} 가운데 ${amount(k, unit)} 꼭 반이므로 가능성은 「반반이다」이다.`,
    `${n}${unit} 가운데 ${amount(k, unit)} 반보다 많으므로 가능성은 「~일 것 같다」이다.`,
    '언제나 일어나는 일이므로 가능성은 「확실하다」이다.'][level(k, n)];
  const becauseNum = (k, n, unit) => (k === 0 ? '일어날 수 없는 일이므로 가능성은 「불가능하다」이고, 수로 나타내면 0이다.'
    : k === n ? '언제나 일어나는 일이므로 가능성은 「확실하다」이고, 수로 나타내면 1이다.'
      : `${n}${unit} 가운데 ${amount(k, unit)} 꼭 반이므로 가능성은 「반반이다」이고, 수로 나타내면 ${HALF}이다.`);

  // 주사위 눈·수 카드의 조건. will: 「눈의 수가 ~ 가능성」, fin: 「눈의 수가 ~」(문장), is: 수를 이르는 말, subject: 풀이의 주어
  const cond = (kind, b) => ({
    ge: { test: (x) => x >= b, will: `${b} 이상일`, fin: `${b} 이상이다`, is: `${b} 이상인 수`, subject: `${b} 이상인 수는` },
    le: { test: (x) => x <= b, will: `${b} 이하일`, fin: `${b} 이하이다`, is: `${b} 이하인 수`, subject: `${b} 이하인 수는` },
    gt: { test: (x) => x > b, will: `${b}보다 클`, fin: `${b}보다 크다`, is: `${b}보다 큰 수`, subject: `${b}보다 큰 수는` },
    lt: { test: (x) => x < b, will: `${b}보다 작을`, fin: `${b}보다 작다`, is: `${b}보다 작은 수`, subject: `${b}보다 작은 수는` },
    even: { test: (x) => x % 2 === 0, will: '짝수일', fin: '짝수이다', is: '짝수', subject: '짝수는' },
    odd: { test: (x) => x % 2 === 1, will: '홀수일', fin: '홀수이다', is: '홀수', subject: '홀수는' },
    mult: { test: (x) => x % b === 0, will: `${b}의 배수일`, fin: `${b}의 배수이다`, is: `${b}의 배수`, subject: `${b}의 배수는` },
    div: { test: (x) => b % x === 0, will: `${b}의 약수일`, fin: `${b}의 약수이다`, is: `${b}의 약수`, subject: `${b}의 약수는` },
    ndiv: { test: (x) => b % x !== 0, will: `${b}의 약수가 아닐`, fin: `${b}의 약수가 아니다`, is: `${b}의 약수가 아닌 수`, subject: `${b}의 약수가 아닌 수는` },
    eq: { test: (x) => x === b, will: `${b}일`, fin: `${b}이다`, is: String(b), subject: josa(b, '은/는'), single: true }
  }[kind]);
  const told = (c, list) => { const h = list.filter(c.test); return !h.length ? `${c.subject} 없다` : c.single ? `${c.subject} 하나뿐이다` : h.length === list.length ? `${c.subject} ${h.join(', ')}의 ${h.length}개 모두이다` : `${c.subject} ${h.join(', ')}의 ${h.length}개이다`; };
  const DIE = [1, 2, 3, 4, 5, 6];
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

  // 일이 일어날 가능성이 정해져 있는 문장. [문장, 까닭]을 가능성의 자리(0~4)마다 모았다. 달력·셈·주사위·주머니·수 카드·제비뿐이다.
  const SAYS = [
    [['주사위를 굴리면 눈의 수가 7이 나올 것이다.', '주사위의 눈은 1부터 6까지이다'], ['월요일의 다음 날은 목요일일 것이다.', '월요일의 다음 날은 화요일이다'], ['흰색 공만 3개 든 주머니에서 꺼낸 공은 검은색일 것이다.', '검은색 공이 없다'],
      ['1부터 10까지의 수 카드 가운데 한 장을 뽑으면 12가 나올 것이다.', '12가 적힌 카드가 없다'], ['주사위 두 개를 굴리면 나온 눈의 수의 합이 13일 것이다.', '눈의 수의 합은 가장 클 때 6 + 6 = 12이다'], ['5월의 다음 달은 7월일 것이다.', '5월의 다음 달은 6월이다']],
    [['주사위를 굴리면 눈의 수가 1이 나올 것이다.', '눈 6개 가운데 1개이다'], ['빨간색 구슬 1개와 파란색 구슬 5개가 든 주머니에서 꺼낸 구슬은 빨간색일 것이다.', '구슬 6개 가운데 1개이다'],
      ['1부터 10까지의 수 카드 가운데 한 장을 뽑으면 10이 나올 것이다.', '카드 10장 가운데 1장이다'], ['당첨 제비 1개와 당첨이 아닌 제비 9개가 든 상자에서 뽑은 제비는 당첨 제비일 것이다.', '제비 10개 가운데 1개이다']],
    [['동전을 던지면 숫자 면이 나올 것이다.', '그림 면과 숫자 면이 나올 가능성이 같다'], ['주사위를 굴리면 눈의 수가 짝수일 것이다.', '눈 6개 가운데 2, 4, 6의 3개이다'], ['흰색 공 2개와 검은색 공 2개가 든 주머니에서 꺼낸 공은 흰색일 것이다.', '공 4개 가운데 2개이다'],
      ['1부터 10까지의 수 카드 가운데 한 장을 뽑으면 홀수가 나올 것이다.', '카드 10장 가운데 5장이다'], ['당첨 제비 3개와 당첨이 아닌 제비 3개가 든 상자에서 뽑은 제비는 당첨 제비일 것이다.', '제비 6개 가운데 3개이다']],
    [['주사위를 굴리면 눈의 수가 2 이상으로 나올 것이다.', '눈 6개 가운데 5개이다'], ['빨간색 구슬 5개와 파란색 구슬 1개가 든 주머니에서 꺼낸 구슬은 빨간색일 것이다.', '구슬 6개 가운데 5개이다'],
      ['당첨 제비 4개와 당첨이 아닌 제비 1개가 든 상자에서 뽑은 제비는 당첨 제비일 것이다.', '제비 5개 가운데 4개이다'], ['1부터 10까지의 수 카드 가운데 한 장을 뽑으면 9 이하인 수가 나올 것이다.', '카드 10장 가운데 9장이다']],
    [['주사위를 굴리면 눈의 수가 6 이하로 나올 것이다.', '주사위의 눈은 모두 6 이하이다'], ['토요일의 다음 날은 일요일일 것이다.', '토요일의 다음 날은 언제나 일요일이다'], ['파란색 구슬만 4개 든 주머니에서 꺼낸 구슬은 파란색일 것이다.', '구슬이 모두 파란색이다'],
      ['12월의 다음 달은 1월일 것이다.', '12월의 다음 달은 언제나 1월이다'], ['1부터 10까지의 수 카드 가운데 한 장을 뽑으면 10 이하인 수가 나올 것이다.', '카드의 수는 모두 10 이하이다'], ['9월의 다음 달은 10월일 것이다.', '9월의 다음 달은 언제나 10월이다']]
  ];
  // 가능성의 자리 목록대로 문장을 하나씩 뽑는다(같은 문장은 두 번 뽑지 않는다).
  const pickSays = (d, levels) => { const out = []; for (const lv of levels) { const s = d.until(() => d.pick(SAYS[lv]), (x) => !out.some((o) => o.text === x[0])); out.push({ text: s[0], why: s[1], lv }); } return out; };
  const saysWhy = (rows) => rows.map((r, i) => `${LAB[i]}은 「${W5[r.lv]}」이다(${r.why}).`).join(' ');
  const PERM3 = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  // 차례를 묻는 보기 넷: 바른 차례와 다른 차례 셋
  const orderOptions = (d, right, perms) => d.shuffle([right].concat(d.shuffle(perms.filter((p) => p.join() !== right.join())).slice(0, 3)));
  const sortBy = (values, down) => values.map((_, i) => i).sort((x, y) => (down ? values[y] - values[x] : values[x] - values[y]));

  // ── 그림 ────────────────────────────────────────────────────
  const INK = { 빨강: '#f87171', 파랑: '#60a5fa', 노랑: '#fde047', 초록: '#4ade80', 보라: '#c4b5fd', 주황: '#fdba74', 흰색: '#ffffff', 검정: '#374151' };
  const HUE = { 빨강: '빨간색', 파랑: '파란색', 노랑: '노란색', 초록: '초록색', 보라: '보라색', 주황: '주황색', 흰색: '흰색', 검정: '검은색' };
  // 회전판. parts: [[색(또는 칸에 적을 글), 각도], …] — 12시에서 시계 방향으로 놓는다. 칸은 각도대로 그리고 색 이름을 칸 안에 적는다.
  // o: { tag: 판의 이름, size: 그림의 크기, said: 그림 설명 }. 색이 아닌 글(수·기호)을 넘기면 칸을 칠하지 않고 그 글만 적는다.
  function spinner(parts, o) {
    const opt = o || {}, size = opt.size || 112, R = size / 2 - 5, cx = size / 2, cy = size / 2, at = (deg, r) => [cx + r * Math.cos(deg * Math.PI / 180), cy + r * Math.sin(deg * Math.PI / 180)];
    let a = -90, wedges = '', words = '';
    parts.forEach(([key, deg]) => {
      const fill = INK[key] || '#ffffff', whole = deg >= 360, [tx, ty] = whole ? [cx, cy + R * 0.5] : at(a + deg / 2, R * (deg >= 180 ? 0.5 : 0.67));
      if (whole) wedges += `<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:${fill};stroke:#1f2937;stroke-width:1.3"/>`;
      else { const [x1, y1] = at(a, R), [x2, y2] = at(a + deg, R); wedges += `<path d="M${cx} ${cy}L${x1.toFixed(1)} ${y1.toFixed(1)}A${R} ${R} 0 ${deg > 180 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}Z" style="fill:${fill};stroke:#1f2937;stroke-width:1.3;stroke-linejoin:round"/>`; }
      const narrow = deg < 60 || (size < 100 && deg < 90), word = INK[key] ? (narrow ? key[0] : key) : String(key), fs = INK[key] ? (narrow ? 10 : 11) : typeof key === 'number' ? 13 : 16;
      words += `<text x="${tx.toFixed(1)}" y="${(ty + fs * 0.36).toFixed(1)}" text-anchor="middle" style="font-size:${fs}px;font-weight:700;fill:${key === '검정' ? '#ffffff' : '#111827'}">${word}</text>`;
      a += deg;
    });
    const needle = `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${(cy - R * 0.3).toFixed(1)}" style="stroke:#111827;stroke-width:2.2"/><path d="M${cx} ${(cy - R * 0.44).toFixed(1)}l-4 7.5h8z" style="fill:#111827"/><circle cx="${cx}" cy="${cy}" r="3.2" style="fill:#111827"/>`;
    const keys = [...new Set(parts.map((p) => p[0]))], even = parts.every((p) => p[1] === parts[0][1]), colored = Boolean(INK[parts[0][0]]);
    const said = opt.said || (!colored ? (even ? `똑같이 ${parts.length}칸으로 나누어 칸마다 ${parts.map((p) => p[0]).join(', ')}${typeof parts[0][0] === 'number' ? '의 수' : ''}를 적었다` : `크기가 다른 ${parts.length}칸: ${parts.map((p) => `${p[0]} ${p[1]}도`).join(', ')}`)
      : even ? `똑같이 ${parts.length}칸으로 나누어 ${keys.map((k) => `${HUE[k]} ${parts.filter((p) => p[0] === k).length}칸`).join(', ')}`
        : `크기가 다른 ${parts.length}칸으로 나누어 ${keys.map((k) => `${HUE[k]} ${parts.filter((p) => p[0] === k).length}칸(모두 ${sum(parts.filter((p) => p[0] === k).map((p) => p[1]))}도)`).join(', ')}`);
    const label = opt.tag ? `<text class="mb-axis-label" style="font-size:${/[가-힣]/.test(opt.tag) ? 12.5 : 15}px" x="${cx}" y="${size + 12}" text-anchor="middle">${opt.tag}</text>` : '';
    return `<svg class="mb-geo" viewBox="0 0 ${size} ${size + (opt.tag ? 17 : 0)}" width="${size}" role="img" aria-label="회전판${opt.tag ? ' ' + opt.tag : ''}: ${said}">${wedges}${words}${needle}${label}</svg>`;
  }
  // 똑같이 n칸으로 나눈 회전판의 칸: counts [[색, 칸 수], …]를 섞어 놓는다.
  const wheel = (d, n, counts) => d.shuffle(counts.reduce((list, [key, k]) => list.concat(Array.from({ length: k }, () => key)), [])).map((key) => [key, 360 / n]);
  // 그림 여럿을 두 줄씩(또는 한 줄로) 가지런히 놓는다.
  const grid = (list, cols) => `<div style="display:grid;grid-template-columns:repeat(${cols || 2}, auto);gap:8px ${cols === 3 ? 8 : 18}px;justify-content:start;align-items:end">${list.join('')}</div>`;
  // 주머니. counts: [[색, 개수], …], o: { tag: 주머니의 이름, thing: 든 것(구슬·공·바둑돌), order: 놓는 차례(색 이름의 배열), cols: 한 줄의 개수 }
  const DOT = { 빨강: '빨', 파랑: '파', 노랑: '노', 초록: '초', 보라: '보', 주황: '주', 흰색: '흰', 검정: '검' };
  function bag(counts, o) {
    const opt = o || {}, cols = opt.cols || 4, order = opt.order || counts.reduce((list, [key, k]) => list.concat(Array.from({ length: k }, () => key)), []), rows = Math.max(1, Math.ceil(order.length / cols)), g = 22, W = cols * g + 14, y0 = 18, body = rows * g + 12, thing = opt.thing || '구슬';
    let out = `<path d="M${(W * 0.3).toFixed(1)} 4H${(W * 0.7).toFixed(1)}L${(W * 0.64).toFixed(1)} ${y0}H${(W * 0.36).toFixed(1)}Z" style="fill:#e7d3b0;stroke:#7c5a2e;stroke-width:1.3;stroke-linejoin:round"/><rect x="3" y="${y0}" width="${W - 6}" height="${body}" rx="13" style="fill:#fbf3e4;stroke:#7c5a2e;stroke-width:1.4"/><line x1="${(W * 0.34).toFixed(1)}" y1="${y0}" x2="${(W * 0.66).toFixed(1)}" y2="${y0}" style="stroke:#7c5a2e;stroke-width:2.8;stroke-linecap:round"/>`;
    order.forEach((key, i) => {
      const x = 7 + g / 2 + (i % cols) * g, y = y0 + 6 + g / 2 + Math.floor(i / cols) * g;
      out += `<circle cx="${x}" cy="${y}" r="9.2" style="fill:${INK[key]};stroke:#1f2937;stroke-width:1.1"/><text x="${x}" y="${y + 3.4}" text-anchor="middle" style="font-size:9.5px;font-weight:700;fill:${key === '검정' ? '#ffffff' : '#111827'}">${DOT[key]}</text>`;
    });
    if (opt.tag) out += `<text class="mb-axis-label" style="font-size:12.5px" x="${W / 2}" y="${y0 + body + 15}" text-anchor="middle">${opt.tag}</text>`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${y0 + body + (opt.tag ? 20 : 5)}" width="${W}" role="img" aria-label="주머니${opt.tag ? ' ' + opt.tag : ''}: ${counts.filter((c) => c[1] > 0).map(([key, k]) => `${HUE[key]} ${thing} ${k}개`).join(', ')}">${out}</svg>`;
  }
  const mixed = (d, counts) => d.shuffle(counts.reduce((list, [key, k]) => list.concat(Array.from({ length: k }, () => key)), []));
  // 가능성을 나타낸 띠. tops: 눈금 다섯 개 위에 적는 글(말이나 기호, 빈 글이면 적지 않는다), nums: 왼쪽 끝·가운데·오른쪽 끝 아래에 적는 수(기호도 된다, '1/2'은 분수로 그린다),
  // under: 왼쪽 끝·가운데·오른쪽 끝 아래에 적는 말.
  function band(o) {
    const tops = o.tops, nums = o.nums, under = o.under, long = tops.some((t) => t.length > 2), x = (i) => 36 + i * 53, axis = long ? 50 : 34, word = 'font-weight:700;fill:#111827';
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${axis}" x2="${x(4)}" y2="${axis}" style="stroke-width:2"/>`;
    tops.forEach((t, i) => {
      if (!t && o.arrow == null) return;
      out += `<line class="mb-axis" x1="${x(i)}" y1="${axis - 7}" x2="${x(i)}" y2="${axis + 7}" style="stroke-width:1.8"/>`;
      if (!t) return;
      const y = long ? (i % 2 === 0 ? 14 : 34) : 18;
      if (long && i % 2 === 0) out += `<line x1="${x(i)}" y1="19" x2="${x(i)}" y2="${axis - 9}" style="stroke:#94a3b8;stroke-width:1;stroke-dasharray:2 2"/>`;
      out += `<text x="${x(i)}" y="${y}" text-anchor="middle" style="font-size:${t.length > 2 ? 13 : 17}px;${word}">${t}</text>`;
    });
    if (o.arrow != null) out += `<path d="M${x(o.arrow)} ${axis - 9}l-6.5 -12h13z" style="fill:#dc2626"/>`;
    let bottom = axis + 9;
    if (nums) {
      [0, 2, 4].forEach((i, j) => {
        const t = nums[j], y = axis + 25;
        out += t === '1/2' ? `<text x="${x(i)}" y="${y - 2}" text-anchor="middle" style="font-size:13.5px;${word}">1</text><line x1="${x(i) - 7}" y1="${y + 2}" x2="${x(i) + 7}" y2="${y + 2}" style="stroke:#111827;stroke-width:1.4"/><text x="${x(i)}" y="${y + 16}" text-anchor="middle" style="font-size:13.5px;${word}">2</text>`
          : `<text x="${x(i)}" y="${y + 5}" text-anchor="middle" style="font-size:${/\d/.test(t) ? 14.5 : 17}px;${word}">${t}</text>`;
      });
      bottom = axis + 44;
    }
    if (under) { [0, 2, 4].forEach((i, j) => { out += `<text x="${x(i)}" y="${bottom + 13}" text-anchor="middle" style="font-size:13px;${word}">${under[j]}</text>`; }); bottom += 19; }
    const said = (o.arrow != null ? `가능성을 나타낸 띠: 눈금 다섯 개 가운데 왼쪽에서 ${o.arrow + 1}째 눈금 위에 화살표` : (tops.every(Boolean) ? '가능성을 나타낸 띠: 눈금 다섯 개 위에 왼쪽부터 ' : '가능성을 나타낸 수직선: 왼쪽 끝, 가운데, 오른쪽 끝의 눈금 위에 ') + tops.filter(Boolean).join(', ')) + (nums ? `. 왼쪽 끝, 가운데, 오른쪽 끝 아래의 수는 ${nums.join(', ')}` : '') + (under ? `. 왼쪽 끝, 가운데, 오른쪽 끝 아래의 말은 ${under.join(', ')}` : '');
    return `<svg class="mb-numberline" viewBox="0 0 284 ${bottom + 4}" width="284" role="img" aria-label="${said}">${out}</svg>`;
  }

  // ── 가능성을 말로 표현하기 ───────────────────────────────────
  B.addTypes(U, 'word', [
    T('word-term', '가능성의 뜻', '②35의 변형', (d) => {
      const list = d.shuffle(['가능성', '평균', '자료', '횟수']);
      return C('어떤 일이 일어나기를 기대할 수 있는 정도를 무엇이라고 하는가?', list, list.indexOf('가능성'), {
        explain: '어떤 일이 일어나기를 기대할 수 있는 정도를 가능성이라고 한다. 가능성은 「불가능하다」, 「~아닐 것 같다」, 「반반이다」, 「~일 것 같다」, 「확실하다」와 같은 말로 나타낼 수 있다.', facts: { truth: list.map((w) => w === '가능성'), want: true }
      });
    }),
    T('word-order', '가능성을 나타내는 말의 차례', '①44의 변형 ②35', (d) => {
      const [i, j] = d.pick([[2, 4], [1, 3], [0, 2], [1, 4], [0, 3], [2, 3]]), x = d.pick([0, 1, 2, 3, 4].filter((k) => k !== i && k !== j));
      const rows = d.shuffle([[[i, j], true], [[j, i], false], [[i, x], false], [[x, j], false]]);
      return C('일이 일어날 가능성을 나타내는 말을 가능성이 낮은 것부터 차례로 놓은 것이다. ㉠, ㉡에 알맞은 말을 차례대로 쓴 것은?', rows.map(([p]) => `${W5[p[0]]}, ${W5[p[1]]}`), rows.findIndex((r) => r[1]), {
        figure: band({ tops: W5.map((w, k) => (k === i ? '㉠' : k === j ? '㉡' : w)) }),
        explain: `가능성이 낮은 것부터 차례로 「불가능하다」, 「~아닐 것 같다」, 「반반이다」, 「~일 것 같다」, 「확실하다」이다. ㉠은 「${W5[i]}」, ㉡은 「${W5[j]}」이다.`, facts: truthOf(rows, true)
      });
    }),
    T('word-fact', '달력·시계·셈의 사실 → 확실하다, 불가능하다', '①30·31 ②36 ③34 심35', (d, n) => {
      const SURE = [['금요일의 다음 날은 토요일일 것이다.', '금요일의 다음 날은 언제나 토요일이다.'], ['3월의 다음 달은 4월일 것이다.', '3월의 다음 달은 언제나 4월이다.'], ['오후 2시에서 1시간이 지나면 오후 3시가 될 것이다.', '오후 2시에서 1시간이 지나면 언제나 오후 3시이다.'], ['계산기로 3 + 4를 계산하면 7이 나올 것이다.', '3 + 4 = 7이므로 언제나 7이 나온다.']];
      const NEVER = [['월요일의 다음 날은 수요일일 것이다.', '월요일의 다음 날은 언제나 화요일이다.'], ['올해 12월에는 32일이 있을 것이다.', '12월은 31일까지 있다.'], ['계산기로 5 × 2를 계산하면 11이 나올 것이다.', '5 × 2 = 10이므로 11은 나올 수 없다.'], ['내년 2월에는 30일이 있을 것이다.', '2월은 28일이나 29일까지 있다.']];
      const [text, why] = d.pick(n === 0 ? SURE : NEVER), answer = n === 0 ? 2 : 0;
      return C('다음 일이 일어날 가능성을 말로 나타낸 것은?', W3, answer, {
        figure: lines([text]), explain: `${why} ${n === 0 ? '언제나 일어나는 일이므로' : '일어날 수 없는 일이므로'} 가능성은 「${W3[answer]}」이다.`, facts: { truth: W3.map((_, i) => i === answer), want: true }
      });
    }, { count: 2 }),
    T('word-half', '둘 가운데 하나인 일 → 반반이다', '①31 ②36 ③35', (d) => {
      const [text, k, n, unit, why] = d.pick([
        ['100원짜리 동전 한 개를 던질 때 숫자 면이 나올 가능성', 1, 2, '면', '동전은 그림 면과 숫자 면의 두 면이 있고, 두 면이 나올 가능성이 같다.'],
        ['1과 2가 적힌 수 카드 2장 가운데 한 장을 뽑을 때 2가 적힌 카드를 뽑을 가능성', 1, 2, '장', '카드 2장 가운데 2가 적힌 카드는 1장이다.'],
        ['1부터 20까지의 번호가 적힌 번호표 20장 가운데 한 장을 뽑을 때 번호가 짝수일 가능성', 10, 20, '장', '번호표 20장 가운데 짝수가 적힌 것은 10장이다.']]);
      return C(`${josa(text, '을/를')} 말로 나타낸 것은?`, W3, 1, { explain: `${why} ${because(k, n, unit)}`, facts: claim3(k, n) });
    }),
    T('word-dice', '주사위 눈의 조건 → 다섯 가지 말', '①32 ②37 ③36 심38', (d, n) => {
      const pools = [[['le', 5], ['ge', 2], ['eq', d.int(1, 6)], ['le', 2], ['ge', 5]], [['even'], ['odd'], ['gt', 3], ['lt', 4], ['ge', 4], ['le', 3]], [['eq', d.int(7, 9)], ['gt', 6], ['lt', 1], ['ge', 7]]];
      const [kind, b] = d.pick(pools[n]), c = cond(kind, b), k = DIE.filter(c.test).length;
      return C(`주사위를 한 번 굴릴 때, 나온 눈의 수가 ${c.will} 가능성을 말로 나타낸 것은?`, W5, level(k, 6), {
        explain: `주사위의 눈 1, 2, 3, 4, 5, 6 가운데 ${told(c, DIE)}. ${because(k, 6, '개')}`, facts: Object.assign(claim5(k, 6), { rule: 'word-dice-' + n })
      });
    }, { count: 3 }),
    T('word-cards', '수 카드 묶음의 조건 → 다섯 가지 말', '①32·43 ③37 심37의 변형', (d) => {
      const [list, kind, b] = d.until(() => { const [kd, bb] = d.pick([['even'], ['odd'], ['mult', 3], ['mult', 5], ['gt', 10], ['lt', 10], ['ge', 12], ['le', 8], ['div', 12], ['div', 20]]); return [d.shuffle(range(1, 20)).slice(0, 6).sort((x, y) => x - y), kd, bb]; }, ([l, kd, bb]) => { const k = l.filter(cond(kd, bb).test).length; return k >= 1 && k <= 5; });
      const c = cond(kind, b), k = list.filter(c.test).length;
      return C(`수 카드 6장 가운데 한 장을 뽑을 때, 뽑은 카드에 적힌 수가 ${c.will} 가능성을 말로 나타낸 것은?`, W5, level(k, 6), {
        figure: cards(list), explain: `카드에 적힌 수 가운데 ${told(c, list)}. ${because(k, 6, '장')}`, facts: claim5(k, 6)
      });
    }),
    T('word-bag-text', '글로 준 주머니 속 개수 → 다섯 가지 말', '①33 ②37 ③39 심37', (d) => {
      const [a, b] = d.pick([[3, 1], [4, 1], [5, 1], [6, 2], [5, 2], [2, 1]]), few = d.bool(), k = few ? b : a;
      return C(`통에 검은색 바둑돌 ${a}개와 흰색 바둑돌 ${b}개가 들어 있다. 이 통에서 바둑돌 1개를 꺼낼 때, ${few ? '흰색' : '검은색'} 바둑돌이 나올 가능성을 말로 나타낸 것은?`, W5, level(k, a + b), {
        explain: `바둑돌은 모두 ${a} + ${b} = ${a + b}(개)이고, 그 가운데 ${few ? '흰색' : '검은색'} 바둑돌은 ${k}개이다. ${because(k, a + b, '개')}`, facts: claim5(k, a + b)
      });
    }),
    T('word-bag-pic', '그림으로 준 주머니 → 가능성을 말로', '①33의 변형 ②38 ③40', (d) => {
      const kind = d.pick(['half', 'none', 'all']), k = d.int(2, 4);
      const counts = kind === 'half' ? [['빨강', k], ['파랑', k]] : kind === 'none' ? [['빨강', k + 1], ['파랑', k]] : [['파랑', 2 * k]], ask = kind === 'half' ? d.pick(['빨강', '파랑']) : kind === 'none' ? '노랑' : '파랑';
      const total = sum(counts.map((c) => c[1])), hit = (counts.find((c) => c[0] === ask) || [ask, 0])[1];
      return C(`주머니에 든 구슬을 나타낸 것이다. 이 주머니에서 구슬 1개를 꺼낼 때, ${HUE[ask]} 구슬이 나올 가능성을 말로 나타낸 것은?`, W5, level(hit, total), {
        figure: bag(counts, { order: mixed(d, counts) }),
        explain: `주머니에 든 구슬은 ${counts.map(([key, x]) => `${HUE[key]} ${x}개`).join(', ')}이다. ${hit === 0 ? `${HUE[ask]} 구슬은 없다. ` : hit === total ? `구슬이 모두 ${HUE[ask]}이다. ` : `구슬 ${total}개 가운데 ${HUE[ask]} 구슬은 ${hit}개이다. `}${because(hit, total, '개')}`, facts: claim5(hit, total)
      });
    }),
    T('word-bag-add', '구슬을 더 넣은 뒤의 가능성', '①33의 변형', (d) => {
      const base = d.pick([3, 4, 5]), add = d.bool() ? base : base * 3;
      return C(`주머니에 빨간색 구슬만 ${base}개 들어 있다. 여기에 보라색 구슬 ${add}개를 더 넣은 다음 구슬 1개를 꺼낼 때, 빨간색 구슬이 나올 가능성을 말로 나타낸 것은?`, W5, level(base, base + add), {
        explain: `보라색 구슬을 넣은 뒤 구슬은 모두 ${base} + ${add} = ${base + add}(개)이고, 그 가운데 빨간색 구슬은 ${base}개이다. ${because(base, base + add, '개')} 빨간색 구슬만 있을 때에는 「확실하다」였지만 다른 색 구슬을 넣으면 가능성이 낮아진다.`, facts: claim5(base, base + add)
      });
    }),
    T('word-spin', '회전판 → 가능성을 말로', '①34 ②38의 변형 ③40 심36', (d) => {
      const [n, k] = d.pick([[4, 1], [4, 3], [6, 1], [6, 2], [6, 4], [6, 5], [8, 2], [8, 6], [8, 7], [8, 1], [4, 2], [8, 4]]), other = d.pick(['파랑', '노랑']);
      return C('회전판을 돌릴 때, 화살이 빨간색에 멈출 가능성을 말로 나타낸 것은?', W5, level(k, n), {
        figure: spinner(wheel(d, n, [['빨강', k], [other, n - k]])),
        explain: `회전판은 똑같이 ${n}칸으로 나뉘어 있고, 그 가운데 빨간색은 ${k}칸이다. ${because(k, n, '칸')}`, facts: claim5(k, n)
      });
    }),
    T('word-timetable', '시간표를 보고 가능성 말하기', '③41', (d) => {
      const subjects = ['국어', '수학', '사회', '과학', '체육', '음악', '미술', '영어'];
      const [rows, subject] = d.until(() => [DAYS5.map(() => d.shuffle(subjects).slice(0, 3)), d.pick(subjects)], ([r, s]) => { const days = r.filter((x) => x.includes(s)).length; return days >= 1 && days <= 3; });
      const k = d.int(0, 4), has = rows[k].includes(subject), person = d.pick(NAMES);
      return C(`${nick(person)}네 반 시간표의 일부이다. 이 시간표대로 수업을 할 때, ${DAYS5[k]}요일의 1교시부터 3교시까지 가운데 ${subject} 수업이 있을 가능성을 말로 나타낸 것은?`, W3, has ? 2 : 0, {
        figure: table(['요일', '1교시', '2교시', '3교시'], DAYS5.map((day, i) => [day].concat(rows[i]))),
        explain: `${DAYS5[k]}요일의 1교시부터 3교시까지는 ${rows[k].join(', ')}이다. ${josa(subject, '이/가')} ${has ? '있으므로 가능성은 「확실하다」이다.' : '없으므로 가능성은 「불가능하다」이다.'}`,
        facts: { truth: W3.map((_, i) => i === (has ? 2 : 0)), want: true }
      });
    }),
    T('word-find', '가능성이 「반반이다」인 일 찾기', '①35 ②39 ③43 심35', (d) => {
      const rows = d.shuffle(pickSays(d, [0, 2, 4, d.pick([1, 3])]));
      return C('일이 일어날 가능성이 「반반이다」인 것은?', LAB.slice(0, 4), rows.findIndex((r) => r.lv === 2), {
        figure: tagged(rows.map((r) => r.text)), explain: saysWhy(rows), facts: { truth: rows.map((r) => r.lv === 2), want: true }
      });
    }),
    T('word-wrong-talk', '가능성을 잘못 말한 사람 찾기', '①35의 변형 ③45 심35의 변형', (d) => {
      const pool = [['노란색 구슬만 2개 든 주머니에서 노란색 구슬을 꺼낼 가능성', 4], ['동전을 던질 때 그림 면이 나올 가능성', 2], ['주사위를 굴릴 때 눈의 수가 8이 나올 가능성', 0], ['파란색 공 5개와 노란색 공 5개가 든 상자에서 파란색 공을 꺼낼 가능성', 2],
        ['주사위를 굴릴 때 눈의 수가 6 이하로 나올 가능성', 4], ['흰색 바둑돌만 든 통에서 검은색 바둑돌을 꺼낼 가능성', 0], ['주사위를 굴릴 때 눈의 수가 홀수일 가능성', 2]];
      const picked = d.until(() => d.shuffle(pool).slice(0, 4), (x) => new Set(x.map((r) => r[1])).size === 3), bad = d.int(0, 3), people = who(d, 4);
      const spoken = picked.map(([, lv], i) => (i === bad ? (lv === 2 ? d.pick([0, 4]) : lv === 4 ? d.pick([0, 2]) : d.pick([2, 4])) : lv));
      return C('네 학생이 가능성을 말한 것이다. 가능성을 잘못 말한 학생은?', people, bad, {
        figure: lines(picked.map(([text], i) => `${people[i]}: ${josa(text, '은/는')} 「${W5[spoken[i]]}」이다.`)),
        explain: `${josa(picked[bad][0], '은/는')} 「${W5[spoken[bad]]}」가 아니라 「${W5[picked[bad][1]]}」이다. 나머지 세 학생은 바르게 말하였다.`,
        facts: { truth: picked.map((_, i) => i !== bad), want: false }
      });
    }),
    T('word-fix', '가능성이 「확실하다」가 되도록 고치기', '①38의 변형 ②46 ③46 심44', (d) => {
      const [text, right, wrongs, why] = d.pick([
        ['월요일의 다음 날은 <u>수요일</u>일 것이다.', '화요일', ['일요일', '목요일', '금요일'], '월요일의 다음 날은 언제나 화요일이다.'],
        ['파란색 구슬만 3개 든 주머니에서 꺼낸 구슬은 <u>노란색</u>일 것이다.', '파란색', ['빨간색', '초록색', '흰색'], '주머니에 파란색 구슬만 있으므로 꺼낸 구슬은 언제나 파란색이다.'],
        ['8월의 다음 달은 <u>10월</u>일 것이다.', '9월', ['7월', '11월', '12월'], '8월의 다음 달은 언제나 9월이다.']]);
      const rows = d.shuffle([[right, true]].concat(wrongs.map((w) => [w, false])));
      return C('다음 일이 일어날 가능성은 「불가능하다」이다. 일이 일어날 가능성이 「확실하다」가 되도록 밑줄 친 부분을 바르게 고친 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: lines([text]), explain: `${why} 밑줄 친 부분을 「${right}」${josa(right, '으로/로').slice(right.length)} 고치면 가능성이 「확실하다」가 된다.`, facts: truthOf(rows, true)
      });
    }),
    T('word-band-place', '가능성을 띠의 자리에 나타내기', '②42·43·55의 변형 ③63의 변형 심52의 변형', (d) => {
      const [a, b] = d.pick([[1, 4], [4, 1], [3, 3], [1, 5], [5, 1], [2, 2], [1, 3], [3, 1]]);
      return C(`주머니에 흰색 공 ${a}개와 파란색 공 ${b}개가 들어 있다. 공 1개를 꺼낼 때 흰색 공이 나올 가능성을 띠에 화살표로 나타내려고 한다. 화살표를 그릴 자리로 알맞은 것은?`, LAB, level(a, a + b), {
        figure: band({ tops: LAB, under: W3 }),
        explain: `공은 모두 ${a + b}개이고 흰색 공은 ${a}개이다. ${because(a, a + b, '개')} 띠의 왼쪽 끝은 「불가능하다」, 가운데는 「반반이다」, 오른쪽 끝은 「확실하다」이므로 ${LAB[level(a, a + b)]}에 그린다.`,
        facts: claim5(a, a + b)
      });
    }),
    T('word-band-read', '띠에 나타낸 가능성을 말로 읽기', '②43', (d) => {
      const at = d.pick([1, 3, 1, 3, 0, 2, 4]), person = d.pick(NAMES), where = ['왼쪽 끝', '왼쪽 끝과 가운데 사이', '가운데', '가운데와 오른쪽 끝 사이', '오른쪽 끝'][at];
      return C(`${name(person, '이/가')} 제비뽑기에서 당첨 제비를 뽑을 가능성을 띠에 화살표로 나타낸 것이다. 이 가능성을 말로 나타낸 것은?`, W5, at, {
        figure: band({ tops: ['', '', '', '', ''], under: W3, arrow: at }),
        explain: `띠의 왼쪽 끝은 「불가능하다」, 가운데는 「반반이다」, 오른쪽 끝은 「확실하다」이다. 화살표는 ${where}에 있으므로 「${W5[at]}」이다.`,
        facts: { pick: { expr: String(at + 1), options: [1, 2, 3, 4, 5] } }
      });
    })
  ]);

  // ── 가능성 비교하기 ──────────────────────────────────────────
  B.addTypes(U, 'comp', [
    T('comp-order', '여러 일을 가능성이 높은 차례로 놓기', '①39 ②41 ③47 심39', (d) => {
      const rows = d.shuffle(pickSays(d, d.shuffle([0, 1, 2, 3, 4]).slice(0, 3))), down = d.bool(), right = sortBy(rows.map((r) => r.lv), down), orders = orderOptions(d, right, PERM3);
      return C(`일이 일어날 가능성이 ${down ? '높은' : '낮은'} 것부터 차례로 쓴 것은?`, orders.map((o) => o.map((i) => LAB[i]).join(', ')), orders.findIndex((o) => o.join() === right.join()), {
        figure: tagged(rows.map((r) => r.text)), explain: `${saysWhy(rows)} 가능성이 ${down ? '높은' : '낮은'} 것부터 차례로 쓰면 ${right.map((i) => LAB[i]).join(', ')}이다.`,
        facts: { choose: { exprs: rows.map((r) => String(r.lv + 1)), rule: down ? 'descending' : 'ascending', orders }, unseen: [1, 2, 3, 4, 5] }
      });
    }),
    T('comp-most', '가능성이 가장 낮은(높은) 일 고르기', '②41의 변형 ③48', (d) => {
      const rows = d.shuffle(pickSays(d, d.shuffle([0, 1, 2, 3, 4]).slice(0, 4))), lowest = d.bool(), levels = rows.map((r) => r.lv), at = levels.indexOf(lowest ? low(levels) : top(levels));
      return C(`일이 일어날 가능성이 가장 ${lowest ? '낮은' : '높은'} 것은?`, LAB.slice(0, 4), at, {
        figure: tagged(rows.map((r) => r.text)), explain: `${saysWhy(rows)} 가능성이 가장 ${lowest ? '낮은' : '높은'} 것은 ${LAB[at]}이다.`,
        facts: { choose: { exprs: levels.map((lv) => String(lv + 1)), rule: lowest ? 'min' : 'max' }, unseen: [1, 2, 3, 4, 5] }
      });
    }),
    T('comp-above-half', '기준이 되는 일보다 가능성이 높은 일 고르기', '심42', (d) => {
      const rows = d.until(() => d.shuffle(pickSays(d, [0, 1, 2, d.pick([3, 4])])), (x) => !x.some((r) => r.text.startsWith('동전')));
      return C('동전을 던질 때 숫자 면이 나올 가능성보다 일이 일어날 가능성이 더 높은 것은?', rows.map((r) => r.text), rows.findIndex((r) => r.lv > 2), {
        explain: `동전을 던질 때 숫자 면이 나올 가능성은 「반반이다」이다. 이보다 가능성이 높은 것은 「~일 것 같다」나 「확실하다」인 일이다. ${rows.find((r) => r.lv > 2).why.replace(/이다$/, '이므로')} 「${W5[rows.find((r) => r.lv > 2).lv]}」이다.`,
        facts: { truth: rows.map((r) => r.lv > 2), want: true }
      });
    }),
    T('comp-odd-text', '가능성이 나머지와 다른 일 찾기', '③49', (d) => {
      const sure = d.bool(), rows = d.shuffle(pickSays(d, sure ? [4, 4, 4, 0] : [0, 0, 0, 4])), odd = rows.findIndex((r) => r.lv === (sure ? 0 : 4));
      return C('일이 일어날 가능성이 나머지 셋과 다른 하나는?', LAB.slice(0, 4), odd, {
        figure: tagged(rows.map((r) => r.text)), explain: `${saysWhy(rows)} ${LAB[odd]}만 「${W5[rows[odd].lv]}」이다.`, facts: { truth: rows.map((_, i) => i === odd), want: true }
      });
    }),
    T('comp-odd-spin', '가능성이 나머지와 다른 회전판 찾기', '심43', (d) => {
      const wheels = d.shuffle([[4, 2], [6, 3], [8, 4], d.pick([[8, 6], [4, 3], [6, 2], [8, 2], [4, 1], [6, 4]])]), odd = wheels.findIndex(([n, k]) => 2 * k !== n);
      return C('회전판을 돌릴 때, 화살이 초록색에 멈출 가능성이 나머지 셋과 다른 회전판은?', TAGS.slice(0, 4), odd, {
        figure: grid(wheels.map(([n, k], i) => spinner(wheel(d, n, [['초록', k], ['노랑', n - k]]), { tag: TAGS[i] }))),
        explain: `초록색은 ${wheels.map(([n, k], i) => `${TAGS[i]} ${n}칸 가운데 ${k}칸`).join(', ')}이다. 칸 수가 달라도 초록색이 꼭 반이면 가능성은 모두 「반반이다」이다. ${TAGS[odd]}만 초록색이 반${2 * wheels[odd][1] > wheels[odd][0] ? '보다 많다' : '보다 적다'}.`,
        facts: { choose: { exprs: wheels.map(([n, k]) => `${k}/${n}`), rule: 'odd' } }
      });
    }),
    T('comp-dice-order', '주사위 눈의 조건을 가능성 차례로 놓기', '②41의 변형 ③54의 변형 심41', (d) => {
      const pool = [['le', 5], ['ge', 1], ['even'], ['odd'], ['mult', 3], ['mult', 5], ['div', 6], ['div', 4], ['gt', 4], ['eq', d.int(1, 6)], ['lt', 3], ['ge', 2]];
      const picked = d.until(() => d.shuffle(pool).slice(0, 3).map(([kind, b]) => cond(kind, b)), (x) => distinct(x.map((c) => DIE.filter(c.test).length))), ks = picked.map((c) => DIE.filter(c.test).length);
      const down = d.bool(), right = sortBy(ks, down), orders = orderOptions(d, right, PERM3);
      return C(`주사위를 한 번 굴릴 때, 다음 일이 일어날 가능성이 ${down ? '높은' : '낮은'} 것부터 차례로 쓴 것은?`, orders.map((o) => o.map((i) => LAB[i]).join(', ')), orders.findIndex((o) => o.join() === right.join()), {
        figure: tagged(picked.map((c) => `나온 눈의 수가 ${c.fin}.`)),
        explain: `주사위의 눈 6개 가운데 ${picked.map((c, i) => `${LAB[i]}에 맞는 눈은 ${ks[i]}개`).join(', ')}이다. 맞는 눈이 많을수록 가능성이 높으므로 ${down ? '높은' : '낮은'} 것부터 차례로 쓰면 ${right.map((i) => LAB[i]).join(', ')}이다.`,
        facts: { choose: { exprs: ks.map(String), rule: down ? 'descending' : 'ascending', orders }, unseen: ks }
      });
    }),
    T('comp-spin-order', '회전판 셋을 가능성이 높은 차례로 놓기', '①41 ②44 ③50 심40', (d) => {
      const ks = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7]).slice(0, 3), (x) => { const s = x.slice().sort((p, q) => p - q); return s[1] - s[0] >= 2 && s[2] - s[1] >= 2; }), right = sortBy(ks, true), orders = orderOptions(d, right, PERM3);
      return C('회전판을 돌릴 때, 화살이 노란색에 멈출 가능성이 높은 회전판부터 차례로 쓴 것은?', orders.map((o) => o.map((i) => TAGS[i]).join(', ')), orders.findIndex((o) => o.join() === right.join()), {
        figure: grid(ks.map((k, i) => spinner(wheel(d, 8, [['노랑', k], ['파랑', 8 - k]]), { tag: TAGS[i], size: 88 })), 3),
        explain: `세 회전판은 모두 똑같이 8칸으로 나뉘어 있다. 노란색은 ${ks.map((k, i) => `${TAGS[i]} ${k}칸`).join(', ')}이다. 노란색이 넓을수록 가능성이 높으므로 ${right.map((i) => TAGS[i]).join(', ')}의 차례이다.`,
        facts: { choose: { exprs: ks.map(String), rule: 'descending', orders } }
      });
    }),
    T('comp-spin-equal', '두 색의 가능성이 같은 회전판 찾기', '②45', (d) => {
      const wheels = d.shuffle([d.pick([[3, 3, 2], [2, 2, 4], [1, 1, 6]]), d.pick([[4, 2, 2], [5, 2, 1]]), d.pick([[2, 4, 2], [1, 4, 3]]), d.pick([[3, 2, 3], [1, 3, 4], [4, 3, 1]])]), right = wheels.findIndex(([r, b]) => r === b);
      return C('회전판을 돌릴 때, 화살이 빨간색에 멈출 가능성과 파란색에 멈출 가능성이 같은 회전판은?', TAGS.slice(0, 4), right, {
        figure: grid(wheels.map(([r, b, y], i) => spinner(wheel(d, 8, [['빨강', r], ['파랑', b], ['노랑', y]]), { tag: TAGS[i] }))),
        explain: `네 회전판은 모두 똑같이 8칸으로 나뉘어 있다. 빨간색과 파란색의 칸 수는 ${wheels.map(([r, b], i) => `${TAGS[i]} ${r}칸과 ${b}칸`).join(', ')}이다. 두 색의 칸 수가 같은 ${TAGS[right]}에서 두 가능성이 같다.`,
        facts: { claimed: wheels.map(([r, b]) => [String(r), b]), claimedWant: true }
      });
    }),
    T('comp-bags', '글로 준 주머니 넷에서 가능성이 가장 낮은(높은) 것', '①40 ②40·44의 변형 ③52의 변형 심40의 변형', (d) => {
      const whites = d.shuffle([0, 1, 2, 3, 4]).slice(0, 4), lowest = d.bool(), at = whites.indexOf(lowest ? low(whites) : top(whites));
      const say = (w) => (w === 0 ? '검은색 공만 4개 든 주머니' : w === 4 ? '흰색 공만 4개 든 주머니' : `흰색 공 ${w}개와 검은색 공 ${4 - w}개가 든 주머니`);
      return C(`주머니에서 공 1개를 꺼낼 때, 흰색 공이 나올 가능성이 가장 ${lowest ? '낮은' : '높은'} 주머니는?`, LAB.slice(0, 4), at, {
        figure: tagged(whites.map(say)), explain: `네 주머니에는 공이 4개씩 들어 있다. 흰색 공은 차례로 ${whites.join('개, ')}개이다. 흰색 공이 가장 ${lowest ? '적은' : '많은'} ${LAB[at]}에서 흰색 공이 나올 가능성이 가장 ${lowest ? '낮다' : '높다'}.`,
        facts: { rank: { values: whites, nth: lowest ? 4 : 1 } }
      });
    }),
    T('comp-bags-pic', '그림으로 준 주머니 셋에서 가능성이 가장 높은 것', '①41의 변형 ③52 심40의 변형', (d) => {
      const reds = d.shuffle([1, 2, 3, 4, 5]).slice(0, 3), at = reds.indexOf(top(reds));
      return C('주머니에서 구슬 1개를 꺼낼 때, 빨간색 구슬이 나올 가능성이 가장 높은 주머니는?', TAGS.slice(0, 3), at, {
        figure: grid(reds.map((r, i) => bag([['빨강', r], ['파랑', 6 - r]], { tag: TAGS[i], cols: 3, order: mixed(d, [['빨강', r], ['파랑', 6 - r]]) })), 3),
        explain: `세 주머니에는 구슬이 6개씩 들어 있다. 빨간색 구슬은 ${reds.map((r, i) => `${TAGS[i]} ${r}개`).join(', ')}이다. 빨간색 구슬이 가장 많은 ${TAGS[at]}에서 빨간색 구슬이 나올 가능성이 가장 높다.`,
        facts: { rank: { values: reds, nth: 1 } }
      });
    }),
    T('comp-one-bag', '한 주머니에서 나올 가능성이 가장 높은 색', '①42', (d) => {
      const [a, b, c] = d.pick([[5, 2, 1], [4, 3, 1], [5, 1, 2], [4, 1, 3], [3, 4, 1], [2, 5, 1], [1, 2, 5], [1, 3, 4]]), keys = d.shuffle(['빨강', '파랑', '노랑', '초록']), counts = [[keys[0], a], [keys[1], b], [keys[2], c]], shown = d.shuffle(keys);
      const value = (key) => (counts.find((x) => x[0] === key) || [key, 0])[1], best = shown.findIndex((key) => value(key) === top([a, b, c]));
      return C('주머니에 든 구슬을 나타낸 것이다. 이 주머니에서 구슬 1개를 꺼낼 때, 나올 가능성이 가장 높은 구슬의 색은?', shown.map((key) => HUE[key]), best, {
        figure: bag(counts, { order: mixed(d, counts) }),
        explain: `주머니에 든 구슬은 ${counts.map(([key, x]) => `${HUE[key]} ${x}개`).join(', ')}이다. 가장 많이 든 ${HUE[shown[best]]} 구슬이 나올 가능성이 가장 높다.`,
        facts: { rank: { values: shown.map(value), nth: 1 } }
      });
    }),
    T('comp-box', '든 것을 비교하여 유리한 상자 고르기', '②69 ③53 심64', (d) => {
      const reds = d.shuffle([10, 15, 20, 25, 30, 40]).slice(0, 3), rows = reds.map((r) => { const blue = d.int(1, (60 - r) / 5 - 1) * 5; return [r, blue, 60 - r - blue]; }), best = reds.indexOf(top(reds));
      return C('세 상자에 색깔별로 든 공의 수(개)를 나타낸 표이다. 상자마다 공은 60개씩 들어 있다. 공 1개를 꺼내어 빨간색이면 선물을 받는다고 할 때, 선물을 받을 가능성이 가장 높은 상자는?', TAGS.slice(0, 3).map((t) => `${t} 상자`), best, {
        figure: table(['상자', '빨강', '파랑', '초록'], rows.map((r, i) => [TAGS[i]].concat(r))),
        explain: `세 상자에 든 공의 수가 60개로 같으므로 빨간색 공이 많을수록 빨간색 공이 나올 가능성이 높다. 빨간색 공이 ${top(reds)}개로 가장 많은 ${TAGS[best]} 상자가 가장 유리하다.`,
        facts: { choose: { exprs: reds.map(String), rule: 'max' } }
      });
    }, { standard: JUDGE }),
    T('comp-spin-cond', '조건에 맞게 색칠한 회전판 고르기', '②48 ③55 심46의 변형', (d) => {
      const wheels = d.shuffle([d.pick([[4, 2, 2], [6, 1, 1]]), [2, 3, 3], d.pick([[4, 3, 1], [5, 1, 2]]), d.pick([[3, 3, 2], [3, 2, 3]])]), ok = ([r, b, g]) => r > b && r > g && b === g, right = wheels.findIndex(ok);
      return C('화살이 빨간색에 멈출 가능성이 가장 높고, 파란색에 멈출 가능성과 초록색에 멈출 가능성이 같은 회전판은?', TAGS.slice(0, 4), right, {
        figure: grid(wheels.map(([r, b, g], i) => spinner(wheel(d, 8, [['빨강', r], ['파랑', b], ['초록', g]]), { tag: TAGS[i] }))),
        explain: `네 회전판은 모두 똑같이 8칸으로 나뉘어 있다. 빨간색, 파란색, 초록색의 칸 수는 ${wheels.map((w, i) => `${TAGS[i]} ${w.join(', ')}칸`).join(' / ')}이다. 빨간색이 가장 넓고 파란색과 초록색의 넓이가 같은 것은 ${TAGS[right]}이다.`,
        facts: { truth: wheels.map(ok), want: true }
      });
    }),
    T('comp-cards-even', '조건에 맞는 수 카드 묶음 고르기', '③55', (d) => {
      const make = (evens) => d.shuffle([2, 4, 6, 8]).slice(0, evens).concat(d.shuffle([1, 3, 5, 7, 9]).slice(0, 5 - evens)).sort((x, y) => x - y);
      const sets = d.until(() => d.shuffle([make(d.pick([3, 4])), make(2), make(d.pick([1, 2])), make(d.pick([0, 1]))]), (x) => new Set(x.map((s) => s.join())).size === 4), counts = sets.map((s) => s.filter((x) => x % 2 === 0).length), right = counts.findIndex((k) => k >= 3);
      return C('1부터 9까지의 수 가운데 다섯 개를 골라 수 카드 묶음을 만들었다. 한 장을 뽑을 때, 짝수가 나올 가능성이 홀수가 나올 가능성보다 높은 묶음은?', LAB.slice(0, 4), right, {
        figure: tagged(sets.map((s) => s.join(', '))),
        explain: `카드 5장 가운데 짝수가 홀수보다 많아야 짝수가 나올 가능성이 더 높다. 짝수는 차례로 ${counts.join('장, ')}장이므로 짝수가 ${counts[right]}장, 홀수가 ${5 - counts[right]}장인 ${LAB[right]}이다.`,
        facts: { only: { values: counts, test: 'atLeast', target: 3 } }
      });
    })
  ]);

  // ── 가능성을 수로 나타내기(답은 0, 1/2, 1뿐이다) ─────────────
  B.addTypes(U, 'num', [
    T('num-match', '가능성을 나타내는 말과 수 짝짓기', '①44 ②50', (d) => {
      const order = d.shuffle([0, 1, 2]), rows = d.shuffle([[order, true]].concat(d.shuffle(PERM3.filter((p) => p.join() !== order.join())).slice(0, 3).map((p) => [p, false])));
      return C(`일이 일어날 가능성을 나타내는 말 「${W3[order[0]]}」, 「${W3[order[1]]}」, 「${W3[order[2]]}」를 수로 나타낸 것을 차례대로 쓴 것은?`, rows.map(([p]) => p.map((i) => N3[i]).join(', ')), rows.findIndex((r) => r[1]), {
        explain: `가능성을 수로 나타내면 「불가능하다」는 0, 「반반이다」는 ${HALF}, 「확실하다」는 1이다.`, facts: truthOf(rows, true)
      });
    }),
    T('num-line', '가능성 띠의 수', '①44의 변형 ②50의 변형', (d) => {
      const at = d.int(0, 2), nums = ['0', '1/2', '1'].map((x, i) => (i === at ? '㉠' : x));
      return C('일이 일어날 가능성을 말과 수로 나타낸 것이다. ㉠에 알맞은 수는?', N3, at, {
        figure: band({ tops: W5, nums }), explain: `㉠은 「${W3[at]}」의 아래에 있다. 「${W3[at]}」를 수로 나타내면 ${N3[at]}이다.`, facts: { truth: N3.map((_, i) => i === at), want: true }
      });
    }),
    T('num-fact', '달력·시계·동전의 일 → 수', '①45 ②54의 변형 ③56 심50', (d, n) => {
      const pool = [
        [['오늘이 월요일일 때 내일은 수요일일 것이다.', '월요일의 다음 날은 화요일이므로 일어날 수 없는 일이다.'], ['1부터 5까지의 수가 적힌 공 5개가 든 상자에서 꺼낸 공에 적힌 수는 8일 것이다.', '8이 적힌 공은 없으므로 일어날 수 없는 일이다.'], ['오전 9시에서 1시간이 지나면 오전 11시가 될 것이다.', '오전 9시에서 1시간이 지나면 오전 10시이므로 일어날 수 없는 일이다.']],
        [['500원짜리 동전 한 개를 던지면 그림 면이 나올 것이다.', '그림 면과 숫자 면이 나올 가능성이 같다.'], ['1부터 10까지의 번호가 적힌 번호표 10장 가운데 한 장을 뽑으면 홀수가 나올 것이다.', '홀수는 1, 3, 5, 7, 9의 5장으로 10장의 꼭 반이다.'], ['당첨 제비 5개와 당첨이 아닌 제비 5개가 든 상자에서 제비 1개를 뽑으면 당첨 제비일 것이다.', '당첨 제비는 제비 10개 가운데 5개로 꼭 반이다.']],
        [['2교시의 다음 교시는 3교시일 것이다.', '2교시의 다음은 언제나 3교시이다.'], ['1부터 10까지의 수가 적힌 수 카드 10장 가운데 한 장을 뽑으면 1 이상인 수가 나올 것이다.', '카드에 적힌 수는 모두 1 이상이다.'], ['지금 11살인 사람은 1년 뒤에 12살이 될 것이다.', '1년이 지나면 나이는 언제나 1살 많아진다.']]];
      const [text, why] = d.pick(pool[n]);
      return C('다음 일이 일어날 가능성을 수로 나타낸 것은?', N3, n, {
        figure: lines([text]), explain: `${why} 가능성은 「${W3[n]}」이고, 수로 나타내면 ${N3[n]}이다.`, facts: { truth: N3.map((_, i) => i === n), want: true }
      });
    }, { count: 3 }),
    T('num-dice', '주사위 눈의 조건 → 수', '①46 ②51 ③57 심49', (d, n) => {
      const pools = [[['ge', 4], ['le', 3], ['even'], ['odd'], ['gt', 3], ['lt', 4]], [['eq', d.int(7, 9)], ['gt', 6], ['lt', 1], ['ge', 7], ['mult', 7]]], [kind, b] = d.pick(pools[n]), c = cond(kind, b), k = DIE.filter(c.test).length;
      return C(`주사위를 한 번 굴릴 때, 나온 눈의 수가 ${c.will} 가능성을 수로 나타낸 것은?`, N3, three(k, 6), {
        explain: `주사위의 눈 1, 2, 3, 4, 5, 6 가운데 ${told(c, DIE)}. ${becauseNum(k, 6, '개')}`, facts: Object.assign(claim3(k, 6), { rule: 'num-dice-' + n })
      });
    }, { count: 2 }),
    T('num-cards', '수 카드의 조건 → 수', '①46 ②51의 글감 ③58 심49', (d) => {
      const [lo, hi, conds] = d.pick([[10, 19, [['mult', 2], ['odd'], ['ge', 15], ['lt', 15], ['gt', 19], ['ge', 10]]], [1, 8, [['div', 8], ['ndiv', 8], ['even'], ['le', 4], ['gt', 8], ['le', 8]]], [2, 9, [['odd'], ['even'], ['ge', 6], ['lt', 2], ['mult', 10], ['ge', 2]]], [1, 10, [['le', 5], ['odd'], ['gt', 5], ['gt', 10], ['ge', 1], ['eq', 11]]]]);
      const list = range(lo, hi), n = list.length, [kind, b] = d.pick(conds), c = cond(kind, b), k = list.filter(c.test).length;
      return C(`${lo}부터 ${hi}까지의 수가 적힌 수 카드 ${n}장 가운데 한 장을 뽑을 때, 뽑은 카드에 적힌 수가 ${c.will} 가능성을 수로 나타낸 것은?`, N3, three(k, n), {
        explain: `${lo}부터 ${hi}까지의 수 가운데 ${told(c, list)}. ${becauseNum(k, n, '장')}`, facts: claim3(k, n)
      });
    }),
    T('num-mixed', '여러 색이 섞인 묶음에서 꼭 반인지 가리기', '②52 심49의 변형', (d) => {
      const [b, c] = d.pick([[3, 4], [2, 5], [1, 3], [2, 3], [1, 4], [2, 4]]), a = b + c;
      return C(`필통에 빨간색 색연필 ${a}자루, 파란색 색연필 ${b}자루, 노란색 색연필 ${c}자루가 들어 있다. 이 필통에서 색연필 한 자루를 꺼낼 때, 빨간색 색연필이 나올 가능성을 수로 나타낸 것은?`, N3, 1, {
        explain: `색연필은 모두 ${a} + ${b} + ${c} = ${2 * a}(자루)이고, 그 가운데 빨간색 색연필은 ${a}자루이다. ${becauseNum(a, 2 * a, '자루')} 색이 세 가지여도 빨간색이 꼭 반이면 가능성은 ${HALF}이다.`, facts: claim3(a, 2 * a)
      });
    }),
    T('num-bag-text', '글로 준 상자에서 두 가능성을 수로', '①47 ②51 ③59 심48', (d) => {
      const k = d.int(2, 4), both = d.bool();
      const lead = both ? `상자에 딸기 맛 사탕 ${k}개와 포도 맛 사탕 ${k}개가 들어 있다.` : `상자에 딸기 맛 사탕만 ${2 * k}개 들어 있다.`, right = both ? [1, 0] : [2, 0], asks = both ? ['포도 맛', '오렌지 맛'] : ['딸기 맛', '포도 맛'];
      const rows = d.shuffle([[right, true], [[right[1], right[0]], false], [[right[0], right[0] === 1 ? 2 : 1], false], [[right[0] === 1 ? 2 : 1, right[1]], false]]);
      return C(`${lead} 이 상자에서 사탕 1개를 꺼낼 때, ㉠ ${asks[0]} 사탕이 나올 가능성과 ㉡ ${asks[1]} 사탕이 나올 가능성을 수로 나타낸 것을 차례대로 쓴 것은?`, rows.map(([p]) => p.map((i) => N3[i]).join(', ')), rows.findIndex((r) => r[1]), {
        explain: both ? `사탕 ${2 * k}개 가운데 포도 맛 사탕은 ${k}개로 꼭 반이므로 ㉠은 ${HALF}이다. 오렌지 맛 사탕은 없으므로 ㉡은 0이다.` : `사탕이 모두 딸기 맛이므로 ㉠은 1이다. 포도 맛 사탕은 없으므로 ㉡은 0이다.`, facts: truthOf(rows, true)
      });
    }),
    T('num-bag-pic', '그림으로 준 주머니 → 수', '②53 ③60', (d) => {
      const kind = d.pick(['all', 'none']), k = d.int(2, 4), counts = [[d.pick(['검정', '흰색']), 2 * k]];
      const ask = kind === 'all' ? counts[0][0] : (counts[0][0] === '검정' ? '흰색' : '검정'), hit = (counts.find((c) => c[0] === ask) || [ask, 0])[1], total = 2 * k;
      return C(`주머니에 든 공을 나타낸 것이다. 이 주머니에서 공 1개를 꺼낼 때, ${HUE[ask]} 공이 나올 가능성을 수로 나타낸 것은?`, N3, three(hit, total), {
        figure: bag(counts, { thing: '공', order: mixed(d, counts) }),
        explain: `주머니에 든 공은 ${counts.map(([key, x]) => `${HUE[key]} ${x}개`).join(', ')}이다. ${hit === 0 ? `${HUE[ask]} 공은 없다. ` : ''}${becauseNum(hit, total, '개')}`, facts: claim3(hit, total)
      });
    }),
    T('num-word-num', '가능성을 말과 수로 함께 나타내기', '①46의 변형 ②54 ③59 심48의 변형', (d) => {
      const x = d.int(6, 9), k = d.pick([4, 6, 8]);
      const [text, lv, why] = d.pick([
        [`1부터 5까지의 수가 적힌 공 5개가 든 상자에서 공 1개를 꺼낼 때, ${josa(x, '이/가')} 적힌 공이 나올 가능성`, 0, `${josa(x, '이/가')} 적힌 공은 없으므로 일어날 수 없는 일이다.`],
        ['1부터 10까지의 수가 적힌 수 카드 10장 가운데 한 장을 뽑을 때, 짝수가 나올 가능성', 1, '짝수는 2, 4, 6, 8, 10의 5장으로 10장의 꼭 반이다.'],
        [`흰색 바둑돌만 ${k}개 든 통에서 바둑돌 1개를 꺼낼 때, 흰색 바둑돌이 나올 가능성`, 2, '바둑돌이 모두 흰색이므로 언제나 일어나는 일이다.']]);
      const other = lv === 1 ? d.pick([0, 2]) : 1, rows = d.shuffle([[lv, lv, true], [lv, other, false], [other, lv, false], [other, other, false]]);
      return C(`${josa(text, '을/를')} 말과 수로 바르게 나타낸 것은?`, rows.map(([w, v]) => `${W3[w]}, ${N3[v]}`), rows.findIndex((r) => r[2]), {
        explain: `${why} 가능성은 「${W3[lv]}」이고, 수로 나타내면 ${N3[lv]}이다.`, facts: { truth: rows.map((r) => r[2]), want: true }
      });
    }),
    T('num-spin', '회전판 → 수', '①48 ②53 ③61 심47', (d) => {
      const n = d.pick([4, 6, 8]), kind = d.pick(['half', 'none', 'all']), parts = kind === 'all' ? wheel(d, n, [['노랑', n]]) : wheel(d, n, [['노랑', n / 2], ['파랑', n / 2]]), ask = kind === 'none' ? '빨강' : '노랑', k = kind === 'half' ? n / 2 : kind === 'all' ? n : 0;
      return C(`회전판을 돌릴 때, 화살이 ${HUE[ask]}에 멈출 가능성을 수로 나타낸 것은?`, N3, three(k, n), {
        figure: spinner(parts),
        explain: `회전판은 똑같이 ${n}칸으로 나뉘어 있다. ${k === 0 ? `${HUE[ask]}은 없다. ` : k === n ? '모든 칸이 노란색이다. ' : `노란색은 ${k}칸이다. `}${becauseNum(k, n, '칸')}`, facts: claim3(k, n)
      });
    }),
    T('num-spin-pick', '가능성이 1/2인 회전판 고르기', '②45의 변형 ③51·61의 변형 심53의 변형', (d) => {
      const ks = d.shuffle([4, d.pick([1, 2, 3]), d.pick([5, 6, 7]), d.pick([0, 8])]), right = ks.indexOf(4);
      return C(`회전판을 돌릴 때, 화살이 빨간색에 멈출 가능성이 ${HALF}인 회전판은?`, TAGS.slice(0, 4), right, {
        figure: grid(ks.map((k, i) => spinner(wheel(d, 8, [['빨강', k], ['노랑', 8 - k]]), { tag: TAGS[i] }))),
        explain: `네 회전판은 모두 똑같이 8칸으로 나뉘어 있다. 빨간색은 ${ks.map((k, i) => `${TAGS[i]} ${k}칸`).join(', ')}이다. 빨간색이 8칸의 꼭 반인 4칸일 때 가능성이 ${HALF}이므로 ${TAGS[right]}이다.`,
        facts: { claimed: ks.map((k) => [`${k}*2`, 8]), claimedWant: true }
      });
    }),
    T('num-spin-number', '수가 적힌 회전판 → 수', '①34의 변형 심47의 변형', (d) => {
      const n = d.pick([6, 8]), list = range(1, n), [kind, b] = d.pick([['even'], ['odd'], ['gt', n / 2], ['le', n / 2], ['lt', n + 1], ['gt', n], ['ge', 1]]), c = cond(kind, b), k = list.filter(c.test).length;
      return C(`수가 적힌 회전판을 돌릴 때, 화살이 ${josa(c.is, '이/가')} 적힌 칸에 멈출 가능성을 수로 나타낸 것은?`, N3, three(k, n), {
        figure: spinner(list.map((x) => [x, 360 / n])),
        explain: `회전판은 똑같이 ${n}칸으로 나뉘어 있고 칸마다 1부터 ${n}까지의 수가 적혀 있다. ${told(c, list)}. ${becauseNum(k, n, '칸')}`, facts: claim3(k, n)
      });
    }),
    T('num-spin-or', '두 색을 합쳐 본 가능성 → 수', '①48의 변형', (d) => {
      const n = d.pick([4, 8]), per = n / 4;
      return C('회전판을 돌릴 때, 화살이 빨간색 또는 파란색에 멈출 가능성을 수로 나타낸 것은?', N3, 1, {
        figure: spinner(wheel(d, n, [['빨강', per], ['파랑', per], ['노랑', per], ['초록', per]])),
        explain: `회전판은 똑같이 ${n}칸으로 나뉘어 있다. 빨간색 ${per}칸과 파란색 ${per}칸을 합치면 ${2 * per}칸이다. ${becauseNum(2 * per, n, '칸')}`, facts: claim3(2 * per, n)
      });
    }),
    T('num-spin-say', '회전판을 두고 한 설명 가리기', '①48의 변형', (d) => {
      const n = d.pick([4, 8]), per = n / 4, t = d.int(0, 3);
      const rows = [
        [`화살이 빨간색에 멈출 가능성을 수로 나타내면 ${t === 0 ? '1' : HALF}이다.`, t !== 0],
        [`화살이 초록색에 멈출 가능성을 수로 나타내면 ${t === 1 ? HALF : '0'}이다.`, t !== 1],
        [`화살이 파란색에 멈출 가능성과 노란색에 멈출 가능성은 서로 ${t === 2 ? '다르다' : '같다'}.`, t !== 2],
        [`화살이 빨간색에 멈출 가능성은 파란색에 멈출 가능성보다 ${t === 3 ? '낮다' : '높다'}.`, t !== 3]
      ];
      return C('회전판을 돌릴 때의 가능성에 대한 설명으로 옳지 않은 것은?', rows.map((r) => r[0]), t, {
        figure: spinner(wheel(d, n, [['빨강', 2 * per], ['파랑', per], ['노랑', per]])),
        explain: `회전판은 똑같이 ${n}칸으로 나뉘어 있고 빨간색 ${2 * per}칸, 파란색 ${per}칸, 노란색 ${per}칸이다. 빨간색은 꼭 반이므로 가능성은 ${HALF}이고, 초록색은 없으므로 가능성은 0이다. 파란색과 노란색은 칸 수가 같아 가능성이 서로 같고, 빨간색은 파란색보다 넓어 가능성이 더 높다.`,
        facts: truthOf(rows, false)
      });
    }),
    T('num-not', '일어나지 않을 가능성 → 수', '①45의 변형 ③59', (d) => {
      const k = d.int(3, 6);
      return C(`당첨 제비만 ${k}개 든 상자에서 제비 1개를 뽑을 때, 뽑은 제비가 당첨 제비가 아닐 가능성을 수로 나타낸 것은?`, N3, 0, {
        explain: `제비 ${k}개가 모두 당첨 제비이므로 당첨 제비가 아닌 제비는 없다. ${becauseNum(0, k, '개')} 당첨 제비를 뽑을 가능성이 1이므로 당첨 제비가 아닐 가능성은 0이다.`, facts: claim3(0, k)
      });
    }),
    T('num-line-mark', '가능성을 수직선의 자리에 나타내기', '①49 ②55 ③63 심52', (d) => {
      const k = d.int(2, 4), [lead, ask, hit, total] = d.pick([
        [`주머니에 흰색 공 ${k}개와 검은색 공 ${k}개가 들어 있다.`, '흰색', k, 2 * k], [`주머니에 흰색 공 ${k}개와 검은색 공 ${k}개가 들어 있다.`, '빨간색', 0, 2 * k], [`주머니에 흰색 공만 ${2 * k}개 들어 있다.`, '흰색', 2 * k, 2 * k]]);
      return C(`${lead} 공 1개를 꺼낼 때 ${ask} 공이 나올 가능성을 수직선에 화살표로 나타내려고 한다. 화살표를 그릴 자리로 알맞은 것은?`, LAB.slice(0, 3), three(hit, total), {
        figure: band({ tops: ['㉠', '', '㉡', '', '㉢'], nums: ['0', '1/2', '1'] }),
        explain: `${hit === 0 ? `${ask} 공은 없다. ` : hit === total ? '공이 모두 흰색이다. ' : `공 ${total}개 가운데 ${ask} 공은 ${hit}개이다. `}${becauseNum(hit, total, '개')} 수직선에서 ${N3[three(hit, total)]}의 자리인 ${LAB[three(hit, total)]}에 그린다.`,
        facts: claim3(hit, total)
      });
    }),
    T('num-three', '한 상자의 세 가지 일을 수로', '③56의 변형 ③62·63 심48의 변형', (d) => {
      const k = d.int(5, 8), order = d.shuffle([0, 1, 2]), events = ['이 모둠 학생의 이름이 적혀 있을 가능성', '5학년 학생의 이름이 적혀 있을 가능성', '아무 이름도 적혀 있지 않을 가능성'], values = [2, 1, 0], right = order.map((i) => values[i]);
      const rows = d.shuffle([[right, true]].concat(d.shuffle(PERM3.filter((p) => p.join() !== right.join())).slice(0, 3).map((p) => [p, false])));
      return C(`어느 모둠은 5학년 학생 ${k}명과 6학년 학생 ${k}명으로 이루어져 있다. 이 모둠 학생의 이름을 한 장에 한 명씩 적은 종이 ${2 * k}장이 상자에 들어 있다. 종이 한 장을 뽑을 때, ${order.map((i, j) => `${LAB[j]} ${events[i]}`).join(', ')}을 수로 나타낸 것을 차례대로 쓴 것은?`, rows.map(([p]) => p.map((i) => N3[i]).join(', ')), rows.findIndex((r) => r[1]), {
        explain: `종이 ${2 * k}장에는 모두 이 모둠 학생의 이름이 적혀 있으므로 이 모둠 학생의 이름이 적혀 있을 가능성은 1, 아무 이름도 적혀 있지 않을 가능성은 0이다. 5학년 학생의 이름이 적힌 종이는 ${k}장으로 꼭 반이므로 가능성은 ${HALF}이다.`, facts: truthOf(rows, true)
      });
    }),
    T('num-find', '가능성이 1(0)인 일 찾기', '②56 ③66', (d) => {
      const one = d.bool(), rows = d.shuffle(pickSays(d, one ? [4, 0, 2, d.pick([1, 3])] : [0, 4, 2, d.pick([1, 3])])), at = rows.findIndex((r) => r.lv === (one ? 4 : 0));
      return C(`일이 일어날 가능성을 수로 나타내면 ${one ? 1 : 0}인 것은?`, LAB.slice(0, 4), at, {
        figure: tagged(rows.map((r) => r.text)), explain: `가능성이 「${one ? '확실하다' : '불가능하다'}」인 일을 수로 나타내면 ${one ? 1 : 0}이다. ${saysWhy(rows)}`, facts: { truth: rows.map((_, i) => i === at), want: true }
      });
    }),
    T('num-count-half', '가능성 1/2에서 거꾸로 개수 구하기', '③64 심54', (d) => {
      const total = d.pick([10, 12, 16, 20, 24, 30]);
      return N(`통에 흰색 바둑돌과 검은색 바둑돌이 모두 ${total}개 들어 있다. 이 통에서 바둑돌 1개를 꺼낼 때 흰색 바둑돌이 나올 가능성이 ${HALF}이다. 통에 든 흰색 바둑돌은 몇 개인가?`, total / 2, {
        unit: '개', explain: `가능성이 ${HALF}이면 흰색 바둑돌이 나올 가능성과 나오지 않을 가능성이 같으므로 흰색 바둑돌은 전체의 꼭 반이다. ${total} ÷ 2 = ${total / 2}(개)`, facts: { calc: [[`${total}/2`, 0]] }
      });
    }),
    T('num-count-jars', '가능성 1/2·0에서 거꾸로 개수 구하기', '①52 ③64의 변형 심54의 변형', (d) => {
      const per = d.pick([20, 30, 40, 50]);
      return N(`가 통과 나 통에 바둑돌이 ${per}개씩 들어 있고, 바둑돌은 모두 흰색 아니면 검은색이다. 가 통에서 바둑돌 1개를 꺼낼 때 흰색 바둑돌이 나올 가능성은 ${HALF}이고, 나 통에서 바둑돌 1개를 꺼낼 때 검은색 바둑돌이 나올 가능성은 0이다. 두 통에 든 흰색 바둑돌은 모두 몇 개인가?`, per / 2 + per, {
        unit: '개', explain: `가 통은 흰색 바둑돌이 꼭 반이므로 ${per} ÷ 2 = ${per / 2}(개)이다. 나 통은 검은색 바둑돌이 나올 가능성이 0이므로 검은색 바둑돌이 없고, ${per}개가 모두 흰색이다. ${per / 2} + ${per} = ${per / 2 + per}(개)`,
        facts: { calc: [[`${per}/2+${per}`, 0]] }
      });
    }),
    T('num-same-spin', '두 가능성이 같도록 칠할 칸 수', '②57 심55', (d) => {
      const total = d.pick([8, 10, 12]), win = total / 2, cells = d.pick([4, 6, 8].filter((x) => x !== total));
      return N(`당첨 제비 ${win}개가 든 제비 ${total}개 가운데 1개를 뽑을 때 당첨 제비를 뽑을 가능성과, 똑같이 ${cells}칸으로 나눈 회전판을 돌릴 때 화살이 빨간색에 멈출 가능성을 같게 하려고 한다. 회전판의 ${cells}칸 가운데 몇 칸을 빨간색으로 칠해야 하는가?`, cells / 2, {
        unit: '칸', explain: `당첨 제비는 제비 ${total}개 가운데 ${win}개로 꼭 반이므로 당첨 제비를 뽑을 가능성은 ${HALF}이다. 빨간색도 회전판의 꼭 반이어야 하므로 ${cells} ÷ 2 = ${cells / 2}(칸)을 칠한다.`,
        facts: { calc: [[`${cells}*${win}/${total}`, 0]] }
      });
    }),
    T('num-after', '뽑고 난 뒤 남은 것으로 따지는 가능성', '③74 심56', (d) => {
      const total = d.pick([10, 12, 20]), win = d.int(2, 4), drawn = d.int(win + 2, total - 3);
      return C(`상자에 제비 ${total}개가 들어 있고, 그 가운데 당첨 제비는 ${win}개이다. 지금까지 뽑은 제비 ${drawn}개 가운데 당첨 제비가 ${win}개 나왔고, 뽑은 제비는 다시 넣지 않았다. 다음에 제비 1개를 뽑을 때 당첨 제비를 뽑을 가능성을 수로 나타낸 것은?`, N3, 0, {
        explain: `당첨 제비 ${win}개가 이미 모두 나왔으므로 남은 제비 ${total} - ${drawn} = ${total - drawn}(개) 가운데 당첨 제비는 없다. 가능성은 「불가능하다」이고, 수로 나타내면 0이다.`,
        facts: claim3(0, total - drawn)
      });
    })
  ]);

  // ── 자료를 보고 가능성 예상하기 ──────────────────────────────
  const tally = (heads, values, h) => table([h || '색', '횟수(번)'], heads.map((x, i) => [x, values[i]]));
  // 100번 가운데 한 가지가 반쯤(48~53번), 나머지 둘이 서로 비슷하게(22~27번) 나온 결과: [반쯤 나온 횟수, 나머지 둘]
  const halfOf = (d) => d.until(() => { const big = d.pick([48, 49, 51, 52, 53]), a = d.int(22, 27); return [big, a, 100 - big - a]; }, (x) => x[2] >= 22 && x[2] <= 27);
  B.addTypes(U, 'data', [
    T('data-table-word', '둘로 갈리는 실험 결과 → 가능성을 말로', '①54 심59의 변형', (d) => {
      const a = d.int(6, 11), few = d.bool();
      return C(`빨간색 구슬과 파란색 구슬이 든 주머니에서 구슬 1개를 꺼내 색을 확인하고 다시 넣기를 50번 되풀이한 결과이다. 이 주머니에서 구슬 1개를 꺼낼 때 ${few ? '빨간색' : '파란색'} 구슬이 나올 가능성을 말로 나타낸 것으로 가장 알맞은 것은?`, W5, few ? 1 : 3, {
        figure: tally(['빨간색', '파란색'], [a, 50 - a]),
        explain: `50번 가운데 빨간색은 ${a}번, 파란색은 ${50 - a}번 나왔다. ${few ? `빨간색은 반인 25번보다 훨씬 적게 나왔지만 나오기는 했으므로 「~아닐 것 같다」가` : `파란색은 반인 25번보다 훨씬 많이 나왔지만 빨간색도 나왔으므로 「~일 것 같다」가`} 가장 알맞다.`,
        facts: { truth: W5.map((_, i) => i === (few ? 1 : 3)), want: true }
      });
    }),
    T('data-table-num', '세 가지로 갈리는 실험 결과 → 가능성을 수로', '①55 심59·60', (d) => {
      const colors = d.shuffle(['빨간색', '노란색', '파란색']), v = halfOf(d), big = v[0], order = d.shuffle([0, 1, 2]), shown = order.map((i) => v[i]), ask = colors[order.indexOf(0)];
      return C(`세 가지 색이 칠해진 회전판을 100번 돌려 화살이 멈춘 색을 기록한 결과이다. 이 회전판을 돌릴 때 화살이 ${ask}에 멈출 가능성을 수로 나타낸 것으로 가장 알맞은 것은?`, N3, 1, {
        figure: tally(colors, shown),
        explain: `${josa(ask, '은/는')} 100번 가운데 ${big}번으로, 반인 50번과 비슷하다. 나머지 두 색을 합친 ${100 - big}번과도 비슷하므로 가능성은 「반반이다」이고, 수로 나타내면 ${HALF}이다. 가장 많이 나왔다고 가능성이 1인 것은 아니다.`,
        facts: { truth: [false, true, false], want: true }
      });
    }),
    T('data-talk', '실험 결과를 보고 가능성을 바르게 말한 사람', '③69', (d) => {
      const a = d.int(22, 28), people = who(d, 4);
      const rows = d.shuffle([['빨간색 구슬이 나올 가능성은 「반반이다」이다.', true], ['노란색 구슬이 나올 가능성은 「확실하다」이다.', false], ['파란색 구슬이 나올 가능성은 「불가능하다」이다.', false], ['노란색 구슬이 나올 가능성은 「반반이다」이다.', false]]);
      return C('구슬 6개가 든 주머니에서 구슬 1개를 꺼내 색을 확인하고 다시 넣기를 50번 되풀이한 결과이다. 이 결과를 보고 가능성을 바르게 말한 학생은?', people, rows.findIndex((r) => r[1]), {
        figure: tally(['빨간색', '노란색', '파란색'], [a, 0, 50 - a]) + lines(rows.map((r, i) => `${people[i]}: ${r[0]}`)),
        explain: `50번 가운데 빨간색은 ${a}번, 파란색은 ${50 - a}번으로 비슷하게 나왔고 노란색은 한 번도 나오지 않았다. 빨간색과 파란색이 나올 가능성은 「반반이다」, 노란색이 나올 가능성은 「불가능하다」로 예상할 수 있다.`,
        facts: truthOf(rows, true)
      });
    }),
    T('data-bar-next', '실험 결과 막대그래프 → 더 꺼낼 때 가능성이 가장 높은 색', '①56의 변형 ②66 ③71 심63', (d) => {
      const colors = ['빨간색', '노란색', '파란색', '초록색'], v = d.until(() => d.shuffle([5, 10, 15, 20, 25, 30, 35, 40, 45]).slice(0, 4), (x) => sum(x) === 100), best = v.indexOf(top(v));
      return C('여러 가지 색 공이 든 상자에서 공 1개를 꺼내 색을 확인하고 다시 넣기를 100번 되풀이한 결과를 나타낸 막대그래프이다. 이 상자에서 공 1개를 한 번 더 꺼낼 때, 나올 가능성이 가장 높은 색은?', colors, best, {
        figure: barChart(colors, v, { step: 5, major: 2, top: 50, unit: '번', title: '색' }),
        explain: `100번 가운데 ${colors[best]} 공이 ${top(v)}번으로 가장 많이 나왔다. 가장 많이 나온 ${colors[best]} 공이 상자에 가장 많이 들어 있다고 예상할 수 있으므로, 한 번 더 꺼낼 때에도 ${colors[best]} 공이 나올 가능성이 가장 높다.`,
        facts: { choose: { exprs: v.map(String), rule: 'max' } }
      });
    }),
    T('data-bar-twice', '두 차례 실험 결과 막대그래프 → 가능성을 말로', '①56 ②67', (d) => {
      const [w1, w2] = d.until(() => [d.pick([45, 50, 55]), d.pick([45, 50, 55])], ([x, y]) => x !== y);
      return C('흰색 바둑돌과 검은색 바둑돌이 든 통에서 바둑돌 1개를 꺼내 색을 확인하고 다시 넣기를 100번씩 두 차례 되풀이한 결과를 나타낸 막대그래프이다. 이 통에서 바둑돌 1개를 꺼낼 때 흰색 바둑돌이 나올 가능성을 말로 나타낸 것으로 가장 알맞은 것은?', W5, 2, {
        figure: barChart(['흰색', '검은색'], [w1, 100 - w1], { second: [w2, 100 - w2], legend: ['1차', '2차'], step: 5, major: 2, top: 60, unit: '번', title: '색' }),
        explain: `흰색 바둑돌은 1차에 ${w1}번, 2차에 ${w2}번 나왔다. 두 차례 모두 100번의 반인 50번과 비슷하므로 가능성은 「반반이다」로 예상할 수 있다.`,
        facts: { truth: W5.map((_, i) => i === 2), want: true }
      });
    }),
    T('data-pick-spin', '실험 결과에 맞는 회전판 고르기', '①57 ②63 ③67 심61', (d) => {
      const keys = ['빨강', '노랑', '파랑'], kind = d.pick([0, 1, 2, 3]), [big, a, rest] = halfOf(d), flat = d.pick([[33, 34, 33], [35, 32, 33], [32, 33, 35]]);
      const v = kind === 3 ? flat : keys.map((_, i) => (i === kind ? big : i === (kind + 1) % 3 ? a : rest));
      const shapes = d.shuffle([0, 1, 2, 3]), parts = (s) => (s === 3 ? keys.map((k) => [k, 120]) : [[keys[s], 180], [keys[(s + 1) % 3], 90], [keys[(s + 2) % 3], 90]]), right = shapes.indexOf(kind);
      return C('세 가지 색이 칠해진 회전판을 100번 돌려 화살이 멈춘 색을 기록한 결과이다. 가, 나, 다, 라 가운데 돌린 회전판으로 가장 알맞은 것은?', TAGS.slice(0, 4), right, {
        figure: tally(keys.map((k) => HUE[k]), v) + grid(shapes.map((s, i) => spinner(parts(s), { tag: TAGS[i] }))),
        explain: kind === 3 ? `세 색이 멈춘 횟수가 ${v.join('번, ')}번으로 비슷하다. 세 색의 넓이가 같은 ${TAGS[right]}가 가장 알맞다.` : `${HUE[keys[kind]]}이 ${big}번으로 100번의 반쯤이고, 나머지 두 색은 서로 비슷하다. ${HUE[keys[kind]]}이 회전판의 반이고 나머지 두 색의 넓이가 같은 ${TAGS[right]}가 가장 알맞다.`,
        facts: { truth: shapes.map((s) => s === kind), want: true }
      });
    }),
    T('data-match', '실험 결과 둘과 회전판 짝 짓기', '①60의 변형 ②65 심61의 변형', (d) => {
      const kinds = d.shuffle(['half', 'flat', 'two']).slice(0, 2), a = d.int(22, 27), b = d.int(47, 52);
      const result = (kind) => (kind === 'half' ? [a, 100 - a - (a > 24 ? 25 : 26), a > 24 ? 25 : 26] : kind === 'flat' ? d.pick([[34, 33, 33], [32, 35, 33]]) : [0, b, 100 - b]);
      const rowsData = kinds.map(result), wheels = d.shuffle(['half', 'flat', 'two']), part = { half: [['노랑', 180], ['빨강', 90], ['파랑', 90]], flat: [['빨강', 120], ['노랑', 120], ['파랑', 120]], two: [['노랑', 180], ['파랑', 180]] };
      const right = kinds.map((k) => wheels.indexOf(k)), pairs = [[0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1]], rows = d.shuffle([[right, true]].concat(d.shuffle(pairs.filter((p) => p.join() !== right.join())).slice(0, 3).map((p) => [p, false])));
      return C('세 회전판 ㉠, ㉡, ㉢ 가운데 두 개를 골라 각각 100번씩 돌려 화살이 멈춘 색의 횟수(번)를 기록한 결과이다. 실험 가와 실험 나에서 돌린 회전판을 바르게 짝 지은 것은?', rows.map(([p]) => `가 – ${LAB[p[0]]}, 나 – ${LAB[p[1]]}`), rows.findIndex((r) => r[1]), {
        figure: table(['실험', '빨강', '노랑', '파랑'], rowsData.map((r, i) => [TAGS[i]].concat(r))) + grid(wheels.map((w, i) => spinner(part[w], { tag: LAB[i], size: 88 })), 3),
        explain: `${kinds.map((k, i) => `실험 ${TAGS[i]}는 ${k === 'half' ? '노란색이 반쯤이고 빨간색과 파란색이 비슷하므로 노란색이 반인' : k === 'flat' ? '세 색이 비슷하게 나왔으므로 세 색의 넓이가 같은' : '빨간색이 한 번도 나오지 않고 노란색과 파란색이 비슷하므로 두 색이 반씩인'} ${LAB[right[i]]}`).join(', ')}이다.`,
        facts: truthOf(rows, true)
      });
    }),
    T('data-pick-table', '회전판에 맞는 실험 결과 고르기', '②64', (d) => {
      const keys = d.shuffle(['빨강', '노랑', '파랑']), [big, a, rest] = halfOf(d), order = ['빨강', '노랑', '파랑'];
      const fit = order.map((k) => (k === keys[0] ? big : k === keys[1] ? a : rest)), other = order.map((k) => (k === keys[1] ? big : k === keys[0] ? a : rest)), flat = d.pick([[33, 34, 33], [35, 32, 33]]), rows = d.shuffle([[fit, true], [other, false], [flat, false]]);
      return C('회전판을 100번 돌려 화살이 멈춘 색의 횟수(번)를 기록하려고 한다. 가, 나, 다 가운데 이 회전판을 돌린 결과로 가장 알맞은 것은?', TAGS.slice(0, 3), rows.findIndex((r) => r[1]), {
        figure: spinner([[keys[0], 180], [keys[1], 90], [keys[2], 90]]) + table(['결과', '빨강', '노랑', '파랑'], rows.map((r, i) => [TAGS[i]].concat(r[0]))),
        explain: `회전판은 ${HUE[keys[0]]}이 반이고, ${HUE[keys[1]]}과 ${HUE[keys[2]]}이 나머지를 똑같이 나누어 가진다. ${HUE[keys[0]]}이 100번의 반쯤 나오고 나머지 두 색이 비슷하게 나온 ${TAGS[rows.findIndex((r) => r[1])]}가 가장 알맞다.`,
        facts: truthOf(rows, true)
      });
    }),
    T('data-pick-bag', '실험 결과에 맞는 주머니 고르기', '①59 ②63의 변형 ③70', (d) => {
      const kind = d.pick([0, 1, 2]), a = d.int(27, 33), v = kind === 0 ? [a, 0, 60 - a] : kind === 1 ? d.pick([[20, 19, 21], [21, 20, 19], [19, 22, 19]]) : [d.int(47, 52), 0, 0];
      if (kind === 2) v[2] = 60 - v[0];
      const bags = [[['빨강', 3], ['파랑', 3]], [['빨강', 2], ['노랑', 2], ['파랑', 2]], [['빨강', 5], ['파랑', 1]]], shown = d.shuffle([0, 1, 2]), right = shown.indexOf(kind);
      return C('구슬 6개가 든 주머니에서 구슬 1개를 꺼내 색을 확인하고 다시 넣기를 60번 되풀이한 결과이다. 가, 나, 다 가운데 구슬을 꺼낸 주머니로 가장 알맞은 것은?', TAGS.slice(0, 3), right, {
        figure: tally(['빨간색', '노란색', '파란색'], v) + grid(shown.map((s, i) => bag(bags[s], { tag: TAGS[i], cols: 3, order: mixed(d, bags[s]) })), 3),
        explain: kind === 0 ? `노란색은 한 번도 나오지 않았고 빨간색과 파란색이 비슷하게 나왔다. 빨간색과 파란색 구슬이 3개씩 든 ${TAGS[right]}가 가장 알맞다.` : kind === 1 ? `세 색이 비슷하게 나왔다. 세 색 구슬이 2개씩 든 ${TAGS[right]}가 가장 알맞다.` : `노란색은 한 번도 나오지 않았고 빨간색이 파란색보다 훨씬 많이 나왔다. 빨간색 구슬 5개와 파란색 구슬 1개가 든 ${TAGS[right]}가 가장 알맞다.`,
        facts: { truth: shown.map((s) => s === kind), want: true }
      });
    }),
    T('data-predict-dice', '생김새를 보고 많이 나올 것 예상하기', '②62', (d) => {
      const faces = d.shuffle([1, 2, 3]), colors = ['주황색', '노란색', '초록색'], best = faces.indexOf(3);
      return C(`여섯 면 가운데 주황색이 ${faces[0]}면, 노란색이 ${faces[1]}면, 초록색이 ${faces[2]}면인 주사위가 있다. 이 주사위를 100번 굴릴 때 가장 많이 나올 것으로 예상되는 색은?`, colors, best, {
        explain: `면의 수가 많은 색일수록 나올 가능성이 높다. ${colors[best]}이 3면으로 가장 많으므로 ${colors[best]}이 가장 많이 나올 것으로 예상된다.`, facts: { choose: { exprs: faces.map(String), rule: 'max' } }
      });
    }),
    T('data-two-bags', '횟수가 같은 두 실험 결과로 유리한 쪽 고르기', '①61의 변형 ②68', (d) => {
      const even = d.int(47, 53), tilt = d.bool() ? d.int(70, 80) : d.int(20, 30), first = d.bool(), reds = first ? [even, tilt] : [tilt, even], answer = reds[0] > reds[1] ? 0 : 2;
      return C('빨간색 구슬과 파란색 구슬이 든 두 주머니에서 각각 구슬 1개를 꺼내 색을 확인하고 다시 넣기를 100번씩 되풀이한 결과이다. 빨간색 구슬을 꺼내면 이기는 놀이를 할 때, 어느 주머니에서 꺼내는 것이 더 유리한가?', ['가 주머니', '어느 주머니나 같다', '나 주머니'], answer, {
        figure: table(['주머니', '빨간색', '파란색'], reds.map((r, i) => [TAGS[i], r, 100 - r])),
        explain: `두 주머니 모두 100번씩 꺼냈으므로 빨간색이 나온 횟수로 비교한다. 빨간색 구슬은 가 주머니에서 ${reds[0]}번, 나 주머니에서 ${reds[1]}번 나왔다. 빨간색이 더 많이 나온 ${TAGS[answer === 0 ? 0 : 1]} 주머니에서 빨간색 구슬이 나올 가능성이 더 높다고 예상할 수 있다.`,
        facts: { choose: { exprs: reds.map(String), rule: 'compare' } }
      });
    }),
    T('data-graph-order', '실험 결과 막대그래프로 가능성 차례 정하기', '③68', (d) => {
      const v = d.shuffle([5, 10, 15, 20, 25, 30, 35, 40, 45]).slice(0, 4), right = sortBy(v, true), all = [];
      for (let p = 0; p < 4; p += 1) for (let q = 0; q < 4; q += 1) for (let r = 0; r < 4; r += 1) for (let s = 0; s < 4; s += 1) if (new Set([p, q, r, s]).size === 4) all.push([p, q, r, s]);
      const orders = d.shuffle([right, right.slice().reverse()].concat(d.shuffle(all.filter((o) => o.join() !== right.join() && o.join() !== right.slice().reverse().join())).slice(0, 2)));
      return C('네 회전판 가, 나, 다, 라를 각각 50번씩 돌렸을 때 화살이 빨간색에 멈춘 횟수를 나타낸 막대그래프이다. 화살이 빨간색에 멈출 가능성이 높은 회전판부터 차례로 쓴 것은?', orders.map((o) => o.map((i) => TAGS[i]).join(', ')), orders.findIndex((o) => o.join() === right.join()), {
        figure: barChart(TAGS.slice(0, 4), v, { step: 5, major: 2, top: 50, unit: '번', title: '회전판' }),
        explain: `네 회전판을 모두 50번씩 돌렸으므로 빨간색에 멈춘 횟수가 많을수록 빨간색에 멈출 가능성이 높다고 예상할 수 있다. 횟수는 ${v.map((x, i) => `${TAGS[i]} ${x}번`).join(', ')}이므로 ${right.map((i) => TAGS[i]).join(', ')}의 차례이다.`,
        facts: { choose: { exprs: v.map(String), rule: 'descending', orders } }
      });
    }),
    T('data-fair', '두 사람의 가능성이 같은 방법 고르기', '②59', (d) => {
      const [x, y] = who(d, 2), turn = (a, b) => `${a} ${name(x, '이/가')}, ${b} ${name(y, '이/가')} 먼저 한다.`;
      const [fair, fairWhy] = d.pick([[`동전을 던져 ${turn('그림 면이 나오면', '숫자 면이 나오면')}`, '동전의 그림 면과 숫자 면은 나올 가능성이 같다'], [`주사위를 굴려 ${turn('눈의 수가 짝수이면', '홀수이면')}`, '주사위의 눈은 짝수가 3개, 홀수가 3개이다'], [`흰색 공 2개와 검은색 공 2개가 든 주머니에서 공 1개를 꺼내 ${turn('흰색이면', '검은색이면')}`, '흰색 공과 검은색 공이 2개씩이다']]);
      const unfair = d.shuffle([[`주사위를 굴려 ${turn('눈의 수가 1이면', '2 이상이면')}`, '주사위의 눈 1과 2 이상은 1개와 5개'], [`빨간색 구슬 3개와 파란색 구슬 1개가 든 주머니에서 구슬 1개를 꺼내 ${turn('빨간색이면', '파란색이면')}`, '빨간색 구슬과 파란색 구슬은 3개와 1개'], [`1부터 5까지의 수 카드 가운데 한 장을 뽑아 ${turn('홀수이면', '짝수이면')}`, '1부터 5까지의 홀수와 짝수는 3장과 2장'], [`주사위를 굴려 ${turn('눈의 수가 4 이하이면', '5 이상이면')}`, '주사위의 눈 4 이하와 5 이상은 4개와 2개']]).slice(0, 3);
      const rows = d.shuffle([[fair, true]].concat(unfair.map((u) => [u[0], false])));
      return C(`${name(x, '과/와')} ${name(y, '이/가')} 놀이에서 누가 먼저 할지 정하려고 한다. 두 사람이 먼저 할 가능성이 같은 방법은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        explain: `두 사람이 먼저 할 가능성이 같으려면 두 가지 일이 일어날 가능성이 모두 「반반이다」이어야 한다. ${fairWhy}. ${unfair.map((u) => u[1]).join(', ')}로 수가 서로 달라 가능성이 같지 않다.`,
        facts: truthOf(rows, true)
      });
    })
  ]);

  // ── 실력 문제 ────────────────────────────────────────────────
  B.addGroup(U, {
    id: 'hard', title: '실력 문제', standard: AVG,
    types: [
      H('h-sum-trap', '합은 더 크지만 평균은 더 낮은 모둠', '18, 기본 ②16', (d) => {
        // ① 장치: 자료 수가 다른 두 모둠에서 합이 큰 모둠이 평균은 더 낮다. 합으로 견주면 틀리고, 모둠마다 그 모둠의 사람 수로 나누어 견주어야 한다.
        const [a, b] = d.until(() => [data(d, 5, 4, 9), data(d, 4, 4, 9)], ([x, y]) => sum(x) > sum(y) && mean(x) < mean(y) && new Set(x).size >= 3 && new Set(y).size >= 3 && sum(x) - sum(y) !== mean(y) - mean(x)), values = [mean(a), mean(b)];
        const gap = values[1] - values[0], sumGap = sum(a) - sum(b);
        // 보기: [나, 평균의 차] 정답 / [가, 합의 차] 합으로 견준 아이 / [가, 평균의 차] 평균은 구했지만 합이 큰 쪽을 고른 아이 / [나, 합의 차] 모둠은 맞혔지만 합의 차를 쓴 아이
        const options = d.shuffle([[1, gap], [0, sumGap], [0, gap], [1, sumGap]]);
        return C('두 모둠 학생들의 제기차기 기록(개)을 나타낸 표이다. 한 명당 기록이 더 좋은 모둠과, 두 모둠의 기록의 평균의 차를 바르게 쓴 것은?', options.map(([w, g]) => `${TAGS[w]} 모둠, ${g}개`), options.findIndex(([w, g]) => w === 1 && g === gap), {
          figure: rowsTab(['가 모둠', '나 모둠'], [a, b]),
          explain: `가 모둠은 5명이므로 ${worked(a, '개')}, 나 모둠은 4명이므로 ${worked(b, '개')}이다. 기록의 합은 가 모둠이 ${sumGap}개 더 많지만 학생 수가 다르므로 합으로 비교할 수 없다. 한 명당 기록은 나 모둠이 ${gap}개 더 좋다.`,
          facts: { who: { exprs: [E(a), E(b)], values, options }, unseen: [5, 4] }
        });
      }),
      H('h-zero', '표에 적히지 않은 날이 있는 자료의 평균', '9의 변형, 기본 ③8', (d) => {
        // ① 장치: 운동을 하지 않은 날은 표에 없다. 표의 네 수를 4로 나누면 틀리고(그 값도 자연수가 되게 했다), 0분인 날도 자료의 수에 넣어 5로 나누어야 한다.
        const off = d.int(0, 4), days = DAYS5.filter((_, i) => i !== off), v = d.until(() => Array.from({ length: 4 }, () => d.int(4, 12) * 5), (x) => sum(x) % 20 === 0 && new Set(x).size >= 3), person = d.pick(NAMES);
        return N(`${name(person, '이/가')} 월요일부터 금요일까지 5일 동안 운동한 시간을 적은 표이다. ${DAYS5[off]}요일에는 운동을 하지 않아 표에 적지 않았다. 5일 동안 하루에 운동한 시간의 평균은 몇 분인가?`, sum(v) / 5, {
          unit: '분', figure: tab('요일', '시간(분)', days, v),
          explain: `운동을 하지 않은 ${DAYS5[off]}요일은 0분이고, 이날도 자료의 수에 넣는다. (${plus(v)} + 0) ÷ 5 = ${sum(v)} ÷ 5 = ${sum(v) / 5}(분)이다. 표에 적힌 네 수만 보고 4로 나누면 안 된다.`,
          facts: { calc: [[`(${v.join('+')})/5`, 0]] }
        });
      }),
      H('h-raise-total', '평균을 올리려면 한 자료를 얼마나 올려야 하는가', '32·33의 변형, 기본 ①29 ③30', (d) => {
        // ① 장치: 평균을 k만큼 올리려면 합은 k가 아니라 (자료의 수) × k만큼 늘어야 한다. 주어진 평균은 쓰이지 않는다.
        const n = d.pick([4, 5]), k = d.int(2, 3), m = d.int(76, 84), subject = d.pick(['수학', '국어', '과학']), count = ['', '', '', '', '네', '다섯', '여섯'][n], person = d.pick(NAMES);
        return N(`${name(person, '의/의')} ${count} 과목 점수의 평균은 ${m}점이다. 다른 과목의 점수는 그대로 두고 ${subject} 점수만 올려서 ${count} 과목 점수의 평균을 ${k}점 높이려면 ${subject} 점수를 몇 점 올려야 하는가?`, n * k, {
          unit: '점', explain: `평균이 ${k}점 높아지려면 ${count} 과목 점수의 합이 ${k} × ${n} = ${n * k}(점) 늘어야 한다. ${subject} 점수만 올리므로 ${subject} 점수를 ${n * k}점 올려야 한다. 올린 점수는 ${n}과목에 고르게 나뉘므로 ${k}점만 올리면 평균은 ${k}점만큼 오르지 않는다.`,
          facts: { calc: [[`${k}*${n}`, 0]], unseen: [n] }
        });
      }),
      H('h-higher-than', '평균이 오르려면 새 기록이 넘어야 하는 값', '16, 기본 ②28', (d) => {
        // ① 장치: 넘어야 하는 값은 새로 셈할 것 없이 지금의 평균이다. 평균보다 큰 자료가 들어와야 평균이 오른다.
        const v = data(d, 5, 12, 26, (x) => distinct(x) && !x.includes(mean(x))), person = d.pick(NAMES);
        return N(`${nick(person)}네 모둠이 농구 다섯 경기에서 얻은 점수는 ${v.join('점, ')}점이다. 여섯 경기의 점수의 평균이 다섯 경기의 점수의 평균보다 높으려면 여섯째 경기에서 몇 점보다 높은 점수를 얻어야 하는가?`, mean(v), {
          unit: '점', explain: `다섯 경기의 점수의 평균은 ${worked(v, '점')}이다. 여섯째 경기의 점수가 평균과 같으면 평균은 그대로이고, 평균보다 높아야 평균이 오른다. ${mean(v)}점보다 높은 점수를 얻어야 한다.`,
          facts: { calc: [[E(v), 0]], unseen: [5] }
        });
      }),
      H('h-fill-to-mean', '평균보다 낮은 자료를 평균까지 올린 뒤의 평균', '17', (d) => {
        // ① 장치: 낮은 자료를 평균까지 올리면 평균이 그대로일 것 같지만, 평균보다 높은 자료의 남는 몫이 그대로여서 평균은 오른다.
        const v = data(d, 5, 2, 16, (x) => { const m = mean(x), lack = sum(x.filter((y) => y < m).map((y) => m - y)); return distinct(x) && !x.includes(m) && lack % 5 === 0 && lack > 0; }), m = mean(v), after = v.map((x) => (x < m ? m : x));
        return N(`다섯 학생이 읽은 책의 수는 ${v.join('권, ')}권이다. 다섯 학생이 읽은 책의 수의 평균보다 적게 읽은 학생들이 책을 더 읽어 모두 그 평균만큼 읽게 되면, 다섯 학생이 읽은 책의 수의 평균은 몇 권이 되는가?`, mean(after), {
          unit: '권', explain: `처음 평균은 ${worked(v, '권')}이다. ${m}권보다 적게 읽은 학생이 모두 ${m}권을 읽게 되면 읽은 책의 수는 ${after.join('권, ')}권이 된다. ${worked(after, '권')}이다. 평균보다 많이 읽은 학생이 그대로 있으므로 평균은 ${m}권보다 커진다.`,
          facts: { calc: [[E(after), 0]], unseen: [m, 5] }
        });
      }),
      H('h-merge-same', '평균이 같은 두 모둠을 합친 평균', '34의 변형', (d) => {
        // ① 장치: 평균이 같은 두 모둠을 합치면 평균은 그대로다. 두 평균을 더하거나 사람 수를 따져 새로 셈할 것이 없다.
        const [n1, n2] = d.until(() => [d.int(3, 7), d.int(3, 7)], ([x, y]) => x !== y), m = d.int(9, 18);
        return N(`가 모둠 ${n1}명이 캔 고구마의 수의 평균은 ${m}개이고, 나 모둠 ${n2}명이 캔 고구마의 수의 평균도 ${m}개이다. 두 모둠 학생 ${n1 + n2}명이 캔 고구마의 수의 평균은 몇 개인가?`, m, {
          unit: '개', explain: `가 모둠은 ${m} × ${n1} = ${m * n1}(개), 나 모둠은 ${m} × ${n2} = ${m * n2}(개)를 캤다. (${m * n1} + ${m * n2}) ÷ ${n1 + n2} = ${m * (n1 + n2)} ÷ ${n1 + n2} = ${m}(개)이다. 두 모둠 모두 한 명당 ${m}개씩으로 고르게 한 것이므로 합쳐도 평균은 ${m}개이다.`,
          facts: { calc: [[`(${m}*${n1}+${m}*${n2})/${n1 + n2}`, 0]] }
        });
      }),
      H('h-merge-two', '사람 수가 다른 두 집단을 합친 평균', '34, 기본 ①28 ②26', (d) => {
        // ① 장치: 두 평균의 가운데가 답이 아니다(가운데 값도 자연수가 되게 했다). 사람 수가 많은 쪽으로 평균이 쏠리므로 합을 되살려 전체 사람 수로 나누어야 한다.
        const [n1, n2, m1, m2] = d.until(() => [d.pick([8, 10, 12, 14, 15, 16, 18, 20]), d.pick([8, 10, 12, 14, 15, 16, 18, 20]), d.int(30, 48), d.int(30, 48)], ([a, b, x, y]) => a !== b && a + b <= 30 && x !== y && (x + y) % 2 === 0 && (a * x + b * y) % (a + b) === 0), total = n1 * m1 + n2 * m2, all = n1 + n2;
        return N(`가 모둠 학생 ${n1}명의 줄넘기 기록의 평균은 ${m1}번이고, 나 모둠 학생 ${n2}명의 줄넘기 기록의 평균은 ${m2}번이다. 두 모둠 학생 ${all}명의 줄넘기 기록의 평균은 몇 번인가?`, total / all, {
          unit: '번', explain: `가 모둠의 기록의 합은 ${m1} × ${n1} = ${m1 * n1}(번), 나 모둠의 기록의 합은 ${m2} × ${n2} = ${m2 * n2}(번)이다. (${m1 * n1} + ${m2 * n2}) ÷ ${all} = ${total} ÷ ${all} = ${total / all}(번)이다. 학생 수가 다르므로 두 평균의 가운데인 ${(m1 + m2) / 2}번이 아니다.`,
          facts: { calc: [[`(${m1}*${n1}+${m2}*${n2})/${all}`, 0]] }
        });
      }),
      H('h-two-books', '두 묶음의 양과 날수를 각각 더해 구하는 평균', '4', (d) => {
        // ① 장치: 책마다 하루 평균을 따로 구해 다시 평균 내면 틀린다(그 값도 자연수가 되게 했다). 쪽수의 합을 날수의 합으로 나누어야 한다.
        const [d1, d2, a, b] = d.until(() => [d.pick([8, 10, 12, 18, 20]), d.pick([8, 10, 12, 18, 20]), d.int(18, 36), d.int(18, 36)], ([x, y, p, q]) => x !== y && [20, 30].includes(x + y) && p !== q && (p + q) % 2 === 0 && (x * p + y * q) % (x + y) === 0), pages = [d1 * a, d2 * b], person = d.pick(NAMES);
        return N(`${name(person, '은/는')} 동화책 ${pages[0]}쪽을 ${d1}일 동안 읽고, 이어서 과학책 ${pages[1]}쪽을 ${d2}일 동안 읽었다. ${d1 + d2}일 동안 하루에 읽은 쪽수의 평균은 몇 쪽인가?`, (pages[0] + pages[1]) / (d1 + d2), {
          unit: '쪽', explain: `읽은 쪽수는 모두 ${pages[0]} + ${pages[1]} = ${pages[0] + pages[1]}(쪽)이고 읽은 날은 모두 ${d1} + ${d2} = ${d1 + d2}(일)이다. ${pages[0] + pages[1]} ÷ ${d1 + d2} = ${(pages[0] + pages[1]) / (d1 + d2)}(쪽)이다. 책마다 하루 평균 ${a}쪽과 ${b}쪽을 구하여 그 가운데인 ${(a + b) / 2}쪽으로 답하면 안 된다. 읽은 날수가 다르기 때문이다.`,
          facts: { calc: [[`(${pages[0]}+${pages[1]})/(${d1}+${d2})`, 0]] }
        });
      }),
      H('h-add-one', '새 자료가 더해진 뒤의 평균', '31, 기본 ①25', (d) => {
        // ① 장치: (처음 평균 + 새 값) ÷ 2가 아니다. 처음 평균은 자료 n개를 대표하는 값이므로 합을 되살려야 한다.
        const [n, m, x] = d.until(() => [d.pick([4, 5, 6]), d.int(40, 70), d.int(30, 95)], ([k, p, q]) => (k * p + q) % (k + 1) === 0 && Math.abs(p - q) >= k + 1 && Math.abs(p - q) <= 25), person = d.pick(NAMES), after = (n * m + x) / (n + 1);
        return N(`${name(person, '의/의')} 1회부터 ${n}회까지의 줄넘기 기록의 평균은 ${m}번이고, ${n + 1}회의 기록은 ${x}번이다. 1회부터 ${n + 1}회까지의 줄넘기 기록의 평균은 몇 번인가?`, after, {
          unit: '번', explain: `1회부터 ${n}회까지의 기록의 합은 ${m} × ${n} = ${m * n}(번)이다. ${n + 1}회의 기록을 더하면 ${m * n} + ${x} = ${m * n + x}(번)이고, ${m * n + x} ÷ ${n + 1} = ${after}(번)이다. 평균 ${m}번은 ${n}회의 기록을 대표하는 값이므로 ${m}번과 ${x}번 두 수만 더해 2로 나누면 안 된다.`,
          facts: { calc: [[`(${m}*${n}+${x})/${n + 1}`, 0]] }
        });
      }),
      H('h-who-joined', '한 명이 들어와 평균이 달라졌을 때 그 값', '33, 기본 ①26 ②29·30 ③31', (d) => {
        // ② 처음 평균 → 새 평균 → 새 합 → 들어온 값. 「처음 평균 + 늘어난 만큼」으로 답하는 잘못을 풀이에 적었다.
        const v = data(d, 4, 138, 154, distinct), m = mean(v), up = d.pick([1, 2]), people = who(d, 4), x = (m + up) * 5 - sum(v);
        return N(`어느 모둠 학생 네 명의 키를 나타낸 표이다. 이 모둠에 학생 한 명이 새로 들어와 다섯 명의 키의 평균이 처음 네 명의 키의 평균보다 ${up} cm 커졌다. 새로 들어온 학생의 키는 몇 cm인가?`, x, {
          unit: 'cm', figure: tab('이름', '키(cm)', people, v),
          explain: `처음 네 명의 키의 평균은 ${worked(v, 'cm')}이다. 다섯 명의 키의 평균은 ${m} + ${up} = ${m + up}(cm)이므로 다섯 명의 키의 합은 ${m + up} × 5 = ${(m + up) * 5}(cm)이다. 새로 들어온 학생의 키는 ${(m + up) * 5} - ${sum(v)} = ${x}(cm)이다. 새 학생은 자기 키뿐 아니라 처음 네 명의 평균도 ${up} cm씩 올려야 하므로 ${m + up} cm보다 훨씬 크다.`,
          facts: { calc: [[`(${E(v)}+${up})*5-(${v.join('+')})`, 0]], unseen: [4, 5] }
        });
      }),
      H('h-rest-mean', '전체의 평균과 일부의 평균으로 나머지의 평균 구하기', '기본 ②27', (d) => {
        // ② 전체의 합 → 일부의 합 → 나머지의 합 → 나머지의 평균
        const [n, k, m, part] = d.until(() => [d.pick([5, 6, 8]), d.pick([2, 3]), d.int(140, 152), d.int(140, 156)], ([a, b, x, y]) => x !== y && (a * x - b * y) % (a - b) === 0 && Math.abs((a * x - b * y) / (a - b) - x) <= 6), rest = (n * m - k * part) / (n - k);
        return N(`어느 모둠 학생 ${n}명의 키의 평균은 ${m} cm이다. 이 가운데 ${k}명의 키의 평균이 ${part} cm일 때, 나머지 ${n - k}명의 키의 평균은 몇 cm인가?`, rest, {
          unit: 'cm', explain: `${n}명의 키의 합은 ${m} × ${n} = ${m * n}(cm)이고, ${k}명의 키의 합은 ${part} × ${k} = ${part * k}(cm)이다. 나머지 ${n - k}명의 키의 합은 ${m * n} - ${part * k} = ${m * n - part * k}(cm)이므로 평균은 ${m * n - part * k} ÷ ${n - k} = ${rest}(cm)이다.`,
          facts: { calc: [[`(${m}*${n}-${part}*${k})/${n - k}`, 0]] }
        });
      }),
      H('h-diff-mean', '두 모둠의 평균의 차가 주어질 때 빈 자료', '27, 기본 ①24 ③28', (d) => {
        // ② 한 모둠의 평균 → 다른 모둠의 평균 → 합 → 빈 자료. 차를 합이 아니라 평균에 더해야 한다.
        const a = data(d, 5, 4, 9, (x) => new Set(x).size >= 3 && mean(x) <= 6), up = d.pick([1, 2]), m = mean(a) + up, b = data(d, 4, 3, 9, (x) => mean(x) === m && new Set(x).size >= 3), k = d.int(0, 3), rest = b.filter((_, i) => i !== k);
        return N(`두 모둠 학생들이 과녁 맞히기에서 얻은 점수(점)를 나타낸 표이다. 나 모둠의 점수의 평균이 가 모둠의 점수의 평균보다 ${up}점 높을 때, 빈칸에 알맞은 수는?`, b[k], {
          unit: '점', figure: rowsTab(['가 모둠', '나 모둠'], [a, b.map((x, i) => (i === k ? null : x))]),
          explain: `가 모둠의 평균은 ${worked(a, '점')}이다. 나 모둠의 평균은 ${mean(a)} + ${up} = ${m}(점)이고 4명이므로 합은 ${m} × 4 = ${m * 4}(점)이다. 빈칸은 ${m * 4} - (${plus(rest)}) = ${b[k]}(점)이다. ${up}점은 합이 아니라 평균에 더한다.`,
          facts: { calc: [[`(${E(a)}+${up})*4-(${rest.join('+')})`, 0]], unseen: [5, 4] }
        });
      }),
      H('h-over-under', '남는 만큼과 모자라는 만큼으로 평균이 기준보다 큰지 가리기', '기본 ③22', (d) => {
        // ① 장치: 평균을 셈하지 않고도 기준선보다 남는 만큼과 모자라는 만큼을 견주면 평균이 기준보다 큰지 알 수 있다(평균의 뜻: 고르게 하기).
        const v = data(d, 5, 6, 14, (x) => [9, 10, 11].includes(mean(x)) && new Set(x).size >= 4 && x.filter((y) => y === 10).length <= 1), over = sum(v.filter((x) => x > 10).map((x) => x - 10)), under = sum(v.filter((x) => x < 10).map((x) => 10 - x));
        return C('나무 다섯 그루의 높이를 나타낸 막대그래프이다. 점선은 10 m를 나타낸다. 나무 다섯 그루의 높이의 평균은 10 m와 비교하여 어떠한가?', ['10 m보다 높다', '10 m와 같다', '10 m보다 낮다'], over > under ? 0 : over === under ? 1 : 2, {
          figure: barsWith(TAGS, v, { step: 1, top: 15, unit: 'm', title: '나무' }, [{ at: 10 }]),
          explain: `10 m보다 높은 나무가 점선 위로 남는 높이는 모두 ${over} m이고, 10 m보다 낮은 나무가 점선까지 모자라는 높이는 모두 ${under} m이다. 남는 만큼을 모자라는 곳에 옮겨 고르게 하면 ${over > under ? '점선을 채우고도 남으므로 평균은 10 m보다 높다' : over === under ? '점선에 꼭 맞으므로 평균은 10 m와 같다' : '점선을 다 채우지 못하므로 평균은 10 m보다 낮다'}.`,
          facts: { choose: { exprs: [v.join('+'), '10*5'], rule: 'compare' }, unseen: [5] }
        });
      }),
      H('h-clock', '평균 시간에 맞추려면 끝내야 하는 시각', '29', (d) => {
        // ② 평균 × 날수 → 남은 시간 → 끝나는 시각
        const [per, a, b, hour, minute] = d.until(() => [d.pick([35, 40, 45, 50]), d.int(5, 11) * 5, d.int(5, 11) * 5, d.int(3, 6), d.int(1, 10) * 5], ([p, x, y, , mm]) => { const need = p * 3 - x - y; return need >= 30 && need <= 75 && x !== y && need !== p && (mm + need) % 60 !== 0 && mm + need >= 60; });
        const need = per * 3 - a - b, end = hour * 60 + minute + need, person = d.pick(NAMES);
        return M(`${name(person, '은/는')} 3일 동안 하루 평균 ${per}분씩 줄넘기를 하기로 하였다. 첫째 날에 ${a}분, 둘째 날에 ${b}분 동안 줄넘기를 하였다. 셋째 날 오후 ${hour}시 ${minute}분에 줄넘기를 시작하면 오후 몇 시 몇 분에 끝내야 하는가?`, [{ lead: '오후', answer: Math.floor(end / 60), unit: '시' }, { answer: end % 60, unit: '분' }], {
          explain: `3일 동안 줄넘기를 한 시간의 합은 ${per} × 3 = ${per * 3}(분)이어야 한다. 셋째 날에는 ${per * 3} - ${a} - ${b} = ${need}(분) 동안 해야 한다. 오후 ${hour}시 ${minute}분에서 ${need}분 뒤는 오후 ${Math.floor(end / 60)}시 ${end % 60}분이다.`,
          facts: { calc: [[`(${hour}*60+${minute}+${per}*3-${a}-${b}-(${hour}*60+${minute}+${per}*3-${a}-${b})%60)/60`, 0], [`(${hour}*60+${minute}+${per}*3-${a}-${b})%60`, 1]], unseen: [60] }
        });
      }),
      H('h-spin-area', '칸 수가 아니라 넓이로 따지는 회전판', '36·53의 변형, 기본 ②45 ③51', (d) => {
        // ① 장치: 칸의 크기가 다른 회전판. 칸 수가 반(4칸 가운데 2칸)인 판은 빨간색이 반이 아니고, 칸 수는 3칸 가운데 1칸이지만 빨간색이 판의 반인 판이 답이다.
        // 보기: 3칸 가운데 1칸이지만 넓이가 반(정답) / 4칸 가운데 2칸이지만 좁은 두 칸(칸 수만 센 아이) / 똑같은 4칸 가운데 1칸 / 2칸 가운데 1칸이지만 좁은 칸(칸 수만 센 아이)
        const made = d.shuffle([{ parts: [['빨강', 180], ['파랑', 90], ['노랑', 90]], red: 180 }, { parts: [['빨강', 45], ['파랑', 135], ['빨강', 45], ['파랑', 135]], red: 90 }, { parts: d.shuffle(['빨강', '파랑', '노랑', '파랑']).map((k) => [k, 90]), red: 90 }, { parts: [['빨강', 120], ['파랑', 240]], red: 120 }]), right = made.findIndex((m) => m.red === 180);
        return C('회전판을 돌릴 때, 화살이 빨간색에 멈출 가능성이 「반반이다」인 회전판은?', TAGS.slice(0, 4), right, {
          figure: grid(made.map((m, i) => spinner(m.parts, { tag: TAGS[i] }))),
          explain: `가능성은 칸의 수가 아니라 칸의 넓이로 따진다. 빨간색이 회전판의 꼭 반을 차지하는 것은 ${TAGS[right]}뿐이다. 칸의 수가 4칸 가운데 2칸이거나 2칸 가운데 1칸이어도 빨간색 칸이 좁으면 빨간색은 회전판의 반이 되지 않는다.`,
          facts: { claimed: made.map((m) => [`${m.red}*2`, 360]), claimedWant: true }
        });
      }, { standard: SAY }),
      H('h-coin-streak', '앞의 결과와 상관없는 가능성', '59의 변형, 기본 ②71의 변형', (d) => {
        // ① 장치: 앞에서 같은 면이 여러 번 나왔어도 다음에 던질 때의 가능성은 달라지지 않는다. 「이제 숫자 면이 나올 차례」(1)도 「계속 그림 면」(0)도 아니다.
        const times = d.pick(['세', '네', '다섯']), coin = d.pick(['100원짜리', '500원짜리']), side = d.bool();
        return C(`${coin} 동전 한 개를 ${times} 번 던졌더니 ${times} 번 모두 그림 면이 나왔다. 이 동전을 한 번 더 던질 때 ${side ? '숫자 면' : '그림 면'}이 나올 가능성을 수로 나타낸 것은?`, N3, 1, {
          explain: `동전을 던질 때 그림 면이 나올 가능성과 숫자 면이 나올 가능성은 언제나 같다. 앞에서 그림 면이 여러 번 나왔다고 해서 다음에 숫자 면이 나올 가능성이 커지거나 작아지지 않는다. 가능성은 「반반이다」이고, 수로 나타내면 ${HALF}이다.`,
          facts: claim3(1, 2)
        });
      }, { standard: NUM }),
      H('h-remaining', '꺼낸 뒤 남은 것으로 따지는 가능성', '56, 기본 ③73', (d) => {
        // ① 장치: 꺼낸 구슬을 다시 넣지 않았으므로 처음 개수가 아니라 남은 개수로 따져야 한다. 처음에는 한쪽이 많았지만 남은 것은 꼭 반씩이다.
        const b = d.int(2, 4), out = d.int(1, 3), a = b + out;
        return C(`주머니에 빨간색 구슬 ${a}개와 파란색 구슬 ${b}개가 들어 있다. 구슬 ${out}개를 꺼냈더니 ${out === 1 ? '빨간색이었고' : '모두 빨간색이었고'}, 꺼낸 구슬은 다시 넣지 않았다. 이어서 구슬 1개를 꺼낼 때 빨간색 구슬이 나올 가능성을 수로 나타낸 것은?`, N3, 1, {
          explain: `꺼낸 구슬을 다시 넣지 않았으므로 주머니에 남은 구슬로 따진다. 남은 구슬은 빨간색 ${a} - ${out} = ${b}(개), 파란색 ${b}개이다. ${becauseNum(b, 2 * b, '개')} 처음 개수인 ${a}개와 ${b}개로 따지면 안 된다.`,
          facts: claim3(b, 2 * b)
        });
      }, { standard: NUM }),
      H('h-count-not-chance', '개수가 많다고 가능성이 높은 것은 아닌 주머니', '기본 ③53의 변형 ②52의 변형', (d) => {
        // ① 장치: 빨간색 구슬이 가장 많은 주머니가 답이 아니다. 주머니마다 전체 개수가 달라, 빨간색이 그 주머니의 반보다 많은지·꼭 반인지·반보다 적은지로 견주어야 한다.
        const many = d.pick([[3, 1], [4, 1], [4, 2]]), half = d.pick([[5, 5], [6, 6]]), few = d.pick([[4, 6], [5, 7], [4, 8]]), bags = d.shuffle([many, half, few]), right = bags.indexOf(many);
        return C('세 주머니에 든 구슬의 수(개)를 나타낸 표이다. 주머니에서 구슬 1개를 꺼낼 때, 빨간색 구슬이 나올 가능성이 가장 높은 주머니는?', TAGS.slice(0, 3).map((t) => `${t} 주머니`), right, {
          figure: table(['주머니', '빨간색', '파란색'], bags.map((x, i) => [TAGS[i]].concat(x))),
          explain: `주머니마다 구슬의 수가 다르므로 빨간색 구슬의 수가 아니라 빨간색이 그 주머니의 반보다 많은지를 본다. ${bags.map(([r, b], i) => `${TAGS[i]} 주머니는 ${r + b}개 가운데 ${r}개로 ${r > b ? '반보다 많고' : r === b ? '꼭 반이고' : '반보다 적고'}`).join(', ').replace(/고$/, '다')}. 빨간색 구슬이 반보다 많은 ${TAGS[right]} 주머니에서 가능성이 가장 높다.`,
          facts: { choose: { exprs: bags.map(([r, b]) => `${r}/(${r}+${b})`), rule: 'max' } }
        });
      }, { standard: SAY }),
      H('h-half-back', '가능성이 「반반이다」가 되는 처음 개수', '54의 변형, 기본 ②60', (d) => {
        // ② 「반반이다」 → 남은 두 색의 수가 같다 → 남은 검은색 → 처음 검은색 → 처음 전체
        const w = d.int(5, 9), out = d.int(2, 4);
        return N(`통에 검은색 바둑돌 몇 개와 흰색 바둑돌 ${w}개가 들어 있다. 이 통에서 검은색 바둑돌 ${out}개를 꺼내고 다시 넣지 않았더니, 바둑돌 1개를 꺼낼 때 흰색 바둑돌이 나올 가능성이 「반반이다」가 되었다. 처음에 통에 들어 있던 바둑돌은 모두 몇 개인가?`, w + w + out, {
          unit: '개', explain: `가능성이 「반반이다」이면 남은 흰색 바둑돌과 검은색 바둑돌의 수가 같다. 남은 검은색 바둑돌은 ${w}개이므로 처음 검은색 바둑돌은 ${w} + ${out} = ${w + out}(개)이다. 처음 바둑돌은 모두 ${w + out} + ${w} = ${2 * w + out}(개)이다.`,
          facts: { calc: [[`${w}+${out}+${w}`, 0]] }
        });
      }, { standard: NUM }),
      H('h-spin-assign', '가능성의 차례에 맞게 칸의 색 정하기', '46', (d) => {
        // ② 조건 셋으로 네 색의 가능성 차례를 정하고(노란색 < 흰색 < 빨간색 < 파란색), 넓이의 차례와 맞댄다.
        const degs = d.shuffle([150, 100, 70, 40]), right = degs.indexOf(100);
        return C('네 칸의 크기가 서로 다른 회전판의 칸마다 빨간색, 파란색, 노란색, 흰색을 하나씩 칠하려고 한다. 화살이 멈출 가능성이 노란색이 가장 낮고 파란색이 가장 높으며, 흰색이 빨간색보다 낮게 되도록 칠할 때 빨간색을 칠하는 칸은?', LAB.slice(0, 4), right, {
          figure: spinner(degs.map((x, i) => [LAB[i], x]), { size: 132 }),
          explain: `가능성이 낮은 색부터 차례로 노란색, 흰색, 빨간색, 파란색이다. 칸이 넓을수록 가능성이 높으므로 가장 좁은 칸에 노란색, 가장 넓은 칸에 파란색을 칠하고, 빨간색은 둘째로 넓은 칸인 ${LAB[right]}에 칠한다.`,
          facts: { rank: { values: degs, nth: 2 } }
        });
      }, { standard: SAY })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
