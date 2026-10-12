// 5학년 2학기 6단원 평균과 가능성 — 단원 틀, 평균 그림 도구, 「평균」의 기본 문항(평균의 뜻, 평균 구하기, 평균 비교와 해석, 평균으로 모르는 값 구하기).
// 수집해 둔 교과서 10종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 61·71·75꼴, 심화꼴 64꼴)을 번호마다 따져,
// 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 주고 무엇을 묻는가를 보고 실었다.
// (가능성의 기본 문항과 실력 문항은 5-2-6b.js. 꼴마다의 판정은 수집본의 _분석/5-2-6/싣기_대조표.md)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 영역: 자료와 가능성.
//   6수04-01 평균의 의미를 알고, 자료를 수집하여 평균을 구하고 해석할 수 있다.
//   6수04-04 사건이 일어날 가능성을 말로 표현하고 비교할 수 있다. / 6수04-05 사건이 일어날 가능성을 수로 나타낼 수 있다.
//   6수04-06 자료를 이용하여 가능성을 예상하고, 가능성에 근거하여 적절한 판단을 내릴 수 있다.
// 교육과정: 「평균은 집단의 자료를 대표하는 값임을 이해하고, 여러 집단의 평균을 비교하는 활동 …」「평균을 구하는 방법뿐만 아니라 그 의미를 직관적으로 파악하게 한다.」
//
// 싣는 기준(평균)
//  - 평균은 모두 자연수로 나누어떨어지는 자료만 쓴다(몫이 소수인 나눗셈은 6학년). 자료는 두 자리 수가 중심이고, 세 자리 수 자료는 넷~다섯 개까지만 쓴다.
//    (자료 하나를 뺀 뒤의 평균은 「오르는가, 내리는가」만 묻는다 — use-line-drop. 그 값은 나누어떨어지지 않을 수 있어 묻지 않는다.)
//  - 표는 휴대폰 너비에 들어가게 세로로 놓고, 두 모둠을 견주는 가로 표는 다섯 칸까지만 쓴다(한 자리 수 다섯 개나 두 자리 수 네 개).
//  - 사람을 가를 때 남학생·여학생이라는 말은 쓰지 않는다(모둠·학년·반으로 가른다).
//  - 주는 것(글·표·늘어놓은 수·○ 그림표·컵·종이띠·막대그래프·평균을 나타낸 점선), 묻는 것(평균·합·자료 수·옮기는 수·더 잘한 쪽·평균보다 큰 자료·빈 자료),
//    푸는 길(합 ÷ 수, 고르게 옮기기, 평균 × 수로 합 구하기)이 다르면 다른 문제다. 조사한 것이나 수만 다른 것은 한 번만 싣는다.
//  - 평균의 뜻(고르게 한 값, 대표하는 값)을 묻는 문항을 넉넉히 실었다: 고르게 옮기기, 짝 지어 고르게 하기, 대표하는 값을 정하는 방법, 평균을 두고 한 말.
//  - 그리는 꼴(작도)은 수 답·고르기로 바꾸었다: ○를 옮겨 그리기 → 고르게 한 수, 평균 가로선 긋기 → 몇 칸 위에 긋는가·어느 선인가.
//  - 설명·까닭을 쓰는 꼴(서술형)은 옳은 말 고르기로 바꾸었다.
//  - 사람은 엔진에 있는 지어낸 이름으로만 적고, 모둠·과수원은 가·나·다로 적는다. 수와 단위 기호는 띄어 쓴다(38 kg, 145 cm).
//
// 뺀 것과 까닭(평균)
//  - 6학년 내용: 빠르기(km/h)의 평균(①14 심19의 변형), 단위당 양 — 1 km를 걷는 데 걸린 시간·한 명당 넓이(②14), 평균이 자연수로 떨어지지 않는 자료(②21 ②26의 변형 ③33 심34의 변형 심31의 변형)
//  - 조건 풀이·방정식 꼴이 일의 대부분인 것: 평균과 차로 빈칸 둘 구하기(②32 심30), 수 카드로 만든 모든 수의 평균(②33), 둘씩 더한 값만 아는 다섯 수의 평균(②34)
//  - 자료의 합이 지나치게 큰 계산: 다섯 자리 수의 평균(①11의 변형), 세 자리 수 일곱 개의 평균(②10의 변형), 네 자리 수 ÷ 두 자리 수로 구하는 평균(②13의 변형)
//  - 작도·서술형·활동: ○를 옮겨 그리기(①1 ②2 ③4 — 고르게 한 수로 바꿈), 두 가지 방법으로 구하기(③10), 직접 모은 자료·계획 세우기(②22 ③13·32·33),
//    평균이 같은 두 자료가 어떻게 다른지 쓰기(심20 — 자료의 흩어짐은 중학교), 알게 된 점 쓰기(심21)
//  - 앞 학년 되짚기: 막대그래프·꺾은선그래프 읽기(③75)
//  - 같은 일: 고르게 한 값 빈칸(③3)·그림 속 물건을 똑같이 나누기(③5)는 ○ 그림표를 고르게 하기와, 한 자료가 평균보다 큰 편인가(②17)는 평균보다 큰 자료 찾기와,
//    한 집단의 평균과 차이로 다른 집단의 평균(③28)은 실력의 h-diff-mean 첫 단계와, 문장 속 자료의 평균(②11)은 늘어놓은 수의 평균과 하는 일이 같다.
//    평균을 올리려면 다음 기록은 얼마(③31)·한 번 더 해서 평균이 달라진 값(②29·30의 변형)은 실력의 h-who-joined 와 셈이 같아 한 번만 실었다.
// 묻는 말: 수나 값을 물으면 "~은?/~는?", 양을 물으면 "몇 ~인가?", 시키는 말은 "~구하시오."로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, box, expr, table, lines, numbers, barChart, N, M, C } = B.kit;
  const AVG = '6수04-01', SAY = '6수04-04', NUM = '6수04-05', JUDGE = '6수04-06';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const sum = (list) => list.reduce((x, y) => x + y, 0), mean = (list) => sum(list) / list.length, top = (v) => Math.max(...v), low = (v) => Math.min(...v);
  const distinct = (x) => new Set(x).size === x.length;
  const plus = (list) => list.join(' + ');
  // 검사가 다시 셈할 식: 평균 = (합) ÷ (자료의 수)
  const E = (list) => '(' + list.join('+') + ')/' + list.length;
  // 풀이에 적는 평균 구하는 식
  const worked = (list, unit) => `(${plus(list)}) ÷ ${list.length} = ${sum(list)} ÷ ${list.length} = ${mean(list)}${unit ? `(${unit})` : ''}`;
  const who = (d, k) => d.shuffle(NAMES).slice(0, k);
  // 평균이 자연수인 자료 n개(lo~hi). ok 가 있으면 그 조건도 만족하는 것만.
  const data = (d, n, lo, hi, ok) => d.until(() => Array.from({ length: n }, () => d.int(lo, hi)), (x) => sum(x) % n === 0 && (!ok || ok(x)));
  const DAYS5 = ['월', '화', '수', '목', '금'], DAYS7 = ['월', '화', '수', '목', '금', '토', '일'], TAGS = ['가', '나', '다', '라', '마'];
  const blank = (v) => (v == null ? box('') : v);
  // 이름과 값의 표(세로). 여섯 줄이 넘으면 두 줄씩 나란히 놓는다.
  function tab(h1, h2, names, values) {
    const rows = names.map((n, i) => [n, blank(values[i])]);
    if (rows.length <= 5) return table([h1, h2], rows);
    const half = Math.ceil(rows.length / 2);
    return table([h1, h2, h1, h2], Array.from({ length: half }, (_, i) => rows[i].concat(rows[i + half] || ['', ''])));
  }
  // 집단마다 자료를 한 줄에 늘어놓은 표(자료 수가 다른 두 모둠을 한눈에 견준다).
  function rowsTab(labels, lists) {
    const width = Math.max(...lists.map((l) => l.length));
    return table(null, labels.map((label, i) => [label].concat(lists[i].map(blank), Array.from({ length: width - lists[i].length }, () => ''))));
  }
  const cap = (label, html) => `<div style="display:grid;gap:2px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">${label}</div>${html}</div>`;
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });

  // ── 그림 ────────────────────────────────────────────────────
  // ○ 그림표: 이름마다 ○를 값만큼 아래에서부터 쌓는다.
  function dotChart(names, values, unit) {
    const rows = Math.max(top(values), 1), n = names.length, W = Math.min(46, 250 / n), g = 16, left = 8, y0 = 8, base = y0 + rows * g, width = Math.ceil(left * 2 + n * W);
    let out = '';
    for (let r = 0; r <= rows; r += 1) out += `<line class="mb-gridline" x1="${left}" y1="${y0 + r * g}" x2="${(left + n * W).toFixed(1)}" y2="${y0 + r * g}"/>`;
    for (let i = 0; i <= n; i += 1) out += `<line class="mb-gridline" x1="${(left + i * W).toFixed(1)}" y1="${y0}" x2="${(left + i * W).toFixed(1)}" y2="${base}"/>`;
    values.forEach((v, i) => { for (let k = 0; k < v; k += 1) out += `<circle cx="${(left + i * W + W / 2).toFixed(1)}" cy="${base - k * g - g / 2}" r="5.8" style="fill:#fde68a;stroke:#92400e;stroke-width:1.1"/>`; });
    out += `<line class="mb-axis" x1="${left}" y1="${base}" x2="${(left + n * W).toFixed(1)}" y2="${base}"/>`;
    names.forEach((word, i) => { out += `<text class="mb-axis-label" style="font-size:11.5px" x="${(left + i * W + W / 2).toFixed(1)}" y="${base + 15}" text-anchor="middle">${word}</text>`; });
    return `<svg class="mb-numberline" viewBox="0 0 ${width} ${base + 22}" width="${width}" role="img" aria-label="○ 그림표: ${names.map((word, i) => `${word} ${values[i]}${unit}`).join(', ')}">${out}</svg>`;
  }
  // 눈금이 있는 컵 여러 개. max: 맨 위 눈금(mL), step: 눈금 한 칸(mL), major: 수를 적는 눈금 간격(mL)
  function cups(names, values, max, step, major) {
    const left = 34, W = 44, gap = 26, y0 = 22, H = 110, base = y0 + H, y = (v) => base - (v / max) * H, right = left + 6 + names.length * W + (names.length - 1) * gap + 6;
    let water = '', rules = '', glass = '';
    names.forEach((word, i) => {
      const x = left + 6 + i * (W + gap);
      water += `<rect class="mb-water" x="${x}" y="${y(values[i]).toFixed(1)}" width="${W}" height="${(base - y(values[i])).toFixed(1)}"/>`;
      glass += `<path class="mb-vessel" d="M${x} ${y0 - 8}V${base}H${x + W}V${y0 - 8}"/><text class="mb-axis-label" style="font-size:12px" x="${x + W / 2}" y="${base + 16}" text-anchor="middle">${word}</text>`;
    });
    for (let v = 0; v <= max; v += step) {
      rules += `<line class="mb-gridline" x1="${left - 3}" y1="${y(v).toFixed(1)}" x2="${right}" y2="${y(v).toFixed(1)}"${v % major === 0 ? ' style="stroke:#7b8ea3"' : ''}/>`;
      if (v % major === 0) rules += `<text class="mb-axis-label" style="font-size:11px" x="${left - 6}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${v}</text>`;
    }
    rules += `<text class="mb-axis-label" style="font-size:10.5px" x="2" y="10">(mL)</text>`;
    return `<svg class="mb-numberline" viewBox="0 0 ${right + 6} ${base + 24}" width="${right + 6}" role="img" aria-label="눈금이 있는 컵에 담긴 물: 눈금 한 칸은 ${step} mL. ${names.map((word, i) => `${word} ${values[i]} mL`).join(', ')}">${water}${rules}${glass}</svg>`;
  }
  // 이어 붙인 종이띠: 값마다 그만큼의 칸을 이어 붙인다. 부분마다 위에 이름을 적는다.
  function tapeStrip(names, values) {
    const total = sum(values), u = Math.min(14, 280 / total), left = 6, y = 22, h = 22, fills = ['#ffd98a', '#a9d4ff', '#bbf7d0', '#fbcfe8'], width = Math.ceil(left * 2 + total * u);
    let out = '', at = 0;
    values.forEach((v, i) => {
      for (let k = 0; k < v; k += 1) out += `<rect x="${(left + (at + k) * u).toFixed(1)}" y="${y}" width="${u.toFixed(1)}" height="${h}" style="fill:${fills[i % 4]};stroke:#475569;stroke-width:0.8"/>`;
      out += `<text class="mb-axis-label" style="font-size:11.5px" x="${(left + (at + v / 2) * u).toFixed(1)}" y="${y - 7}" text-anchor="middle">${names[i]}</text>`;
      at += v;
    });
    at = 0;
    values.slice(0, -1).forEach((v) => { at += v; out += `<line x1="${(left + at * u).toFixed(1)}" y1="${y - 4}" x2="${(left + at * u).toFixed(1)}" y2="${y + h + 4}" style="stroke:#1f2937;stroke-width:1.8"/>`; });
    return `<svg class="mb-numberline" viewBox="0 0 ${width} ${y + h + 8}" width="${width}" role="img" aria-label="이어 붙인 종이띠: ${names.map((word, i) => `${word} ${values[i]}칸`).join(', ')}">${out}</svg>`;
  }
  // 막대그래프에 가로 점선을 긋는다. o.top(맨 위 눈금)을 꼭 준다. rules: [{ at: 값, tag: 선 오른쪽 끝에 적는 기호 }]
  function barsWith(names, values, o, rules) {
    const step = o.step || 1, n = names.length, ticks = o.top / step, H = Math.min(12, 168 / ticks), W = Math.min(48, 244 / n), left = 34, y = (v) => 24 + (o.top - v) / step * H, right = left + n * W;
    const extra = rules.map((r) => `<line x1="${left}" y1="${y(r.at).toFixed(1)}" x2="${(right + 4).toFixed(1)}" y2="${y(r.at).toFixed(1)}" style="stroke:#dc2626;stroke-width:1.8;stroke-dasharray:6 3"/>`
      + (r.tag ? `<text class="mb-axis-label" style="font-size:13px;font-weight:700;fill:#b91c1c" x="${(right + 6).toFixed(1)}" y="${(y(r.at) + 4.5).toFixed(1)}">${r.tag}</text>` : '')).join('');
    const note = ' 점선: ' + rules.map((r) => `${r.tag ? r.tag + ' ' : ''}눈금 ${r.at}`).join(', ');
    return barChart(names, values, o).replace(/viewBox="0 0 (\d+) (\d+)" width="\d+"/, (all, w, h) => `viewBox="0 0 ${Number(w) + 14} ${h}" width="${Number(w) + 14}"`)
      .replace(/aria-label="([^"]*)"/, (all, label) => `aria-label="${label}.${note}"`).replace('</svg>', extra + '</svg>');
  }

  B.kit.avg526 = { AVG, SAY, NUM, JUDGE, sum, mean, top, low, distinct, plus, E, worked, who, data, DAYS5, DAYS7, TAGS, blank, tab, rowsTab, cap, truthOf, dotChart, barsWith };

  B.addUnit({
    id: '5-2-6', grade: 5, semester: 2, no: 6, title: '평균과 가능성', version: 1,
    groups: [
      {
        id: 'mean', title: '평균의 뜻', standard: AVG,
        types: [
          T('mean-word', '평균의 뜻', '①7 ②6 ③1 심13', (d) => {
            const list = d.shuffle(['평균', '합계', '가능성', '눈금']);
            return C('자료의 값을 모두 더해 자료의 수로 나눈 값을 무엇이라고 하는가?', list, list.indexOf('평균'), {
              explain: '자료의 값을 모두 더해 자료의 수로 나눈 값을 평균이라고 한다. 평균은 자료의 값을 고르게 한 값으로, 그 자료를 대표한다.', facts: { truth: list.map((w) => w === '평균'), want: true }
            });
          }),
          T('mean-how', '평균을 구하는 방법', '①10의 변형 ③8의 변형', (d) => {
            const rows = d.shuffle([['키를 모두 더한 값을 학생 수로 나눈다.', true], ['키를 모두 곱한 값을 학생 수로 나눈다.', false], ['키를 모두 더한 값을 가장 큰 키로 나눈다.', false], ['가장 큰 키에서 가장 작은 키를 뺀다.', false]]);
            return C('어느 모둠 학생들의 키의 평균을 구하는 방법으로 옳은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: '평균은 자료의 값을 모두 더한 값을 자료의 수로 나누어 구한다. 키의 평균은 키를 모두 더한 값을 학생 수로 나눈다.', facts: truthOf(rows, true)
            });
          }),
          T('mean-circles', '○ 그림표를 고르게 하기', '①1·2 ②1·2 ③3·4·5 심11', (d) => {
            const n = d.pick([4, 5]), people = who(d, n), v = data(d, n, 1, 7, (x) => top(x) - low(x) >= 3 && new Set(x).size >= 3);
            return N(`${nick(people[0])}네 모둠 학생들이 넣은 고리의 수만큼 ○를 그린 것이다. ○를 옮겨 학생들의 ○의 수를 고르게 하면 한 명의 ○는 몇 개가 되는가?`, mean(v), {
              unit: '개', figure: dotChart(people, v, '개'),
              explain: `○는 모두 ${plus(v)} = ${sum(v)}(개)이다. ○가 많은 학생의 것을 적은 학생에게 옮겨 ${n}명이 똑같이 가지면 ${sum(v)} ÷ ${n} = ${mean(v)}(개)씩이다.`,
              facts: { calc: [[E(v), 0]], unseen: [n] }
            });
          }),
          T('mean-move', '한 사람이 다른 사람에게 주어 고르게 하기', '①3', (d) => {
            const m = d.int(6, 14), k = d.int(1, 4), v = d.shuffle([m, m, m + k, m - k]), people = who(d, 4);
            return M('네 학생이 가진 구슬의 수를 나타낸 표이다. 구슬이 가장 많은 학생이 가장 적은 학생에게 구슬 ㉠개를 주었더니 네 학생의 구슬의 수가 모두 ㉡개로 같아졌다. ㉠, ㉡에 알맞은 수는?', [{ label: '㉠', answer: k, unit: '개' }, { label: '㉡', answer: m, unit: '개' }], {
              figure: tab('이름', '구슬 수(개)', people, v),
              explain: `가장 많은 ${m + k}개와 가장 적은 ${m - k}개의 차는 ${2 * k}개이다. 그 반인 ${k}개를 주면 두 학생 모두 ${m}개가 되고, 나머지 두 학생도 ${m}개이므로 고르게 한 수는 ${m}개이다.`,
              facts: { calc: [[`(${m + k}-${m - k})/2`, 0], [E(v), 1]], unseen: [2, 4] }
            });
          }),
          T('mean-pairs', '평균을 예상하고 짝 지어 고르게 하기', '①4 ②3 심12', (d) => {
            const m = d.int(20, 60), [p, q] = d.shuffle([1, 2, 3, 4, 5, 6]).slice(0, 2), a = m - p, b = m - q, all = [a, b, m + p, m + q].sort((x, y) => x - y);
            return M(`${all.join(', ')}의 평균을 ${josa(m, '으로/로')} 예상하고, 두 수씩 짝 지어 큰 수에서 작은 수로 옮겨 네 수를 모두 ${josa(m, '으로/로')} 만들려고 한다. (${a}, ㉠), (${b}, ㉡)으로 짝 지을 때 ㉠, ㉡에 알맞은 수는?`, [{ label: '㉠', answer: m + p }, { label: '㉡', answer: m + q }], {
              explain: `${josa(a, '은/는')} ${m}보다 ${p}만큼 작으므로 ${m}보다 ${p}만큼 큰 ${josa(m + p, '과/와')} 짝 지으면 둘 다 ${josa(m, '이/가')} 된다. 같은 방법으로 ${josa(b, '은/는')} ${m}보다 ${q}만큼 큰 ${josa(m + q, '과/와')} 짝 짓는다. 네 수의 평균은 ${m}이다.`,
              facts: { calc: [[`${m}*2-${a}`, 0], [`${m}*2-${b}`, 1]], unseen: [2] }
            });
          }),
          T('mean-shift', '가장 큰 값에서 두 값으로 옮겨 고르게 하기', '②3의 변형', (d) => {
            const m = d.int(20, 40), [a, b] = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2), [big, la, lb, even] = d.shuffle([0, 1, 2, 3]), v = [];
            v[big] = m + a + b; v[la] = m - a; v[lb] = m - b; v[even] = m;
            const person = d.pick(NAMES);
            return M(`${name(person, '의/의')} 줄넘기 기록을 나타낸 표이다. ${big + 1}회의 기록에서 ㉠번을 ${la + 1}회로, ㉡번을 ${lb + 1}회로 옮기면 네 번의 기록이 모두 같아진다. ㉠, ㉡에 알맞은 수는?`, [{ label: '㉠', answer: a, unit: '번' }, { label: '㉡', answer: b, unit: '번' }], {
              figure: tab('회', '기록(번)', ['1회', '2회', '3회', '4회'], v),
              explain: `네 번의 기록을 고르게 한 값은 평균이다. ${worked(v, '번')}이다. ${la + 1}회는 ${m} - ${m - a} = ${a}(번), ${lb + 1}회는 ${m} - ${m - b} = ${b}(번)이 모자라므로 ${big + 1}회에서 그만큼씩 옮긴다.`,
              facts: { calc: [[`${E(v)}-${m - a}`, 0], [`${E(v)}-${m - b}`, 1]], unseen: [4] }
            });
          }),
          T('mean-cups', '컵의 물을 옮겨 고르게 하기', '①5 ②11의 변형', (d) => {
            const v = d.until(() => [d.int(2, 9), d.int(2, 9), d.int(2, 9)], (x) => distinct(x) && sum(x) % 3 === 0 && top(x) - low(x) >= 3).map((x) => x * 10);
            return N('모양과 크기가 같은 컵 세 개에 담긴 물의 양을 나타낸 것이다. 물을 옮겨 세 컵에 담긴 물의 양을 같게 하면 한 컵의 물은 몇 mL가 되는가?', mean(v), {
              unit: 'mL', figure: cups(['가', '나', '다'], v, 100, 10, 20),
              explain: `세 컵의 물은 모두 ${plus(v)} = ${sum(v)}(mL)이다. 세 컵에 똑같이 나누어 담으면 ${sum(v)} ÷ 3 = ${mean(v)}(mL)씩이다.`,
              facts: { calc: [[E(v), 0]], unseen: [3] }
            });
          }),
          T('mean-tape', '이어 붙인 종이띠로 평균 알아보기', '②7', (d) => {
            const v = data(d, 3, 3, 9, (x) => new Set(x).size >= 2 && top(x) !== mean(x)), person = d.pick(NAMES);
            const rows = d.shuffle([['종이띠를 똑같이 3부분으로 접으면 한 부분의 칸 수가 평균이다.', true], ['종이띠를 똑같이 2부분으로 접으면 한 부분의 칸 수가 평균이다.', false], ['가장 긴 부분의 칸 수가 평균이다.', false], ['종이띠 전체의 칸 수가 평균이다.', false]]);
            return C(`${name(person, '이/가')} 3주 동안 주마다 읽은 책의 수만큼 칸을 이어 붙여 만든 종이띠이다. 이 종이띠로 한 주에 읽은 책 수의 평균을 알아보는 방법으로 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: tapeStrip(['1주', '2주', '3주'], v),
              explain: `종이띠 전체의 칸 수 ${sum(v)}칸은 3주 동안 읽은 책 수의 합이다. 자료가 3개이므로 똑같이 3부분으로 접으면 한 부분은 ${sum(v)} ÷ 3 = ${mean(v)}(칸)이고, 평균은 ${mean(v)}권이다.`,
              facts: truthOf(rows, true)
            });
          }),
          T('mean-line-pick', '막대를 고르게 한 높이의 선 고르기', '①6', (d) => {
            const v = data(d, 5, 2, 10, (x) => mean(x) >= 4 && mean(x) <= 8 && new Set(x).size >= 4), m = mean(v), at = d.pick([[m + 2, m, m - 2]].concat(m <= 6 ? [[m + 4, m + 2, m]] : [], m >= 6 ? [[m, m - 2, m - 4]] : [])), right = at.indexOf(m), person = d.pick(NAMES);
            return C(`${name(person, '이/가')} 요일별로 읽은 책의 수를 나타낸 막대그래프이다. 막대의 높이를 고르게 하면 점선 ㉠, ㉡, ㉢ 가운데 어느 선의 높이가 되는가?`, ['㉠', '㉡', '㉢'], right, {
              figure: barsWith(DAYS5, v, { step: 1, top: 10, unit: '권', title: '요일' }, at.map((x, i) => ({ at: x, tag: ['㉠', '㉡', '㉢'][i] }))),
              explain: `막대의 높이를 고르게 한 값은 평균이다. ${worked(v, '권')}이므로 세로 눈금 ${m}에 그은 ${['㉠', '㉡', '㉢'][right]}이다.`,
              facts: { pick: { expr: E(v), options: at }, unseen: [5] }
            });
          }),
          T('mean-rep-how', '대표하는 값을 정하는 방법', '①8 ②4 ③2 심13의 변형', (d) => {
            const [x, y, z] = d.until(() => [d.int(3, 12), d.int(2, 12), d.int(2, 12)], ([p, q, r]) => { const l = [p, q, p, r], m = mean(l), mid = (top(l) + low(l)) / 2; return Number.isInteger(m) && Number.isInteger(mid) && new Set([p, q, r]).size === 3 && new Set([m, top(l), p, mid]).size === 4; });
            const v = d.shuffle([x, y, x, z]), m = mean(v), mid = (top(v) + low(v)) / 2;
            const rows = d.shuffle([[`연필의 수를 모두 고르게 한 ${josa(m + '자루', '으로/로')} 정한다.`, true], [`가장 많은 연필의 수인 ${josa(top(v) + '자루', '으로/로')} 정한다.`, false], [`두 번 나온 연필의 수인 ${josa(x + '자루', '으로/로')} 정한다.`, false], [`가장 많은 수와 가장 적은 수만 고르게 한 ${josa(mid + '자루', '으로/로')} 정한다.`, false]]);
            return C(`네 학생이 가진 연필의 수는 ${v.join('자루, ')}자루이다. 네 학생이 가진 연필의 수를 대표하는 값을 정하는 방법으로 가장 알맞은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: `자료를 대표하는 값은 자료의 값을 모두 고르게 한 평균으로 정한다. ${worked(v, '자루')}이다. 가장 큰 값이나 여러 번 나온 값, 두 값만 고르게 한 값은 네 학생 모두를 대표하지 못한다.`,
              facts: truthOf(rows, true)
            });
          }),
          T('mean-say', '평균의 뜻을 바르게 말한 것', '②5 ③23의 변형 심13', (d) => {
            const m = d.pick([80, 84, 85, 88, 90]), person = d.pick(NAMES);
            const rows = d.shuffle([[`세 과목의 점수를 고르게 하면 ${m}점이다.`, true], [`세 과목의 점수가 모두 ${m}점이다.`, false], [`세 과목 가운데 가장 높은 점수가 ${m}점이다.`, false], [`세 과목의 점수를 모두 더하면 ${m}점이다.`, false]]);
            return C(`${name(person, '의/의')} 국어, 수학, 과학 점수의 평균은 ${m}점이다. 바르게 말한 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: `평균 ${m}점은 세 과목의 점수를 고르게 한 값이다. 세 과목의 점수가 모두 ${m}점인 것은 아니며, ${m}점보다 높은 과목과 낮은 과목이 있을 수 있다. 세 과목의 점수의 합은 ${m} × 3 = ${m * 3}(점)이다.`,
              facts: truthOf(rows, true)
            });
          })
        ]
      },
      {
        id: 'calc', title: '평균 구하기', standard: AVG,
        types: [
          T('calc-sum-mean', '합과 평균을 차례로 구하기', '①9 ②8 ③6의 변형 심1의 변형', (d) => {
            const v = data(d, 5, 19, 26, (x) => new Set(x).size >= 4);
            return M('어느 학교 5학년의 반별 학생 수를 나타낸 표이다. 5학년 전체 학생 수와 한 반의 학생 수의 평균을 차례로 구하시오.', [{ label: '전체', answer: sum(v), unit: '명' }, { label: '평균', answer: mean(v), unit: '명' }], {
              figure: tab('반', '학생 수(명)', ['1반', '2반', '3반', '4반', '5반'], v),
              explain: `전체 학생 수는 ${plus(v)} = ${sum(v)}(명)이다. 반이 5개이므로 한 반의 학생 수의 평균은 ${sum(v)} ÷ 5 = ${mean(v)}(명)이다.`,
              facts: { calc: [[v.join('+'), 0], [E(v), 1]] }
            });
          }),
          T('calc-expr-fill', '평균을 구하는 식의 빈칸', '①10 ②9 ③7', (d) => {
            const v = data(d, 4, 80, 99, distinct);
            return M(`네 가족이 딴 귤의 수는 ${v.join('개, ')}개이다. 한 가족이 딴 귤의 수의 평균을 구하는 식에서 ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: '㉠', answer: 4 }, { label: '㉡', answer: sum(v) }, { label: '㉢', answer: mean(v), unit: '개' }], {
              figure: lines([expr(`(${v[0]}`, '+', v[1], '+', v[2], '+', `${v[3]})`, '/', box('㉠')), expr('=', box('㉡'), '/', box('㉠'), '=', box('㉢'))]),
              explain: `평균은 자료의 값을 모두 더해 자료의 수로 나눈다. 자료가 4개이므로 ${worked(v, '개')}이다.`,
              facts: { calc: [['4', 0], [v.join('+'), 1], [E(v), 2]], unseen: [4] }
            });
          }),
          T('calc-table', '표를 보고 평균 구하기', '①11 ②10 ③6 심1', (d) => {
            const v = data(d, 4, 138, 158, distinct), people = who(d, 4);
            return N('네 학생의 키를 나타낸 표이다. 네 학생의 키의 평균은 몇 cm인가?', mean(v), {
              unit: 'cm', figure: tab('이름', '키(cm)', people, v), explain: `${worked(v, 'cm')}이다.`, facts: { calc: [[E(v), 0]], unseen: [4] }
            });
          }),
          T('calc-list', '늘어놓은 수의 평균', '①11의 변형 ②10·11 심1의 변형', (d) => {
            const v = data(d, 5, 22, 46, distinct);
            return N('다음 다섯 수의 평균은?', mean(v), { figure: numbers(v), explain: `${worked(v)}이다.`, facts: { calc: [[E(v), 0]], unseen: [5] } });
          }),
          T('calc-seven', '일주일 자료의 평균', '①11의 변형 ②8의 변형 심1의 변형', (d) => {
            const v = data(d, 7, 12, 30, (x) => new Set(x).size >= 5), person = d.pick(NAMES);
            return N(`${name(person, '이/가')} 일주일 동안 요일별로 푼 수학 문제의 수(개)를 나타낸 표이다. 하루에 푼 수학 문제의 수의 평균은 몇 개인가?`, mean(v), {
              unit: '개', figure: tab('요일', '문제', DAYS7, v), explain: `일주일은 7일이므로 자료는 7개이다. ${worked(v, '개')}이다.`, facts: { calc: [[E(v), 0]], unseen: [7] }
            });
          }),
          T('calc-zero', '0이 있는 자료의 평균', '②10의 변형 ③8', (d) => {
            const at = d.int(0, 4), v = d.until(() => DAYS5.map((_, i) => (i === at ? 0 : d.int(3, 10) * 5)), (x) => sum(x) % 5 === 0 && new Set(x).size >= 4), person = d.pick(NAMES);
            return N(`${name(person, '이/가')} 5일 동안 책을 읽은 시간을 나타낸 표이다. 하루에 책을 읽은 시간의 평균은 몇 분인가?`, mean(v), {
              unit: '분', figure: tab('요일', '시간(분)', DAYS5, v),
              explain: `책을 읽지 않은 ${DAYS5[at]}요일(0분)도 자료의 수에 넣는다. 자료는 5개이므로 ${worked(v, '분')}이다.`,
              facts: { calc: [[E(v), 0]] }
            });
          }),
          T('calc-bar', '막대그래프를 읽어 평균 구하기', '①12 ②11의 변형 심2', (d) => {
            const v = data(d, 5, 3, 12, distinct).map((x) => x * 2);
            return N('모둠별로 읽은 책의 수를 나타낸 막대그래프이다. 한 모둠이 읽은 책의 수의 평균은 몇 권인가?', mean(v), {
              unit: '권', figure: barChart(TAGS, v, { step: 2, unit: '권', title: '모둠' }),
              explain: `세로 눈금 한 칸은 2권을 나타낸다. 읽은 책의 수는 가 모둠부터 차례로 ${v.join('권, ')}권이므로 ${worked(v, '권')}이다.`,
              facts: { calc: [[E(v), 0]], unseen: [5] }
            });
          }),
          T('calc-sum-given', '합과 자료의 수가 주어진 평균', '①13 ③9 심3', (d) => {
            const n = d.int(4, 8), m = d.int(24, 45);
            return N(`버스 ${n}대에 탄 승객은 모두 ${n * m}명이다. 버스 한 대에 탄 승객의 수의 평균은 몇 명인가?`, m, {
              unit: '명', explain: `승객의 수의 합을 버스의 수로 나눈다. ${n * m} ÷ ${n} = ${m}(명)`, facts: { calc: [[`${n * m}/${n}`, 0]] }
            });
          }),
          T('calc-sum-two', '두 수를 더한 합으로 평균 구하기', '②13의 변형 심3', (d) => {
            const k = d.pick([4, 5, 6, 8]), m = d.int(22, 26), total = k * m, boys = Math.floor(total / 2) + d.int(2, 7), girls = total - boys;
            return N(`어느 학교 5학년은 안경을 쓴 학생이 ${girls}명, 안경을 쓰지 않은 학생이 ${boys}명이고, 모두 ${k}개 반이다. 한 반의 학생 수의 평균은 몇 명인가?`, m, {
              unit: '명', explain: `5학년 학생은 모두 ${girls} + ${boys} = ${total}(명)이다. 반의 수로 나누면 ${total} ÷ ${k} = ${m}(명)이다. 학생 수가 아니라 반의 수로 나눈다.`,
              facts: { calc: [[`(${girls}+${boys})/${k}`, 0]] }
            });
          }),
          T('calc-evens', '조건에 맞는 수를 골라 평균 구하기', '심5', (d) => {
            const last = d.pick([9, 11, 13, 15, 17]), even = d.bool(), list = Array.from({ length: last }, (_, i) => i + 1).filter((x) => (x % 2 === 0) === even);
            return N(`1부터 ${last}까지의 자연수 가운데 ${even ? '짝수' : '홀수'}의 평균은?`, mean(list), {
              explain: `1부터 ${last}까지의 자연수 가운데 ${josa(even ? '짝수' : '홀수', '은/는')} ${list.join(', ')}의 ${list.length}개이다. ${worked(list)}이다.`,
              facts: { calc: [[E(list), 0]], unseen: list.concat([list.length]) }
            });
          }),
          T('calc-chain', '차로 알려 준 자료의 평균', '②31 ③12', (d) => {
            const [a, p, q] = d.until(() => [d.int(80, 92), d.int(2, 6), d.int(3, 9)], ([, x, y]) => (x + y) % 3 === 0 && x !== y), [x, y, z] = who(d, 3), v = [a, a - p, a - p + q];
            return N(`${name(x, '의/의')} 수학 점수는 ${a}점이고, ${name(y, '은/는')} ${nick(x)}보다 ${p}점 낮고, ${name(z, '은/는')} ${nick(y)}보다 ${q}점 높다. 세 학생의 수학 점수의 평균은 몇 점인가?`, mean(v), {
              unit: '점', explain: `${name(y, '은/는')} ${a} - ${p} = ${v[1]}(점), ${name(z, '은/는')} ${v[1]} + ${q} = ${v[2]}(점)이다. ${worked(v, '점')}이다.`,
              facts: { calc: [[`(${a}+(${a}-${p})+(${a}-${p}+${q}))/3`, 0]], unseen: [3] }
            });
          })
        ]
      },
      {
        id: 'use', title: '평균 비교와 해석', standard: AVG,
        types: [
          T('use-above', '평균보다 높은 자료 모두 찾기', '①15 ②17·18 ③18 심6', (d) => {
            const v = data(d, 5, 20, 40, (x) => distinct(x) && !x.includes(mean(x)) && [2, 3].includes(x.filter((y) => y > mean(x)).length)), m = mean(v), people = who(d, 5);
            const pickBy = (test) => people.filter((_, i) => test(v[i])).join(', '), nearBelow = top(v.filter((y) => y < m));
            const rows = d.shuffle([[pickBy((y) => y > m), true], [pickBy((y) => y < m), false], [pickBy((y) => y === top(v)), false], [pickBy((y) => y >= nearBelow), false]]);
            return C('다섯 학생의 팔굽혀펴기 기록을 나타낸 표이다. 기록이 평균보다 높은 학생을 모두 고른 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: tab('이름', '기록(회)', people, v), explain: `${worked(v, '회')}이다. 기록이 ${m}회보다 높은 학생은 ${pickBy((y) => y > m)}이다.`, facts: truthOf(rows, true)
            });
          }),
          T('use-faster', '평균보다 빠른 사람 수', '①16 ②18의 변형 심7', (d) => {
            const v = d.until(() => Array.from({ length: 5 }, () => d.int(8, 13)), (x) => sum(x) % 5 === 0 && x.filter((y) => y === mean(x)).length === 1 && [1, 2, 3].includes(x.filter((y) => y < mean(x)).length) && new Set(x).size >= 4), m = mean(v), people = who(d, 5);
            const fast = people.filter((_, i) => v[i] < m), same = people[v.indexOf(m)];
            return N('다섯 학생의 50 m 달리기 기록을 나타낸 표이다. 기록이 평균보다 빠른 학생은 몇 명인가?', fast.length, {
              unit: '명', figure: tab('이름', '기록(초)', people, v),
              explain: `${worked(v, '초')}이다. 달리기는 걸린 시간이 짧을수록 빠르므로 기록이 ${m}초보다 짧은 학생을 센다. ${fast.join(', ')}의 ${fast.length}명이다. 기록이 평균과 같은 ${josa(same, '은/는')} 세지 않는다.`,
              facts: { count: v.map((y) => y < m) }
            });
          }),
          T('use-same', '평균과 같은 자료 찾기', '②18의 변형 ③11', (d) => {
            const v = data(d, 4, 28, 42, (x) => distinct(x) && x.includes(mean(x))), m = mean(v), people = who(d, 4);
            return C('네 학생의 몸무게를 나타낸 표이다. 몸무게가 네 학생의 몸무게의 평균과 같은 학생은?', people, v.indexOf(m), {
              figure: tab('이름', '몸무게(kg)', people, v), explain: `${worked(v, 'kg')}이다. 몸무게가 ${m} kg인 학생은 ${people[v.indexOf(m)]}이다.`, facts: { pick: { expr: E(v), options: v }, unseen: [4] }
            });
          }),
          T('use-gap', '가장 낮은 자료와 평균의 차', '심8', (d) => {
            const v = data(d, 4, 3, 14, (x) => distinct(x) && mean(x) - low(x) >= 2), people = who(d, 4), at = v.indexOf(low(v));
            return N('네 학생의 제기차기 기록을 나타낸 표이다. 기록이 가장 낮은 학생의 기록은 네 학생의 기록의 평균보다 몇 개 적은가?', mean(v) - low(v), {
              unit: '개', figure: tab('이름', '기록(개)', people, v),
              explain: `${worked(v, '개')}이다. 기록이 가장 낮은 학생은 ${low(v)}개인 ${people[at]}이다. ${mean(v)} - ${low(v)} = ${mean(v) - low(v)}(개) 적다. 평균이 아니라 평균과의 차를 묻는 것이다.`,
              facts: { calc: [[`${E(v)}-${low(v)}`, 0]], unseen: [4] }
            });
          }),
          T('use-two-means', '자료 수가 다른 두 모둠의 평균', '①17 ②15 ③14 심18', (d) => {
            const [a, b] = d.until(() => [data(d, 3, 3, 10), data(d, 4, 2, 10)], ([x, y]) => mean(x) !== mean(y) && new Set(x).size >= 2 && new Set(y).size >= 3);
            return M('두 모둠 학생들이 넣은 고리의 수(개)를 나타낸 표이다. 두 모둠의 넣은 고리의 수의 평균을 각각 구하시오.', [{ label: '가 모둠', answer: mean(a), unit: '개' }, { label: '나 모둠', answer: mean(b), unit: '개' }], {
              figure: rowsTab(['가 모둠', '나 모둠'], [a, b]),
              explain: `가 모둠은 3명이므로 ${worked(a, '개')}, 나 모둠은 4명이므로 ${worked(b, '개')}이다. 학생 수가 다르므로 모둠마다 그 모둠의 학생 수로 나눈다.`,
              facts: { calc: [[E(a), 0], [E(b), 1]], unseen: [3, 4] }
            });
          }),
          T('use-two-run', '기록이 작을수록 좋은 두 모둠의 평균 비교', '①18·19 ②12의 변형 심9', (d) => {
            const [a, b] = d.until(() => [data(d, 3, 18, 26), data(d, 4, 18, 26)], ([x, y]) => mean(x) !== mean(y) && distinct(x) && new Set(y).size >= 3), values = [mean(a), mean(b)];
            const win = values[0] < values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]), options = d.shuffle([[win, gap], [1 - win, gap], [win, gap + 1], [1 - win, gap + 1]]);
            return C('두 모둠 학생들의 50 m 달리기 기록(초)을 나타낸 표이다. 기록의 평균이 더 빠른 모둠과, 두 모둠의 기록의 평균의 차를 바르게 쓴 것은?', options.map(([w, g]) => `${TAGS[w]} 모둠, ${g}초`), options.findIndex(([w, g]) => w === win && g === gap), {
              figure: rowsTab(['가 모둠', '나 모둠'], [a, b]),
              explain: `가 모둠은 ${worked(a, '초')}, 나 모둠은 ${worked(b, '초')}이다. 달리기는 걸린 시간이 짧을수록 빠르므로 평균이 더 작은 ${TAGS[win]} 모둠이 ${gap}초 더 빠르다.`,
              facts: { who: { exprs: [E(a), E(b)], values, options, smaller: true }, unseen: [3, 4] }
            });
          }),
          T('use-three-best', '세 사람의 평균을 구해 가장 높은 사람 찾기', '①17의 변형 ③14의 변형 ③17', (d) => {
            const rows = d.until(() => [data(d, 3, 4, 12), data(d, 3, 4, 12), data(d, 3, 4, 12)], (x) => distinct(x.map(mean)) && x.every((r) => new Set(r).size >= 2)), people = who(d, 3), best = rows.map(mean).indexOf(top(rows.map(mean)));
            return C('세 학생이 9월, 10월, 11월에 읽은 책의 수(권)를 나타낸 표이다. 한 달에 읽은 책의 수의 평균이 가장 많은 학생은?', people, best, {
              figure: table(['이름', '9월', '10월', '11월'], people.map((p, i) => [p].concat(rows[i]))),
              explain: `한 달에 읽은 책의 수의 평균은 ${people.map((p, i) => `${p} ${sum(rows[i])} ÷ 3 = ${mean(rows[i])}(권)`).join(', ')}이다. 평균이 가장 많은 학생은 ${people[best]}이다.`,
              facts: { choose: { exprs: rows.map(E), rule: 'max' }, unseen: [3] }
            });
          }),
          T('use-per-table', '학생 수와 합이 적힌 표에서 한 명당 평균', '①20 ②12 ③16', (d) => {
            const ns = [d.int(3, 6), d.int(3, 6), d.int(3, 6)], ms = d.shuffle([8, 9, 10, 11, 12, 13, 14, 15]).slice(0, 3), totals = ns.map((n, i) => n * ms[i]);
            return M('모둠별 학생 수(명)와 읽은 책의 수(권)를 나타낸 표이다. 한 명이 읽은 책의 수의 평균을 모둠별로 구하시오.', [0, 1, 2].map((i) => ({ label: `${TAGS[i]} 모둠`, answer: ms[i], unit: '권' })), {
              figure: table(['모둠', '학생 수', '책의 수'], [0, 1, 2].map((i) => [TAGS[i], ns[i], totals[i]])),
              explain: `읽은 책의 수를 그 모둠의 학생 수로 나눈다. ${[0, 1, 2].map((i) => `${TAGS[i]} 모둠 ${totals[i]} ÷ ${ns[i]} = ${ms[i]}(권)`).join(', ')}이다.`,
              facts: { calc: [0, 1, 2].map((i) => [`${totals[i]}/${ns[i]}`, i]) }
            });
          }),
          T('use-per-best', '한 그루당 평균이 가장 많은 쪽 찾기', '①20 ③15 심19', (d) => {
            const [ns, ms] = d.until(() => [d.shuffle([4, 5, 6, 8, 10]).slice(0, 3), d.shuffle([18, 20, 21, 22, 24, 25, 26, 28, 30]).slice(0, 3)], ([n, m]) => { const t = n.map((x, i) => x * m[i]); return distinct(t) && t.indexOf(top(t)) !== m.indexOf(top(m)); });
            const totals = ns.map((n, i) => n * ms[i]), best = ms.indexOf(top(ms));
            return C('과수원별 사과나무의 수(그루)와 딴 사과의 수(개)를 나타낸 표이다. 나무 한 그루에서 딴 사과의 수의 평균이 가장 많은 과수원은?', [0, 1, 2].map((i) => `${TAGS[i]} 과수원`), best, {
              figure: table(['과수원', '나무의 수', '사과의 수'], [0, 1, 2].map((i) => [TAGS[i], ns[i], totals[i]])),
              explain: `딴 사과의 수를 나무의 수로 나눈다. ${[0, 1, 2].map((i) => `${TAGS[i]} 과수원 ${totals[i]} ÷ ${ns[i]} = ${ms[i]}(개)`).join(', ')}이다. 한 그루당 평균이 가장 많은 곳은 ${TAGS[best]} 과수원이다. 딴 사과가 가장 많은 ${TAGS[totals.indexOf(top(totals))]} 과수원이 아니다.`,
              facts: { choose: { exprs: [0, 1, 2].map((i) => `${totals[i]}/${ns[i]}`), rule: 'max' } }
            });
          }),
          T('use-per-sentence', '날수가 다른 두 사람의 하루 평균 비교', '②13 ③15의 변형 심19의 변형', (d) => {
            const days = d.pick([10, 12, 15]), [m1, m2] = d.until(() => [d.int(16, 30), d.int(16, 30)], ([x, y]) => x !== y), people = who(d, 2), values = [m1, m2];
            const win = m1 > m2 ? 0 : 1, gap = Math.abs(m1 - m2), options = d.shuffle([[win, gap], [1 - win, gap], [win, gap + 2], [1 - win, gap + 2]]);
            return C(`${name(people[0], '은/는')} ${days}일 동안 줄넘기를 모두 ${m1 * days}번 했고, ${name(people[1], '은/는')} 일주일 동안 모두 ${m2 * 7}번 했다. 하루에 한 줄넘기 횟수의 평균이 더 많은 사람과, 두 사람의 하루 평균의 차를 바르게 쓴 것은?`, options.map(([w, g]) => `${people[w]}, ${g}번`), options.findIndex(([w, g]) => w === win && g === gap), {
              explain: `${name(people[0], '은/는')} ${m1 * days} ÷ ${days} = ${m1}(번), ${name(people[1], '은/는')} 일주일이 7일이므로 ${m2 * 7} ÷ 7 = ${m2}(번)이다. ${name(people[win], '이/가')} 하루에 ${gap}번 더 많이 했다. 날수가 다르므로 모두 한 횟수가 아니라 하루 평균으로 비교한다.`,
              facts: { who: { exprs: [`${m1 * days}/${days}`, `${m2 * 7}/7`], values, options }, unseen: [7] }
            });
          }),
          T('use-split', '한 표를 둘로 갈라 평균 비교하기', '②15의 변형', (d) => {
            const [wk, we] = d.until(() => [data(d, 5, 20, 45, distinct), [d.int(40, 70), d.int(40, 70)]], ([x, y]) => sum(y) % 2 === 0 && y[0] !== y[1] && mean(x) !== mean(y)), values = [mean(wk), mean(we)];
            const win = values[0] > values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]), sides = ['평일', '주말'], options = d.shuffle([[win, gap], [1 - win, gap], [win, gap + 5], [1 - win, gap + 5]]);
            return C('어느 도서관의 요일별 방문자 수(명)를 나타낸 표이다. 평일(월요일부터 금요일까지)의 하루 평균 방문자 수와 주말(토요일, 일요일)의 하루 평균 방문자 수 가운데 더 많은 쪽과 그 차를 바르게 쓴 것은?', options.map(([w, g]) => `${sides[w]}, ${g}명`), options.findIndex(([w, g]) => w === win && g === gap), {
              figure: tab('요일', '방문자', DAYS7, wk.concat(we)),
              explain: `평일은 5일이므로 ${worked(wk, '명')}, 주말은 2일이므로 ${worked(we, '명')}이다. ${sides[win]}이 하루에 ${gap}명 더 많다.`,
              facts: { who: { exprs: [E(wk), E(we)], values, options }, unseen: [5, 2] }
            });
          }),
          T('use-cut', '평균이 기준을 넘는지 판단하기', '②20 심10', (d) => {
            const cut = d.pick([30, 40]), m = cut + d.pick([-1, 0, 1]), v = data(d, 5, cut - 7, cut + 7, (x) => mean(x) === m && new Set(x).size >= 4), other = m >= cut ? cut - 1 : cut;
            const rows = d.shuffle([[m, true], [m, false], [other, true], [other, false]]);
            return C(`줄넘기 대회에서 학생 다섯 명의 기록의 평균이 ${cut}번 이상인 반이 결승에 올라간다. 어느 반 학생 다섯 명의 기록이 다음과 같을 때, 이 반의 기록의 평균과 결승에 올라갈 수 있는지를 바르게 쓴 것은?`, rows.map(([x, pass]) => `평균 ${x}번, 올라갈 수 ${pass ? '있다' : '없다'}`), rows.findIndex(([x, pass]) => x === m && pass === (m >= cut)), {
              figure: numbers(v.map((x) => x + '번')),
              explain: `${worked(v, '번')}이다. ${cut}번 이상은 ${cut}번과 같거나 많은 것이므로 평균이 ${m}번인 이 반은 결승에 올라갈 수 ${m >= cut ? '있다' : '없다'}.`,
              facts: { truth: rows.map(([x, pass]) => x === m && pass === (m >= cut)), want: true }
            });
          }),
          T('use-talk', '평균을 두고 한 말의 옳고 그름', '③23 심13의 변형', (d) => {
            const total = d.pick([20, 25]), m = d.pick([15, 16, 18]);
            const rows = d.shuffle([[`${total}문제를 모두 맞힌 학생이 있을 수 있다.`, true], [`모든 학생이 ${m}문제씩 맞혔다.`, false], [`${m}문제보다 적게 맞힌 학생은 없다.`, false], [`가장 많이 맞힌 학생이 ${m}문제를 맞혔다.`, false]]);
            return C(`어느 반 학생들이 수학 문제를 ${total}문제씩 풀었더니 맞힌 문제의 수의 평균이 ${m}문제였다. 바르게 말한 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: `평균 ${m}문제는 맞힌 문제의 수를 고르게 한 값이다. 평균보다 많이 맞힌 학생과 적게 맞힌 학생이 있을 수 있으므로 ${total}문제를 모두 맞힌 학생도 있을 수 있다.`,
              facts: truthOf(rows, true)
            });
          }),
          T('use-read-say', '표와 평균을 보고 한 설명 가리기', '②19', (d) => {
            const v = d.until(() => d.shuffle([5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 5).map((x) => x * 5), (x) => !x.includes(mean(x)) && [2, 3].includes(x.filter((y) => y > mean(x)).length)), m = mean(v), people = who(d, 5), t = d.int(0, 3), k = d.int(0, 4), above = v.filter((y) => y > m).length;
            const rows = [
              [`사용 시간의 평균은 ${t === 0 ? m + 5 : m}분이다.`, t !== 0],
              [`${name(people[k], '의/의')} 사용 시간은 평균보다 ${(v[k] > m) === (t !== 1) ? '길다' : '짧다'}.`, t !== 1],
              [`사용 시간이 평균보다 긴 학생은 ${t === 2 ? above + 1 : above}명이다.`, t !== 2],
              [`사용 시간이 평균과 같은 학생은 ${t === 3 ? '있다' : '없다'}.`, t !== 3]
            ];
            return C('다섯 학생이 하루 동안 컴퓨터를 사용한 시간을 나타낸 표이다. 설명으로 옳지 않은 것은?', rows.map((r) => r[0]), t, {
              figure: tab('이름', '시간(분)', people, v),
              explain: `${worked(v, '분')}이다. ${name(people[k], '의/의')} 사용 시간 ${v[k]}분은 평균보다 ${v[k] > m ? '길다' : '짧다'}. 사용 시간이 ${m}분보다 긴 학생은 ${above}명이고, ${m}분인 학생은 없다.`,
              facts: truthOf(rows, false)
            });
          }),
          T('use-grade', '평균으로 급수 찾기', '③29', (d) => {
            const gradeOf = (x) => (x >= 300 ? 0 : x >= 250 ? 1 : x >= 200 ? 2 : 3);
            const v = d.until(() => d.shuffle([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]).slice(0, 5).map((x) => x * 10), (x) => top(x) - low(x) <= 80 && x.some((y) => gradeOf(y) !== gradeOf(mean(x)))), m = mean(v), person = d.pick(NAMES), grade = gradeOf(m), names = ['1급', '2급', '3급', '4급'];
            return C(`${name(person, '의/의')} 타자 연습 기록과 급수를 정하는 기준을 나타낸 표이다. 다섯 번의 기록의 평균으로 급수를 정할 때 ${name(person, '의/의')} 급수는?`, names, grade, {
              figure: tab('회', '기록(타)', ['1회', '2회', '3회', '4회', '5회'], v) + table(['급수', '기록의 평균'], [['1급', '300타 이상'], ['2급', '250타 이상 300타 미만'], ['3급', '200타 이상 250타 미만'], ['4급', '200타 미만']]),
              explain: `${worked(v, '타')}이다. ${m}타는 ${['300타 이상', '250타 이상 300타 미만', '200타 이상 250타 미만', '200타 미만'][grade]}이므로 ${names[grade]}이다.`,
              facts: { truth: names.map((_, i) => i === grade), want: true }
            });
          }),
          T('use-rest-day', '평균 표를 보고 정하기', '③24', (d) => {
            const days = ['화', '수', '목', '금', '토'], v = d.shuffle([16, 24, 31, 38, 42, 47, 55, 63, 72, 78, 80]).slice(0, 5), at = v.indexOf(low(v));
            return C('어느 도서관에서 한 달 동안 조사한 요일별 하루 평균 이용자 수를 나타낸 표이다. 하루 평균 이용자가 가장 적은 요일에 쉬려고 할 때, 쉬는 날로 알맞은 요일은?', days.map((x) => x + '요일'), at, {
              figure: tab('요일', '이용자(명)', days, v), explain: `하루 평균 이용자 수가 가장 적은 요일은 ${v[at]}명인 ${days[at]}요일이다. 평균으로 요일마다 이용자가 얼마나 되는지 비교할 수 있다.`,
              facts: { choose: { exprs: v.map(String), rule: 'min' } }
            });
          }),
          T('use-line-read', '평균 점선이 그어진 막대그래프 읽기', '③19', (d) => {
            const cells = d.until(() => Array.from({ length: 5 }, () => d.int(2, 10)), (x) => sum(x) % 5 === 0 && x.filter((y) => y === mean(x)).length === 1 && [1, 2, 3].includes(x.filter((y) => y > mean(x)).length) && new Set(x).size >= 4), v = cells.map((x) => x * 2), m = mean(v);
            const over = DAYS5.filter((_, i) => v[i] > m);
            return N('어느 미술관의 요일별 방문자 수를 나타낸 막대그래프이다. 점선은 다섯 요일의 방문자 수의 평균을 나타낸다. 방문자 수가 평균보다 많은 요일은 며칠인가?', over.length, {
              unit: '일', figure: barsWith(DAYS5, v, { step: 2, top: 20, unit: '명', title: '요일' }, [{ at: m }]),
              explain: `점선은 세로 눈금 ${m}에 있으므로 평균은 ${m}명이다. 막대가 점선보다 높은 요일은 ${over.map((x) => x + '요일').join(', ')}의 ${over.length}일이다. 막대의 끝이 점선과 같은 요일은 평균과 같으므로 세지 않는다.`,
              facts: { count: v.map((y) => y > m) }
            });
          }),
          T('use-line-drop', '자료 하나를 빼면 평균이 오르는지 내리는지', '③20 심15', (d) => {
            const cells = data(d, 5, 2, 10, (x) => new Set(x).size >= 4), v = cells.map((x) => x * 2), m = mean(v), k = d.until(() => d.int(0, 4), (i) => v[i] !== m), rest = v.filter((_, i) => i !== k);
            const answer = v[k] < m ? 0 : 2;
            return C(`어느 농장의 요일별 딸기 판매량을 나타낸 막대그래프이다. 점선은 다섯 요일의 판매량의 평균을 나타낸다. ${DAYS5[k]}요일의 자료를 빼고 나머지 네 요일의 판매량의 평균을 구하여 점선을 다시 그으면 점선은 어떻게 되는가?`, ['지금보다 위로 올라간다', '지금과 같은 자리에 있다', '지금보다 아래로 내려간다'], answer, {
              figure: barsWith(DAYS5, v, { step: 2, top: 20, unit: '상자', title: '요일' }, [{ at: m }]),
              explain: `${DAYS5[k]}요일의 판매량 ${v[k]}상자는 평균 ${m}상자보다 ${v[k] < m ? '적다' : '많다'}. 평균보다 ${v[k] < m ? '적은' : '많은'} 자료를 빼면 나머지 자료의 평균은 ${v[k] < m ? '커지므로 점선은 위로 올라간다' : '작아지므로 점선은 아래로 내려간다'}.`,
              facts: { choose: { exprs: [E(rest), E(v)], rule: 'compare' }, unseen: [4, 5] }
            });
          }),
          T('use-line-where', '평균을 나타내는 가로선을 긋는 자리', '③21 심14', (d) => {
            const v = data(d, 5, 2, 10, (x) => new Set(x).size >= 4).map((x) => x * 2), people = who(d, 5);
            return N('다섯 학생이 한 달 동안 읽은 책의 수를 나타낸 막대그래프이다. 이 그래프에 읽은 책의 수의 평균을 나타내는 가로선을 그으려고 한다. 가로선은 세로 눈금 0에서 몇 칸 위에 그어야 하는가?', mean(v) / 2, {
              unit: '칸', figure: barChart(people, v, { step: 2, top: 20, unit: '권', title: '이름' }),
              explain: `세로 눈금 한 칸은 2권을 나타낸다. ${worked(v, '권')}이므로 가로선은 세로 눈금 ${mean(v)}에 긋는다. 0에서 ${mean(v)} ÷ 2 = ${mean(v) / 2}(칸) 위이다.`,
              facts: { calc: [[`${E(v)}/2`, 0]], unseen: [5] }
            });
          })
        ]
      },
      {
        id: 'back', title: '평균으로 모르는 값 구하기', standard: AVG,
        types: [
          T('back-total', '평균과 자료의 수로 합 구하기', '①21 ②23 ③25 심22', (d) => {
            const n = d.int(4, 8), m = d.int(78, 92);
            return N(`어느 모둠 학생 ${n}명의 수학 점수의 평균은 ${m}점이다. 이 모둠 학생 ${n}명의 수학 점수의 합은 몇 점인가?`, n * m, {
              unit: '점', explain: `평균은 합을 자료의 수로 나눈 값이므로 합은 평균에 자료의 수를 곱한 값이다. ${m} × ${n} = ${n * m}(점)`, facts: { calc: [[`${m}*${n}`, 0]] }
            });
          }),
          T('back-total-month', '하루 평균으로 한 달 동안의 합 구하기', '①21의 변형 ②23의 변형 심22의 변형', (d) => {
            const month = d.pick(['4월', '6월', '9월', '11월']), m = d.int(12, 32) * 10;
            return N(`어느 박물관에 ${month} 한 달 동안 하루 평균 ${m}명이 다녀갔다. ${month} 한 달 동안 박물관에 다녀간 사람은 모두 몇 명인가?`, m * 30, {
              unit: '명', explain: `${josa(month, '은/는')} 30일까지 있으므로 자료의 수는 30이다. ${m} × 30 = ${m * 30}(명)`, facts: { calc: [[`${m}*30`, 0]], unseen: [30] }
            });
          }),
          T('back-total-more', '평균으로 합을 구해 한 번 더 계산하기', '②23의 변형 심23', (d) => {
            const per = d.pick([250, 300, 350, 400, 450]), saved = per * 14, goal = Math.ceil((saved + 500) / 1000) * 1000, person = d.pick(NAMES);
            return N(`${name(person, '은/는')} 2주 동안 하루 평균 ${per}원씩 저금했다. 저금한 돈이 ${goal}원이 되려면 몇 원을 더 저금해야 하는가?`, goal - saved, {
              unit: '원', explain: `2주는 14일이므로 저금한 돈은 ${per} × 14 = ${saved}(원)이다. ${goal} - ${saved} = ${goal - saved}(원)을 더 저금해야 한다.`, facts: { calc: [[`${goal}-${per}*14`, 0]], unseen: [14] }
            });
          }),
          T('back-total-time', '평균으로 구한 합을 시간과 분으로 나타내기', '③25의 변형 심3의 변형', (d) => {
            const [days, per] = d.until(() => [d.pick([4, 5, 6]), d.pick([35, 40, 45, 50, 55])], ([x, y]) => (x * y) % 60 !== 0), total = days * per, person = d.pick(NAMES);
            return M(`${name(person, '은/는')} ${days}일 동안 하루 평균 ${per}분씩 책을 읽었다. ${days}일 동안 책을 읽은 시간은 모두 몇 시간 몇 분인가?`, [{ answer: Math.floor(total / 60), unit: '시간' }, { answer: total % 60, unit: '분' }], {
              explain: `책을 읽은 시간은 모두 ${per} × ${days} = ${total}(분)이다. 60분은 1시간이므로 ${total}분은 ${Math.floor(total / 60)}시간 ${total % 60}분이다.`,
              facts: { calc: [[`(${per}*${days}-${per}*${days}%60)/60`, 0], [`${per}*${days}%60`, 1]], unseen: [60] }
            });
          }),
          T('back-missing', '평균이 주어진 표의 빈 자료', '①22 ②24 ③26 심24', (d) => {
            const v = data(d, 5, 100, 170, distinct), m = mean(v), k = d.int(0, 4), rest = v.filter((_, i) => i !== k);
            return N(`어느 전시관의 요일별 방문자 수를 나타낸 표이다. 5일 동안의 방문자 수의 평균이 ${m}명일 때, ${DAYS5[k]}요일의 방문자 수는 몇 명인가?`, v[k], {
              unit: '명', figure: tab('요일', '방문자 수(명)', DAYS5, v.map((x, i) => (i === k ? null : x))),
              explain: `5일 동안의 방문자 수의 합은 ${m} × 5 = ${m * 5}(명)이다. 나머지 네 요일의 합은 ${plus(rest)} = ${sum(rest)}(명)이므로 ${DAYS5[k]}요일은 ${m * 5} - ${sum(rest)} = ${v[k]}(명)이다.`,
              facts: { calc: [[`${m}*5-(${rest.join('+')})`, 0]] }
            });
          }),
          T('back-missing-table', '평균 칸이 있는 표에서 합과 빈 자료 구하기', '①22의 변형 ②24의 변형 ③26의 변형', (d) => {
            const subjects = ['국어', '수학', '사회', '과학'], v = data(d, 4, 76, 96, distinct), m = mean(v), k = d.int(0, 3), rest = v.filter((_, i) => i !== k), person = d.pick(NAMES);
            return M(`${name(person, '의/의')} 과목별 점수와 네 과목의 점수의 평균을 나타낸 표이다. 네 과목의 점수의 합과 ${subjects[k]} 점수를 차례로 구하시오.`, [{ label: '합', answer: m * 4, unit: '점' }, { label: subjects[k], answer: v[k], unit: '점' }], {
              figure: table(['과목', '점수(점)'], subjects.map((s, i) => [s, i === k ? box('') : v[i]]).concat([['평균', m]])),
              explain: `네 과목의 점수의 합은 ${m} × 4 = ${m * 4}(점)이다. 나머지 세 과목의 합은 ${plus(rest)} = ${sum(rest)}(점)이므로 ${subjects[k]} 점수는 ${m * 4} - ${sum(rest)} = ${v[k]}(점)이다.`,
              facts: { calc: [[`${m}*4`, 0], [`${m}*4-(${rest.join('+')})`, 1]], unseen: [4] }
            });
          }),
          T('back-missing-rank', '빈 자료를 구한 뒤 자료 비교하기', '②24의 변형 심25', (d) => {
            const v = data(d, 4, 25, 55, distinct), m = mean(v), k = d.int(0, 3), rest = v.filter((_, i) => i !== k), people = who(d, 4), at = v.indexOf(low(v));
            return C(`네 학생의 줄넘기 기록을 나타낸 표이다. 네 학생의 기록의 평균이 ${m}번일 때, 기록이 가장 낮은 학생은?`, people, at, {
              figure: tab('이름', '기록(번)', people, v.map((x, i) => (i === k ? null : x))),
              explain: `네 학생의 기록의 합은 ${m} × 4 = ${m * 4}(번)이므로 ${name(people[k], '의/의')} 기록은 ${m * 4} - (${plus(rest)}) = ${v[k]}(번)이다. 기록이 가장 낮은 학생은 ${v[at]}번인 ${people[at]}이다.`,
              facts: { rank: { values: v, nth: 4 } }
            });
          }),
          T('back-last-day', '앞의 합이 주어질 때 마지막 자료', '심24의 변형', (d) => {
            const [per, last] = d.until(() => [d.pick([1200, 1400, 1500, 1600, 1800]), d.int(5, 15) * 200], ([x, y]) => y !== x && x * 5 - y > 0 && (x * 5 - y) % 4 === 0), first = per * 5 - last, person = d.pick(NAMES);
            return N(`${name(person, '은/는')} 4일 동안 모두 ${first}원을 모았다. 5일 동안 모은 돈의 하루 평균이 ${per}원이 되려면 5일째에는 몇 원을 모아야 하는가?`, last, {
              unit: '원', explain: `5일 동안 모은 돈의 합은 ${per} × 5 = ${per * 5}(원)이어야 한다. 4일 동안 ${first}원을 모았으므로 5일째에는 ${per * 5} - ${first} = ${last}(원)을 모아야 한다.`,
              facts: { calc: [[`${per}*5-${first}`, 0]] }
            });
          }),
          T('back-same-mean', '두 모둠의 평균이 같을 때 빈 자료', '①23 ②25 ③27 심26', (d) => {
            const a = data(d, 3, 30, 55, distinct), m = mean(a), b = data(d, 4, m - 12, m + 12, (x) => mean(x) === m && distinct(x)), k = d.int(0, 3), rest = b.filter((_, i) => i !== k);
            return M('두 모둠 학생들의 하루 운동 시간(분)을 나타낸 표이다. 두 모둠의 운동 시간의 평균이 같을 때, 가 모둠의 평균, 나 모둠의 운동 시간의 합, 빈칸에 알맞은 수를 차례로 구하시오.', [{ label: '평균', answer: m, unit: '분' }, { label: '합', answer: m * 4, unit: '분' }, { label: '빈칸', answer: b[k], unit: '분' }], {
              figure: rowsTab(['가 모둠', '나 모둠'], [a, b.map((x, i) => (i === k ? null : x))]),
              explain: `가 모둠의 평균은 ${worked(a, '분')}이다. 나 모둠은 4명이고 평균이 같으므로 합은 ${m} × 4 = ${m * 4}(분)이다. 빈칸은 ${m * 4} - (${plus(rest)}) = ${b[k]}(분)이다. 두 모둠은 학생 수가 달라 합은 같지 않다.`,
              facts: { calc: [[E(a), 0], [`${E(a)}*4`, 1], [`${E(a)}*4-(${rest.join('+')})`, 2]], unseen: [3, 4] }
            });
          }),
          T('back-goal', '목표 평균이 되려면 받아야 하는 점수', '①27 ②29 심28', (d) => {
            const [v, goal] = d.until(() => [Array.from({ length: 4 }, () => d.int(76, 96)), d.pick([84, 85, 86, 88, 90])], ([x, g]) => { const need = g * 5 - sum(x); return distinct(x) && need >= 80 && need <= 100 && need !== g && !x.includes(need); }), need = goal * 5 - sum(v), person = d.pick(NAMES);
            return N(`${name(person, '의/의')} 1단원부터 4단원까지의 수학 단원 평가 점수는 ${v.join('점, ')}점이다. 5단원까지의 점수의 평균이 ${goal}점 이상이 되려면 5단원에서 적어도 몇 점을 받아야 하는가?`, need, {
              unit: '점', explain: `평균이 ${goal}점이 되려면 다섯 단원의 점수의 합이 ${goal} × 5 = ${goal * 5}(점)이어야 한다. 네 단원의 합은 ${plus(v)} = ${sum(v)}(점)이므로 5단원에서 적어도 ${goal * 5} - ${sum(v)} = ${need}(점)을 받아야 한다.`,
              facts: { calc: [[`${goal}*5-(${v.join('+')})`, 0]] }
            });
          })
        ]
      },
      { id: 'word', title: '가능성을 말로 표현하기', standard: SAY, types: [] },
      { id: 'comp', title: '가능성 비교하기', standard: SAY, types: [] },
      { id: 'num', title: '가능성을 수로 나타내기', standard: NUM, types: [] },
      { id: 'data', title: '자료를 보고 가능성 예상하기', standard: JUDGE, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
