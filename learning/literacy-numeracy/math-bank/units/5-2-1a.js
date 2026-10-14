// 5학년 2학기 1단원 수의 범위와 어림하기 — 단원 틀과 「수의 범위」 기본 문항(이상·이하·초과·미만, 두 끝이 있는 범위, 수직선, 생활 속 수의 범위).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 75·83·84꼴, 심화꼴 74꼴)을 처음부터 끝까지 대조하여,
// 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 주고 무엇을 묻는가를 따져서 실었다. 꼴 번호는 ①n = 기본꼴_1의 n번, ②n, ③n, 심n.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/5-2-1/싣기_대조표.md 에 있다.
// (올림·버림·반올림의 기본 문항과 실력 문항은 5-2-1b.js 에 있다.)
//
// 영역과 성취기준: 수와 연산. [6수01-02] 이상·이하·초과·미만의 의미와 쓰임, 수의 범위 나타내기 / [6수01-03] 올림·버림·반올림의 의미와 필요성, 실생활 활용.
// 교육과정: 「수의 범위와 올림, 버림, 반올림은 측정 상황과 같이 수나 양의 어림이 필요한 여러 가지 실생활 사례를 통하여 그 의미를 알게 한다.」
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다. 낱말(이상·이하·초과·미만과 그 짝), 주는 것(수 묶음·수직선·표·생활 문장), 묻는 것(모두 고르기·개수·아닌 것·경계의 수),
//    수의 꼴(자연수만·소수와 분수가 섞임·경계가 소수)이 다르면 따로 싣는다. 수나 이름만 다른 것은 한 번만 싣는다.
//  - 어느 문항에나 경계의 수(20 이상의 20, 20 초과의 20)가 보기나 자료에 들어 있다. 이 단원의 요점이 경계의 수가 드는가이기 때문이다.
//  - 「모두 쓰시오」는 칸 수가 답을 알려 주므로 「모두 고른 것은」「모두 몇 개인가」「가장 큰 수는」으로 바꾸어 묻는다.
//  - 「수직선에 나타내시오」(작도)는 「바르게 나타낸 수직선은」(㉠~㉣ 가운데 고르기)과 「수직선에 나타낸 범위는」(읽기)으로 바꾸어 실었다.
//  - 답은 모두 코드로 셈한다(범위에 드는가, 표의 어느 칸인가). 표와 등급의 이름은 지어낸 것이고 사람은 이름으로만 적는다.
//
// 뺀 것과 까닭
//  - 경우 따지기·조건 풀이가 어려움의 대부분인 것: 수 카드로 만든 수 가운데 범위에 드는 수(①22 ③81 심12), 자리마다 범위 조건을 주고 수를 모두 만들거나
//    세는 것(②17 ③82 심27 — 조건 둘로 가장 큰 수 하나를 만드는 것만 실력에 실었다), 구간별 학생 수를 모두 세어 가장 적은 구간 찾기(②27의 변형)
//  - 5-1-2(약수와 배수)가 주가 되는 것: 범위 안에서 나누어떨어지는 수 세기(②15 심9의 배수 쪽)
//  - 혼합 계산이 일의 대부분인 것: 기본 시간을 넘긴 만큼 붙는 요금(②32 심32), 요금에서 거꾸로 시간의 범위(①34 ②33), 장수 구간별 값으로 산 값 견주기(②34)
//  - 답이 하나로 정해지지 않는 것: 체급에 맞추려고 줄여야 하는 몸무게에 「이상」 고르기(①35 — 아래 끝도 지켜야 하므로 온전한 답은 범위다)
//  - 작도·서술형·활동: 수직선에 나타내기(①10 ②23 ③20·21 심13 — 고르기로 바꿈), 잘못 그린 수직선 고쳐 그리기(③22 심15), 문장 만들기·생활 속 예 쓰기(①36 ③24 심11),
//    틀린 말 고쳐 쓰기(①32 ②13의 변형 — 옳고 그름을 가리는 문항은 실었다)
//  - 같은 일: 두 조건 줄(○ 이상인 수, △ 이하인 수)을 모두 만족하는 자연수(②5·14 ③8의 변형)는 두 끝이 있는 범위와, 등급에 드는 값 고르기(①28 ③31의 변형)는
//    두 끝 범위에 드는 수 고르기와, 소수 첫째 자리 숫자의 범위로 소수 세기(②16)는 범위의 자연수 세기와 하는 일이 같다. 개수가 더 많은 범위 고르기(①16의 변형 심21)는
//    범위의 자연수 세기를 두 번 하는 것이고, 네 범위와 네 수직선 잇기(①11 ③18의 변형)는 수직선 고르기를 네 번 하는 것이다.
//    두 값의 합으로 구간 찾기(②31)는 실력의 hd-box-weight 와 얼개가 같고, 값이 속한 범위 쓰기(③30)와 등급의 범위 빈칸 채우기(②28의 변형)는 life-table-grade 가 하는 일이다.
//    구간으로 나눈 표는 초과–이하로 나눈 것(life-table-fee, 체급)과 이상–미만으로 나눈 것(life-table-grade, 줄넘기 급수)을 따로 실었다. 경계의 값이 드는 칸이 서로 반대이기 때문이다.
// 묻는 말: 수나 값을 물으면 "~은?/~는?", 양을 물으면 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, mixed, lines, tagged, numbers, table, josa, name, nick, N, M, C } = B.kit;
  const U = '5-2-1', RANGE = '6수01-02', ROUND = '6수01-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마'];
  const ints = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const some = (d, list, k) => d.shuffle(list).slice(0, k);
  const asc = (list) => list.slice().sort((x, y) => x - y);
  const sum = (list) => list.reduce((s, v) => s + v, 0);
  const pickNames = (d, k) => d.shuffle(NAMES).slice(0, k);

  // ── 수의 범위 ────────────────────────────────────────────────
  // kind: 'ge' 이상 | 'le' 이하 | 'gt' 초과 | 'lt' 미만. 두 끝이 있는 범위는 { lo: 'ge'|'gt', a, hi: 'le'|'lt', b }.
  const W = { ge: '이상', le: '이하', gt: '초과', lt: '미만' };
  const KINDS = ['ge', 'le', 'gt', 'lt'];
  const COMBOS = [['ge', 'le'], ['ge', 'lt'], ['gt', 'le'], ['gt', 'lt']];
  const holds = (v, kind, b) => (kind === 'ge' ? v >= b : kind === 'le' ? v <= b : kind === 'gt' ? v > b : v < b);
  const inside = (v, r) => holds(v, r.lo, r.a) && holds(v, r.hi, r.b);
  const closed = (kind) => kind === 'ge' || kind === 'le';
  // 수와 단위: 단위 기호는 띄어 쓰고(130 cm) 우리말 단위는 붙여 쓴다(12세).
  const amt = (v, unit) => (unit ? v + (/^[A-Za-z℃]/.test(unit) ? ' ' : '') + unit : String(v));
  const two = (r, unit) => `${amt(r.a, unit)} ${W[r.lo]} ${amt(r.b, unit)} ${W[r.hi]}`;
  // 토씨: 소수는 끝자리 숫자를 마지막에 읽는다(9.6은, 28.4는). 자연수를 적은 글에도 쓴다.
  const BATCHIM = [true, true, false, true, false, false, true, true, true, false], RIEUL = [false, true, false, false, false, false, false, true, true, false];
  const dj = (text, pair) => { const [yes, no] = pair.split('/'), k = Number(String(text).slice(-1)); return text + (yes === '으로' ? (BATCHIM[k] && !RIEUL[k] ? '으로' : '로') : BATCHIM[k] ? yes : no); };
  // 뜻을 푼 말과 풀이 글
  const MEAN = { ge: (b) => `${dj(b, '과/와')} 같거나 큰 수`, le: (b) => `${dj(b, '과/와')} 같거나 작은 수`, gt: (b) => `${b}보다 큰 수`, lt: (b) => `${b}보다 작은 수` };
  const mean = (kind, b) => `${b} ${W[kind]}인 수는 ${MEAN[kind](b)}이다.`;
  const edge = (kind, b) => (closed(kind) ? `${b}도 포함된다.` : `${dj(b, '은/는')} 포함되지 않는다.`);

  // ── 보기 짜기 ────────────────────────────────────────────────
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  // 참·거짓이 붙은 보기 가운데 하나만 참(거짓)인 고르기 문항. 참·거짓은 코드로 셈하여 넣는다.
  const CT = (text, rows, want, o) => C(text, rows.map((row) => row[0]), rows.findIndex((row) => row[1] === want), Object.assign({}, o, { facts: Object.assign(truthOf(rows, want), o.facts || {}) }));
  // 여럿을 고르는 문제의 보기: 맞는 묶음 하나와 틀린 묶음 셋. trap 자리(경계의 수)를 넣거나 뺀 묶음은 꼭 넣는다.
  function setOptions(d, labels, flags, trap) {
    const key = (list) => list.join(', '), pickBy = (fl) => labels.filter((_, i) => fl[i]);
    const right = pickBy(flags), out = [right], seen = new Set([key(right)]);
    const push = (cand) => { if (cand.length && out.length < 4 && !seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } };
    if (trap != null && trap >= 0) push(pickBy(flags.map((f, i) => (i === trap ? !f : f))));
    const pool = [];
    labels.forEach((_, i) => pool.push(pickBy(flags.map((f, j) => (j === i ? !f : f)))));
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) pool.push(pickBy(flags.map((f, k) => (k === i ? false : k === j ? true : f)))); }));
    for (const cand of d.shuffle(pool)) push(cand);
    const list = d.shuffle(out);
    return { options: list.map(key), answer: list.findIndex((o) => key(o) === key(right)), sets: list };
  }
  const setItem = (d, text, labels, flags, trap, o) => { const made = setOptions(d, labels, flags, trap); return C(text, made.options, made.answer, Object.assign({}, o, { facts: { sets: { labels, flags, options: made.sets } } })); };

  // ── 그림 ─────────────────────────────────────────────────────
  // 수의 범위를 나타낸 수직선. ticks: 눈금에 적는 수(글). from·to: { at: 눈금 자리(0부터 세고 작은 눈금은 0.5), on: ●(들어감)이면 true, text: 눈금 사이에 있을 때 그 수 }.
  // to 가 없으면 from 에서 o.dir('right' | 'left') 쪽 끝까지 굵은 선을 긋는다. o.tag: 수직선 앞에 적는 기호(보기 여럿을 세로로 늘어놓을 때), o.half: 큰 눈금 사이에 작은 눈금을 긋는다.
  function rangeLine(ticks, from, to, o) {
    const opt = o || {}, n = ticks.length, left = opt.tag ? 50 : 26, gap = (262 - left) / (n - 1), x = (i) => left + i * gap, y = 20;
    const ink = '#1d4ed8', dark = '#1f2933', word = 'style="font-size:13px;font-weight:600"', x0 = x(0) - 18, x1 = x(n - 1) + 18;
    const head = (px, way, color, size) => `<path d="M${px.toFixed(1)} ${y}l${-way * size} ${-size * 0.6}v${size * 1.2}z" style="fill:${color}"/>`;
    let out = opt.tag ? `<text class="mb-axis-label" style="font-size:15px;font-weight:600" x="4" y="${y + 5}">${opt.tag}</text>` : '';
    out += `<line class="mb-axis" x1="${x0.toFixed(1)}" y1="${y}" x2="${x1.toFixed(1)}" y2="${y}"/>` + head(x1 + 5, 1, dark, 6) + head(x0 - 5, -1, dark, 6);
    const a = x(from.at), b = to ? x(to.at) : opt.dir === 'left' ? x0 : x1;
    out += `<line x1="${a.toFixed(1)}" y1="${y}" x2="${b.toFixed(1)}" y2="${y}" style="stroke:${ink};stroke-width:4.5"/>`;
    if (!to) out += head(b + (opt.dir === 'left' ? -7 : 7), opt.dir === 'left' ? -1 : 1, ink, 9);
    for (let i = 0; i < n; i += 1) {
      // 눈금 글이 '' 인 자리는 눈금을 긋지 않는다(두 끝만 적는 수직선).
      if (ticks[i] !== '') out += `<line class="mb-axis" x1="${x(i).toFixed(1)}" y1="${y - 6}" x2="${x(i).toFixed(1)}" y2="${y + 6}"/><text class="mb-axis-label" ${word} x="${x(i).toFixed(1)}" y="${y + 22}" text-anchor="middle">${ticks[i]}</text>`;
      if (opt.half && i < n - 1) out += `<line class="mb-axis" x1="${x(i + 0.5).toFixed(1)}" y1="${y - 3.5}" x2="${x(i + 0.5).toFixed(1)}" y2="${y + 3.5}"/>`;
    }
    const dot = (p) => `<circle cx="${x(p.at).toFixed(1)}" cy="${y}" r="5.2" style="fill:${p.on ? ink : '#fff'};stroke:${ink};stroke-width:2"/>`;
    out += dot(from) + (to ? dot(to) : '');
    const at = (p) => (p.text != null ? p.text : ticks[p.at]) + '에 ' + (p.on ? '●' : '○');
    const said = '수직선' + (opt.tag ? ' ' + opt.tag : '') + ': 눈금 ' + ticks.filter((t) => t !== '').join(', ') + '. ' + at(from) + (to ? ', ' + at(to) + '로 표시하고 그 사이에 굵은 선을 그었다' : '로 표시하고 ' + (opt.dir === 'left' ? '왼쪽' : '오른쪽') + '으로 굵은 선을 그었다');
    return `<svg class="mb-numberline" viewBox="0 0 288 ${y + 28}" width="288" role="img" aria-label="${said}">${out}</svg>`;
  }
  // 한쪽 범위를 나타낸 수직선(kind 대로 ●·○와 방향을 정한다)과 두 끝 범위를 나타낸 수직선
  const oneLine = (ticks, at, kind, tag) => rangeLine(ticks, { at, on: closed(kind) }, null, { dir: kind === 'ge' || kind === 'gt' ? 'right' : 'left', tag });
  const twoLine = (ticks, i, j, lo, hi, tag) => rangeLine(ticks, { at: i, on: lo === 'ge' }, { at: j, on: hi === 'le' }, { tag });
  const stack = (list) => '<div class="mb-lines" style="gap:4px">' + list.map((svg) => '<div>' + svg + '</div>').join('') + '</div>';
  // 이름과 값의 표. 다섯 줄이 넘으면 두 줄씩 나란히 놓는다(휴대폰에서 길어지지 않게).
  function listTable(head, rows) {
    if (rows.length <= 5) return table(head, rows);
    const half = Math.ceil(rows.length / 2);
    return table(head.concat(head), ints(0, half - 1).map((i) => rows[i].concat(rows[i + half] || ['', ''])));
  }

  B.addUnit({
    id: '5-2-1', grade: 5, semester: 2, no: 1, title: '수의 범위와 어림하기', version: 1,
    groups: [
      { id: 'mean', title: '이상, 이하, 초과, 미만', standard: RANGE, types: [] },
      { id: 'both', title: '두 끝이 있는 수의 범위', standard: RANGE, types: [] },
      { id: 'line', title: '수의 범위와 수직선', standard: RANGE, types: [] },
      { id: 'life', title: '생활 속 수의 범위', standard: RANGE, types: [] },
      { id: 'up', title: '올림', standard: ROUND, types: [] },
      { id: 'down', title: '버림', standard: ROUND, types: [] },
      { id: 'round', title: '반올림', standard: ROUND, types: [] },
      { id: 'mix', title: '올림, 버림, 반올림 비교하기', standard: ROUND, types: [] },
      { id: 'back', title: '어림하기 전의 수', standard: ROUND, types: [] },
      { id: 'use', title: '생활 속 올림, 버림, 반올림', standard: ROUND, types: [] }
    ]
  });

  // ── 이상, 이하, 초과, 미만 ───────────────────────────────────
  B.addTypes(U, 'mean', [
    T('mean-word', '이상·이하·초과·미만의 뜻', '①1 ②1 ③1·2 심1', (d, n) => {
      const kinds = n === 0 ? ['ge', 'lt'] : ['gt', 'le'], a = d.int(12, 48), b = d.until(() => d.int(12, 48), (v) => v !== a);
      const right = kinds.map((k) => W[k]).join(', ');
      const rows = d.shuffle(COMBOS.map(([l, h]) => [`${W[l]}, ${W[h]}`, `${W[l]}, ${W[h]}` === right]));
      return CT('㉠, ㉡에 알맞은 말을 차례로 쓴 것은?', rows, true, {
        figure: lines([`${MEAN[kinds[0]](a)} → ${a} ${box(LABELS[0])}인 수`, `${MEAN[kinds[1]](b)} → ${b} ${box(LABELS[1])}인 수`]),
        explain: `${MEAN[kinds[0]](a)}는 ${a} ${W[kinds[0]]}인 수이고, ${MEAN[kinds[1]](b)}는 ${b} ${W[kinds[1]]}인 수이다.`
      });
    }, { count: 2 }),
    T('mean-phrase', '수의 범위를 말로 풀기', '②1 ③2', (d) => {
      const kind = d.pick(KINDS), b = d.int(5, 60);
      return CT(`「${b} ${W[kind]}인 수」를 바르게 설명한 것은?`, d.shuffle(KINDS.map((k) => [MEAN[k](b), k === kind])), true, { explain: mean(kind, b) + ' ' + edge(kind, b) });
    }),
    T('mean-in-ge', '이상인 수 모두 고르기', '①2 ②2 ③4 심2', (d) => {
      const b = d.int(15, 60), list = d.shuffle([b].concat(some(d, ints(b + 1, b + 14), 2), some(d, ints(b - 12, b - 1), 3))), flags = list.map((v) => holds(v, 'ge', b));
      return setItem(d, `${b} 이상인 수를 모두 고른 것은?`, list, flags, list.indexOf(b), {
        figure: numbers(list), explain: `${mean('ge', b)} ${edge('ge', b)} ${b} 이상인 수는 ${list.filter((v) => v >= b).join(', ')}이다.`
      });
    }),
    T('mean-in-lt', '미만인 수의 개수', '①2 ②3 ③5 심2', (d) => {
      const b = d.int(15, 60), list = d.shuffle([b].concat(some(d, ints(b + 1, b + 12), 2), some(d, ints(b - 14, b - 1), d.int(2, 3)))), hit = list.filter((v) => v < b);
      return N(`${b} 미만인 수는 모두 몇 개인가?`, hit.length, {
        unit: '개', figure: numbers(list), explain: `${mean('lt', b)} ${edge('lt', b)} ${b} 미만인 수는 ${hit.join(', ')}이다.`, facts: { count: list.map((v) => holds(v, 'lt', b)) }
      });
    }),
    T('mean-in-gt-deci', '소수가 섞인 수에서 초과인 수 고르기', '①3 ②2 ③5 심2', (d) => {
      const b = d.int(12, 48), k = () => d.int(1, 9);
      const list = d.shuffle([String(b), `${b}.${k()}`, `${b - 1}.${k()}`, String(b + d.int(2, 9)), `${b + d.int(1, 6)}.${k()}`, String(b - d.int(2, 8))]), flags = list.map((t) => holds(Number(t), 'gt', b));
      return setItem(d, `${b} 초과인 수를 모두 고른 것은?`, list, flags, list.indexOf(String(b)), {
        figure: numbers(list), explain: `${mean('gt', b)} ${edge('gt', b)} ${b} 초과인 수는 ${list.filter((_, i) => flags[i]).join(', ')}이다.`
      });
    }),
    T('mean-in-le-deci', '소수와 분수가 섞인 수에서 이하인 수의 개수', '①3 ②3 ③4 심2', (d) => {
      const b = d.int(12, 48), k = () => d.int(1, 9), q = d.pick([2, 3, 4, 5]), p = d.int(1, q - 1);
      // [적는 글, 값]. 대분수는 자연수 부분만 보아도 가려진다.
      const vals = d.shuffle([[String(b), b], [`${b}.${k()}`, b + 0.5], [mixed(b - 1, p, q), b - 0.5], [String(b + d.int(2, 9)), b + 2], [`${b + d.int(1, 6)}.${k()}`, b + 1.5],
        d.bool() ? [`${b - d.int(1, 6)}.${k()}`, b - 0.5] : [mixed(b, 1, d.pick([2, 3, 4])), b + 0.5]]);
      const hit = vals.filter(([, v]) => v <= b);
      return N(`${b} 이하인 수는 모두 몇 개인가?`, hit.length, {
        unit: '개', figure: numbers(vals.map(([t]) => t)), explain: `${mean('le', b)} ${edge('le', b)} ${b} 이하인 수는 ${hit.map(([t]) => t).join(', ')}이다.`, facts: { count: vals.map(([, v]) => holds(v, 'le', b)) }
      });
    }),
    T('mean-in-deci-bound', '경계가 소수인 범위에 드는 수', '①3 ③4', (d) => {
      const w = d.int(5, 40), k = d.int(2, 8), kind = d.pick(['ge', 'lt']), bt = `${w}.${k}`, b = Number(bt);
      const list = d.shuffle([bt, `${w}.${k + 1}`, `${w}.${k - 1}`, String(w), String(w + 1), `${w + d.int(1, 3)}.${d.int(1, 9)}`]), flags = list.map((t) => holds(Number(t), kind, b));
      return setItem(d, `${bt} ${W[kind]}인 수를 모두 고른 것은?`, list, flags, list.indexOf(bt), {
        figure: numbers(list), explain: `${bt} ${W[kind]}인 수는 ${MEAN[kind](bt)}이다. ${edge(kind, bt)} ${bt} ${W[kind]}인 수는 ${list.filter((_, i) => flags[i]).join(', ')}이다.`
      });
    }),
    T('mean-not', '범위에 들지 않는 수', '②4 심2', (d) => {
      const kind = d.pick(['gt', 'lt']), b = d.int(20, 70), others = some(d, kind === 'gt' ? ints(b + 1, b + 14) : ints(b - 14, b - 1), 4);
      return CT(`${b} ${W[kind]}인 수가 아닌 것은?`, d.shuffle([b].concat(others).map((v) => [String(v), holds(v, kind, b)])), false, { explain: `${mean(kind, b)} ${edge(kind, b)}` });
    }),
    T('mean-only-set', '범위에 드는 수로만 이루어진 것', '②4', (d) => {
      // 맞는 묶음에는 경계의 수가 들어 있고, 틀린 묶음에는 범위 밖의 수가 하나씩 들어 있다.
      const kind = d.pick(['ge', 'le']), b = d.int(20, 70), s = kind === 'ge' ? 1 : -1;
      const sets = d.until(() => [[b, b + s * d.int(2, 4), b + s * d.int(5, 9)], [b - s, b + s, b + s * d.int(3, 8)], [b - s * 2, b, b + s * d.int(2, 7)], [b - s * d.int(1, 3), b + s * 2, b + s * d.int(4, 9)]].map(asc),
        (list) => new Set(list.map(String)).size === 4 && list.every((one) => new Set(one).size === 3));
      return CT(`${b} ${W[kind]}인 수로만 이루어진 것은?`, d.shuffle(sets.map((one) => [one.join(', '), one.every((v) => holds(v, kind, b))])), true, { explain: `${mean(kind, b)} ${edge(kind, b)} ${sets[0].join(', ')}${josa(sets[0][2], '은/는').slice(String(sets[0][2]).length)} 모두 ${b} ${W[kind]}인 수이다.` });
    }),
    T('mean-marks-none', '두 범위 어디에도 들지 않는 수', '①4 ②2 심2', (d) => {
      const b = d.int(12, 30), a = b + d.int(9, 14), mid = some(d, ints(b + 1, a - 1), d.int(2, 3));
      const list = d.shuffle([a, b].concat(mid, some(d, ints(a + 1, a + 12), 1), some(d, ints(b - 10, b - 1), 1)));
      return N(`${a} 이상인 수에 ○표, ${b} 이하인 수에 △표를 하였다. 어느 표도 하지 않은 수는 모두 몇 개인가?`, mid.length, {
        unit: '개', figure: numbers(list), explain: `${a}에는 ○표, ${b}에는 △표를 한다. 표를 하지 않은 수는 ${b}보다 크고 ${a}보다 작은 ${asc(mid).join(', ')}이다.`, facts: { count: list.map((v) => !holds(v, 'ge', a) && !holds(v, 'le', b)) }
      });
    }),
    T('mean-marks-both', '이상과 이하에 모두 드는 수', '③6', (d) => {
      const b = d.int(12, 48), list = d.shuffle([String(b), `${b}.${d.int(1, 9)}`, `${b - 1}.${d.int(1, 9)}`, String(b + d.int(1, 9)), String(b - d.int(1, 9))]);
      return CT(`${b} 이상인 수에 ○표, ${b} 이하인 수에 △표를 하였다. ○표와 △표를 모두 한 수는?`, list.map((t) => [t, holds(Number(t), 'ge', b) && holds(Number(t), 'le', b)]), true, {
        explain: `${b} 이상인 수에도, ${b} 이하인 수에도 ${josa(b, '이/가')} 포함된다. 두 표를 모두 한 수는 ${b}뿐이다.`
      });
    }),
    T('mean-say', '어떤 수가 범위에 포함되는가', '①5 ②13 ③3 심7', (d) => {
      // 경계의 수와 경계 바로 옆의 소수를 섞는다. 참인 말은 하나뿐이다.
      const bs = some(d, ints(11, 59), 4), t = d.int(0, 3), k = () => d.int(1, 9);
      const cases = d.shuffle([(b) => [String(b), d.pick(['gt', 'lt'])], (b) => [String(b), d.pick(['ge', 'le'])], (b) => [`${b}.${k()}`, d.pick(KINDS)], (b) => [`${b - 1}.${k()}`, d.pick(KINDS)]]);
      const made = cases.map((make, i) => { const [text, kind] = make(bs[i]), actual = holds(Number(text), kind, bs[i]), says = i === t ? actual : !actual; return { row: [`${dj(text, '은/는')} ${bs[i]} ${W[kind]}인 수에 포함${says ? '된다' : '되지 않는다'}.`, says === actual], fact: `${dj(text, '은/는')} ${bs[i]} ${W[kind]}인 수에 포함${actual ? '된다' : '되지 않는다'}.` }; });
      return CT('수의 범위에 대한 설명으로 옳은 것은?', made.map((m) => m.row), true, { explain: made.map((m) => m.fact).join(' ') });
    }),
    T('mean-say-natural', '범위에 드는 자연수에 대한 설명', '①5 ③3 심7', (d) => {
      // 틀린 말 하나는 경계의 수를 잘못 넣거나 뺀 것이다.
      const FORMS = [
        { text: (b, v) => `${b} 초과인 자연수 중 가장 작은 수는 ${v}이다.`, right: (b) => b + 1, slip: (b) => b, lo: 11, hi: 80 },
        { text: (b, v) => `${b} 이상인 자연수 중 가장 작은 수는 ${v}이다.`, right: (b) => b, slip: (b) => b + 1, lo: 11, hi: 80 },
        { text: (b, v) => `${b} 미만인 자연수 중 가장 큰 수는 ${v}이다.`, right: (b) => b - 1, slip: (b) => b, lo: 11, hi: 80 },
        { text: (b, v) => `${b} 이하인 자연수 중 가장 큰 수는 ${v}이다.`, right: (b) => b, slip: (b) => b - 1, lo: 11, hi: 80 },
        { text: (b, v) => `${b} 이하인 자연수는 모두 ${v}개이다.`, right: (b) => b, slip: (b) => b - 1, lo: 5, hi: 12 },
        { text: (b, v) => `${b} 미만인 자연수는 모두 ${v}개이다.`, right: (b) => b - 1, slip: (b) => b, lo: 5, hi: 12 }
      ];
      const forms = some(d, FORMS, 4), bs = d.until(() => forms.map((f) => d.int(f.lo, f.hi)), (list) => new Set(list).size === 4);
      const rows = forms.map((f, i) => { const said = i === 0 ? f.slip(bs[i]) : f.right(bs[i]); return [f.text(bs[i], said), said === f.right(bs[i])]; });
      return CT('자연수에 대한 설명으로 옳지 않은 것은?', d.shuffle(rows), false, { explain: `${forms[0].text(bs[0], forms[0].right(bs[0]))} 이상과 이하는 경계의 수가 포함되고, 초과와 미만은 포함되지 않는다.` });
    }),
    T('mean-contains-one', '어떤 수를 포함하는 범위 모두 고르기', '①6 ②9 ③10', (d) => {
      const n = d.int(20, 70), k1 = d.int(2, 8), k2 = d.int(2, 8);
      const rows = d.shuffle([[d.pick(['ge', 'le']), n], [d.pick(['gt', 'lt']), n], d.pick([['ge', n - k1], ['gt', n + k1]]), d.pick([['lt', n + k2], ['le', n - k2]])]), flags = rows.map(([kind, b]) => holds(n, kind, b));
      return setItem(d, `${josa(n, '을/를')} 포함하는 수의 범위를 모두 고른 것은?`, LABELS, flags, rows.findIndex(([kind, b]) => b === n && !closed(kind)), {
        figure: tagged(rows.map(([kind, b]) => `${b} ${W[kind]}인 수`)), explain: `${n} 이상인 수와 ${n} 이하인 수에는 ${josa(n, '이/가')} 포함되고, ${n} 초과인 수와 ${n} 미만인 수에는 포함되지 않는다. ${josa(n, '을/를')} 포함하는 범위는 ${LABELS.filter((_, i) => flags[i]).join(', ')}이다.`
      });
    }),
    T('mean-nat-count', '미만인 자연수의 개수', '②6 ③9', (d) => {
      const b = d.int(6, 15);
      return N(`${b} 미만인 자연수는 모두 몇 개인가?`, b - 1, { unit: '개', explain: `${b} 미만인 자연수는 1부터 ${b - 1}까지의 수이다. ${josa(b, '은/는')} 포함되지 않으므로 ${b - 1}개이다.`, facts: { calc: [[`${b}-1`, 0]], unseen: [1] } });
    }),
    T('mean-nat-two-digit', '이하인 자연수 가운데 두 자리 수', '①7', (d) => {
      const b = d.int(12, 19);
      return N(`${b} 이하인 자연수 중 두 자리 수는 모두 몇 개인가?`, b - 9, { unit: '개', explain: `${b} 이하인 두 자리 수는 ${ints(10, b).join(', ')}이다. ${b}도 포함된다.`, facts: { count: ints(1, b + 3).map((v) => v >= 10 && holds(v, 'le', b)) } });
    }),
    T('mean-nat-end', '범위에 드는 자연수 가운데 끝의 수', '②7 심22', (d, n) => {
      const b = d.int(21, 95);
      if (n === 0) return N(`${b} 초과인 자연수 중 가장 작은 수는?`, b + 1, { explain: `${b} 초과인 수에 ${josa(b, '은/는')} 포함되지 않는다. ${b}보다 큰 자연수 중 가장 작은 수는 ${b + 1}이다.`, facts: { calc: [[`${b}+1`, 0]], unseen: [1] } });
      return N(`${b} 미만인 자연수 중 가장 큰 수는?`, b - 1, { explain: `${b} 미만인 수에 ${josa(b, '은/는')} 포함되지 않는다. ${b}보다 작은 자연수 중 가장 큰 수는 ${b - 1}이다.`, facts: { calc: [[`${b}-1`, 0]], unseen: [1] } });
    }, { count: 2 }),
    T('mean-bound-from-list', '늘어놓은 자연수를 보고 경계의 수 찾기', '①8 심8', (d) => {
      const s = d.int(8, 60);
      if (d.bool()) return N('㉠ 초과인 자연수를 작은 수부터 차례로 쓴 것이다. ㉠에 알맞은 자연수는?', s - 1, { figure: numbers([s, s + 1, s + 2, s + 3, '…']), explain: `가장 작은 수가 ${s}이다. ㉠ 초과인 수에 ㉠은 포함되지 않으므로 ㉠은 ${s}보다 1 작은 ${s - 1}이다.`, facts: { calc: [[`${s}-1`, 0]], unseen: [1] } });
      return N('㉠ 미만인 자연수를 큰 수부터 차례로 쓴 것이다. ㉠에 알맞은 자연수는?', s + 1, { figure: numbers([s, s - 1, s - 2, s - 3, '…']), explain: `가장 큰 수가 ${s}이다. ㉠ 미만인 수에 ㉠은 포함되지 않으므로 ㉠은 ${s}보다 1 큰 ${s + 1}이다.`, facts: { calc: [[`${s}+1`, 0]], unseen: [1] } });
    }),
    T('mean-bound-all', '수를 모두 포함하는 범위의 경계', '①8 ②11', (d, n) => {
      const list = some(d, ints(21, 69), 5), lo = Math.min(...list), hi = Math.max(...list);
      if (n === 0) return N('다음 수는 모두 □ 미만인 수이다. □ 안에 들어갈 수 있는 자연수 중 가장 작은 수는?', hi + 1, { figure: numbers(list), explain: `가장 큰 수 ${hi}까지 포함되어야 한다. □ 미만인 수에 □는 포함되지 않으므로 □는 ${hi}보다 커야 하고, 가장 작은 수는 ${hi + 1}이다.`, facts: { calc: [[`${hi}+1`, 0]], unseen: [1] } });
      return N('다음 수는 모두 □ 이상인 수이다. □ 안에 들어갈 수 있는 자연수 중 가장 큰 수는?', lo, { figure: numbers(list), explain: `가장 작은 수 ${lo}까지 포함되어야 한다. □ 이상인 수에 □도 포함되므로 □ 안에 들어갈 수 있는 가장 큰 수는 ${lo}이다.`, facts: { minOf: list } });
    }, { count: 2 }),
    T('mean-cover', '수를 모두 포함하는 한쪽 범위', '②10 심20', (d) => {
      const list = some(d, ints(21, 59), 5), lo = Math.min(...list), hi = Math.max(...list), mid = asc(list)[2], upper = d.bool();
      const cands = upper ? [['lt', hi + 1], ['lt', hi], ['gt', lo], ['ge', mid]] : [['ge', lo], ['gt', lo], ['lt', hi], ['le', mid]];
      return CT('다음 수를 모두 포함하는 수의 범위는?', d.shuffle(cands.map(([kind, b]) => [`${b} ${W[kind]}인 수`, list.every((v) => holds(v, kind, b))])), true, {
        figure: numbers(list), explain: upper ? `가장 큰 수가 ${hi}이다. ${hi + 1} 미만인 수는 ${hi + 1}보다 작은 수이므로 다섯 수가 모두 포함된다. ${hi} 미만인 수에는 ${josa(hi, '이/가')} 포함되지 않는다.` : `가장 작은 수가 ${lo}이다. ${lo} 이상인 수에는 ${lo}도 포함되므로 다섯 수가 모두 포함된다. ${lo} 초과인 수에는 ${josa(lo, '이/가')} 포함되지 않는다.`
      });
    })
  ]);

  // ── 두 끝이 있는 수의 범위 ───────────────────────────────────
  B.addTypes(U, 'both', [
    T('both-word', '두 끝이 있는 범위의 뜻', '②1', (d) => {
      const [lo, hi] = d.pick(COMBOS), a = d.int(3, 30), b = a + d.int(4, 12);
      const phrase = `${lo === 'ge' ? `${josa(a, '과/와')} 같거나 크고` : `${a}보다 크고`} ${hi === 'le' ? `${josa(b, '과/와')} 같거나 작은 수` : `${b}보다 작은 수`}`;
      return CT('다음을 수의 범위로 바르게 나타낸 것은?', d.shuffle(COMBOS.map(([l, h]) => [`${a} ${W[l]} ${b} ${W[h]}인 수`, l === lo && h === hi])), true, {
        figure: lines([phrase]), explain: `${lo === 'ge' ? `${josa(a, '과/와')} 같거나 큰 수는 ${a} 이상인 수` : `${a}보다 큰 수는 ${a} 초과인 수`}이고, ${hi === 'le' ? `${josa(b, '과/와')} 같거나 작은 수는 ${b} 이하인 수` : `${b}보다 작은 수는 ${b} 미만인 수`}이다.`
      });
    }),
    T('both-in-set', '두 끝 범위에 드는 수 모두 고르기', '①15 ②5 ③7', (d) => {
      const [lo, hi] = d.pick(COMBOS), a = d.int(20, 60), b = a + d.int(5, 8), r = { lo, a, hi, b };
      const list = d.shuffle([a, b].concat(some(d, ints(a + 1, b - 1), 2), [d.bool() ? a - d.int(1, 4) : b + d.int(1, 5)])), flags = list.map((v) => inside(v, r));
      return setItem(d, `${two(r)}인 수를 모두 고른 것은?`, list, flags, list.indexOf(lo === 'gt' ? a : hi === 'lt' ? b : a), {
        figure: numbers(list), explain: `${a} ${W[lo]}인 수에 ${josa(a, '은/는')} 포함${lo === 'ge' ? '되고' : '되지 않고'}, ${b} ${W[hi]}인 수에 ${josa(b, '은/는')} 포함${hi === 'le' ? '된다' : '되지 않는다'}. 범위에 드는 수는 ${list.filter((_, i) => flags[i]).join(', ')}이다.`
      });
    }),
    T('both-in-count', '소수가 섞인 수에서 두 끝 범위에 드는 수의 개수', '①15 ②3 ③7', (d) => {
      const [lo, hi] = d.pick(COMBOS), a = d.int(20, 60), b = a + d.int(5, 8), r = { lo, a, hi, b }, k = () => d.int(1, 9);
      const list = d.shuffle([String(a), String(b), `${a - 1}.${k()}`, `${b}.${k()}`, `${a + d.int(1, 3)}.${k()}`, String(a + d.int(1, b - a - 1)), String(b + d.int(3, 30)), `${a}.${k()}`]), hit = list.filter((t) => inside(Number(t), r));
      return N(`${two(r)}인 수는 모두 몇 개인가?`, hit.length, {
        unit: '개', figure: numbers(list), explain: `${a} ${W[lo]}인 수에 ${josa(a, '은/는')} 포함${lo === 'ge' ? '되고' : '되지 않고'}, ${b} ${W[hi]}인 수에 ${josa(b, '은/는')} 포함${hi === 'le' ? '된다' : '되지 않는다'}. 범위에 드는 수는 ${hit.join(', ')}이다.`, facts: { count: list.map((t) => inside(Number(t), r)) }
      });
    }),
    T('both-only-set', '두 끝 범위에 드는 수로만 이루어진 것', '②4', (d) => {
      const [lo, hi] = d.pick(COMBOS.slice(1)), a = d.int(20, 60), b = a + d.int(7, 10), r = { lo, a, hi, b }, mid = () => d.int(a + 1, b - 1);
      // 맞는 묶음에는 범위에 드는 끝의 수가 (있으면) 들어 있고, 틀린 묶음에는 범위에 들지 않는 끝의 수나 범위 밖의 수가 하나씩 들어 있다.
      const good = lo === 'ge' ? a : hi === 'le' ? b : mid(), bad = lo === 'gt' ? a : b;
      const sets = d.until(() => [[good, mid(), mid()], [bad, mid(), mid()], [a - d.int(1, 2), mid(), mid()], [mid(), mid(), b + d.int(1, 2)]].map(asc), (list) => new Set(list.map(String)).size === 4 && list.every((one) => new Set(one).size === 3));
      return CT(`${two(r)}인 수로만 이루어진 것은?`, d.shuffle(sets.map((one) => [one.join(', '), one.every((v) => inside(v, r))])), true, {
        explain: `${a} ${W[lo]}인 수에 ${josa(a, '은/는')} 포함${lo === 'ge' ? '되고' : '되지 않고'}, ${b} ${W[hi]}인 수에 ${josa(b, '은/는')} 포함${hi === 'le' ? '된다' : '되지 않는다'}. ${sets[0].join(', ')}만 모두 범위에 든다.`
      });
    }),
    T('both-contains', '어떤 수를 포함하는 두 끝 범위 모두 고르기', '①6 ②9 ③10 심19', (d) => {
      const n = d.int(30, 70), k = () => d.int(2, 5), any = (list) => d.pick(list);
      // 그 수가 드는 끝에 놓인 범위, 들지 않는 끝에 놓인 범위, 안쪽에 놓인 범위, 바깥에 놓인 범위에서 넷을 고른다.
      const POOL = [() => ({ lo: 'ge', a: n, hi: any(['le', 'lt']), b: n + k() }), () => ({ lo: 'gt', a: n, hi: any(['le', 'lt']), b: n + k() }), () => ({ lo: any(['ge', 'gt']), a: n - k(), hi: 'le', b: n }),
        () => ({ lo: any(['ge', 'gt']), a: n - k(), hi: 'lt', b: n }), () => ({ lo: any(['ge', 'gt']), a: n - k(), hi: any(['le', 'lt']), b: n + k() }), () => ({ lo: any(['ge', 'gt']), a: n + 1, hi: any(['le', 'lt']), b: n + 1 + k() })];
      const rows = d.until(() => some(d, POOL, 4).map((make) => make()), (list) => { const hit = list.filter((r) => inside(n, r)).length; return hit >= 1 && hit <= 3 && list.some((r) => !inside(n, r) && (r.a === n || r.b === n)) && new Set(list.map((r) => two(r))).size === 4; });
      const flags = rows.map((r) => inside(n, r));
      return setItem(d, `${josa(n, '을/를')} 포함하는 수의 범위를 모두 고른 것은?`, LABELS, flags, rows.findIndex((r) => !inside(n, r) && (r.a === n || r.b === n)), {
        figure: tagged(rows.map((r) => `${two(r)}인 수`)), explain: `${n} 이상, ${n} 이하에는 ${josa(n, '이/가')} 포함되고 ${n} 초과, ${n} 미만에는 포함되지 않는다. ${josa(n, '을/를')} 포함하는 범위는 ${LABELS.filter((_, i) => flags[i]).join(', ')}이다.`
      });
    }),
    T('both-nat-count', '두 끝 범위에 드는 자연수의 개수', '①16 ②6 ③9 심21', (d, n) => {
      const a = d.int(11, 80), b = a + d.int(4, 9);
      if (n === 0) return N(`${a} 이상 ${b} 이하인 자연수는 모두 몇 개인가?`, b - a + 1, { unit: '개', explain: `${josa(a, '과/와')} ${b}도 포함된다. ${a}부터 ${b}까지의 자연수는 ${b} − ${a} + 1 = ${b - a + 1}(개)이다.`, facts: { calc: [[`${b}-${a}+1`, 0]], unseen: [1] } });
      return N(`${a} 초과 ${b} 미만인 자연수는 모두 몇 개인가?`, b - a - 1, { unit: '개', explain: `${josa(a, '과/와')} ${josa(b, '은/는')} 포함되지 않는다. ${a + 1}부터 ${b - 1}까지의 자연수는 ${b - a - 1}개이다.`, facts: { calc: [[`${b}-${a}-1`, 0]], unseen: [1] } });
    }, { count: 2 }),
    T('both-nat-sum', '두 끝 범위에 드는 자연수의 합', '①17 ②8', (d) => {
      const [lo, hi] = d.pick(COMBOS.slice(1)), a = d.int(6, 30), b = a + d.int(4, 5), r = { lo, a, hi, b }, list = ints(a, b).filter((v) => inside(v, r));
      return N(`${two(r)}인 자연수를 모두 더한 값은?`, sum(list), { explain: `범위에 드는 자연수는 ${list.join(', ')}이다. ${list.join(' + ')} = ${sum(list)}`, facts: { calc: [[list.join('+'), 0]], unseen: list.filter((v) => v !== a && v !== b) } });
    }),
    T('both-nat-deci-bound', '경계가 소수인 범위에 드는 자연수의 개수', '③8', (d) => {
      const a = d.int(11, 60), b = a + d.int(3, 5), k = d.int(1, 9), low = d.bool();
      const r = low ? { lo: d.pick(['ge', 'gt']), a: Number(`${a}.${k}`), hi: d.pick(['le', 'lt']), b } : { lo: d.pick(['ge', 'gt']), a, hi: d.pick(['le', 'lt']), b: Number(`${b}.${k}`) }, list = ints(a - 1, b + 2).filter((v) => inside(v, r));
      return N(`${two(r)}인 자연수는 모두 몇 개인가?`, list.length, { unit: '개', explain: low ? `${r.a}보다 큰 자연수 중 가장 작은 수는 ${a + 1}이다. 범위에 드는 자연수는 ${list.join(', ')}이다.` : `${r.b}보다 작은 자연수 중 가장 큰 수는 ${b}이다. 범위에 드는 자연수는 ${list.join(', ')}이다.`, facts: { count: ints(a - 1, b + 2).map((v) => inside(v, r)) } });
    }),
    T('both-odd-count', '두 끝 범위에 드는 홀수·짝수의 개수', '①18', (d) => {
      const [lo, hi] = d.pick(COMBOS), a = d.int(20, 70), b = a + d.int(9, 14), r = { lo, a, hi, b }, odd = d.bool(), list = ints(a, b).filter((v) => inside(v, r) && (v % 2 === 1) === odd);
      return N(`${two(r)}인 자연수 중 ${odd ? '홀수' : '짝수'}는 모두 몇 개인가?`, list.length, { unit: '개', explain: `범위에 드는 ${odd ? '홀수' : '짝수'}는 ${list.join(', ')}이다.`, facts: { count: ints(a - 1, b + 1).map((v) => inside(v, r) && (v % 2 === 1) === odd) } });
    }),
    T('both-deci2-count', '두 끝 범위에 드는 소수 두 자리 수', '①19 ③11 심18', (d) => {
      // 소수 둘째 자리가 0이 되는 수(9.40)는 넘지 않게 한다. 수는 100배 한 자연수로 셈한다.
      const [lo, hi] = d.pick(COMBOS), w = d.int(1, 30), t = d.int(0, 9), from = d.int(1, 4), g = d.int(4, 9 - from), h = w * 100 + t * 10 + from, r = { lo, a: h, hi, b: h + g };
      const fx = (v) => `${Math.floor(v / 100)}.${String(v % 100).padStart(2, '0')}`, list = ints(h, h + g).filter((v) => inside(v, r));
      return N(`${fx(h)} ${W[lo]} ${fx(h + g)} ${W[hi]}인 소수 두 자리 수는 모두 몇 개인가?`, list.length, { unit: '개', explain: `범위에 드는 소수 두 자리 수는 ${list.map(fx).join(', ')}이다.`, facts: { count: ints(h - 1, h + g + 1).map((v) => inside(v, r)) } });
    }),
    T('both-common-count', '두 범위에 공통으로 드는 자연수', '①20 ②14 ③12', (d) => {
      const a = d.int(10, 40), c = a + d.int(2, 3), b = c + d.int(2, 4), e = b + d.int(2, 4), r1 = { lo: d.pick(['ge', 'gt']), a, hi: d.pick(['le', 'lt']), b }, r2 = { lo: d.pick(['ge', 'gt']), a: c, hi: d.pick(['le', 'lt']), b: e };
      const list = ints(a, e).filter((v) => inside(v, r1) && inside(v, r2));
      return N(`「${two(r1)}인 수」와 「${two(r2)}인 수」에 공통으로 포함되는 자연수는 모두 몇 개인가?`, list.length, {
        unit: '개', explain: `두 범위에 모두 드는 수는 ${c} ${W[r2.lo]} ${b} ${W[r1.hi]}인 수이다. 이 범위의 자연수는 ${list.join(', ')}이다.`, facts: { count: ints(a - 1, e + 1).map((v) => inside(v, r1) && inside(v, r2)) }
      });
    }),
    T('both-bounds-from-list', '늘어놓은 자연수를 보고 두 경계의 수 찾기', '①8 ②11', (d) => {
      const [lo, hi] = d.pick(COMBOS.slice(1)), s = d.int(12, 80), list = ints(s, s + 5), e = s + 5;
      return M(`다음은 ㉠ ${W[lo]} ㉡ ${W[hi]}인 자연수를 모두 쓴 것이다. ㉠, ㉡에 알맞은 자연수는?`, [{ label: LABELS[0], answer: lo === 'gt' ? s - 1 : s }, { label: LABELS[1], answer: hi === 'lt' ? e + 1 : e }], {
        figure: numbers(list), explain: `${lo === 'gt' ? `㉠ 초과인 수에 ㉠은 포함되지 않으므로 ㉠은 ${s}보다 1 작은 ${s - 1}이다.` : `㉠ 이상인 수에 ㉠도 포함되므로 ㉠은 ${s}이다.`} ${hi === 'lt' ? `㉡ 미만인 수에 ㉡은 포함되지 않으므로 ㉡은 ${e}보다 1 큰 ${e + 1}이다.` : `㉡ 이하인 수에 ㉡도 포함되므로 ㉡은 ${e}이다.`}`,
        facts: { calc: [[lo === 'gt' ? `${s}-1` : `${s}`, 0], [hi === 'lt' ? `${e}+1` : `${e}`, 1]], unseen: [1] }
      });
    }),
    T('both-cover', '자료를 모두 포함하는 범위', '①31 ②10 ③13', (d) => {
      const list = some(d, ints(8, 29), 5), m = Math.min(...list), x = Math.max(...list);
      const right = d.pick([{ lo: 'ge', a: m, hi: 'le', b: x }, { lo: 'gt', a: m - 1, hi: 'le', b: x }, { lo: 'ge', a: m, hi: 'lt', b: x + 1 }]);
      const rows = [right, { lo: 'gt', a: m, hi: 'le', b: x }, { lo: 'ge', a: m, hi: 'lt', b: x }, { lo: 'gt', a: m - 1, hi: 'lt', b: x }].map((r) => [two(r, '권'), list.every((v) => inside(v, r))]);
      return CT('학생 5명이 한 달 동안 읽은 책의 수이다. 5명이 읽은 책의 수를 모두 포함하는 범위는?', d.shuffle(rows), true, {
        figure: numbers(list.map((v) => v + '권')), explain: `가장 적은 수는 ${m}권, 가장 많은 수는 ${x}권이다. ${m}권과 ${x}권이 모두 포함되는 범위는 「${two(right, '권')}」이다.`
      });
    })
  ]);

  // ── 수의 범위와 수직선 ───────────────────────────────────────
  B.addTypes(U, 'line', [
    T('line-read-one', '수직선에 나타낸 한쪽 범위 읽기', '①9 ②18 ③15·17 심14', (d) => {
      const kind = d.pick(KINDS), s = d.int(11, 60), ticks = ints(s, s + 5), at = d.int(1, 4), b = ticks[at];
      return CT('수직선에 나타낸 수의 범위는?', d.shuffle(KINDS.map((k) => [`${b} ${W[k]}인 수`, k === kind])), true, {
        figure: oneLine(ticks, at, kind), explain: `${b}에 ${closed(kind) ? '●' : '○'}로 표시했으므로 ${josa(b, '은/는')} 포함${closed(kind) ? '된다' : '되지 않는다'}. 굵은 선이 ${kind === 'ge' || kind === 'gt' ? '오른쪽' : '왼쪽'}으로 뻗으므로 ${b} ${W[kind]}인 수이다.`
      });
    }),
    T('line-read-two', '수직선에 나타낸 두 끝 범위 읽기', '①9 ②19 ③16·18 심14', (d) => {
      const [lo, hi] = d.pick(COMBOS), s = d.int(11, 60), ticks = ints(s, s + 6), i = d.int(1, 2), j = i + d.int(2, 3), a = ticks[i], b = ticks[j];
      return CT(`수직선에 나타낸 수의 범위를 「${a} ㉠ ${b} ㉡인 수」라고 할 때 ㉠, ㉡에 알맞은 말을 차례로 쓴 것은?`, d.shuffle(COMBOS.map(([l, h]) => [`${W[l]}, ${W[h]}`, l === lo && h === hi])), true, {
        figure: twoLine(ticks, i, j, lo, hi), explain: `${a}에 ${lo === 'ge' ? '●' : '○'}로 표시했으므로 ${a} ${W[lo]}이고, ${b}에 ${hi === 'le' ? '●' : '○'}로 표시했으므로 ${b} ${W[hi]}이다. ●는 그 수가 포함되고 ○는 포함되지 않는다는 표시이다.`
      });
    }),
    T('line-read-half', '작은 눈금이 있는 수직선의 범위 읽기', '②19 ③16·17', (d) => {
      const [lo, hi] = d.pick(COMBOS), s = d.int(3, 40), ticks = ints(s, s + 4), i = d.int(0, 1), j = i + d.int(1, 2), a = `${s + i}.5`, b = `${s + j}.5`;
      const form = (l, x, h, y) => `${x} ${W[l]} ${y} ${W[h]}인 수`, flip = { ge: 'gt', gt: 'ge', le: 'lt', lt: 'le' };
      // 틀린 보기: ●와 ○를 거꾸로 읽은 것, 작은 눈금을 보지 않고 왼쪽·오른쪽 큰 눈금으로 읽은 것
      const rows = [[form(lo, a, hi, b), true], [form(flip[lo], a, flip[hi], b), false], [form(lo, s + i, hi, s + j), false], [form(lo, s + i + 1, hi, s + j + 1), false]];
      return CT('수직선에 나타낸 수의 범위로 알맞은 것은?', d.shuffle(rows), true, {
        figure: rangeLine(ticks, { at: i + 0.5, on: lo === 'ge', text: a }, { at: j + 0.5, on: hi === 'le', text: b }, { half: true }),
        explain: `큰 눈금 한 칸이 1이고 그 사이를 둘로 나누었으므로 작은 눈금 한 칸은 0.5이다. 두 끝은 ${dj(a, '과/와')} ${b}이고, ●는 포함, ○는 포함되지 않는다는 표시이므로 ${form(lo, a, hi, b)}이다.`
      });
    }),
    T('line-draw-one', '한쪽 범위를 바르게 나타낸 수직선', '①10·11 ②22·23 ③20 심13', (d) => {
      const kind = d.pick(KINDS), b = d.int(12, 80), at = d.int(1, 3), ticks = ints(b - at, b - at + 4), order = d.shuffle(KINDS);
      return CT(`${b} ${W[kind]}인 수를 수직선에 바르게 나타낸 것은?`, LABELS.map((label, i) => [label, order[i] === kind]), true, {
        figure: stack(order.map((k, i) => oneLine(ticks, at, k, LABELS[i]))), explain: `${mean(kind, b)} ${josa(b, '이/가')} 포함${closed(kind) ? '되므로 ●' : '되지 않으므로 ○'}로 표시하고, ${kind === 'ge' || kind === 'gt' ? '오른쪽' : '왼쪽'}으로 선을 긋는다.`
      });
    }),
    T('line-draw-two', '두 끝 범위를 바르게 나타낸 수직선', '①10·11 ②22·23 ③21·22 심13·15', (d) => {
      const [lo, hi] = d.pick(COMBOS), a = d.int(12, 80), b = a + d.int(3, 4), ticks = ints(a - 1, b + 1), order = d.shuffle(COMBOS), r = { lo, a, hi, b };
      return CT(`${two(r)}인 수를 수직선에 바르게 나타낸 것은?`, LABELS.map((label, i) => [label, order[i][0] === lo && order[i][1] === hi]), true, {
        figure: stack(order.map(([l, h], i) => twoLine(ticks, 1, b - a + 1, l, h, LABELS[i]))), explain: `${a} ${W[lo]}이므로 ${a}에 ${lo === 'ge' ? '●' : '○'}, ${b} ${W[hi]}이므로 ${b}에 ${hi === 'le' ? '●' : '○'}로 표시하고 그 사이에 선을 긋는다.`
      });
    }),
    T('line-not-in', '수직선의 범위에 포함되지 않는 수', '①12 ②20 ③19 심16', (d) => {
      const [lo, hi] = d.pick([['gt', 'le'], ['ge', 'lt']]), a = d.int(12, 80), b = a + 4, r = { lo, a, hi, b }, out = lo === 'gt' ? a : b;
      return CT('수직선에 나타낸 수의 범위에 포함되지 않는 수는?', ints(a, b).map((v) => [String(v), inside(v, r)]), false, {
        figure: twoLine(ints(a - 1, b + 1), 1, 5, lo, hi), explain: `수직선은 ${two(r)}인 수를 나타낸다. ${out}에는 ○로 표시했으므로 ${josa(out, '은/는')} 포함되지 않는다.`
      });
    }),
    T('line-in-set', '수직선의 범위에 포함되는 수 모두 고르기', '①12 ②20 ③19 심16', (d) => {
      const [lo, hi] = d.pick(COMBOS.slice(1)), a = d.int(12, 80), b = a + 4, r = { lo, a, hi, b }, k = () => d.int(1, 9);
      const list = d.shuffle([String(a), String(b), `${a}.${k()}`, String(a + d.int(1, 3)), `${b}.${k()}`, `${a - 1}.${k()}`]), flags = list.map((t) => inside(Number(t), r));
      return setItem(d, '수직선에 나타낸 수의 범위에 포함되는 수를 모두 고른 것은?', list, flags, list.indexOf(String(lo === 'gt' ? a : b)), {
        figure: twoLine(ints(a - 1, b + 1), 1, 5, lo, hi) + numbers(list), explain: `수직선은 ${two(r)}인 수를 나타낸다. 이 범위에 포함되는 수는 ${list.filter((_, i) => flags[i]).join(', ')}이다.`
      });
    }),
    T('line-nat-ends', '수직선의 범위에 드는 자연수 가운데 가장 큰 수와 가장 작은 수', '②21 심22', (d) => {
      const [lo, hi] = d.pick(COMBOS.slice(1)), a = d.int(12, 80), b = a + d.int(4, 5), big = hi === 'le' ? b : b - 1, small = lo === 'ge' ? a : a + 1;
      return M('수직선에 나타낸 수의 범위에 포함되는 자연수 중 가장 큰 수와 가장 작은 수는?', [{ label: '가장 큰 수', answer: big }, { label: '가장 작은 수', answer: small }], {
        figure: twoLine(ints(a - 1, b + 1), 1, b - a + 1, lo, hi), explain: `수직선은 ${two({ lo, a, hi, b })}인 수를 나타낸다. ${b}에 ${hi === 'le' ? '●' : '○'}로 표시했으므로 가장 큰 자연수는 ${big}, ${a}에 ${lo === 'ge' ? '●' : '○'}로 표시했으므로 가장 작은 자연수는 ${small}이다.`,
        facts: { calc: [[hi === 'le' ? `${b}` : `${b}-1`, 0], [lo === 'ge' ? `${a}` : `${a}+1`, 1]], unseen: [1] }
      });
    }),
    T('line-say', '수직선을 보고 한 설명', '①11 ②22', (d) => {
      const [lo, hi] = d.pick(COMBOS), a = d.int(12, 80), b = a + d.int(4, 5), r = { lo, a, hi, b }, t = d.int(0, 3), count = ints(a, b).filter((v) => inside(v, r)).length;
      const wrong = d.pick(COMBOS.filter(([l, h]) => l !== lo || h !== hi)), slip = count === b - a ? b - a + 1 : b - a;
      const claim = (v, actual, on) => { const says = on ? actual : !actual; return [`${josa(v, '은/는')} 이 범위에 포함${says ? '된다' : '되지 않는다'}.`, says === actual]; };
      const rows = [claim(a, lo === 'ge', t === 0), claim(b, hi === 'le', t === 1), t === 2 ? [`${two(r)}인 수를 나타낸다.`, true] : [`${two({ lo: wrong[0], a, hi: wrong[1], b })}인 수를 나타낸다.`, false],
        [`이 범위에 포함되는 자연수는 모두 ${t === 3 ? count : slip}개이다.`, t === 3]];
      return CT('수직선을 보고 바르게 설명한 것은?', d.shuffle(rows), true, {
        figure: twoLine(ints(a - 1, b + 1), 1, b - a + 1, lo, hi), explain: `수직선은 ${two(r)}인 수를 나타낸다. ●로 표시한 수는 포함되고 ○로 표시한 수는 포함되지 않으므로 ${josa(a, '은/는')} 포함${lo === 'ge' ? '되고' : '되지 않고'}, ${b}${lo === 'ge' === (hi === 'le') ? '도' : josa(b, '은/는').slice(String(b).length)} 포함${hi === 'le' ? '된다' : '되지 않는다'}. 범위에 포함되는 자연수는 ${count}개이다.`
      });
    }),
    T('line-life-draw', '생활 속 기준을 바르게 나타낸 수직선', '①13 ②23 ③23', (d) => {
      const S = d.pick([
        { kind: 'ge', bs: [110, 120, 130, 140], step: 10, text: (b) => `「이 놀이 기구는 키가 ${b} cm 이상인 사람만 탈 수 있다.」 탈 수 있는 키의 범위를 수직선에 바르게 나타낸 것은?`, why: (b) => `키가 ${b} cm인 사람도 탈 수 있으므로 ${b}에 ●로 표시하고 오른쪽으로 선을 긋는다.` },
        { kind: 'gt', bs: [15, 20, 25, 30], step: 5, text: (b) => `「무게가 ${b} kg을 초과하는 짐은 요금을 더 내야 한다.」 요금을 더 내야 하는 짐의 무게의 범위를 수직선에 바르게 나타낸 것은?`, why: (b) => `무게가 ${b} kg인 짐은 요금을 더 내지 않으므로 ${b}에 ○로 표시하고 오른쪽으로 선을 긋는다.` },
        { kind: 'le', bs: [35, 40, 45, 50], step: 5, text: (b) => `「이 그네는 몸무게가 ${b} kg 이하인 사람만 탈 수 있다.」 탈 수 있는 몸무게의 범위를 수직선에 바르게 나타낸 것은?`, why: (b) => `몸무게가 ${b} kg인 사람도 탈 수 있으므로 ${b}에 ●로 표시하고 왼쪽으로 선을 긋는다.` },
        { kind: 'lt', bs: [3, 4, 5], step: 1, text: (b) => `「이 터널은 높이가 ${b} m 미만인 차만 지나갈 수 있다.」 지나갈 수 있는 차의 높이의 범위를 수직선에 바르게 나타낸 것은?`, why: (b) => `높이가 ${b} m인 차는 지나갈 수 없으므로 ${b}에 ○로 표시하고 왼쪽으로 선을 긋는다.` }
      ]);
      const b = d.pick(S.bs), ticks = [-2, -1, 0, 1, 2].map((i) => b + i * S.step), order = d.shuffle(KINDS);
      return CT(S.text(b), LABELS.map((label, i) => [label, order[i] === S.kind]), true, { figure: stack(order.map((k, i) => oneLine(ticks, 2, k, LABELS[i]))), explain: S.why(b) });
    })
  ]);

  // ── 생활 속 수의 범위 ─────────────────────────────────────────
  // 구간으로 나눈 표: 줄마다 { name, lo, a, hi, b }(끝이 없는 쪽은 lo 나 hi 가 없다)
  const inRow = (v, row) => (row.lo ? holds(v, row.lo, row.a) : true) && (row.hi ? holds(v, row.hi, row.b) : true);
  const rowText = (row, unit) => (row.lo && row.hi ? two(row, unit) : row.lo ? `${amt(row.a, unit)} ${W[row.lo]}` : `${amt(row.b, unit)} ${W[row.hi]}`);
  // 씨름 체급(몸무게): 초과–이하로 나눈다.
  const CLASSES = [{ name: '경장급', hi: 'le', b: 40 }, { name: '소장급', lo: 'gt', a: 40, hi: 'le', b: 45 }, { name: '청장급', lo: 'gt', a: 45, hi: 'le', b: 50 }, { name: '용장급', lo: 'gt', a: 50, hi: 'le', b: 55 }];
  // 달걀 등급(무게): 이상–미만으로 나눈다.
  const EGGS = [{ name: '왕란', lo: 'ge', a: 68 }, { name: '특란', lo: 'ge', a: 60, hi: 'lt', b: 68 }, { name: '대란', lo: 'ge', a: 52, hi: 'lt', b: 60 }, { name: '중란', lo: 'ge', a: 44, hi: 'lt', b: 52 }, { name: '소란', hi: 'lt', b: 44 }];
  const classTable = (rows) => table(['체급', '몸무게'], rows.map((row) => [row.name, rowText(row, 'kg')]));
  // 5-2-1b.js 와 함께 쓰는 도구
  B.kit.range521 = { TAGS, ints, some, asc, sum, pickNames, W, KINDS, COMBOS, holds, inside, closed, amt, two, dj, truthOf, CT, setOptions, setItem, rangeLine, oneLine, twoLine, stack, listTable, inRow, rowText };
  B.addTypes(U, 'life', [
    T('life-one-set', '기준 이상인 사람 모두 고르기', '①23 ②24 ③25 심3', (d) => {
      const b = d.pick([110, 120, 130, 140]), who = pickNames(d, 5), k = () => d.int(1, 9);
      const hs = d.shuffle([String(b), `${b - d.int(1, 6)}.${k()}`, String(b + d.int(3, 12)), String(b - d.int(4, 9)), `${b + d.int(0, 5)}.${k()}`]), flags = hs.map((h) => holds(Number(h), 'ge', b));
      return setItem(d, `키가 ${b} cm 이상인 사람만 탈 수 있는 놀이 기구가 있다. 이 놀이 기구를 탈 수 있는 학생을 모두 고른 것은?`, who, flags, hs.indexOf(String(b)), {
        figure: table(['이름', '키(cm)'], who.map((w, i) => [w, hs[i]])), explain: `키가 ${b} cm와 같거나 큰 학생을 찾는다. 키가 ${b} cm인 ${nick(who[hs.indexOf(String(b))])}도 탈 수 있다. 탈 수 있는 학생은 ${who.filter((_, i) => flags[i]).join(', ')}이다.`
      });
    }),
    T('life-one-count', '기준 미만인 사람 수', '①23 ③26·28 심3', (d) => {
      const b = d.int(16, 19), who = pickNames(d, 6), k = () => d.int(1, 9);
      const recs = d.shuffle([`${b}.0`, `${b - 1}.${k()}`, `${b}.${k()}`, `${b - 2}.${k()}`, `${b + 1}.${k()}`, d.bool() ? `${b - 1}.0` : `${b + 2}.0`]), hit = who.filter((_, i) => Number(recs[i]) < b);
      return N(`학생 6명의 50 m 달리기 기록이다. 기록이 ${b}초 미만인 학생은 모두 몇 명인가?`, hit.length, {
        unit: '명', figure: listTable(['이름', '기록(초)'], who.map((w, i) => [w, recs[i]])), explain: `${b}초 미만은 ${b}초보다 짧은 기록이다. 기록이 ${b}.0초인 학생은 포함되지 않는다. ${b}초 미만인 학생은 ${hit.join(', ')}이다.`, facts: { count: recs.map((t) => holds(Number(t), 'lt', b)) }
      });
    }),
    T('life-both-sides', '같은 기준의 이상과 이하', '①23', (d) => {
      // 기준과 같은 값은 이상에도 이하에도 든다.
      const b = d.pick([20, 25, 30, 35]), who = pickNames(d, 6), list = d.shuffle([b, d.bool() ? b : b + d.int(6, 9), b + d.int(1, 5), b - d.int(1, 4), b - d.int(5, 9), b + d.int(1, 5)]), up = list.filter((v) => v >= b).length, down = list.filter((v) => v <= b).length;
      const floor = (v, by) => `(${v}-${v}%${by})/${by}`;
      return M(`학생 6명이 모은 붙임딱지의 수이다. 붙임딱지를 ${b}장 이상 모은 학생과 ${b}장 이하 모은 학생은 각각 몇 명인가?`, [{ label: `${b}장 이상`, answer: up, unit: '명' }, { label: `${b}장 이하`, answer: down, unit: '명' }], {
        figure: listTable(['이름', '수(장)'], who.map((w, i) => [w, String(list[i])])), explain: `${b}장을 모은 학생은 ${b}장 이상에도, ${b}장 이하에도 포함된다. ${b}장 이상은 ${who.filter((_, i) => list[i] >= b).join(', ')}, ${b}장 이하는 ${who.filter((_, i) => list[i] <= b).join(', ')}이다.`,
        facts: { calc: [[list.map((v) => floor(v, b)).join('+'), 0], [`6-(${list.map((v) => floor(v, b + 1)).join('+')})`, 1]], unseen: [6, b + 1] }
      });
    }),
    T('life-not-over', '초과하면 안 되는 기준', '①25 ②24', (d) => {
      const b = d.pick([10, 15, 20]), k = () => d.int(1, 9), ws = d.shuffle([String(b), `${b}.${k()}`, `${b - 1}.${k()}`, `${b + d.int(1, 3)}.${k()}`, `${b - d.int(2, 4)}.${k()}`]), flags = ws.map((w) => holds(Number(w), 'le', b));
      return setItem(d, `무게가 ${b} kg을 초과하는 가방은 들고 탈 수 없는 비행기가 있다. 들고 탈 수 있는 가방을 모두 고른 것은?`, TAGS, flags, ws.indexOf(String(b)), {
        figure: table(['가방', '무게(kg)'], ws.map((w, i) => [TAGS[i], w])), explain: `${b} kg을 초과하는 무게는 ${b} kg보다 무거운 무게이다. 무게가 ${b} kg인 가방은 들고 탈 수 있다. 들고 탈 수 있는 가방은 ${TAGS.filter((_, i) => flags[i]).join(', ')}이다.`
      });
    }),
    T('life-pay-count', '미만은 내지 않을 때 내는 사람 수', '②24', (d) => {
      const b = d.pick([7, 8, 12, 13]), who = pickNames(d, 5), ages = d.shuffle([b, b - 1, b + d.int(1, 2), b - d.int(2, 4), b + d.int(3, 5)]), pay = who.filter((_, i) => ages[i] >= b);
      return N(`나이가 ${b}세 미만이면 입장료를 내지 않는 박물관에 학생 5명이 갔다. 입장료를 내야 하는 학생은 모두 몇 명인가?`, pay.length, {
        unit: '명', figure: table(['이름', '나이(세)'], who.map((w, i) => [w, String(ages[i])])), explain: `${b}세 미만에 ${b}세는 포함되지 않으므로 ${b}세인 학생은 입장료를 낸다. 입장료를 내는 학생은 ${pay.join(', ')}이다.`, facts: { count: ages.map((v) => !holds(v, 'lt', b)) }
      });
    }),
    T('life-two-free', '떨어진 두 범위의 기준', '②24 ③34', (d) => {
      const a = d.pick([6, 7, 8, 12, 13]), b = d.pick([65, 70]), list = [a, d.int(20, 34), d.int(35, 55), b - 1, b];
      return CT(`나이가 ${a}세 미만이거나 ${b}세 이상이면 입장료를 내지 않는 공원이 있다. 입장료를 내지 않는 나이는?`, d.shuffle(list.map((v) => [`${v}세`, holds(v, 'lt', a) || holds(v, 'ge', b)])), true, {
        explain: `${a}세 미만에 ${a}세는 포함되지 않고, ${b}세 이상에 ${b}세는 포함된다. 입장료를 내지 않는 나이는 ${b}세이다.`
      });
    }),
    T('life-unit', '단위를 바꾸어 기준과 비교하기', '①24 심6', (d) => {
      const m = d.pick([3, 4]), top = m * 100, hs = d.shuffle([top, top - d.int(1, 5) * 5, top + d.int(1, 4) * 5, top - d.int(8, 14) * 10]), flags = hs.map((h) => holds(h, 'lt', top)), tags = TAGS.slice(0, 4);
      return setItem(d, `높이가 ${m} m 미만인 차만 지나갈 수 있는 터널이 있다. 이 터널을 지나갈 수 있는 차를 모두 고른 것은?`, tags, flags, hs.indexOf(top), {
        figure: table(['차', '높이(cm)'], hs.map((h, i) => [tags[i], String(h)])), explain: `${m} m = ${top} cm이다. 높이가 ${top} cm보다 낮은 차만 지나갈 수 있고, 높이가 ${top} cm인 차는 지나갈 수 없다. 지나갈 수 있는 차는 ${tags.filter((_, i) => flags[i]).join(', ')}이다.`
      });
    }),
    T('life-two-set', '두 끝 기준에 드는 곳 모두 고르기', '①26 ②25 ③27 심17', (d) => {
      const S = d.pick([{ season: '겨울철', a: 18 }, { season: '여름철', a: 26 }]), a = S.a, b = a + 2, r = { lo: 'ge', a, hi: 'le', b }, k = () => d.int(1, 9), places = d.shuffle(['교실', '도서실', '강당', '급식실', '보건실']);
      const ts = d.shuffle([`${d.bool() ? a : b}.0`, `${b}.${k()}`, `${a - 1}.${k()}`, `${a}.${k()}`, `${a + 1}.${k()}`]), flags = ts.map((t) => inside(Number(t), r));
      return setItem(d, `${S.season} 실내 온도는 ${a} ℃ 이상 ${b} ℃ 이하가 알맞다고 한다. 실내 온도가 알맞은 곳을 모두 고른 것은?`, places, flags, ts.findIndex((t) => t === `${a}.0` || t === `${b}.0`), {
        figure: table(['곳', '온도(℃)'], places.map((p, i) => [p, ts[i]])), explain: `온도가 ${a} ℃와 같거나 높고 ${b} ℃와 같거나 낮은 곳을 찾는다. 알맞은 곳은 ${places.filter((_, i) => flags[i]).join(', ')}이다.`
      });
    }),
    T('life-two-count', '두 끝 기준에 드는 사람 수', '①26 ②25', (d) => {
      const a = d.pick([60, 70]), b = a + 20, r = { lo: 'gt', a, hi: 'le', b }, who = pickNames(d, 6);
      const list = d.shuffle([a, b, a + d.pick([5, 10, 15]), a - d.pick([5, 10]), b + d.pick([5, 10]), d.bool() ? a + 5 * d.int(1, 3) : b + 5]), hit = who.filter((_, i) => inside(list[i], r));
      return N(`수학 점수가 ${a}점 초과 ${b}점 이하인 학생에게 연습 문제를 한 장 더 준다. 연습 문제를 받는 학생은 모두 몇 명인가?`, hit.length, {
        unit: '명', figure: listTable(['이름', '점수(점)'], who.map((w, i) => [w, String(list[i])])), explain: `${a}점인 학생은 포함되지 않고 ${b}점인 학생은 포함된다. 연습 문제를 받는 학생은 ${hit.join(', ')}이다.`, facts: { count: list.map((v) => inside(v, r)) }
      });
    }),
    T('life-table-fee', '구간으로 나눈 표에서 값 찾기', '①27 ②26 ③32 심28', (d) => {
      const fees = d.pick([[1000, 2000, 3000, 5000], [500, 1500, 2500, 4000], [2000, 3000, 4000, 6000]]), cuts = [7, 13, 19], age = d.pick(cuts), who = d.pick(NAMES);
      const rows = [{ hi: 'le', b: 7 }, { lo: 'gt', a: 7, hi: 'le', b: 13 }, { lo: 'gt', a: 13, hi: 'le', b: 19 }, { lo: 'gt', a: 19 }], at = rows.findIndex((row) => inRow(age, row));
      return CT(`어느 과학관의 입장료이다. 나이가 ${age}세인 ${who}의 입장료는?`, fees.map((f, i) => [`${f}원`, i === at]), true, {
        figure: table(['나이', '입장료'], rows.map((row, i) => [rowText(row, '세'), `${fees[i]}원`])), explain: `${age}세는 「${rowText(rows[at], '세')}」에 포함된다. 「${rowText(rows[at + 1], '세')}」에는 포함되지 않는다. 입장료는 ${fees[at]}원이다.`
      });
    }),
    T('life-table-grade', '이상과 미만으로 나눈 표에서 등급 찾기', '②26 ③29·30 심28', (d) => {
      // 이상–미만으로 나눈 표에서는 경계의 값이 위 등급에 든다(초과–이하로 나눈 life-table-fee 와 반대이다).
      const w = d.pick([44, 52, 60, 68]), at = EGGS.findIndex((row) => inRow(w, row));
      return CT(`달걀의 등급을 무게로 나눈 표이다. 무게가 ${w} g인 달걀의 등급은?`, EGGS.map((row, i) => [row.name, i === at]), true, {
        figure: table(['등급', '무게'], EGGS.map((row) => [row.name, rowText(row, 'g')])), explain: `${w} g은 「${rowText(EGGS[at], 'g')}」에 포함되고 「${rowText(EGGS[at + 1], 'g')}」에는 포함되지 않는다. ${EGGS[at].name}이다.`
      });
    }),
    T('life-table-unit', '단위를 바꾸어 표에서 값 찾기', '②26 ③32', (d) => {
      const fees = d.pick([[2000, 3000, 4000, 5000], [1500, 2500, 3500, 5000]]), rows = [{ hi: 'le', b: 60 }, { lo: 'gt', a: 60, hi: 'le', b: 90 }, { lo: 'gt', a: 90, hi: 'le', b: 120 }, { lo: 'gt', a: 120 }];
      const [said, minutes] = d.pick([['1시간', 60], ['1시간 30분', 90], ['2시간', 120]]), at = rows.findIndex((row) => inRow(minutes, row));
      return CT(`자전거를 빌리는 요금이다. 자전거를 ${said} 동안 빌렸을 때 내야 하는 요금은?`, fees.map((f, i) => [`${f}원`, i === at]), true, {
        figure: table(['빌린 시간', '요금'], rows.map((row, i) => [rowText(row, '분'), `${fees[i]}원`])), explain: `${said}${josa(minutes, '은/는').slice(String(minutes).length)} ${minutes}분이다. ${minutes}분은 「${rowText(rows[at], '분')}」에 포함되므로 요금은 ${fees[at]}원이다.`
      });
    }),
    T('life-multi-rule', '여러 기준 가운데 맞는 것 모두 고르기', '①27 심5', (d) => {
      const h = d.pick([120, 125, 130, 135]), who = d.pick(NAMES), tags = TAGS.slice(0, 4);
      const rules = d.shuffle([{ lo: 'ge', a: h }, { lo: 'gt', a: h }, { lo: 'gt', a: h - 10, hi: 'le', b: h + d.pick([15, 20, 25]) }, { lo: 'ge', a: h - d.pick([15, 20]), hi: 'lt', b: h }]), flags = rules.map((row) => inRow(h, row));
      return setItem(d, `놀이 기구마다 탈 수 있는 키가 정해져 있다. 키가 ${h} cm인 ${name(who, '이/가')} 탈 수 있는 놀이 기구를 모두 고른 것은?`, tags, flags, rules.findIndex((row) => row.lo === 'gt' && row.a === h), {
        figure: table(['놀이 기구', '탈 수 있는 키'], rules.map((row, i) => [tags[i], rowText(row, 'cm')])), explain: `${h} cm는 「${h} cm 이상」에는 포함되지만 「${h} cm 초과」와 「${h} cm 미만」에는 포함되지 않는다. 탈 수 있는 놀이 기구는 ${tags.filter((_, i) => flags[i]).join(', ')}이다.`
      });
    }),
    T('life-table-same', '같은 구간에 드는 사람 모두 고르기', '①28 ②27 ③31 심29', (d) => {
      const rows = CLASSES.slice(1), row = d.pick(rows), who = pickNames(d, 5), k = () => d.int(1, 9), me = `${row.a}.${k()}`;
      // 같은 체급의 위 끝(포함)과 아래 끝(포함되지 않음)에 놓인 선수를 넣는다.
      const ws = d.shuffle([String(row.b), String(row.a), `${row.a + d.int(1, 4)}.${k()}`, row === rows[2] ? `${row.a - d.int(2, 4)}.${k()}` : `${row.b}.${k()}`]), flags = ws.map((w) => inRow(Number(w), row));
      return setItem(d, `씨름 선수의 체급을 몸무게로 나눈 표이다. 몸무게가 ${me} kg인 ${name(who[4], '과/와')} 같은 체급인 선수를 모두 고른 것은?`, who.slice(0, 4), flags, ws.indexOf(String(row.a)), {
        figure: classTable(CLASSES) + table(['선수', '몸무게(kg)'], who.slice(0, 4).map((w, i) => [w, ws[i]])), explain: `${me} kg은 「${rowText(row, 'kg')}」인 ${row.name}이다. ${row.b} kg은 포함되고 ${row.a} kg은 포함되지 않는다. 같은 체급인 선수는 ${who.slice(0, 4).filter((_, i) => flags[i]).join(', ')}이다.`
      });
    }),
    T('life-table-grade-count', '등급에 드는 사람 수', '②27 ③28·31 심29', (d) => {
      const base = d.pick([40, 50, 60]), rows = [{ name: '1급', lo: 'ge', a: base + 40 }, { name: '2급', lo: 'ge', a: base + 20, hi: 'lt', b: base + 40 }, { name: '3급', lo: 'ge', a: base, hi: 'lt', b: base + 20 }, { name: '4급', hi: 'lt', b: base }];
      const row = d.pick(rows.slice(1, 3)), who = pickNames(d, 6), list = d.shuffle([row.a, row.b, row.a + d.int(1, 9), row.b - d.int(1, 9), row.a - d.int(1, 9), d.bool() ? row.b + d.int(1, 9) : row.a + d.int(10, 18)]), hit = who.filter((_, i) => inRow(list[i], row));
      return N(`줄넘기 급수를 넘은 횟수로 나눈 표이다. 학생 6명 가운데 ${row.name}인 학생은 모두 몇 명인가?`, hit.length, {
        unit: '명', figure: table(['급수', '횟수'], rows.map((r) => [r.name, rowText(r, '회')])) + listTable(['이름', '횟수(회)'], who.map((w, i) => [w, String(list[i])])),
        explain: `${row.name}은 「${rowText(row, '회')}」이다. ${row.a}회는 포함되고 ${row.b}회는 포함되지 않는다. ${row.name}인 학생은 ${hit.join(', ')}이다.`, facts: { count: list.map((v) => inRow(v, row)) }
      });
    }),
    T('life-table-line', '표에서 찾은 구간을 나타낸 수직선', '①13 ②28', (d) => {
      const rows = CLASSES.slice(1), row = d.pick(rows), me = `${row.a + d.int(0, 4)}.${d.int(1, 9)}`, order = d.shuffle(COMBOS), ticks = [row.a - 5, row.a, row.b, row.b + 5];
      return CT(`씨름 선수의 체급을 몸무게로 나눈 표이다. 몸무게가 ${me} kg인 선수가 속한 체급의 몸무게 범위를 수직선에 바르게 나타낸 것은?`, LABELS.map((label, i) => [label, order[i][0] === row.lo && order[i][1] === row.hi]), true, {
        figure: classTable(rows) + stack(order.map(([l, h], i) => twoLine(ticks, 1, 2, l, h, LABELS[i]))), explain: `${me} kg은 「${rowText(row, 'kg')}」인 ${row.name}이다. ${row.a}에는 ○, ${row.b}에는 ●로 표시하고 그 사이에 선을 긋는다.`
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
