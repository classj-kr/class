// 6학년 1학기 5단원 여러 가지 그래프 — 단원 틀, 띠그래프·원그래프 그림 도구, 기본 문항(알아보기, 읽기, 백분율을 구하여 표로 나타내기).
// 수집해 둔 교과서 10종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 62·61·51꼴, 심화꼴 64꼴)을 번호마다 따져,
// 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 주고 무엇을 묻는가를 보고 실었다. 뽑은 글에는 그래프 그림이 없어 그래프의 수와 상황은 모두 새로 정했다.
// (그래프로 나타내기·해석하기·두 그래프 비교하기·여러 가지 그래프의 기본 문항은 6-1-5b.js, 실력 문항은 6-1-5c.js. 꼴마다의 판정은 수집본의 _분석/6-1-5/싣기_대조표.md)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 영역: 자료와 가능성.
//   6수04-02 자료를 수집하여 띠그래프나 원그래프로 나타내고 해석할 수 있다.
//   6수04-03 탐구 문제를 설정하고, 그에 맞는 자료를 수집, 정리하여 적절한 그래프로 나타내고 해석할 수 있다.
// 교육과정: 「조사 자료에서 전체에 대한 각 부분의 비율을 비교해야 하는 문제 상황을 제시하여 띠그래프와 원그래프의 필요성을 인식하게 한다.」
//   「원그래프를 그릴 때는 눈금이 표시된 원을 사용하게 한다.」「복잡한 자료의 평균이나 백분율을 구할 때 계산기를 사용하게 할 수 있다.」
//   「자료 수집의 목적과 수집한 자료의 특성에 맞는 그래프로 적절히 표현되었는지, 또는 정보를 왜곡하는 오류가 포함되어 있지는 않은지 등을 비판적으로 판단하게 할 수 있다.」
//
// 싣는 기준
//  - 주는 것(표, 글, 낱낱의 자료, 띠그래프, 원그래프, 두 그래프, 막대그래프·그림그래프), 묻는 것(백분율, 항목, 차례, 칸 수, 수량, 옳은 설명),
//    셈의 구조(읽기, 100에서 빼기, 수 ÷ 전체, 전체 × 백분율, 몇 배)가 다르면 다른 문제다. 조사한 것이나 수만 다른 것은 한 번만 싣는다.
//  - 백분율은 모두 자연수로 떨어지는 쉬운 수만 쓴다(전체 20·25·40·50·200·400·500). 반올림하는 백분율, 계산기가 있어야 하는 큰 수는 쓰지 않는다.
//  - 원그래프는 언제나 둘레에 눈금(20칸이나 10칸)이 있는 원으로 그리고 12시에서 시계 방향으로 놓는다. 중심각을 각도로 셈하는 문항은 없다.
//  - 띠그래프는 칸의 너비가 백분율에 꼭 맞고 위에 0~100 눈금 자가 있다. 백분율을 눈금으로 읽게 하는 문항은 그 칸에 백분율을 적지 않는다.
//    좁은 칸의 이름과 백분율은 띠 아래(원그래프는 원 밖)에 선으로 이어 적는다.
//  - 지워진 백분율을 100에서 빼어 구하는 문항은 지워진 칸의 금이 눈금 위에 놓이지 않게 한다(눈금 한 칸 10 %, 5의 배수가 아닌 수). 눈금을 읽어 답하면 묻는 일을 하지 않게 되기 때문이다.
//  - 그리는 꼴(작도)은 고르기·수 답으로 바꾸었다: 띠그래프·원그래프 그리기 → 바르게 나타낸 그래프 고르기, 차지하는 눈금의 칸 수, 그래프의 빈 곳.
//  - 설명·까닭을 쓰는 꼴(서술형)은 옳은 설명 고르기로 바꾸었다. 조사·탐구 활동과 열린 물음은 싣지 않는다.
//  - 사람을 가를 때 남학생·여학생이라는 말은 쓰지 않는다(학년·반·학교로 가른다). 실제 지역·기관 이름과 실제 통계는 쓰지 않는다(어느 학교, 가 마을).
//  - 수와 단위 기호는 띄어 쓴다(25 %, 12 cm, 120 kg).
//
// 뺀 것과 까닭(꼴 번호마다의 판정은 싣기_대조표.md)
//  - 6학년 2학기 비례식·비례배분: 서로 몇 배인 두 빈 항목 나누기(②49 ③31 심15·39), 자연수 배가 아닌 배로 다른 항목의 수 구하기(①40 심26·28),
//    두 항목의 합으로 다른 항목의 수 구하기(①43), (자연수) ÷ (소수)로 전체 구하기(②47의 뒷부분 ②48 ③35의 일부)
//  - 띠의 길이를 여러 단계로 셈하기(심32), 조건을 차례로 풀어 비율 셋 구하기(②50), 다섯 단계 넘게 이어지는 것(심45의 변형)
//  - 반올림하는 백분율·계산기가 있어야 하는 수(②31 ③14 심19·40)
//  - 6학년 1학기 4단원 「비와 비율」의 일: 그래프 없이 비율을 백분율로 고치기만 하는 것(③51), 색칠한 칸 수의 비율(③20)
//  - 3·4학년 그래프 되짚기: 그림그래프·막대그래프·꺾은선그래프 읽기와 그리기(②59 ③21·22·48 심63·64)
//  - 작도·서술형·활동: 그래프 그리기(①21·23·25·58 ②34·36 ③17·18 심42 — 고르기로 바꿈), 알 수 있는 내용 쓰기(①36 ②21 ③37 심54),
//    그래프를 보고 정하기와 까닭(①37 ②22 심55), 좋은 점·같은 점·다른 점 쓰기(①59·60 ②4 ③7·47 심56 — 옳은 설명 고르기로 바꿈), 탐구·조사 활동(①61 ②61 ③50 심61)
// 묻는 말: 수나 값을 물으면 "~은?/~는?", 양을 물으면 "몇 ~인가?", 시키는 말은 "~구하시오."로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, table, barChart, pictograph, N, M, C } = B.kit;
  const RATIO = '6수04-02', KIND = '6수04-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const sum = (v) => v.reduce((x, y) => x + y, 0), top = (v) => Math.max(...v), low = (v) => Math.min(...v);
  const distinct = (v) => new Set(v).size === v.length;
  const lone = (v, x) => v.filter((y) => y === x).length === 1;
  const truthOf = (rows, want) => ({ truth: rows.map((r) => r[1]), want });
  const tail = (word, pair) => josa(word, pair).slice(String(word).length);
  const MARKS = ['㉠', '㉡', '㉢', '㉣', '㉤'];

  // ── 조사한 것 ────────────────────────────────────────────────
  // noun: 항목을 이르는 말, names: 항목, unit: 세는 단위, count: 세는 것, title: 그래프의 제목, intro: 「~ 조사하여 나타낸」 앞에 놓는 말,
  // one(n): 한 항목에 드는 것(「딸기를 좋아하는 학생」), all: 전체를 이르는 말, most: 가장 큰 항목을 묻는 말, say(n): 글에서 항목을 이르는 말, fixed: 항목의 차례가 정해져 있다.
  const like = (noun, names) => ({ noun, names, unit: '명', count: '학생 수', title: `좋아하는 ${noun}별 학생 수`, intro: `어느 학교 6학년 학생들이 좋아하는 ${josa(noun, '을/를')}`, one: (n) => `${josa(n, '을/를')} 좋아하는 학생`, all: '조사한 학생', most: `가장 많은 학생이 좋아하는 ${noun}` });
  const SETS = {
    fruit: like('과일', ['사과', '포도', '딸기', '수박', '참외', '자두']),
    sport: like('운동', ['축구', '피구', '농구', '수영', '야구', '탁구']),
    subject: like('과목', ['국어', '수학', '사회', '과학', '체육', '음악']),
    snack: like('간식', ['김밥', '과자', '만두', '빵', '떡', '호두']),
    color: like('색깔', ['빨강', '파랑', '노랑', '초록', '보라', '분홍']),
    season: Object.assign(like('계절', ['봄', '여름', '가을', '겨울']), { fixed: true }),
    pet: { noun: '동물', names: ['강아지', '고양이', '토끼', '햄스터', '거북'], unit: '명', count: '학생 수', title: '기르고 싶은 동물별 학생 수', intro: '어느 학교 6학년 학생들이 기르고 싶은 동물을', one: (n) => `${josa(n, '을/를')} 기르고 싶은 학생`, all: '조사한 학생', most: '가장 많은 학생이 기르고 싶은 동물' },
    place: { noun: '장소', names: ['박물관', '과학관', '동물원', '민속촌', '수목원'], unit: '명', count: '학생 수', title: '가고 싶은 체험 학습 장소별 학생 수', intro: '어느 학교 6학년 학생들이 가고 싶은 체험 학습 장소를', one: (n) => `${n}에 가고 싶은 학생`, all: '조사한 학생', most: '가장 많은 학생이 가고 싶은 장소' },
    job: { noun: '장래 희망', names: ['선생님', '요리사', '의사', '과학자', '가수'], unit: '명', count: '학생 수', title: '장래 희망별 학생 수', intro: '어느 학교 6학년 학생들의 장래 희망을', one: (n) => `장래 희망이 ${n}인 학생`, all: '조사한 학생', most: '가장 많은 학생의 장래 희망' },
    village: { noun: '마을', names: ['가', '나', '다', '라', '마'], fixed: true, unit: '명', count: '학생 수', title: '마을별 학생 수', intro: '어느 학교 학생들이 사는 마을을', one: (n) => `${n} 마을에 사는 학생`, say: (n) => `${n} 마을`, all: '조사한 학생', most: '가장 많은 학생이 사는 마을' },
    recycle: { noun: '재활용품', names: ['종이', '캔', '유리병', '비닐', '플라스틱'], unit: 'kg', count: '무게', title: '재활용품 종류별 무게', intro: '어느 아파트에서 일주일 동안 나온 재활용품의 무게를 종류별로', one: (n) => `${n}의 무게`, all: '재활용품 전체의 무게', most: '가장 많이 나온 재활용품' },
    field: { noun: '채소', names: ['배추', '무', '고추', '감자', '상추'], unit: 'm²', count: '넓이', title: '채소별 심은 넓이', intro: '어느 밭에 심은 채소별 넓이를', one: (n) => `${josa(n, '을/를')} 심은 넓이`, all: '밭 전체의 넓이', most: '가장 넓은 곳에 심은 채소' },
    money: { noun: '쓰임', names: ['저축', '학용품', '간식', '교통비', '선물'], unit: '원', count: '금액', title: '용돈의 쓰임별 금액', intro: '수아가 한 달 용돈을 쓴 곳을', one: (n) => `${n}에 쓴 돈`, all: '한 달 용돈', most: '돈을 가장 많이 쓴 곳' },
    books: { noun: '책', names: ['동화책', '과학책', '위인전', '만화책', '시집'], unit: '권', count: '책 수', title: '종류별 책 수', intro: '어느 학급 문고에 있는 책의 수를 종류별로', one: (n) => n, all: '학급 문고의 책', most: '가장 많은 책' },
    farm: { noun: '가축', names: ['닭', '돼지', '소', '오리', '염소'], unit: '마리', count: '마릿수', title: '가축별 마릿수', intro: '어느 농장에서 기르는 가축의 수를 종류별로', one: (n) => n, all: '농장의 가축', most: '가장 많은 가축' },
    crop: { noun: '곡식', names: ['쌀', '보리', '콩', '옥수수', '밀'], unit: 'kg', count: '생산량', title: '곡식별 생산량', intro: '어느 마을의 곡식 생산량을 종류별로', one: (n) => `${n}의 생산량`, all: '곡식 전체의 생산량', most: '가장 많이 생산한 곡식' }
  };
  const say = (c, n) => (c.say ? c.say(n) : n);
  // 수와 단위: 단위 기호는 띄어 쓰고(120 kg) 우리말 단위는 붙여 쓴다(120명).
  const amt = (c, n) => n + (/^[A-Za-z]/.test(c.unit) ? ' ' : '') + c.unit;
  const pc = (p) => `${p} %`;
  const lead = (c, kind) => `${c.intro} 조사하여 나타낸 ${kind}이다.`;
  // 「가장 많은 …」을 「두 번째로 많은 …」으로
  const nth = (c, k) => c.most.replace('가장', ['', '', '두 번째로', '세 번째로'][k]);

  // ── 수 고르기 ────────────────────────────────────────────────
  // 합이 100인 백분율 n개. step 의 배수이고 lo 이상 hi 이하. ok(백분율들)을 만족할 때까지 다시 뽑는다.
  const parts = (d, n, o) => {
    const opt = o || {}, step = opt.step || 5, lo = opt.lo || 10, hi = opt.hi || 45;
    return d.until(() => { const v = Array.from({ length: n - 1 }, () => d.int(Math.ceil(lo / step), Math.floor(hi / step)) * step); v.push(100 - sum(v)); return v; }, (v) => v[n - 1] >= lo && v[n - 1] <= hi && v[n - 1] % step === 0 && (!opt.ok || opt.ok(v)));
  };
  // 그래프 하나의 자료. key: 조사한 것, n: 항목 수. o: parts 의 조건에 더해 etc(가장 작은 것을 맨 끝의 「기타」로), sort(큰 것부터 놓는다), names(항목을 정해 준다).
  const make = (d, key, n, o) => {
    const c = SETS[key], opt = o || {}, k = opt.etc ? n - 1 : n;
    const names = (opt.names || (c.fixed ? c.names.slice(0, k) : d.shuffle(c.names).slice(0, k))).concat(opt.etc ? ['기타'] : []);
    let p = parts(d, n, opt);
    if (opt.etc) { const m = p.indexOf(low(p)); p = p.slice(0, m).concat(p.slice(m + 1), [p[m]]); }
    if (opt.sort) p = p.slice(0, k).sort((x, y) => y - x).concat(p.slice(k));
    return { c, names, p, n };
  };
  // 한 항목이 다른 항목의 자연수 배(2배 이상)인 짝 [큰 쪽, 작은 쪽]
  const ratioPairs = (p) => { const out = []; p.forEach((x, i) => p.forEach((y, j) => { if (i !== j && x > y && x % y === 0) out.push([i, j]); })); return out; };
  // 차례를 묻는 보기 넷: 바른 차례와, 거꾸로·놓인 차례·이웃한 둘을 바꾼 차례 가운데 서로 다른 셋
  const orderOptions = (d, right) => {
    const n = right.length, cand = [right, right.slice().reverse(), right.map((_, i) => i), [right[1], right[0]].concat(right.slice(2)), right.slice(0, n - 2).concat([right[n - 1], right[n - 2]]), [right[0], right[2], right[1]].concat(right.slice(3))];
    const seen = new Set(), out = [];
    for (const o of cand) if (!seen.has(o.join())) { seen.add(o.join()); out.push(o); }
    return d.shuffle(out.slice(0, 4));
  };
  const desc = (p) => p.map((_, i) => i).sort((x, y) => p[y] - p[x]);

  // ── 그림 ────────────────────────────────────────────────────
  // 칸의 빛깔: 옆 칸과 구별되고 글자가 또렷이 읽히는 옅은 색. 「기타」는 회색. 칸에 k 를 주면 그 번호의 빛깔을, fill 을 주면 그 빛깔을 쓴다(빛깔로 항목을 알아채면 안 되는 그림).
  const INK = ['#bfdbfe', '#fde68a', '#bbf7d0', '#fbcfe8', '#ddd6fe', '#fed7aa'], GRAY = '#e2e8f0';
  const fillOf = (cell, i) => cell.fill || (cell.name === '기타' ? GRAY : INK[(cell.k == null ? i : cell.k) % INK.length]);
  // 글의 너비 어림(한글 1, 숫자 0.6, 괄호 0.4, % 1, 빈칸 0.3). 조금 넉넉하게 잡는다.
  const tw = (text, fs) => Array.from(String(text)).reduce((w, ch) => w + (ch === ' ' ? 0.3 : ch === '%' ? 1 : /[0-9~.,·]/.test(ch) ? 0.6 : /[()]/.test(ch) ? 0.4 : /[A-Za-z]/.test(ch) ? 0.7 : 1), 0) * fs;
  // 칸에 적는 글. show: 'both'(이름과 백분율, 기본) | 'name'(이름만 — 백분율은 눈금으로 읽는다) | 'blank'(이름과 □ %) | 'mark'(기호만). as: 그래프에 적힌 백분율(잘못 적은 수를 보일 때).
  const wordsOf = (c) => (c.show === 'mark' ? [c.mark] : c.show === 'name' ? [c.name] : c.show === 'blank' ? [c.name, `${c.mark || '□'} %`] : [c.name, pc(c.as == null ? c.pct : c.as)]);
  // 그림 설명: 그려진 크기를 적는다. 백분율을 가린 칸(blank)은 □, 잘못 적은 칸(as)은 적힌 수를 적는다.
  const saidOf = (c) => (c.show === 'mark' ? `${c.mark} ${pc(c.pct)}` : c.show === 'blank' ? `${c.name} ${c.mark || '□'} %` : `${c.name} ${pc(c.as == null ? c.pct : c.as)}`);
  const word = (x, y, text, fs, anchor) => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor || 'middle'}" style="font-size:${fs}px;font-weight:600;fill:#0f172a">${text}</text>`;
  const rule = (x1, y1, x2, y2, ink, wide) => `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" style="stroke:${ink || '#0f172a'};stroke-width:${wide || 1}"/>`;
  // 글씨 크기 [이름, 백분율]: 큰 것부터 대어 보고 들어가는 것을 쓴다. 기호는 조금 크게 적는다.
  const SIZES = [[11.5, 10.5], [10.5, 9.5]];
  const sized = (c, ws, fits) => (c.show === 'mark' ? [[13, 13]] : SIZES).find((fs) => fits(Math.max(...ws.map((t, k) => tw(t, fs[k]))), fs));
  // 띠그래프. rows: 칸의 배열 [{ name, pct, show, mark, k }], 또는 띠 여럿 [{ tag: 띠의 이름, cells }].
  // 위에 0·10·…·100 눈금 자를 두고(작은 눈금 한 칸은 o.tick %, 기본 5), 칸의 너비는 백분율에 꼭 맞는다. 글이 칸에 들어가지 않으면 띠 아래에 선으로 이어 적는다.
  function band(rows, o) {
    const opt = o || {}, tick = opt.tick || 5, list = rows[0] && rows[0].cells ? rows : [{ cells: rows }];
    const tagFs = (t) => (/[가-힣0-9]/.test(t) ? 11 : 13.5);
    const W = 288, tagW = Math.max(0, ...list.map((r) => (r.tag ? tw(r.tag, tagFs(r.tag)) + 7 : 0))), x0 = 6 + tagW, x1 = W - 11, u = (x1 - x0) / 100, X = (p) => x0 + p * u, H = 34;
    let out = word(W - 1, 10, '(%)', 9.5, 'end') + rule(X(0), 35, X(100), 35);
    for (let p = 0; p <= 100; p += tick) out += rule(X(p), 35 - (p % 10 === 0 ? 7 : p % 5 === 0 ? 5 : 3), X(p), 35);
    for (let p = 0; p <= 100; p += 10) out += word(X(p), 24, p, 9.5);
    let y = 39;
    list.forEach((r) => {
      const below = []; let acc = 0;
      if (r.tag) out += word(3, y + H / 2 + 4, r.tag, tagFs(r.tag), 'start');
      r.cells.forEach((c, i) => {
        const x = X(acc), w = c.pct * u, mid = x + w / 2, ws = wordsOf(c), fs = sized(c, ws, (need) => need + 3 <= w);
        out += `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${H}" style="fill:${fillOf(c, i)};stroke:#334155;stroke-width:1"/>`;
        if (fs) out += ws.length === 2 ? word(mid, y + 14.5, ws[0], fs[0]) + word(mid, y + 27.5, ws[1], fs[1]) : word(mid, y + 21.5, ws[0], fs[0]);
        else below.push({ mid, text: ws.length === 2 ? `${ws[0]}(${ws[1]})` : ws[0] });
        acc += c.pct;
      });
      // 칸에 들어가지 않은 글: 띠 아래 첫 줄에 놓고, 앞의 글과 겹치면 둘째 줄에 놓는다.
      const ends = [-99, -99]; let depth = 0;
      below.forEach((b) => {
        const w = tw(b.text, 10); let at = Math.min(Math.max(b.mid, x0 + w / 2), W - 1 - w / 2), line = at - w / 2 >= ends[0] + 4 ? 0 : 1;
        if (line === 1 && at - w / 2 < ends[1] + 4) at = ends[1] + 4 + w / 2;
        ends[line] = at + w / 2; depth = Math.max(depth, line + 1);
        const ty = y + H + 13.5 + line * 13;
        out += rule(b.mid, y + H, at, ty - 9.5, '#64748b', 0.8) + word(at, ty, b.text, 10);
      });
      y += H + (depth ? depth * 13 + 5 : 0) + 8;
    });
    const told = (r) => `왼쪽부터 ${r.cells.map(saidOf).join(', ')}`;
    const said = `띠그래프: 0부터 100까지 작은 눈금 ${100 / tick}칸. ${list.map((r) => (r.tag ? `${r.tag} — ` : '') + told(r)).join(' / ')}`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${(y - 4).toFixed(0)}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }
  // 원그래프. cells: 칸의 배열(띠그래프와 같다). 12시에서 시계 방향으로 놓고, 둘레에 눈금을 긋는다(한 칸은 o.tick %, 기본 5).
  // 눈금에 적는 수는 한 칸이 5 %(1 %)이면 0·25·50·75, 10 %이면 0·50 이다(o.nums 로 바꿀 수 있다). 글이 칸에 들어가지 않으면 원 밖에 선으로 이어 적는다. o.r: 반지름.
  function pie(cells, o) {
    const opt = o || {}, tick = opt.tick || 5, R = opt.r || 76, nums = opt.nums || (tick === 10 ? [0, 50] : [0, 25, 50, 75]);
    const at = (p, r) => { const a = (p * 3.6 - 90) * Math.PI / 180; return [r * Math.cos(a), r * Math.sin(a)]; };
    const box4 = [-R - 19, -R - 19, R + 19, R + 19], grow = (xa, ya, xb, yb) => { box4[0] = Math.min(box4[0], xa); box4[1] = Math.min(box4[1], ya); box4[2] = Math.max(box4[2], xb); box4[3] = Math.max(box4[3], yb); };
    const placed = []; let wedges = '', words = '', marks = '', acc = 0;
    cells.forEach((c, i) => {
      const [xa, ya] = at(acc, R), [xb, yb] = at(acc + c.pct, R), ink = `fill:${fillOf(c, i)};stroke:#334155;stroke-width:1;stroke-linejoin:round`, from = acc;
      wedges += c.pct >= 100 ? `<circle cx="0" cy="0" r="${R}" style="${ink}"/>` : `<path d="M0 0L${xa.toFixed(2)} ${ya.toFixed(2)}A${R} ${R} 0 ${c.pct > 50 ? 1 : 0} 1 ${xb.toFixed(2)} ${yb.toFixed(2)}Z" style="${ink}"/>`;
      const ws = wordsOf(c), two = ws.length === 2, mid = acc + c.pct / 2, base = c.pct >= 50 ? 0.5 : c.pct >= 30 ? 0.56 : 0.62;
      // 글 덩이의 네 귀가 모두 부채꼴 안에 들어가는 자리를 찾는다(가운데에서 가까운 자리부터). 두 줄 글은 12 %보다 좁은 칸에 넣지 않는다.
      const corners = (f, w, fsz) => { const [tx, ty] = at(mid, R * f), up = (two ? ty - 2 : ty + 4) - fsz[0] * 0.84, down = (two ? ty + 10.5 : ty + 4) + fsz[two ? 1 : 0] * 0.24; return [[tx - w / 2, up], [tx + w / 2, up], [tx - w / 2, down], [tx + w / 2, down]]; };
      const within = ([x, y]) => { const ang = (Math.atan2(x, -y) / (2 * Math.PI) * 100 + 100) % 100; return Math.hypot(x, y) <= R - 2.5 && (c.pct >= 100 || (ang >= from + 0.8 && ang <= from + c.pct - 0.8)); };
      let f = null;
      const fs = two && c.pct < 12 ? null : sized(c, ws, (need, fsz) => { f = [0.5, 0.56, 0.62, 0.68, 0.74, 0.8].find((v) => v >= base && corners(v, need * 1.05 + 2, fsz).every(within)); return f != null; });
      if (fs) {
        const [tx, ty] = at(mid, R * f);
        words += two ? word(tx, ty - 2, ws[0], fs[0]) + word(tx, ty + 10.5, ws[1], fs[1]) : word(tx, ty + 4, ws[0], fs[0]);
      } else {
        // 원 밖에 적는다. 눈금에 적힌 수나 먼저 적은 글과 겹치면 둘레를 따라 조금씩 비켜 놓는다.
        const text = two ? `${ws[0]}(${ws[1]})` : ws[0], w = tw(text, 10) * 1.05;
        const spot = (turn) => { const [lx, ly] = at(turn, R + 22), anchor = lx > 8 ? 'start' : lx < -8 ? 'end' : 'middle', ty = ly + (ly < -R * 0.9 ? -1 : ly > R * 0.9 ? 9 : 3.5), left = anchor === 'start' ? lx : anchor === 'end' ? lx - w : lx - w / 2; return { turn, lx, ty, anchor, box: [left - 2, ty - 10, left + w + 2, ty + 4] }; };
        const clash = (s) => nums.concat([100]).some((v) => Math.abs(v - s.turn) < 2.6) || placed.some((b) => s.box[0] < b[2] && b[0] < s.box[2] && s.box[1] < b[3] && b[1] < s.box[3]);
        const s = [0, 3.2, -3.2, 6.4, -6.4, 9.6, -9.6, 12.8, -12.8].map((shift) => spot(mid + shift)).find((x) => !clash(x)) || spot(mid), [sx, sy] = at(mid, R + 1), [ex, ey] = at(s.turn, R + 18);
        words += rule(sx, sy, ex, ey, '#64748b', 0.8) + word(s.lx, s.ty, text, 10, s.anchor);
        placed.push(s.box); grow(s.box[0], s.box[1], s.box[2], s.box[3]);
      }
      acc += c.pct;
    });
    for (let p = 0; p < 100; p += tick) { const big = nums.includes(p), [xa, ya] = at(p, R), [xb, yb] = at(p, R + (big ? 6 : tick === 1 && p % 5 !== 0 ? 2.6 : 4)); marks += rule(xa, ya, xb, yb, '#0f172a', big ? 1.3 : 1); }
    nums.forEach((p) => { const [x, y] = at(p, R + 12.5); marks += word(x, y + 3.4, p, 9.5); });
    const w = box4[2] - box4[0], h = box4[3] - box4[1];
    const said = `원그래프: 둘레 100 %를 눈금 ${100 / tick}칸으로 똑같이 나누었다. 12시부터 시계 방향으로 ${cells.map(saidOf).join(', ')}`;
    return `<svg class="mb-geo" viewBox="${box4[0].toFixed(1)} ${box4[1].toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}" width="${Math.ceil(w)}" role="img" aria-label="${said}">${wedges}${marks}${words}</svg>`;
  }
  // 그래프 위에 제목을 붙인다.
  const cap = (label, html) => `<div style="display:grid;gap:3px;justify-items:start;max-width:100%"><div style="font-size:0.95rem;font-weight:600">${label}</div>${html}</div>`;
  // 그래프의 칸: how(i) 가 칸마다 더할 것({ show, mark, k … })을 돌려준다.
  const cells = (g, how) => g.names.map((name, i) => Object.assign({ name, pct: g.p[i] }, typeof how === 'function' ? how(i) : how));
  // 표(세로). cols: [[머리글, 값들], …]. foot 을 주면 맨 아래에 합계 줄을 붙인다.
  const tab = (g, cols, foot) => table([g.c.noun].concat(cols.map((x) => x[0])), g.names.map((name, i) => [name].concat(cols.map((x) => x[1][i]))).concat(foot ? [['합계'].concat(foot)] : []));
  const head = (c) => `${c.count}(${c.unit})`;
  const words = (list) => '<div class="mb-numbers">' + list.map((w) => '<span style="font-size:1.05rem">' + w + '</span>').join('') + '</div>';
  // 항목별 수: 백분율 × 전체 ÷ 100
  const counts = (g, total) => g.p.map((p) => p * total / 100);

  B.kit.g615 = { RATIO, KIND, T, sum, top, low, distinct, lone, truthOf, tail, MARKS, SETS, say, amt, pc, lead, nth, parts, make, ratioPairs, orderOptions, desc, band, pie, cap, cells, tab, head, words, counts, tw, word, rule, INK, GRAY };

  B.addUnit({
    id: '6-1-5', grade: 6, semester: 1, no: 5, title: '여러 가지 그래프', version: 1,
    groups: [
      {
        id: 'know', title: '띠그래프와 원그래프 알아보기', standard: RATIO,
        types: [
          T('know-name', '띠그래프와 원그래프의 뜻', '①1 ②1 ③1 심1', (d, n) => {
            if (n === 0) {
              const list = d.shuffle(['띠그래프', '원그래프', '막대그래프', '꺾은선그래프']);
              return C('전체에 대한 각 부분의 비율을 띠 모양에 나타낸 그래프를 무엇이라고 하는가?', list, list.indexOf('띠그래프'), { explain: '전체에 대한 각 부분의 비율을 띠 모양에 나타낸 그래프를 띠그래프라고 한다.', facts: { truth: list.map((w) => w === '띠그래프'), want: true } });
            }
            const g = make(d, 'fruit', 4, { sort: true, lo: 15, ok: distinct }), list = d.shuffle(['원그래프', '띠그래프', '그림그래프', '막대그래프']);
            return C(`${g.c.intro} 조사하여 그래프로 나타내었다. 이와 같이 전체에 대한 각 부분의 비율을 원 모양에 나타낸 그래프를 무엇이라고 하는가?`, list, list.indexOf('원그래프'), {
              figure: cap(g.c.title, pie(cells(g))), explain: '전체에 대한 각 부분의 비율을 원 모양에 나타낸 그래프를 원그래프라고 한다.', facts: { truth: list.map((w) => w === '원그래프'), want: true }
            });
          }, { count: 2 }),
          T('know-wide', '원그래프에서 가장 넓은 부분을 차지하는 항목', '②1의 변형 ②7의 변형', (d) => {
            const g = make(d, d.pick(['sport', 'subject']), 4, { ok: (v) => distinct(v) && top(v) - v.slice().sort((x, y) => y - x)[1] <= 10 }), c = g.c, hi = g.p.indexOf(top(g.p));
            return C(`${c.intro} 조사하여 백분율로 나타낸 표이다. 이 표를 원그래프로 나타낼 때, 가장 넓은 부분을 차지하는 ${josa(c.noun, '은/는')}?`, g.names, hi, {
              figure: tab(g, [['백분율(%)', g.p]], [100]), explain: `원그래프에서는 비율이 높은 항목일수록 넓은 부분을 차지한다. 백분율이 가장 큰 것은 ${pc(g.p[hi])}인 ${g.names[hi]}이다.`, facts: { choose: { exprs: g.p.map(String), rule: 'max' } }
            });
          }),
          T('know-whole', '백분율의 합계', '①10 ②2 ③10 심9', (d) => {
            const g = make(d, 'season', 4, { ok: distinct }), c = g.c, total = d.pick([20, 40]), n = counts(g, total);
            return N(`${lead(c, '표')} ㉠에 알맞은 수는?`, 100, {
              figure: tab(g, [[head(c), n], ['백분율(%)', g.p]], [total, box('㉠')]), explain: `각 항목의 백분율을 모두 더하면 ${g.p.join(' + ')} = 100(%)이다. 학생 수의 합계는 ${total}명이지만 백분율의 합계는 언제나 100 %이다.`, facts: { calc: [[g.p.join('+'), 0]] }
            });
          }),
          T('know-tick-band', '띠그래프의 작은 눈금 한 칸의 크기', '①2 ②3 ③2', (d) => {
            const tick = d.pick([5, 5, 1]), g = make(d, 'subject', 4, { step: tick === 1 ? 2 : 5, lo: 14, hi: 40, ok: (v) => distinct(v) && (tick === 5 || v.some((x) => x % 5 !== 0)) }), c = g.c;
            return N(`${lead(c, '띠그래프')} 띠그래프의 작은 눈금 한 칸은 몇 %를 나타내는가?`, tick, {
              unit: '%', figure: cap(c.title, band(cells(g), { tick })),
              explain: `눈금 0과 10 사이가 작은 눈금 ${10 / tick}칸으로 똑같이 나뉘어 있다. 0부터 100까지가 작은 눈금 ${100 / tick}칸이므로 한 칸은 100 ÷ ${100 / tick} = ${tick}(%)를 나타낸다.`, facts: { calc: [[`100/${100 / tick}`, 0]] }
            });
          }),
          T('know-tick-pie', '원그래프의 눈금 한 칸의 크기', '①2 ②3 ③2', (d) => {
            const tick = d.pick([5, 10]), g = make(d, 'sport', 4, { step: tick, lo: tick === 10 ? 10 : 15, hi: 40, ok: distinct }), c = g.c;
            return N(`${lead(c, '원그래프')} 원의 둘레에 표시된 눈금 한 칸은 몇 %를 나타내는가?`, tick, {
              unit: '%', figure: cap(c.title, pie(cells(g), { tick })),
              explain: `원 전체는 100 %이고, 둘레를 눈금 ${100 / tick}칸으로 똑같이 나누었다. 눈금 한 칸은 100 ÷ ${100 / tick} = ${tick}(%)를 나타낸다.`, facts: { calc: [[`100/${100 / tick}`, 0]] }
            });
          }),
          T('know-topic', '무엇을 조사한 그래프인지 알기', '①11', (d) => {
            const g = make(d, 'fruit', 5, { etc: true, sort: true, lo: 5, hi: 40, ok: distinct });
            const rows = d.shuffle([['학생들이 좋아하는 과일', true], ['과일 가게에서 요일마다 판 과일의 수', false], ['학생들이 좋아하는 과일의 값', false], ['학생들이 좋아하는 과일의 수가 달마다 변한 모습', false]]);
            return C('그래프의 제목을 보고, 무엇을 조사하여 나타낸 그래프인지 고르시오.', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: cap(g.c.title, pie(cells(g))), explain: '제목이 「좋아하는 과일별 학생 수」이므로 학생들이 좋아하는 과일을 조사하여, 과일별 학생 수의 비율을 나타낸 그래프이다.', facts: truthOf(rows, true)
            });
          }),
          T('know-good', '띠그래프와 원그래프로 나타내면 좋은 점', '①59 ②4 ③7 심56', (d) => {
            const rows = d.shuffle([['전체에 대한 각 부분의 비율을 한눈에 알아보기 쉽다.', true], ['시간에 따라 수량이 변하는 모습을 알아보기 쉽다.', false], ['조사한 전체 수와 항목별 수를 바로 읽을 수 있다.', false], ['그림의 크기와 수로 수량을 나타내어 지역별로 비교하기 쉽다.', false]]);
            return C('자료를 띠그래프나 원그래프로 나타내면 좋은 점은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: '띠그래프와 원그래프는 전체에 대한 각 부분의 비율을 한눈에 알아보기 쉽고, 항목끼리 비율을 비교하기도 쉽다.', facts: truthOf(rows, true)
            });
          }),
          T('know-bar-vs-band', '막대그래프와 띠그래프의 다른 점', '①60 ③7', (d) => {
            const g = make(d, 'season', 4, { ok: distinct }), c = g.c, n = counts(g, 20), a = d.pick(g.names);
            const rows = d.shuffle([
              ['(가)는 계절별 학생 수를, (나)는 계절별 학생 수의 비율을 알기 쉽다.', true],
              [`(나)의 눈금을 읽으면 ${josa(a, '을/를')} 좋아하는 학생이 몇 명인지 바로 알 수 있다.`, false],
              ['(가)의 막대의 길이는 전체에 대한 비율만큼 그린 것이다.', false],
              ['두 그래프 모두 시간에 따라 학생 수가 변하는 모습을 나타낸다.', false]
            ]);
            return C(`${c.intro} 조사하여 막대그래프 (가)와 띠그래프 (나)로 나타내었다. 두 그래프에 대한 설명으로 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: cap('(가)', barChart(g.names, n, { unit: '명', title: '계절' })) + cap('(나)', band(cells(g))),
              explain: '막대그래프는 막대의 길이로 항목별 학생 수를 나타내고, 띠그래프는 전체에 대한 각 부분의 비율을 나타낸다. 띠그래프의 눈금은 백분율이므로 학생 수는 바로 알 수 없다.', facts: truthOf(rows, true)
            });
          }),
          T('know-both', '띠그래프와 원그래프의 같은 점과 다른 점', '①60 ③7의 변형 심56', (d) => {
            const wrong = d.pick(['두 그래프 모두 가장 높이 있는 점을 찾아 가장 큰 항목을 안다.', '두 그래프 모두 선분이 기울어진 정도로 변화의 크기를 나타낸다.']);
            const rows = d.shuffle([['두 그래프 모두 전체에 대한 각 부분의 비율을 나타낸다.', true], ['두 그래프 모두 각 항목의 백분율의 합계는 100 %이다.', true], ['띠그래프는 띠를, 원그래프는 원을 백분율의 크기만큼 나누어 나타낸다.', true], [wrong, false]]);
            return C('띠그래프와 원그래프에 대한 설명으로 옳지 않은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
              explain: '띠그래프와 원그래프는 모두 전체에 대한 각 부분의 비율을 나타내고 백분율의 합계는 100 %이다. 점을 찍고 선분으로 이어 변화를 나타내는 것은 꺾은선그래프이다.', facts: truthOf(rows, false)
            });
          }),
          T('know-cant', '띠그래프만 보고는 알 수 없는 것', '①35 ③6 ③46의 유의점 심53', (d) => {
            const g = make(d, 'pet', 4, { lo: 15, hi: 40, ok: distinct }), c = g.c, [a, b, e] = d.shuffle(g.names);
            const rows = d.shuffle([[c.most, true], [`${c.one(a)} 수`, false], [`${c.one(a)} 수의 비율`, true], [`${josa(b, '과/와')} ${e} 가운데 기르고 싶은 학생이 더 많은 동물`, true]]);
            return C(`${lead(c, '띠그래프')} 이 띠그래프만 보고는 알 수 없는 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
              figure: cap(c.title, band(cells(g))), explain: `띠그래프는 전체에 대한 각 부분의 비율을 나타낸다. 조사한 전체 학생 수가 나와 있지 않으므로 ${c.one(a)}이 몇 명인지는 알 수 없다.`, facts: truthOf(rows, false)
            });
          })
        ]
      },
      {
        id: 'read', title: '띠그래프와 원그래프 읽기', standard: RATIO,
        types: [
          T('read-band', '띠그래프에서 한 항목의 백분율 읽기', '①3 ②5 ③3 심2', (d) => {
            const g = make(d, 'fruit', 5, { etc: true, sort: true, lo: 5, hi: 40, ok: distinct }), c = g.c, k = d.int(0, 3), a = g.names[k];
            return N(`${lead(c, '띠그래프')} ${josa(c.one(a), '은/는')} 전체의 몇 %인가?`, g.p[k], {
              unit: '%', figure: cap(c.title, band(cells(g))), explain: `띠그래프에서 ${josa(a, '이/가')} 차지하는 칸에 ${pc(g.p[k])}라고 적혀 있다.`, facts: { calc: [[String(g.p[k]), 0]] }
            });
          }),
          T('read-band-ticks', '띠그래프의 눈금을 읽어 백분율 구하기', '①4 ②18', (d) => {
            const g = make(d, 'season', 4, { ok: distinct }), c = g.c, k = d.int(1, 3), a = g.names[k], from = sum(g.p.slice(0, k)), to = from + g.p[k];
            return N(`${lead(c, '띠그래프')} 눈금을 읽어 구하면, ${josa(c.one(a), '은/는')} 전체의 몇 %인가?`, g.p[k], {
              unit: '%', figure: cap(c.title, band(cells(g, { show: 'name' }))),
              explain: `작은 눈금 한 칸은 5 %를 나타낸다. ${a}의 칸은 눈금 ${from}에서 ${to}까지이므로 ${to} - ${from} = ${g.p[k]}(%)이다.`, facts: { calc: [[String(g.p[k]), 0]] }
            });
          }),
          T('read-pie-find', '원그래프에서 백분율을 보고 항목 찾기', '①5 ②6 ③4 심2', (d) => {
            const g = make(d, 'sport', 4, { lo: 15, hi: 40, ok: distinct }), c = g.c, k = d.int(0, 3);
            return C(`${lead(c, '원그래프')} 비율이 ${pc(g.p[k])}인 ${josa(c.noun, '은/는')}?`, g.names, k, {
              figure: cap(c.title, pie(cells(g))), explain: `원그래프에서 ${pc(g.p[k])}라고 적힌 부분을 찾으면 ${g.names[k]}이다.`, facts: { choose: { exprs: g.p.map(String), rule: 'equals', target: g.p[k] } }
            });
          }),
          T('read-pie-ticks', '원그래프의 눈금을 읽어 백분율 구하기', '②18의 변형', (d) => {
            const g = make(d, 'subject', 4, { lo: 15, hi: 40, ok: distinct }), c = g.c, k = d.int(1, 3), a = g.names[k];
            return N(`${lead(c, '원그래프')} 둘레의 눈금을 읽어 구하면, ${josa(c.one(a), '은/는')} 전체의 몇 %인가?`, g.p[k], {
              unit: '%', figure: cap(c.title, pie(cells(g, { show: 'name' }))),
              explain: `눈금 0과 25 사이가 5칸이므로 눈금 한 칸은 5 %를 나타낸다. ${josa(a, '이/가')} 차지하는 부분은 눈금 ${g.p[k] / 5}칸이므로 5 × ${g.p[k] / 5} = ${g.p[k]}(%)이다.`, facts: { calc: [[String(g.p[k]), 0]] }
            });
          }),
          T('read-fraction', '전체의 몇 분의 1을 차지하는 항목 찾기', '②18의 변형 ③5 심21', (d) => {
            const [den, p] = d.pick([[2, 50], [4, 25], [5, 20], [10, 10]]), g = make(d, 'color', 4, { lo: 10, hi: 50, ok: (v) => distinct(v) && v.includes(p) }), c = g.c, k = g.p.indexOf(p);
            return C(`${lead(c, '띠그래프')} 비율이 전체의 ${frac(1, den)}인 ${josa(c.noun, '은/는')}?`, g.names, k, {
              figure: cap(c.title, band(cells(g))), explain: `전체 100 %의 ${frac(1, den)}은 100 ÷ ${den} = ${p}(%)이다. 비율이 ${pc(p)}인 ${josa(c.noun, '은/는')} ${g.names[k]}이다.`, facts: { choose: { exprs: g.p.map(String), rule: 'equals', target: p } }
            });
          }),
          T('read-most', '가장 많은 항목 찾기', '①6 ②7 ③23 심3', (d) => {
            const g = make(d, 'village', 4, { ok: (v) => distinct(v) && top(v) - v.slice().sort((x, y) => y - x)[1] <= 10 }), c = g.c, hi = g.p.indexOf(top(g.p));
            return C(`${lead(c, '원그래프')} ${josa(c.most, '은/는')}?`, g.names.map((n) => say(c, n)), hi, {
              figure: cap(c.title, pie(cells(g))), explain: `백분율이 가장 큰 것을 찾는다. ${josa(say(c, g.names[hi]), '이/가')} ${pc(g.p[hi])}로 가장 높다.`, facts: { choose: { exprs: g.p.map(String), rule: 'max' } }
            });
          }),
          T('read-second', '두 번째·세 번째로 많은 항목 찾기', '①6의 변형 ②8 ③24 심3', (d) => {
            const g = make(d, 'pet', 5, { lo: 5, hi: 40, ok: distinct }), c = g.c, k = d.pick([2, 3]), order = desc(g.p);
            return C(`${lead(c, '띠그래프')} ${josa(nth(c, k), '은/는')}?`, g.names, order[k - 1], {
              figure: cap(c.title, band(cells(g))), explain: `백분율이 큰 것부터 쓰면 ${order.map((i) => `${g.names[i]}(${pc(g.p[i])})`).join(', ')}이다. ${k === 2 ? '두' : '세'} 번째는 ${g.names[order[k - 1]]}이다.`, facts: { rank: { values: g.p, nth: k } }
            });
          }),
          T('read-order', '비율이 높은 것부터 차례로 쓰기', '①8 ②8 ③24 심3', (d) => {
            const g = make(d, 'season', 4, { ok: distinct }), c = g.c, right = desc(g.p), orders = orderOptions(d, right);
            return C(`${lead(c, '원그래프')} 비율이 높은 계절부터 차례로 쓴 것은?`, orders.map((o) => o.map((i) => g.names[i]).join(', ')), orders.findIndex((o) => o.join() === right.join()), {
              figure: cap(c.title, pie(cells(g))), explain: `백분율이 큰 것부터 쓰면 ${right.map((i) => `${g.names[i]}(${pc(g.p[i])})`).join(', ')}이다.`, facts: { choose: { exprs: g.p.map(String), rule: 'descending', orders } }
            });
          }),
          T('read-same', '비율이 같은 항목 찾기', '①7 ②9 ③4 심4', (d) => {
            const g = make(d, 'snack', 5, { lo: 10, hi: 35, ok: (v) => new Set(v).size === 4 }), c = g.c, same = g.p.find((x) => !lone(g.p, x)), [i, j] = d.shuffle(g.p.map((x, at) => (x === same ? at : -1)).filter((at) => at >= 0));
            const rest = g.names.map((_, at) => at).filter((at) => at !== i);
            return C(`${lead(c, '띠그래프')} ${josa(g.names[i], '과/와')} 비율이 같은 ${josa(c.noun, '은/는')}?`, rest.map((at) => g.names[at]), rest.indexOf(j), {
              figure: cap(c.title, band(cells(g))), explain: `${josa(g.names[i], '은/는')} ${pc(same)}이다. 비율이 ${pc(same)}인 다른 ${josa(c.noun, '은/는')} ${g.names[j]}이다.`, facts: { choose: { exprs: rest.map((at) => String(g.p[at])), rule: 'equals', target: same } }
            });
          }),
          T('read-range', '비율이 기준에 맞는 항목의 수', '①9 ②10 ③25 심5', (d, n) => {
            if (n === 0) {
              const t = d.pick([15, 20, 25]), g = make(d, 'subject', 5, { lo: 10, hi: 35, ok: (v) => distinct(v) && v.includes(t) }), c = g.c, hit = g.p.map((x) => x >= t);
              return N(`${lead(c, '원그래프')} 비율이 ${pc(t)} 이상인 과목은 모두 몇 가지인가?`, hit.filter(Boolean).length, {
                unit: '가지', figure: cap(c.title, pie(cells(g))), explain: `${pc(t)} 이상은 ${pc(t)}와 같거나 큰 것이다. ${g.names.filter((_, i) => hit[i]).map((x, i) => `${x}(${pc(g.p.filter((_, at) => hit[at])[i])})`).join(', ')}의 ${hit.filter(Boolean).length}가지이다.`, facts: { count: hit }
              });
            }
            const [lo, hi] = d.pick([[15, 30], [10, 25], [20, 35], [10, 30]]), g = make(d, 'sport', 5, { lo: 5, hi: 40, ok: (v) => distinct(v) && v.includes(lo) && v.includes(hi) }), c = g.c, hit = g.p.map((x) => x >= lo && x < hi);
            return N(`${lead(c, '띠그래프')} 비율이 ${pc(lo)} 이상 ${pc(hi)} 미만인 운동은 모두 몇 가지인가?`, hit.filter(Boolean).length, {
              unit: '가지', figure: cap(c.title, band(cells(g))),
              explain: `${pc(lo)}는 들어가고 ${pc(hi)}는 들어가지 않는다. ${g.names.filter((_, i) => hit[i]).map((x, i) => `${x}(${pc(g.p.filter((_, at) => hit[at])[i])})`).join(', ')}의 ${hit.filter(Boolean).length}가지이다.`, facts: { count: hit }
            });
          }, { count: 2 })
        ]
      },
      {
        id: 'table', title: '백분율을 구하여 표로 나타내기', standard: RATIO,
        types: [
          T('pct-one', '표를 보고 한 항목의 백분율 구하기', '①13 ②23·24 심24', (d) => {
            const [total, step] = d.pick([[20, 5], [25, 4], [50, 2]]), g = make(d, 'fruit', 4, { step, lo: 12, hi: 40, ok: distinct }), c = g.c, n = counts(g, total), k = d.int(0, 3), a = g.names[k];
            return N(`${lead(c, '표')} ${josa(c.one(a), '은/는')} 전체의 몇 %인가?`, g.p[k], {
              unit: '%', figure: tab(g, [[head(c), n]], [total]), explain: `(${c.one(a)} 수) ÷ (전체 학생 수) × 100을 계산한다. ${frac(n[k], total)} × 100 = ${g.p[k]}(%)이다.`, facts: { calc: [[`${n[k]}*100/${total}`, 0]], unseen: [100] }
            });
          }),
          T('pct-table', '표의 백분율 칸을 모두 채우기', '①14 ②25 ③8 심33', (d) => {
            const total = d.pick([200, 400, 500]), g = make(d, 'place', 4, { ok: distinct }), c = g.c, n = counts(g, total);
            return M(`${lead(c, '표')} ㉠, ㉡, ㉢, ㉣에 알맞은 수를 차례로 구하시오.`, g.p.map((p, i) => ({ label: MARKS[i], answer: p, unit: '%' })), {
              figure: tab(g, [[head(c), n], ['백분율(%)', MARKS.slice(0, 4).map((m) => box(m))]], [total, 100]),
              explain: `항목마다 (학생 수) ÷ (전체 학생 수) × 100을 계산한다. ${g.names.map((x, i) => `${x} ${frac(n[i], total)} × 100 = ${g.p[i]}(%)`).join(', ')}이다. 백분율을 모두 더하면 100 %이다.`,
              facts: { calc: g.p.map((_, i) => [`${n[i]}*100/${total}`, i]) }
            });
          }),
          T('pct-total', '합계를 구한 뒤 백분율 구하기', '①15 ③9 심33의 변형', (d) => {
            const total = d.pick([40, 80]), g = make(d, 'color', 4, { ok: distinct }), c = g.c, n = counts(g, total), k = d.int(0, 3), a = g.names[k];
            return M(`${lead(c, '표')} 조사한 학생은 모두 몇 명이고, ${josa(c.one(a), '은/는')} 전체의 몇 %인가?`, [{ label: '전체', answer: total, unit: '명' }, { label: '백분율', answer: g.p[k], unit: '%' }], {
              figure: tab(g, [[head(c), n]]), explain: `조사한 학생은 ${n.join(' + ')} = ${total}(명)이다. ${josa(c.one(a), '은/는')} ${frac(n[k], total)} × 100 = ${g.p[k]}(%)이다.`,
              facts: { calc: [[n.join('+'), 0], [`${n[k]}*100/(${n.join('+')})`, 1]], unseen: [100] }
            });
          }),
          T('pct-missing-count', '글을 읽고 빠진 항목의 수와 백분율 구하기', '①16 ②26 ②28 ③13 심34·36', (d) => {
            const [total, step] = d.pick([[50, 2], [200, 5]]), g = make(d, 'fruit', 4, { step, lo: 12, hi: 40, ok: distinct }), n = counts(g, total), [a, b, e, x] = g.names;
            return M(`어느 학교 6학년 학생 ${total}명이 좋아하는 과일을 조사하였더니 ${josa(a, '이/가')} ${n[0]}명, ${josa(b, '이/가')} ${n[1]}명, ${josa(e, '이/가')} ${n[2]}명이고 나머지는 모두 ${x}${tail(x, '이었다/였다')}. ${josa(x, '을/를')} 좋아하는 학생은 몇 명이고, 전체의 몇 %인가?`, [{ label: '학생 수', answer: n[3], unit: '명' }, { label: '백분율', answer: g.p[3], unit: '%' }], {
              explain: `${josa(x, '을/를')} 좋아하는 학생은 ${total} - ${n[0]} - ${n[1]} - ${n[2]} = ${n[3]}(명)이다. ${frac(n[3], total)} × 100 = ${g.p[3]}(%)이다.`,
              facts: { calc: [[`${total}-${n[0]}-${n[1]}-${n[2]}`, 0], [`(${total}-${n[0]}-${n[1]}-${n[2]})*100/${total}`, 1]], unseen: [100] }
            });
          }),
          T('pct-rest-text', '나머지 항목의 백분율 구하기', '①17 ②30 ③13의 변형 ③27의 변형 심36의 변형', (d) => {
            const names = d.shuffle(['옷', '장난감', '책', '신발', '학용품']).slice(0, 4), p = parts(d, 4, { ok: distinct }), [a, b, e, x] = names;
            return N(`어느 알뜰 시장에 나온 물건을 조사하였더니 ${josa(a, '이/가')} ${pc(p[0])}, ${josa(b, '이/가')} ${pc(p[1])}, ${josa(e, '이/가')} ${pc(p[2])}이고 나머지는 모두 ${x}이었다. ${josa(x, '은/는')} 전체의 몇 %인가?`, p[3], {
              unit: '%', explain: `백분율의 합계는 100 %이다. 100 - ${p[0]} - ${p[1]} - ${p[2]} = ${p[3]}(%)이다.`, facts: { calc: [[`100-${p[0]}-${p[1]}-${p[2]}`, 0]], unseen: [100] }
            });
          }),
          T('pct-tally', '낱낱의 자료를 세어 백분율 구하기', '①18 ③11', (d) => {
            const g = make(d, 'season', 4, { ok: distinct }), n = counts(g, 20), list = d.shuffle(g.names.flatMap((x, i) => Array(n[i]).fill(x))), k = d.int(0, 3), a = g.names[k];
            return M(`학생 20명이 좋아하는 계절을 한 가지씩 적은 것이다. 「${a}」${tail(a, '이라고/라고')} 적은 학생은 몇 명이고, 전체의 몇 %인가?`, [{ label: '학생 수', answer: n[k], unit: '명' }, { label: '백분율', answer: g.p[k], unit: '%' }], {
              figure: words(list), explain: `빠뜨리거나 두 번 세지 않도록 표시하면서 세면 「${a}」${tail(a, '은/는')} ${n[k]}명이다. ${frac(n[k], 20)} × 100 = ${g.p[k]}(%)이다.`,
              facts: { tallyOf: { list, target: a }, calc: [[`${n[k]}*100/20`, 1]], unseen: [n[k], 100] }
            });
          }),
          T('table-etc', '수가 적은 항목을 기타로 묶어 백분율 구하기', '①19 ②29 ③11·13 심37', (d) => {
            // 기타의 백분율이 눈금에 꼭 맞지 않게 하여(눈금 한 칸 10 %), 띠의 눈금을 읽지 않고 표의 수로 구하게 한다.
            const c = SETS.sport, names = d.shuffle(c.names), [s1, s2] = d.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 4], [4, 2], [3, 4], [4, 3]]), etc = (s1 + s2) * 2;
            const p4 = d.until(() => { const v = Array.from({ length: 3 }, () => d.int(6, 20) * 2); v.push(100 - etc - sum(v)); return v; }, (v) => v[3] >= 12 && v[3] <= 44 && distinct(v)).sort((x, y) => y - x);
            const n = p4.map((p) => p / 2).concat([s1, s2]);
            const shown = names.slice(0, 4).map((name, i) => ({ name, pct: p4[i] })).concat([{ name: '기타', pct: etc, show: 'blank', mark: '㉠' }]);
            return N(`${c.intro} 조사하여 나타낸 표와, 수가 적은 운동을 「기타」로 묶어 나타낸 띠그래프이다. ㉠에 알맞은 수는?`, etc, {
              figure: table(['운동', '학생 수(명)'], names.map((name, i) => [name, n[i]]).concat([['합계', 50]])) + cap(c.title, band(shown, { tick: 10 })),
              explain: `띠그래프에 없는 ${josa(names[4], '과/와')} ${josa(names[5], '을/를')} 기타로 묶었다. 기타는 ${s1} + ${s2} = ${s1 + s2}(명)이므로 ${frac(s1 + s2, 50)} × 100 = ${etc}(%)이다.`,
              facts: { calc: [[`(${s1}+${s2})*100/50`, 0]], unseen: [100] }
            });
          }),
          T('etc-which', '기타에 넣은 항목 찾기', '①12 ③12 심37', (d) => {
            const c = SETS.snack, names = d.shuffle(c.names), small = d.pick([[1, 3], [3, 1]]), p4 = d.until(() => { const v = Array.from({ length: 3 }, () => d.int(3, 8) * 5); v.push(90 - sum(v)); return v; }, (v) => v[3] >= 15 && v[3] <= 40 && distinct(v)).sort((x, y) => y - x);
            const n = p4.map((p) => p * 2 / 5).concat(small), pairs = d.shuffle([[4, 5], [3, 4], [3, 5], [2, 3]]);
            const shown = names.slice(0, 4).map((name, i) => ({ name, pct: p4[i] })).concat([{ name: '기타', pct: 10 }]);
            return C(`${c.intro} 조사하여 나타낸 표와, 수가 적은 간식을 「기타」로 묶어 나타낸 띠그래프이다. 띠그래프에서 「기타」에 넣은 간식을 모두 고른 것은?`, pairs.map(([i, j]) => `${names[i]}, ${names[j]}`), pairs.findIndex(([i, j]) => i === 4 && j === 5), {
              figure: table(['간식', '학생 수(명)'], names.map((name, i) => [name, n[i]]).concat([['합계', 40]])) + cap(c.title, band(shown)),
              explain: `표에는 있지만 띠그래프에는 이름이 없는 ${josa(names[4], '과/와')} ${josa(names[5], '을/를')} 기타에 넣었다. 두 간식을 좋아하는 학생은 ${small[0]} + ${small[1]} = 4(명)이고 ${frac(4, 40)} × 100 = 10(%)이다.`,
              facts: { truth: pairs.map(([i, j]) => i === 4 && j === 5), want: true }
            });
          }),
          T('pct-need', '백분율을 구하는 데 더 필요한 것', '③50의 변형', (d) => {
            const [a, b] = d.shuffle(SETS.fruit.names), n = d.int(12, 48);
            const rows = d.shuffle([['조사한 6학년 전체 학생 수', true], [`6학년에서 ${josa(b, '을/를')} 좋아하는 학생 수`, false], [`5학년에서 ${josa(a, '을/를')} 좋아하는 학생 수`, false], ['과일을 조사한 날짜', false]]);
            return C(`어느 학교 6학년 학생들이 좋아하는 과일을 조사하였더니 ${josa(a, '을/를')} 좋아하는 학생이 ${n}명이었다. ${josa(a, '을/를')} 좋아하는 학생 수가 6학년 전체의 몇 %인지 구하려면 더 알아야 하는 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: `백분율은 (${josa(a, '을/를')} 좋아하는 학생 수) ÷ (전체 학생 수) × 100으로 구한다. 조사한 6학년 전체 학생 수를 알아야 한다.`, facts: truthOf(rows, true)
            });
          }),
          T('from-bar', '막대그래프를 읽어 백분율 구하기', '①27 ②58 ③15 심41', (d) => {
            const total = d.pick([20, 40]), g = make(d, 'village', 4, { ok: distinct }), c = g.c, n = counts(g, total), k = d.int(0, 3), a = g.names[k];
            return N(`${lead(c, '막대그래프')} 이 자료를 띠그래프로 나타낼 때, ${josa(c.one(a), '은/는')} 전체의 몇 %로 나타내어야 하는가?`, g.p[k], {
              unit: '%', figure: barChart(g.names, n, { step: total === 20 ? 1 : 2, unit: '명', title: '마을' }),
              explain: `막대그래프에서 읽은 학생 수는 ${g.names.map((x, i) => `${x} ${n[i]}명`).join(', ')}이고 모두 ${n.join(' + ')} = ${total}(명)이다. ${josa(say(c, a), '은/는')} ${frac(n[k], total)} × 100 = ${g.p[k]}(%)이다.`,
              facts: { calc: [[`${n[k]}*100/(${n.join('+')})`, 0]], unseen: [100] }
            });
          }),
          T('from-picto', '그림그래프를 읽어 백분율 구하기', '①62 ②57 ③15 심62', (d) => {
            const p = parts(d, 4, { step: 2, lo: 12, hi: 40, ok: distinct }), v = p.map((x) => x * 5), names = ['가', '나', '다', '라'], k = d.int(0, 3);
            return N(`어느 지역의 마을별 사과 생산량을 조사하여 나타낸 그림그래프이다. ${names[k]} 마을의 사과 생산량은 네 마을 전체 생산량의 몇 %인가?`, p[k], {
              unit: '%', figure: pictograph(['마을', '생산량'], names.map((x, i) => [x, v[i]]), [100, 10], ' kg'),
              explain: `그림그래프에서 읽은 생산량은 ${names.map((x, i) => `${x} ${v[i]} kg`).join(', ')}이고 모두 ${v.join(' + ')} = 500(kg)이다. ${names[k]} 마을은 ${frac(v[k], 500)} × 100 = ${p[k]}(%)이다.`,
              facts: { picto: { shown: v }, calc: [[`${v[k]}*100/(${v.join('+')})`, 0]], unseen: v.concat([100]) }
            });
          })
        ]
      },
      { id: 'draw', title: '띠그래프와 원그래프로 나타내기', standard: RATIO, types: [] },
      { id: 'solve', title: '띠그래프와 원그래프 해석하기', standard: RATIO, types: [] },
      { id: 'compare', title: '두 그래프 비교하기', standard: RATIO, types: [] },
      { id: 'kind', title: '여러 가지 그래프', standard: KIND, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
