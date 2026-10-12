// 2학년 2학기 5단원 표와 그래프 — 단원 틀, 그림 도구, 기본 문항(조사한 자료 읽기, 표로 나타내기, 표 읽기와 빈칸, 그래프로 나타내기).
// 수집해 둔 국정 교과서 평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 48꼴, 심화꼴: 34꼴)을 번호마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/2-2-5/싣기_대조표.md 에 있다.
// (표와 그래프의 내용 알기·편리한 점의 기본 문항과 실력 문항은 2-2-5b.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 영역: 자료와 가능성.
//   2수04-02 자료를 분류하여 표로 나타내고, 자료를 표로 나타내면 편리한 점을 말할 수 있다.
//   2수04-03 자료를 분류하여 ○, ×, / 등을 이용한 그래프로 나타내고, 자료를 그래프로 나타내면 편리한 점을 말할 수 있다.
//   교육과정: 「표와 그래프로 나타내기는 … 학생들의 수준에 비해 어려운 분류 대상이나 분류 기준을 사용하지 않는다.」
//   → 조사한 것은 좋아하는 과일·운동·간식·색깔·동물·계절, 날씨, 읽은 책 수처럼 2학년이 아는 것만 쓴다.
//   → 그래프는 ○, ×, / 하나가 1을 나타내는 것만 쓴다(그림 하나가 여럿을 나타내는 그림그래프, 막대그래프, 한 칸이 1이 아닌 눈금은 3·4학년이다).
//
// 싣는 기준
//  - 주는 것(이름표 자료·그림 자료·분류한 칸·표·세로 그래프·가로 그래프·표와 그래프)과 묻는 것(한 가지의 수·모두 몇 명·몇 가지·빈칸·
//    가로와 세로·칸 수·그리는 방법·바르게 그린 것)이 다르면 다른 문제다. 조사한 것(과일·운동)만 다른 것, 수만 다른 것은 한 번만 싣는다.
//  - 한 가지의 수는 1~8, 조사한 수는 10~25쯤으로 한다(그래프의 칸은 8칸까지). 가짓수는 3~5가지다.
//    표만 주는 실력 문항 둘은 조금 넘는다: 다섯 가지 표의 합계 28까지(h-twin), 한 달의 날씨 30·31일(h-rest-gap).
//  - 그래프를 그리게 하는 꼴(작도)은 「○를 몇 개 그리는가」「모두 몇 개 그리는가」「아래에서 몇 번째 칸에 그리는가」「가로와 세로는 몇 칸인가」
//    「어느 쪽에서부터 그리는가」「바르게 그린 것은 어느 것인가」로 바꾸어 실었다.
//  - 답으로 한글을 적게 하지 않는다. 과일·이름은 고르기로, 수는 숫자로 받는다. 답 칸은 넷까지다.
//  - 아이에게 보이는 글에는 이 학년군의 말(표, 그래프, 가로, 세로, 합계, 자료, 분류)만 쓴다. 「항목」「눈금」이라는 말은 쓰지 않는다.
//  - 표는 세로로 놓는다(가로로 길면 휴대폰 너비를 넘는다). 그래프는 단원 파일 안에 그린다(가로 286px 안쪽 — 휴대폰에서 그림 자리는 290px).
//
// 뺀 것과 까닭(단원 전체)
//  - 가려진 두 칸을 합과 차로 구하는 표(①17 심12): 합과 차로 두 수를 찾는 조건 풀이다. 표를 읽는 일이 아니다.
//    (두 칸의 수가 같은 심13은 한 번 빼고 똑같이 가르면 되어 실력에 실었다.)
//  - 이름에서 성씨를 뽑아 표 만들기(①11): 분류 기준을 이름에서 스스로 읽어 내는 열린 활동이다.
//  - 우리 반을 실제로 조사하여 표 만들기(①48): 활동이다. 답이 열려 있다.
//  - 몇 칸이 채워진 표 완성하기(①9): 자료를 세어 표를 채우는 문제(tab-fill)와 빈칸의 수만 다르다.
//  - 그래프 그리기(①18·19·20 심15·16), 알 수 있는 내용·편리한 점 쓰기(①41·46 심4·34), 이유·까닭 쓰기(①24·39)는 수 답·고르기로 바꾸어 실었다.
// 묻는 말: 수나 값을 물으면 「~은?/~는?」, 양을 물으면 「몇 ~인가?」. 풀이는 「~이다.」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, table, tagged, N, M, C } = B.kit;
  const TAB = '2수04-02', GRAPH = '2수04-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const sum = (list) => list.reduce((x, y) => x + y, 0);
  const top = (v) => Math.max(...v), low = (v) => Math.min(...v);
  const range = (n) => Array.from({ length: n }, (_, i) => i);
  const distinct = (v) => new Set(v).size === v.length;
  const TAGS = ['가', '나', '다', '라'];
  // 이름표 자료에 쓰는 이름(지어낸 이름). 생김새가 비슷한 이름은 함께 쓰지 않는다.
  const KIDS = ['지우', '서연', '민재', '하린', '도현', '수아', '은호', '채원', '나은', '준서', '예린', '태윤', '소율', '건우', '다인', '유나', '성민', '가온', '한결', '로아'];

  // ── 조사한 것 ────────────────────────────────────────────────
  // kind: 가짓수를 세는 것(과일), all: 고를 수 있는 것(세 글자까지), unit·axis: 수 쪽의 낱말, topic: 머리말, who(n): n을 고른 학생
  const liked = (kind, all, more) => Object.assign({ kind, all, unit: '명', axis: '학생 수', topic: `학생들이 좋아하는 ${josa(kind, '을/를')}`, who: (n) => `${josa(n, '을/를')} 좋아하는 학생` }, more || {});
  const SETS = {
    fruit: liked('과일', ['사과', '포도', '딸기', '수박', '귤']),
    sport: liked('운동', ['축구', '피구', '수영', '줄넘기', '달리기']),
    snack: liked('간식', ['김밥', '피자', '만두', '과자', '떡']),
    color: liked('색깔', ['빨강', '노랑', '파랑', '초록', '보라']),
    animal: liked('동물', ['강아지', '고양이', '토끼', '사자', '곰']),
    season: liked('계절', ['봄', '여름', '가을', '겨울'], { fixed: true })
  };
  // 유형마다 조사한 것 하나를 골라 n가지를 정한다.
  const pick = (d, key, n) => { const s = SETS[key]; return Object.assign({}, s, { names: s.fixed ? s.all.slice(0, n) : d.shuffle(s.all).slice(0, n) }); };
  // 학생별 읽은 책 수(이름이 가로나 세로에 놓인다)
  const books = (d, n) => ({ kind: '이름', names: d.shuffle(NAMES).slice(0, n), unit: '권', axis: '책 수', topic: '학생들이 한 달 동안 읽은 책 수를' });
  // 날씨별 날수
  const WEATHER = { kind: '날씨', names: ['맑음', '흐림', '비', '눈'], unit: '일', axis: '날수', day: { 맑음: '맑은 날', 흐림: '흐린 날', 비: '비가 온 날', 눈: '눈이 온 날' } };
  const leadData = (c) => `${c.topic} 조사한 자료이다.`;
  const leadTab = (c) => `${c.topic} 조사하여 나타낸 표이다.`;
  const leadGr = (c) => `${c.topic} 조사하여 나타낸 그래프이다.`;
  // 표: 첫 칸에 고른 것, 둘째 칸에 수. extra 로 합계 줄을 붙인다.
  const tab = (c, v, extra) => table([c.kind, `${c.axis}(${c.unit})`], c.names.map((n, i) => [n, v[i]]).concat(extra || []));
  const nums = (d, n, lo, hi, ok) => d.until(() => range(n).map(() => d.int(lo, hi)), (v) => !ok || ok(v));
  // 이름표 자료: [이름, 고른 것]. counts 는 c.names 차례대로의 학생 수.
  const dataOf = (d, c, counts) => { const list = d.shuffle(c.names.flatMap((n, i) => Array(counts[i]).fill(n))), kids = d.shuffle(KIDS).slice(0, list.length); return kids.map((k, i) => [k, list[i]]); };
  const countIn = (rows, n) => rows.filter((r) => r[1] === n).length;
  // 여럿을 고르는 보기: 맞는 묶음 하나와, 거기서 하나를 빼거나 더하거나 바꾼 틀린 묶음 셋.
  function setChoices(d, labels, flags) {
    const key = (list) => list.join(', '), right = labels.filter((_, i) => flags[i]), pool = [];
    labels.forEach((_, i) => { const flipped = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (flipped.length) pool.push(flipped); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) pool.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(pool)) { if (out.length === 4) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const list = d.shuffle(out);
    return { options: list.map(key), answer: list.findIndex((o) => key(o) === key(right)), truth: list.map((o) => key(o) === key(right)) };
  }

  // ── 그림: 이름표 자료 ────────────────────────────────────────
  // 이름표를 한 줄에 네 장씩 놓는다. 위에 이름, 아래에 고른 것.
  const cardsFig = (rows) => '<div style="display:grid;grid-template-columns:repeat(4,auto);gap:5px;justify-content:start">'
    + rows.map(([who, what]) => '<span style="display:block;min-width:3.5em;padding:2px 5px 3px;border:1px solid #8a96a3;border-radius:7px;background:#fffdf5;text-align:center;font-size:0.9rem;line-height:1.4"><b style="display:block;font-weight:600;border-bottom:1px dashed #c3ccd6">' + who + '</b>' + what + '</span>').join('') + '</div>';

  // ── 그림: ○·×·/ 그래프 ───────────────────────────────────────
  // names: 가로(세로)에 놓는 것, values: 수(빈 줄은 null) 또는 표시를 그린 칸의 번호들(잘못 그린 그래프).
  // o: mark('o' ○ | 'x' × | 's' /), flip(가로에 수를 나타낸 그래프), top(칸 수), kind·axis·unit(모서리 칸의 이름표), mini(이름표가 없는 작은 그래프), say(그림 설명에 적는 이름)
  // 세로 그래프는 아래에서 위로, 가로 그래프는 왼쪽에서 오른쪽으로 채운다. 표시 하나가 1이다. 그림 설명(aria-label)에 줄마다의 수를 적는다.
  const MARK = { o: '○', x: '×', s: '/' };
  const INK = '#1f2933', RULE = '#7b8794', SHADE = '#eef3f8';
  const r1 = (n) => Math.round(n * 10) / 10;
  const fill = (v) => range(v).map((i) => i + 1);
  function markAt(mark, cx, cy, r) {
    const pen = 'fill:none;stroke:' + INK + ';stroke-width:1.6;stroke-linecap:round';
    if (mark === 'x') return `<path d="M${r1(cx - r)} ${r1(cy - r)}L${r1(cx + r)} ${r1(cy + r)}M${r1(cx + r)} ${r1(cy - r)}L${r1(cx - r)} ${r1(cy + r)}" style="${pen}"/>`;
    if (mark === 's') return `<path d="M${r1(cx - r)} ${r1(cy + r)}L${r1(cx + r)} ${r1(cy - r)}" style="${pen}"/>`;
    return `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r}" style="${pen}"/>`;
  }
  function graph(names, values, o) {
    const mark = o.mark || 'o', flip = Boolean(o.flip), mini = Boolean(o.mini), n = names.length;
    const cells = values.map((v) => (Array.isArray(v) ? v : v == null ? [] : fill(v)));
    const size = o.top || Math.max(1, ...cells.map((c) => Math.max(0, ...c)));
    const word = (x, y, text, px, anchor) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor || 'middle'}" style="font-size:${px}px;font-weight:600;fill:${INK}">${text}</text>`;
    const rule = (x1, y1, x2, y2) => `<path d="M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}" style="fill:none;stroke:${RULE};stroke-width:1"/>`;
    const big = mini ? 12.5 : 13.5, small = 11;
    let out = '', width, height;
    if (!flip) {
      const left = mini ? 20 : 72, foot = mini ? 22 : 40, colW = mini ? 34 : Math.min(48, Math.floor((284 - left) / n)), rowH = mini ? 20 : 24, r = mini ? 6 : 7.5;
      const gw = n * colW, gh = size * rowH, nameSize = Math.min(big, Math.floor(((colW - 5) / Math.max(...names.map((x) => String(x).length))) * 10) / 10); width = left + gw + 2; height = gh + foot + 2;
      out += `<rect x="1" y="1" width="${left + gw}" height="${gh + foot}" style="fill:#fff"/><rect x="1" y="1" width="${left}" height="${gh + foot}" style="fill:${SHADE}"/><rect x="1" y="${1 + gh}" width="${left + gw}" height="${foot}" style="fill:${SHADE}"/>`;
      for (let t = 1; t <= size; t += 1) out += rule(1, 1 + t * rowH, 1 + left + gw, 1 + t * rowH) + word(1 + left / 2, 1 + (size - t) * rowH + rowH / 2 + 4.5, t, big);
      for (let i = 0; i < n; i += 1) out += rule(1 + left + i * colW, 1, 1 + left + i * colW, 1 + gh + foot) + word(1 + left + i * colW + colW / 2, 1 + gh + foot / 2 + 4.5, names[i], nameSize);
      if (!mini) out += rule(1, 1 + gh + foot, 1 + left, 1 + gh) + word(5, 1 + gh + 13, o.axis, small, 'start') + word(5, 1 + gh + 26, '(' + o.unit + ')', small, 'start') + word(left - 2, gh + foot - 4, o.kind, small, 'end');
      cells.forEach((list, i) => list.forEach((t) => { out += markAt(mark, 1 + left + i * colW + colW / 2, 1 + (size - t) * rowH + rowH / 2, r); }));
    } else {
      const left = mini ? 38 : 88, foot = mini ? 19 : 48, colW = mini ? 17 : Math.min(28, Math.floor((284 - left) / size)), rowH = mini ? 22 : 26, r = mini ? 5.5 : 7.5;
      const gw = size * colW, gh = n * rowH; width = left + gw + 2; height = gh + foot + 2;
      out += `<rect x="1" y="1" width="${left + gw}" height="${gh + foot}" style="fill:#fff"/><rect x="1" y="1" width="${left}" height="${gh + foot}" style="fill:${SHADE}"/><rect x="1" y="${1 + gh}" width="${left + gw}" height="${foot}" style="fill:${SHADE}"/>`;
      for (let i = 0; i < n; i += 1) out += rule(1, 1 + (i + 1) * rowH, 1 + left + gw, 1 + (i + 1) * rowH) + word(1 + left / 2, 1 + i * rowH + rowH / 2 + 4.5, names[i], big);
      for (let t = 1; t <= size; t += 1) out += rule(1 + left + (t - 1) * colW, 1, 1 + left + (t - 1) * colW, 1 + gh + foot) + word(1 + left + (t - 1) * colW + colW / 2, 1 + gh + foot / 2 + 4.5, t, big);
      if (!mini) out += rule(1, 1 + gh + foot, 1 + left, 1 + gh) + word(5, 1 + gh + 15, o.kind, small, 'start') + word(left - 2, gh + foot - 16, o.axis, small, 'end') + word(left - 2, gh + foot - 3, '(' + o.unit + ')', small, 'end');
      cells.forEach((list, i) => list.forEach((t) => { out += markAt(mark, 1 + left + (t - 1) * colW + colW / 2, 1 + i * rowH + rowH / 2, r); }));
    }
    out += `<rect x="1" y="1" width="${width - 2}" height="${height - 2}" style="fill:none;stroke:${INK};stroke-width:1.3"/>`;
    const say = o.say || ((x) => x);
    const told = names.map((nm, i) => say(nm) + ' ' + (cells[i].length === 0 ? '빈 줄' : cells[i].every((t, j) => t === j + 1) ? MARK[mark] + ' ' + cells[i].length + '개' : MARK[mark] + ' ' + cells[i].join(', ') + '번째 칸')).join(', ');
    const head = mini ? `${flip ? '가로' : '세로'}에 수를 나타낸 작은 그래프, 칸 ${size}칸` : `${flip ? '가로' : '세로'}에 ${o.axis}(${o.unit}), ${flip ? '세로' : '가로'}에 ${josa(o.kind, '을/를')} 나타낸 그래프, 칸 ${size}칸`;
    return `<svg viewBox="0 0 ${width} ${height}" width="${width}" role="img" aria-label="${head}: ${told}" style="max-width:100%;height:auto">${out}</svg>`;
  }
  const graphOf = (c, v, o) => graph(c.names, v, Object.assign({ kind: c.kind, axis: c.axis, unit: c.unit }, o || {}));
  // 그림 위에 이름(가, 나, 다, 라)을 붙인다.
  const cap = (label, html) => `<div style="display:grid;gap:2px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">${label}</div>${html}</div>`;
  // 잘못 그린 줄: 빈칸을 두고 그린 것, 끝 칸에서부터 채운 것
  const gapRow = (d, v) => { const j = d.int(1, v); return fill(v).filter((t) => t !== j).concat([v + 1]); };
  const farRow = (v, size) => range(v).map((i) => size - v + 1 + i);
  const drawnRight = (rows, v) => rows.every((list, i) => list.length === v[i] && list.every((t, j) => t === j + 1));

  // ── 그림: 날씨 달력, 모양 조각, ○× 기록 ──────────────────────
  function weatherIcon(kind, cx, cy) {
    if (kind === '맑음') {
      let rays = '';
      for (let k = 0; k < 8; k += 1) { const a = (k * Math.PI) / 4; rays += `M${r1(cx + 8.5 * Math.cos(a))} ${r1(cy + 8.5 * Math.sin(a))}L${r1(cx + 11.5 * Math.cos(a))} ${r1(cy + 11.5 * Math.sin(a))}`; }
      return `<path d="${rays}" style="fill:none;stroke:#b45309;stroke-width:1.5;stroke-linecap:round"/><circle cx="${cx}" cy="${cy}" r="6" style="fill:#fbbf24;stroke:#b45309;stroke-width:1.3"/>`;
    }
    if (kind === '흐림') return `<path d="M${cx - 8} ${cy + 6}a5 5 0 0 1 0.5 -10a6.5 6.5 0 0 1 12.5 -1a5.3 5.3 0 0 1 3.5 11z" style="fill:#cbd5e1;stroke:#475569;stroke-width:1.3;stroke-linejoin:round"/>`;
    if (kind === '비') return `<path d="M${cx - 10} ${cy + 1}a10 10 0 0 1 20 0z" style="fill:#60a5fa;stroke:#1e40af;stroke-width:1.3;stroke-linejoin:round"/><path d="M${cx} ${cy + 1}v7.5a2.4 2.4 0 0 1 -4.8 0" style="fill:none;stroke:#1e40af;stroke-width:1.5;stroke-linecap:round"/>`;
    return `<circle cx="${cx}" cy="${cy + 4}" r="6.5" style="fill:#fff;stroke:#334155;stroke-width:1.3"/><circle cx="${cx}" cy="${cy - 5.5}" r="4.5" style="fill:#fff;stroke:#334155;stroke-width:1.3"/>`;
  }
  // 날씨 달력: 1일부터 차례로 한 줄에 다섯 칸씩. 칸마다 날짜와 날씨 그림.
  function calendar(list) {
    const cols = 5, cw = 50, ch = 42, rows = Math.ceil(list.length / cols);
    let out = `<rect x="1" y="1" width="${cols * cw}" height="${rows * ch}" style="fill:#fff;stroke:${INK};stroke-width:1.3"/>`;
    list.forEach((kind, i) => {
      const x = 1 + (i % cols) * cw, y = 1 + Math.floor(i / cols) * ch;
      out += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" style="fill:none;stroke:${RULE};stroke-width:0.8"/><text x="${x + 5}" y="${y + 13}" style="font-size:10px;font-weight:600;fill:${INK}">${i + 1}</text>` + weatherIcon(kind, x + cw / 2 + 4, y + ch / 2 + 3);
    });
    return `<svg viewBox="0 0 ${cols * cw + 2} ${rows * ch + 2}" width="${cols * cw + 2}" role="img" aria-label="날씨 달력: ${list.map((kind, i) => (i + 1) + '일 ' + kind).join(', ')}" style="max-width:100%;height:auto">${out}</svg>`;
  }
  // 날씨 그림이 무엇을 뜻하는지 알려 주는 줄(글줄 속 작은 그림)
  const weatherKey = (kinds) => '<div class="mb-lines" style="font-size:0.92rem"><div>' + kinds.map((kind) => `<span style="margin-right:12px;white-space:nowrap"><svg class="mb-inline" viewBox="0 0 26 26" width="22" height="22" style="vertical-align:-6px" aria-hidden="true">${weatherIcon(kind, 13, 13)}</svg> ${kind}</span>`).join('') + '</div></div>';
  // 모양 조각: 삼각형·사각형·원을 한 줄에 여섯 개씩 놓는다. 그림 설명에 놓인 차례대로 모양 이름을 적는다.
  function pieces(list) {
    const cols = 6, size = 38, rows = Math.ceil(list.length / cols), pen = ';stroke:' + INK + ';stroke-width:1.4;stroke-linejoin:round';
    const out = list.map((kind, i) => {
      const cx = size / 2 + (i % cols) * size, cy = size / 2 + Math.floor(i / cols) * size;
      if (kind === '원') return `<circle cx="${cx}" cy="${cy}" r="12.5" style="fill:#fecaca${pen}"/>`;
      if (kind === '삼각형') return `<path d="M${cx} ${cy - 13}L${cx + 14} ${cy + 11.5}H${cx - 14}Z" style="fill:#fde68a${pen}"/>`;
      return `<rect x="${cx - 12}" y="${cy - 12}" width="24" height="24" style="fill:#bfdbfe${pen}"/>`;
    }).join('');
    return `<svg viewBox="0 0 ${cols * size} ${rows * size}" width="${cols * size}" role="img" aria-label="모양 조각: ${list.join(', ')}" style="max-width:100%;height:auto">${out}</svg>`;
  }
  // ○× 기록: 줄마다 한 학생, 칸마다 한 문제.
  const oxTable = (kids, marks) => { const cell = (tag, text) => `<${tag} style="padding:4px 6px">${text}</${tag}>`; return '<div class="mb-table-wrap"><table class="mb-table"><thead><tr>' + cell('th', '이름') + marks[0].map((_, i) => cell('th', (i + 1) + '번')).join('') + '</tr></thead><tbody>' + kids.map((k, i) => '<tr>' + cell('td', k) + marks[i].map((m) => cell('td', m)).join('') + '</tr>').join('') + '</tbody></table></div>'; };

  // 2-2-5b.js 가 같은 도구를 쓴다.
  B.kit.g225 = { sum, top, low, range, distinct, TAGS, KIDS, SETS, pick, books, WEATHER, leadData, leadTab, leadGr, tab, nums, dataOf, countIn, setChoices, cardsFig, graph, graphOf, cap, fill, MARK };

  B.addUnit({
    id: '2-2-5', grade: 2, semester: 2, no: 5, title: '표와 그래프', version: 1,
    groups: [
      {
        id: 'data', title: '조사한 자료 읽기', standard: TAB,
        types: [
          T('data-one', '한 학생이 고른 것 찾기', '①1 심1', (d) => {
            const c = pick(d, d.pick(['fruit', 'snack', 'color']), 4), rows = dataOf(d, c, nums(d, 4, 2, 4, (v) => sum(v) === 12)), [who, what] = d.pick(rows);
            return C(`${leadData(c)} ${name(who, '이/가')} 좋아하는 ${josa(c.kind, '은/는')}?`, c.names, c.names.indexOf(what), {
              figure: cardsFig(rows), explain: `자료에서 ${name(who, '을/를')} 찾는다. ${name(who, '은/는')} ${josa(what, '을/를')} 좋아한다.`, facts: { kindPick: { kinds: c.names, target: what } }
            });
          }),
          T('data-who', '한 가지를 고른 학생 모두 찾기', '①2 심2', (d) => {
            const c = pick(d, d.pick(['sport', 'animal']), 4), rows = dataOf(d, c, d.shuffle([2, 3, 3, 4])), what = d.until(() => d.pick(c.names), (n) => countIn(rows, n) === 3);
            const picked = setChoices(d, rows.map((r) => r[0]), rows.map((r) => r[1] === what));
            return C(`${leadData(c)} ${c.who(what)}을 모두 고른 것은?`, picked.options, picked.answer, {
              figure: cardsFig(rows), explain: `자료에서 ${josa(what, '을/를')} 하나씩 찾아 표시한다. ${c.who(what)}은 ${rows.filter((r) => r[1] === what).map((r) => r[0]).join(', ')}이다.`, facts: { truth: picked.truth, want: true }
            });
          }),
          T('data-count', '자료에서 한 가지를 고른 학생 수 세기', '①3 심2', (d) => {
            const c = pick(d, d.pick(['color', 'fruit']), 4), rows = dataOf(d, c, nums(d, 4, 2, 5, (v) => sum(v) >= 13 && sum(v) <= 15 && new Set(v).size >= 3)), k = d.int(0, 3), n = countIn(rows, c.names[k]);
            return N(`${leadData(c)} ${c.who(c.names[k])}은 몇 명인가?`, n, {
              unit: '명', figure: cardsFig(rows), explain: `빠뜨리거나 두 번 세지 않게 표시하면서 센다. ${c.who(c.names[k])}은 ${n}명이다.`, facts: { tallyOf: { list: rows.map((r) => r[1]), target: c.names[k] } }
            });
          }),
          T('data-kinds', '자료에 나온 것의 가짓수', '①4', (d) => {
            const key = d.pick(['snack', 'fruit']), all = SETS[key].all, c = pick(d, key, d.int(3, 4)), rows = dataOf(d, c, nums(d, c.names.length, 2, 4, (v) => sum(v) >= 10 && sum(v) <= 12));
            const used = all.filter((n) => rows.some((r) => r[1] === n));
            return N(`${leadData(c)} 자료에 나온 ${josa(c.kind, '은/는')} 모두 몇 가지인가?`, used.length, {
              unit: '가지', figure: cardsFig(rows), explain: `같은 ${josa(c.kind, '은/는')} 한 번만 센다. ${used.join(', ')}의 ${used.length}가지이다.`, facts: { count: all.map((n) => rows.some((r) => r[1] === n)) }
            });
          }),
          T('data-total', '자료에서 조사한 학생 수 세기', '①6', (d) => {
            const c = pick(d, d.pick(['animal', 'sport']), 4), rows = dataOf(d, c, nums(d, 4, 2, 5, (v) => [11, 13, 14, 15].includes(sum(v)))), counts = c.names.map((n) => countIn(rows, n));
            return N(`${leadData(c)} 조사한 학생은 모두 몇 명인가?`, rows.length, {
              unit: '명', figure: cardsFig(rows), explain: `자료에 있는 이름을 빠짐없이 센다. 조사한 학생은 모두 ${rows.length}명이다.`, facts: { calc: [[counts.join('+'), 0]], unseen: counts }
            });
          }),
          T('data-sorted', '잘못 분류한 이름 찾기', '①5 심3', (d) => {
            const c = pick(d, d.pick(['fruit', 'color']), 3), counts = d.shuffle(d.pick([[3, 3, 4], [3, 4, 4], [3, 3, 3]])), rows = dataOf(d, c, counts);
            const to = d.until(() => d.int(0, 2), (i) => counts[i] === 3), from = d.until(() => d.int(0, 2), (i) => i !== to);
            const groups = c.names.map((n) => rows.filter((r) => r[1] === n).map((r) => r[0])), moved = d.pick(groups[from]);
            const shown = groups.map((g, i) => (i === from ? g.filter((k) => k !== moved) : i === to ? d.shuffle(g.concat([moved])) : g));
            const options = d.shuffle([moved].concat(groups.map((g) => d.pick(g.filter((k) => k !== moved)))));
            return C(`${leadData(c)} 좋아하는 ${c.kind}에 따라 이름을 분류하였다. 잘못 분류한 이름은?`, options, options.indexOf(moved), {
              figure: cardsFig(rows) + table([c.kind, '이름'], c.names.map((n, i) => [n, shown[i].join(', ')])),
              explain: `자료와 하나씩 맞추어 본다. ${name(moved, '은/는')} ${josa(c.names[from], '을/를')} 좋아하는데 ${c.names[to]} 칸에 썼다.`,
              facts: { truth: options.map((k) => rows.find((r) => r[0] === k)[1] !== c.names[shown.findIndex((g) => g.includes(k))]), want: true }
            });
          })
        ]
      },
      {
        id: 'table', title: '표로 나타내기', standard: TAB,
        types: [
          T('tab-fill', '자료를 세어 표로 나타내기', '①8 ①9 심6', (d) => {
            const c = pick(d, d.pick(['snack', 'season', 'sport']), 4), rows = dataOf(d, c, nums(d, 4, 2, 6, (v) => sum(v) >= 14 && sum(v) <= 16 && new Set(v).size >= 3)), list = rows.map((r) => r[1]);
            const cnt = c.names.map((n) => countIn(rows, n)), all = sum(cnt);
            return M(`${leadData(c)} 자료를 보고 표로 나타낼 때, ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, cnt.map((x, i) => ({ label: LABELS[i], answer: x })), {
              figure: cardsFig(rows) + tab(c, c.names.map((_, i) => box(LABELS[i])), [['합계', all]]),
              explain: `${c.kind}마다 표시하면서 센다. ${c.names.map((n, i) => `${n} ${cnt[i]}명`).join(', ')}이다. 모두 더하면 ${cnt.join(' + ')} = ${josa(all, '으로/로')} 합계와 같다.`,
              facts: { tallyOf: { list, target: c.names[0] }, calc: cnt.map((x, i) => [`${all}-${cnt.filter((_, j) => j !== i).join('-')}`, i]), unseen: cnt }
            });
          }),
          T('tab-weather', '그림 자료를 세어 표로 나타내기', '①7 심5', (d) => {
            const kinds = ['맑음', '흐림', '비'], counts = nums(d, 3, 3, 8, (v) => sum(v) === 15 && distinct(v)), list = d.shuffle(kinds.flatMap((n, i) => Array(counts[i]).fill(n)));
            const cnt = kinds.map((n) => list.filter((w) => w === n).length);
            return M('어느 달 1일부터 15일까지의 날씨를 조사한 자료이다. 날씨별 날수를 표로 나타낼 때, ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', cnt.concat([15]).map((x, i) => ({ label: LABELS[i], answer: x })), {
              figure: calendar(list) + weatherKey(kinds) + table(['날씨', '날수(일)'], kinds.map((n, i) => [n, box(LABELS[i])]).concat([['합계', box(LABELS[3])]])),
              explain: `날씨마다 표시하면서 센다. ${kinds.map((n, i) => `${n} ${cnt[i]}일`).join(', ')}이다. 합계는 ${cnt.join(' + ')} = 15(일)이다.`,
              facts: { tallyOf: { list, target: '맑음' }, calc: [[`15-${cnt[0]}-${cnt[2]}`, 1], [`15-${cnt[0]}-${cnt[1]}`, 2], [cnt.join('+'), 3]], unseen: cnt }
            });
          }),
          T('tab-head', '표에 쓸 것 찾기', '①10', (d) => {
            const c = pick(d, d.pick(['fruit', 'animal']), 4), counts = d.shuffle([2, 3, 4, 5]), rows = dataOf(d, c, counts), [a, b] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort();
            return C(`${leadData(c)} 자료를 보고 표로 나타내었다. ㉠에 알맞은 ${josa(c.kind, '은/는')}?`, c.names, a, {
              figure: cardsFig(rows) + table([c.kind, `${c.axis}(${c.unit})`], c.names.map((n, i) => [i === a ? box(LABELS[0]) : i === b ? box(LABELS[1]) : n, counts[i]]).concat([['합계', 14]])),
              explain: `표에 없는 ${josa(c.kind, '은/는')} ${josa(c.names[a], '과/와')} ${c.names[b]}이다. 자료에서 ${c.who(c.names[a])}을 세면 ${counts[a]}명이므로 ㉠은 ${c.names[a]}이다.`,
              facts: { kindPick: { kinds: c.names, target: c.names[a] }, choose: { exprs: counts.map(String), rule: 'equals', target: countIn(rows, c.names[a]) } }
            });
          }),
          T('tab-sorted', '분류한 것을 표로 나타내기', '①3 ①5 심3', (d) => {
            const c = pick(d, 'sport', 4), counts = nums(d, 4, 2, 4, (v) => sum(v) >= 11 && sum(v) <= 13 && new Set(v).size >= 2), kids = d.shuffle(KIDS), k = d.int(0, 3);
            const groups = counts.map((x, i) => kids.slice(sum(counts.slice(0, i)), sum(counts.slice(0, i)) + x));
            return M(`학생들이 좋아하는 운동에 따라 이름을 분류하였다. 이것을 표로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: groups[k].length }, { label: LABELS[1], answer: sum(counts) }], {
              figure: table([c.kind, '이름'], c.names.map((n, i) => [n, groups[i].join(', ')])) + tab(c, counts.map((x, i) => (i === k ? box(LABELS[0]) : x)), [['합계', box(LABELS[1])]]),
              explain: `${c.names[k]} 칸의 이름을 세면 ${counts[k]}명이다. 합계는 ${counts.join(' + ')} = ${sum(counts)}(명)이다.`,
              facts: { calc: [[String(counts[k]), 0], [counts.join('+'), 1]], unseen: [counts[k]], count: groups[k].map(() => true).concat([false]) }
            });
          }),
          T('tab-shapes', '모양 조각을 세어 표로 나타내기', '①12 심7', (d) => {
            const kinds = ['삼각형', '사각형', '원'], counts = nums(d, 3, 3, 7, (v) => sum(v) >= 14 && sum(v) <= 17 && distinct(v)), list = d.shuffle(kinds.flatMap((n, i) => Array(counts[i]).fill(n)));
            const cnt = kinds.map((n) => list.filter((w) => w === n).length), all = sum(cnt);
            return M('여러 가지 모양 조각이다. 모양별 조각의 수를 표로 나타낼 때, ㉠, ㉡, ㉢에 알맞은 수는?', cnt.map((x, i) => ({ label: LABELS[i], answer: x })), {
              figure: pieces(list) + table(['모양', '조각의 수(개)'], kinds.map((n, i) => [n, box(LABELS[i])]).concat([['합계', all]])),
              explain: `모양마다 표시하면서 센다. ${kinds.map((n, i) => `${n} ${cnt[i]}개`).join(', ')}이다. 모두 더하면 ${cnt.join(' + ')} = ${josa(all, '으로/로')} 합계와 같다.`,
              facts: { tallyOf: { list, target: '삼각형' }, calc: [[`${all}-${cnt[0]}-${cnt[2]}`, 1], [`${all}-${cnt[0]}-${cnt[1]}`, 2]], unseen: cnt }
            });
          }),
          T('tab-shapes-most', '모양 조각 가운데 가장 많은 모양', '①12 심7', (d) => {
            const kinds = ['삼각형', '사각형', '원'], counts = nums(d, 3, 4, 7, (v) => { const s = v.slice().sort((p, q) => q - p); return s[0] - s[1] === 1 && sum(v) <= 17; }), list = d.shuffle(kinds.flatMap((n, i) => Array(counts[i]).fill(n)));
            const cnt = kinds.map((n) => list.filter((w) => w === n).length), hi = cnt.indexOf(top(cnt));
            return C('여러 가지 모양 조각을 모양별로 세어 표로 나타내려고 한다. 조각의 수가 가장 많은 모양은?', kinds, hi, {
              figure: pieces(list), explain: `모양마다 표시하면서 센다. ${kinds.map((n, i) => `${n} ${cnt[i]}개`).join(', ')}이다. ${josa(kinds[hi], '이/가')} 가장 많다.`,
              facts: { choose: { exprs: cnt.map(String), rule: 'max' }, unseen: cnt }
            });
          }),
          T('tab-ox', '○× 기록을 세어 표로 나타내기', '심8', (d) => {
            const kids = d.shuffle(NAMES).slice(0, 4), right = nums(d, 4, 1, 5, (v) => new Set(v).size >= 3 && sum(v) >= 10), marks = right.map((x) => d.shuffle(Array(x).fill('○').concat(Array(5 - x).fill('×'))));
            const [a, b] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort(), got = marks.map((row) => row.filter((m) => m === '○').length);
            return M('네 학생이 문제를 5개씩 풀었다. 맞힌 문제에 ○, 틀린 문제에 ×를 하였다. 학생별 맞힌 문제 수를 표로 나타낼 때, ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: got[a] }, { label: LABELS[1], answer: got[b] }, { label: LABELS[2], answer: sum(got) }], {
              figure: oxTable(kids, marks) + table(['이름', '맞힌 문제 수(개)'], kids.map((k, i) => [k, i === a ? box(LABELS[0]) : i === b ? box(LABELS[1]) : got[i]]).concat([['합계', box(LABELS[2])]])),
              explain: `학생마다 ○의 수만 센다. ${name(kids[a], '은/는')} ${got[a]}개, ${name(kids[b], '은/는')} ${got[b]}개를 맞혔다. 합계는 ${got.join(' + ')} = ${sum(got)}(개)이다.`,
              facts: { calc: [[String(got[a]), 0], [String(got[b]), 1], [got.join('+'), 2]], unseen: [got[a], got[b]], tallyOf: { list: marks[a], target: '○' } }
            });
          }),
          T('tab-steps', '조사하여 표로 나타내는 차례', '①47', (d) => {
            const steps = ['무엇을 조사할지 정한다.', '조사할 방법을 정한다.', '자료를 조사한다.', '조사한 것을 표로 나타낸다.'];
            const shown = d.until(() => d.shuffle([0, 1, 2, 3]), (s) => s.join() !== '0,1,2,3'), right = [0, 1, 2, 3].map((step) => shown.indexOf(step));
            const options = d.shuffle([right, right.slice().reverse(), [right[1], right[0], right[2], right[3]], [right[0], right[1], right[3], right[2]]]);
            return C('자료를 조사하여 표로 나타내려고 한다. 하는 차례대로 쓴 것은?', options.map((o) => o.map((i) => LABELS[i]).join(', ')), options.indexOf(right), {
              figure: tagged(shown.map((step) => steps[step])), explain: '무엇을 조사할지 정하고, 조사할 방법을 정한 다음, 자료를 조사하여 표로 나타낸다.', facts: { sequence: { ranks: shown, options } }
            });
          })
        ]
      },
      {
        id: 'read', title: '표 읽기와 빈칸', standard: TAB,
        types: [
          T('read-one', '표에서 한 가지의 수 읽기', '①13 심9', (d) => {
            const c = pick(d, d.pick(['fruit', 'animal']), 4), v = nums(d, 4, 2, 8, (x) => distinct(x) && sum(x) <= 22), k = d.int(0, 3);
            return N(`${leadTab(c)} ${c.who(c.names[k])}은 몇 명인가?`, v[k], {
              unit: '명', figure: tab(c, v, [['합계', sum(v)]]), explain: `표에서 ${c.names[k]} 칸의 수를 읽는다. ${c.who(c.names[k])}은 ${v[k]}명이다.`, facts: { calc: [[String(v[k]), 0]] }
            });
          }),
          T('read-total', '합계로 조사한 학생 수 알기', '①14', (d) => {
            const c = pick(d, d.pick(['sport', 'snack']), 5), v = nums(d, 5, 2, 7, (x) => sum(x) >= 17 && sum(x) <= 25);
            return N(`${leadTab(c)} 조사한 학생은 모두 몇 명인가?`, sum(v), {
              unit: '명', figure: tab(c, v, [['합계', sum(v)]]), explain: `합계가 조사한 학생 수이다. 조사한 학생은 모두 ${sum(v)}명이다.`, facts: { calc: [[v.join('+'), 0]] }
            });
          }),
          T('read-sum', '표의 합계 구하기', '①15 심10', (d) => {
            const c = pick(d, d.pick(['color', 'season']), 4), v = nums(d, 4, 3, 8, (x) => sum(x) >= 18 && sum(x) <= 25);
            return N(`${leadTab(c)} 합계에 알맞은 수는?`, sum(v), {
              figure: tab(c, v, [['합계', box()]]), explain: `표의 수를 모두 더한다. ${v.join(' + ')} = ${sum(v)}`, facts: { calc: [[v.join('+'), 0]] }
            });
          }),
          T('read-blank', '합계로 표의 빈칸 구하기', '①16 심11', (d) => {
            const c = pick(d, d.pick(['fruit', 'snack', 'animal']), 4), v = nums(d, 4, 3, 8, (x) => sum(x) >= 16 && sum(x) <= 25), k = d.int(0, 3), all = sum(v), rest = v.filter((_, i) => i !== k);
            return N(`${leadTab(c)} □ 안에 알맞은 수는?`, v[k], {
              figure: tab(c, v.map((x, i) => (i === k ? box() : x)), [['합계', all]]), explain: `합계에서 나머지 수를 모두 뺀다. ${all} - ${rest.join(' - ')} = ${v[k]}`, facts: { calc: [[`${all}-${rest.join('-')}`, 0]] }
            });
          })
        ]
      },
      {
        id: 'graph', title: '그래프로 나타내기', standard: GRAPH,
        types: [
          T('gr-axes', '그래프의 가로와 세로에 나타낸 것', '①21', (d) => {
            const c = pick(d, d.pick(['fruit', 'animal']), 4), v = nums(d, 4, 2, 6, (x) => new Set(x).size >= 3);
            const rows = d.shuffle([[`가로: ${c.kind}, 세로: ${c.axis}`, true], [`가로: ${c.axis}, 세로: ${c.kind}`, false], [`가로: ${c.kind}, 세로: 합계`, false], [`가로: 합계, 세로: ${c.axis}`, false]]);
            return C(`${leadGr(c)} 가로와 세로에 나타낸 것을 바르게 쓴 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: graphOf(c, v, { top: 6 }), explain: `가로에는 ${c.kind}의 이름이 적혀 있고, 세로에는 ${josa(c.axis, '을/를')} 나타내는 수가 적혀 있다.`, facts: { truth: rows.map((r) => r[1]), want: true }
            });
          }),
          T('gr-axes-flip', '가로에 수를 나타낸 그래프의 가로', '①21 심17', (d) => {
            const c = pick(d, d.pick(['snack', 'color']), 4), v = nums(d, 4, 2, 7, (x) => new Set(x).size >= 3), rows = d.shuffle([[c.axis, true], [c.kind, false], ['합계', false], ['조사한 날', false]]);
            return C(`${c.topic} 조사하여 ×를 이용한 그래프로 나타내었다. 그래프의 가로에 나타낸 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: graphOf(c, v, { mark: 'x', flip: true, top: 7 }), explain: `×를 왼쪽에서 오른쪽으로 그린 그래프이다. 가로에는 ${josa(c.axis, '을/를')}, 세로에는 ${josa(c.kind, '을/를')} 나타내었다.`, facts: { truth: rows.map((r) => r[1]), want: true }
            });
          }),
          T('gr-plan-axis', '세로에 수를 나타낼 때 가로에 나타낼 것', '①21', (d) => {
            const c = pick(d, d.pick(['sport', 'season']), 4), v = nums(d, 4, 2, 8, (x) => sum(x) <= 22), rows = d.shuffle([[c.kind, true], [c.axis, false], ['합계', false], ['조사한 날', false]]);
            return C(`${leadTab(c)} 이 표를 그래프로 나타내려고 한다. 세로에 ${josa(c.axis, '을/를')} 나타내면 가로에는 무엇을 나타내어야 하는가?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: tab(c, v, [['합계', sum(v)]]), explain: `세로에 ${josa(c.axis, '을/를')} 나타내면 가로에는 ${josa(c.kind, '을/를')} 나타낸다. 합계는 그래프에 나타내지 않는다.`, facts: { truth: rows.map((r) => r[1]), want: true }
            });
          }),
          T('gr-one', '한 가지에 그리는 ○의 수', '①18 ①22 심15', (d) => {
            const c = pick(d, d.pick(['fruit', 'color']), 4), v = nums(d, 4, 2, 8, (x) => distinct(x) && sum(x) <= 22), k = d.int(0, 3);
            return N(`${leadTab(c)} 표를 보고 ○를 이용하여 그래프로 나타내려고 한다. ${c.names[k]}에는 ○를 몇 개 그려야 하는가?`, v[k], {
              unit: '개', figure: tab(c, v, [['합계', sum(v)]]), explain: `학생 수만큼 ○를 그린다. ${c.who(c.names[k])}이 ${v[k]}명이므로 ○를 ${v[k]}개 그린다.`, facts: { calc: [[String(v[k]), 0]] }
            });
          }),
          T('gr-all', '그래프에 그리는 ×의 수', '①18 ①19 심15 심16', (d) => {
            const c = pick(d, d.pick(['animal', 'snack']), 4), v = nums(d, 4, 2, 7, (x) => sum(x) >= 14 && sum(x) <= 22);
            return N(`${leadTab(c)} 표를 보고 ×를 이용하여 그래프로 나타내려고 한다. ×를 모두 몇 개 그려야 하는가?`, sum(v), {
              unit: '개', figure: tab(c, v, [['합계', sum(v)]]), explain: `학생 한 명에 ×를 하나씩 그린다. 조사한 학생이 모두 ${sum(v)}명이므로 ×를 ${sum(v)}개 그려야 한다.`, facts: { calc: [[v.join('+'), 0]] }
            });
          }),
          T('gr-reach', '아래에서 몇 번째 칸에 ○를 그리는 것', '①18 심15', (d) => {
            const c = pick(d, d.pick(['sport', 'fruit']), 4), t = d.pick([3, 4, 5]);
            const v = nums(d, 4, 1, 7, (x) => distinct(x) && x.filter((y) => y === t).length === 1 && x.some((y) => y > t) && x.some((y) => y < t));
            const at = (ok) => c.names.filter((_, i) => ok(v[i])), key = (list) => list.join(', '), right = at((y) => y >= t);
            const options = d.shuffle([right, at((y) => y > t), at((y) => y < t), at((y) => y <= t)]);
            return C(`${leadTab(c)} 표를 보고 아래에서부터 ○를 그려 그래프로 나타내려고 한다. 아래에서 ${t}번째 칸에 ○를 그리는 ${josa(c.kind, '을/를')} 모두 고른 것은?`, options.map(key), options.indexOf(right), {
              figure: tab(c, v), explain: `학생 수가 ${t}명이거나 ${t}명보다 많으면 아래에서 ${t}번째 칸에도 ○를 그린다. ${c.names.filter((_, i) => v[i] >= t).map((n) => `${n} ${v[c.names.indexOf(n)]}명`).join(', ')}이다.`,
              facts: { truth: options.map((o) => key(o) === key(right)), want: true }
            });
          }),
          T('gr-cells', '그래프의 가로와 세로의 칸 수', '①23', (d) => {
            const n = d.pick([4, 5]), c = pick(d, d.pick(['snack', 'color']), n), v = nums(d, n, 2, 8, (x) => x.filter((y) => y === top(x)).length === 1 && top(x) !== n && top(x) >= 6 && sum(x) <= 25), hi = v.indexOf(top(v));
            return M(`${leadTab(c)} 이 표를 가로에 ${c.kind}, 세로에 ${josa(c.axis, '을/를')} 나타내는 그래프로 나타내려고 한다. 가로와 세로는 각각 적어도 몇 칸이어야 하는가?`, [{ label: '가로', answer: n, unit: '칸' }, { label: '세로', answer: top(v), unit: '칸' }], {
              figure: tab(c, v, [['합계', sum(v)]]),
              explain: `가로에는 ${c.kind} ${n}가지를 나타내므로 ${n}칸이 있어야 한다. 세로에는 가장 많은 ${c.names[hi]}의 ${top(v)}명까지 나타내어야 하므로 적어도 ${top(v)}칸이 있어야 한다. 합계는 그래프에 나타내지 않는다.`,
              facts: { calc: [[String(n), 0], [String(top(v)), 1]], unseen: [n], count: v.map(() => true).concat([false]) }
            });
          }),
          T('gr-way-up', '세로에 수를 나타낼 때 ○를 그리는 방법', '①18 심15', (d) => {
            const c = pick(d, d.pick(['fruit', 'animal']), 4), v = nums(d, 4, 2, 7, (x) => sum(x) <= 22);
            const rows = d.shuffle([['아래에서 위로 빈칸 없이 그린다.', true], ['위에서 아래로 빈칸 없이 그린다.', false], ['왼쪽에서 오른쪽으로 빈칸 없이 그린다.', false], ['아래에서 위로 한 칸씩 띄어서 그린다.', false]]);
            return C(`${leadTab(c)} 이 표를 가로에 ${c.kind}, 세로에 ${josa(c.axis, '을/를')} 나타내는 그래프로 나타내려고 한다. ○를 그리는 방법으로 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: tab(c, v), explain: `세로에 ${josa(c.axis, '을/를')} 나타내는 그래프는 ○를 아래에서 위로 한 칸에 하나씩 빈칸 없이 그린다.`, facts: { truth: rows.map((r) => r[1]), want: true }
            });
          }),
          T('gr-way-right', '가로에 수를 나타낼 때 /를 그리는 방법', '①19 심16', (d) => {
            const c = pick(d, d.pick(['sport', 'color']), 4), v = nums(d, 4, 2, 7, (x) => sum(x) <= 22);
            const rows = d.shuffle([['왼쪽에서 오른쪽으로 빈칸 없이 그린다.', true], ['오른쪽에서 왼쪽으로 빈칸 없이 그린다.', false], ['아래에서 위로 빈칸 없이 그린다.', false], ['왼쪽에서 오른쪽으로 한 칸씩 띄어서 그린다.', false]]);
            return C(`${leadTab(c)} 이 표를 가로에 ${c.axis}, 세로에 ${josa(c.kind, '을/를')} 나타내는 그래프로 나타내려고 한다. /를 그리는 방법으로 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: tab(c, v), explain: `가로에 ${josa(c.axis, '을/를')} 나타내는 그래프는 /를 왼쪽에서 오른쪽으로 한 칸에 하나씩 빈칸 없이 그린다.`, facts: { truth: rows.map((r) => r[1]), want: true }
            });
          }),
          T('gr-rest', '그리다 만 그래프 완성하기', '①20', (d) => {
            const c = pick(d, d.pick(['snack', 'fruit']), 4), v = nums(d, 4, 2, 7, (x) => distinct(x)), [a, b] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort();
            return N(`${leadTab(c)} 이 표를 보고 그래프를 그리고 있다. 그래프를 완성하려면 ○를 몇 개 더 그려야 하는가?`, v[a] + v[b], {
              unit: '개', figure: tab(c, v) + graphOf(c, v.map((x, i) => (i === a || i === b ? null : x)), { top: 7 }),
              explain: `그래프에서 ${josa(c.names[a], '과/와')} ${c.names[b]}의 줄이 비어 있다. 표에서 ${c.names[a]} ${v[a]}명, ${c.names[b]} ${v[b]}명이므로 ○를 ${v[a]} + ${v[b]} = ${v[a] + v[b]}(개) 더 그려야 한다.`,
              facts: { calc: [[`${v[a]}+${v[b]}`, 0]] }
            });
          }),
          T('gr-both', '그래프를 보고 표 완성하기', '①20 심10 심18', (d) => {
            const c = pick(d, d.pick(['animal', 'color']), 4), v = nums(d, 4, 2, 6, (x) => distinct(x)), [a, b] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort();
            return M(`${c.topic} 조사하여 표와 그래프로 나타내고 있다. 표의 ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: v[a] }, { label: LABELS[1], answer: v[b] }, { label: LABELS[2], answer: sum(v) }], {
              figure: tab(c, v.map((x, i) => (i === a ? box(LABELS[0]) : i === b ? box(LABELS[1]) : x)), [['합계', box(LABELS[2])]]) + graphOf(c, v.map((x, i) => (i === a || i === b ? x : null)), { top: 6 }),
              explain: `그래프에서 ${josa(c.names[a], '은/는')} ○가 ${v[a]}개, ${josa(c.names[b], '은/는')} ○가 ${v[b]}개이다. 합계는 ${v.join(' + ')} = ${sum(v)}(명)이다.`,
              facts: { calc: [[String(v[a]), 0], [String(v[b]), 1], [v.join('+'), 2]] }
            });
          }),
          T('gr-right', '바르게 나타낸 그래프 고르기(세로에 수)', '①24', (d) => {
            const c = pick(d, d.pick(['fruit', 'snack']), 3), v = nums(d, 3, 1, 4, (x) => distinct(x)), size = 5;
            const k = d.until(() => d.int(0, 2), (i) => v[i] >= 2), m = d.int(0, 2), off = v.map((x, i) => (i === m ? x + (x === 4 ? -1 : 1) : x));
            const drawn = d.shuffle([['right', v.map(fill)], ['gap', v.map((x, i) => (i === k ? gapRow(d, x) : fill(x)))], ['far', v.map((x) => farRow(x, size))], ['off', off.map(fill)]]);
            const tagOf = (what) => TAGS[drawn.findIndex((g) => g[0] === what)];
            return C(`${leadTab(c)} 표를 보고 ○를 이용하여 그래프로 나타내었다. 바르게 나타낸 것은?`, TAGS, drawn.findIndex((g) => g[0] === 'right'), {
              figure: tab(c, v) + drawn.map((g, i) => cap(TAGS[i], graph(c.names, g[1], { mini: true, top: size }))).join(''),
              explain: `○는 아래에서 위로 빈칸 없이, 표의 수만큼 그린다. ${tagOf('gap')}는 ${c.names[k]}에 빈칸이 있고, ${tagOf('far')}는 위에서부터 그렸고, ${tagOf('off')}는 ${c.names[m]}의 수가 표와 다르다.`,
              facts: { truth: drawn.map((g) => drawnRight(g[1], v)), want: true }
            });
          }),
          T('gr-right-flip', '바르게 나타낸 그래프 고르기(가로에 수)', '①19 ①24 심16', (d) => {
            const c = pick(d, d.pick(['color', 'fruit']), 3), v = nums(d, 3, 1, 4, (x) => distinct(x)), size = 5;
            const k = d.until(() => d.int(0, 2), (i) => v[i] >= 2), m = d.int(0, 2), off = v.map((x, i) => (i === m ? x + (x === 4 ? -1 : 1) : x));
            const drawn = d.shuffle([['right', v.map(fill)], ['gap', v.map((x, i) => (i === k ? gapRow(d, x) : fill(x)))], ['far', v.map((x) => farRow(x, size))], ['off', off.map(fill)]]);
            const tagOf = (what) => TAGS[drawn.findIndex((g) => g[0] === what)];
            return C(`${leadTab(c)} 표를 보고 가로에 ${josa(c.axis, '을/를')} 나타내어 /를 이용한 그래프로 나타내었다. 바르게 나타낸 것은?`, TAGS, drawn.findIndex((g) => g[0] === 'right'), {
              figure: tab(c, v) + drawn.map((g, i) => cap(TAGS[i], graph(c.names, g[1], { mini: true, flip: true, mark: 's', top: size }))).join(''),
              explain: `/는 왼쪽에서 오른쪽으로 빈칸 없이, 표의 수만큼 그린다. ${tagOf('gap')}는 ${c.names[k]}에 빈칸이 있고, ${tagOf('far')}는 오른쪽에서부터 그렸고, ${tagOf('off')}는 ${c.names[m]}의 수가 표와 다르다.`,
              facts: { truth: drawn.map((g) => drawnRight(g[1], v)), want: true }
            });
          })
        ]
      },
      { id: 'know', title: '표와 그래프의 내용 알기', standard: GRAPH, types: [] },
      { id: 'good', title: '표와 그래프의 편리한 점', standard: GRAPH, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
