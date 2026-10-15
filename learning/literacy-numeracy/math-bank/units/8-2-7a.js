// 중학교 2학년 2학기 7단원 확률 — 단원 틀·단원 안의 도구와 앞쪽 묶음(확률의 뜻, 여러 가지 상황에서의 확률, 확률의 성질, 어떤 사건이 일어나지 않을 확률).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1·2: 78·74꼴, 심화꼴 59꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/8-2-7/싣기_대조표.md 에 있다.
// (「또는」·「동시에」·연속하여 뽑기·도형에서의 확률 묶음은 8-2-7b.js 에, 실력 문항은 8-2-7c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 자료와 가능성. 성취기준은 9수04-06 「확률의 개념과 그 기본 성질을 이해하고, 확률을 구할 수 있다」 하나다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(주사위·동전·수 카드·주머니·표·달력·원판·색칠한 칸)과 세는 길(한 번 뽑기 / 순서쌍 36가지 / 수 만들기 / 줄 세우기 / 대표 뽑기),
//    확률을 다루는 길(경우의 수의 비율 / 1에서 빼기 / 더하기 / 곱하기 / 갈래를 나누어 곱하고 더하기)이 다를 때만 따로 싣는다. 소재와 수만 다른 것은 한 번만 싣는다.
//  - 경우의 수만 묻는 것은 앞 단원(8-2-6)의 일이므로 싣지 않는다. 「단계로 묻기」(모든 경우의 수 → 사건의 경우의 수 → 확률)는 마지막 확률만 묻고 앞 단계는 풀이에 적는다.
//  - 답: 확률은 분수(분자·분모 두 칸)로 받는다. 적어 두는 답은 기약분수이고, 문제가 「기약분수로」라고 하지 않으므로 크기가 같은 분수는 모두 맞게 친다(anyForm).
//    확률이 0이나 1인 꼴은 분수 칸으로 받을 수 없어 고르기로 낸다. 원문이 소수·백분율로 답하게 한 꼴(발아율 0.72, 비 올 확률 48 %)도 분수로 답하게 바꾸었다.
//    공의 개수는 수 칸, 옳은 설명·차례는 고르기. 음수가 없는 단원이므로 부호 단추는 달지 않는다. 답은 모두 코드가 경우를 직접 세거나 분수 셈으로 정한다.
//  - 용어는 교육과정의 것(사건, 확률)만 쓴다. 「여사건」「조건부확률」「독립」「기댓값」「합의 법칙·곱의 법칙」은 쓰지 않고 「사건 A가 일어나지 않을 확률」처럼 풀어 쓴다.
//  - 교육과정: 「확률은 실험이나 관찰을 통해 구한 상대도수로서의 의미와 경우의 수의 비율로서의 의미를 연결하여 이해하게 한다. 경우의 수의 비율로 확률을 다룰 때,
//    각 경우가 발생할 가능성이 동등하다는 것을 가정한다는 점에 유의하게 한다.」 「순열과 조합을 이용하면 쉽게 해결되는 등의 복잡한 경우의 수를 구하는 문제는 다루지 않는다.」
//    줄 세우기는 3~5개(6·24·120가지)까지, 두 무리가 끼리끼리 이웃하는 꼴만 6명(720가지)까지, 대표 뽑기는 4~8명 중 2명까지만 싣는다. 조사한 표의 도수로 확률을 구하는 꼴(②4·5·38)과 「10번에 4번꼴」(①51)이 상대도수로서의 확률이다.
//  - 그림: 쪽 그림(2015 지도서 중단원 06의 달력, 2022 소단원 Ⅷ-2 기초 02의 6등분 원판, 2015 교과서 251쪽 09의 두 원판, 2022 소단원 Ⅷ-4 실력 01의 두 주머니)을 보고 생김새를 지었다.
//    수와 놓인 자리는 모두 새로 정했다. 그림 설명(aria-label)에는 칸의 수, 적힌 수, 색칠한 칸의 수, 달력의 첫날의 요일과 색칠한 날짜를 적었다.
//  - 꼴 목록에 적힌 원문 답지의 잘못(미래엔 2022 소단원 Ⅷ-4 실력 04의 9/16, 은4-8의 15/64, 발17, 최16)은 따르지 않는다.
//
// 뺀 것과 까닭(8-2-7b.js, 8-2-7c.js 의 것까지 여기에 모아 적는다)
//  - 상위 학년의 내용이 있어야 하는 것: 심41(다섯 번 가운데 꼭 두 번, 가능성이 다른 윷 넷 — 독립시행의 확률은 고등학교의 내용이다),
//    심57(눈에 따라 좌표평면 위를 움직이는 점 — 같은 것이 든 차례를 세어야 하고, 원문 문장의 뜻도 갈린다).
//  - 실험 활동지: ②73(끈 묶기 — 끈 그림을 알 수 없고 묶는 방법 15가지를 표로 채운다). ②74(생일이 같을 확률)는 세 사람의 꼴만 답을 구하게 바꾸어 실었다.
//  - 문제에 주어지지 않은 확률을 써야 하는 것: 심42(상자를 고를 확률이 문제에 없다. 밝혀 주면 「주머니를 고른 다음 공 꺼내기」와 같은 일이다).
//  - 겹치는 두 조건의 「또는」 가운데 ①27(소수 또는 12의 약수 → 1)은 ①44와 같은 일이어서 따로 싣지 않았다.
//  - 처음 지을 때 꼬임·경우 따지기·「한 유형만」이라는 까닭으로 뺐던 ①75·76·77·78, ②67·68·74, 심11·18·23·24·49·50·52·54·55·56은 다시 보고 실었다(8-2-7c.js 의 「다시 싣기」).
//  - 같은 일이어서 한 번만 실은 것은 대조표에 꼴마다 적었다(○× 문제와 동전의 「적어도」, 두 무리에서 정한 두 사람, 세 사람 가운데 정한 사람만, 다시 넣고 한 사람만 당첨 등).
//  - 쪽 그림에서도 그림을 알 수 없어 뺀 꼴은 없다. 색칠한 칸의 자리(①73 ②69 심59), 과녁의 색칠한 부분(②70), 달력의 첫날(②39), 원판의 수(②41)는 원문 그림을 보지 못했으나
//    답이 칸의 수·넓이의 비·날짜의 수로만 정해지는 꼴이므로 자리와 수를 새로 정해 지었다.
// 묻는 말: 확률은 「~일 확률은?」, 개수는 「몇 개인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, frac, tagged, table, N, C, F } = B.kit;
  const { range, gcd, lcm, Q, qadd, qsub, qmul, qcmp, tx, js, tail, V, nb, poly, claimQ, MINUS, SG } = B.kit.mid;
  const G = B.kit.mgeo;
  const STD = '9수04-06';
  const sourceOf = (ref) => (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make }, more || {});

  // ── 셈 ──
  const sum = (a) => a.reduce((s, v) => s + v, 0);
  const isPrime = (v) => { if (v < 2) return false; for (let i = 2; i * i <= v; i += 1) if (v % i === 0) return false; return true; };
  const divs = (n) => range(1, n).filter((v) => n % v === 0);
  const fact = (k) => (k <= 1 ? 1 : k * fact(k - 1));
  // 확률은 유리수 { p, q }(기약분수)로 다룬다. non(x): 일어나지 않을 확률
  const P = (k, n) => Q(k, n), ONE = Q(1), non = (x) => qsub(ONE, x);
  const isP = (x) => x.p > 0 && x.p < x.q;
  // 두 주사위의 순서쌍 36가지
  const DICE = [];
  for (let a = 1; a <= 6; a += 1) for (let b = 1; b <= 6; b += 1) DICE.push([a, b]);

  // ── 글 ──
  const pairsSaid = (list) => list.map(([a, b]) => `(${a}, ${b})`).join(', ') + `의 ${list.length}가지`;
  const listSaid = (list, each) => list.join(', ') + `의 ${list.length}${each || '가지'}`;
  // k/n 을 약분해 가는 글: 4/36 = 1/9 (더 줄일 수 없으면 분수 하나)
  const red = (k, n) => { const x = Q(k, n); return (x.q === n ? '' : frac(k, n) + ' = ') + tx(x); };
  const two = (d) => d.shuffle(NAMES).slice(0, 2);
  const mulSaid = (k) => range(1, k).reverse().join(' × ');
  // 수의 조건. n: 수를 가리키는 말(모두 「수」로 끝난다), eye: 주사위의 눈을 가리키는 말, 일·인: 「~일 확률」「~인 수」
  const cond = (n, ok) => ({ n, eye: n.replace(/의 수$/, '') + '의 눈', 일: n.replace(/의 수$/, '') + '일', 인: n.replace(/의 수$/, '') + '인', ok });
  const mult = (k) => cond(`${k}의 배수`, (v) => v % k === 0), divOf = (k) => cond(`${k}의 약수`, (v) => k % v === 0);
  const PRIME = cond('소수', isPrime), ODD = cond('홀수', (v) => v % 2 === 1), EVEN = cond('짝수', (v) => v % 2 === 0);
  const atLeast = (k) => cond(`${k} 이상의 수`, (v) => v >= k), atMost = (k) => cond(`${k} 이하의 수`, (v) => v <= k);
  // 조건에 맞는 수를 늘어놓는 글. 맞는 수가 많으면 맞지 않는 수를 세어 뺀다.
  const countSaid = (all, c) => {
    const hit = all.filter(c.ok), rest = all.filter((v) => !c.ok(v));
    return hit.length <= 12 || rest.length > 12 ? `${c.인} 수는 ${listSaid(hit, '개')}` : `${c.인} 수가 아닌 것은 ${listSaid(rest, '개')}이므로 ${c.인} 수는 ${all.length} − ${rest.length} = ${hit.length}(개)`;
  };
  const TWO = '서로 다른 두 개의 주사위를 동시에 던질 때';
  const AB = `두 개의 주사위 A, B를 동시에 던져 나오는 눈의 수를 각각 ${V('a')}, ${V('b')}라 할 때`;
  const XY = `한 개의 주사위를 두 번 던져 처음에 나오는 눈의 수를 ${V('x')}, 나중에 나오는 눈의 수를 ${V('y')}라 할 때`;
  const pt = (x, y) => nb(`(${x}, ${y})`);

  // ── 답과 검사 근거 ──
  // 확률 하나를 답하는 문항: 0과 1 사이의 분수. 크기가 같은 분수는 모두 맞게 친다.
  const ansP = (text, x, o) => { if (!isP(x)) throw new Error('확률 답은 0과 1 사이의 분수여야 한다'); return F(text, x.p, x.q, Object.assign({ anyForm: true }, o)); };
  // 근거: (사건의 경우의 수)/(모든 경우의 수). 두 수는 세어서 얻는 수라 문제 글에 없다.
  const kn = (k, n) => ({ value: k + '/' + n, unseen: [k, n] });
  // 근거: 문제에 적힌 확률로 셈하는 식. 1(전체)과 100(백분율)은 글에 없어도 된다.
  const vf = (value, more) => ({ value, unseen: [1, 100].concat(more || []) });
  // 확률 여럿을 고를 때 쓰는 값들
  const PP = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6], [3, 8], [5, 8], [3, 10], [7, 10]].map(([a, b]) => Q(a, b));
  const probs = (d, n, ok) => d.until(() => d.shuffle(PP).slice(0, n), (list) => !ok || ok(list));

  // ── 그림 ──
  // 원판: labels 를 맨 위 칸부터 시계 방향으로 한 칸에 하나씩 적는다. 맨 위 칸의 한가운데를 바늘이 가리킨다(쪽 그림: 가운데 작은 원, 위쪽 바깥의 바늘).
  function wheel(b, labels, o) {
    const opt = o || {}, c = opt.at || [0, 0], n = labels.length, r = opt.r || (n > 8 ? 62 : 54), step = 360 / n;
    b.disk(c, r, G.WHITE);
    for (let i = 0; i < n; i += 1) b.seg(c, G.at(c, r, 90 + step / 2 - i * step), 'thin');
    labels.forEach((t, i) => b.text(G.at(c, r * 0.66, 90 - i * step), String(t), { plain: true }));
    b.disk(c, 3.5, G.WHITE);
    b.poly([[c[0] - 5.5, c[1] - r - 13], [c[0] + 5.5, c[1] - r - 13], [c[0], c[1] - r - 2]], 'fill:#b42318;stroke:#b42318');
    if (opt.name) b.text([c[0], c[1] + r + 13], opt.name);
    return b;
  }
  const wheelSaid = (labels, nm) => `원판${nm ? ' ' + nm : ''}: 크기가 같은 부채꼴 ${labels.length}칸으로 나뉘어 있고, 맨 위 칸부터 시계 방향으로 한 칸에 하나씩 다음이 적혀 있다 — ${labels.join(', ')}. 원판 위쪽에 바늘이 있다.`;
  const wheelFig = (labels) => wheel(G.Board(), labels).svg(wheelSaid(labels));
  // 원판 둘을 나란히
  const wheelsFig = (first, second) => { const b = G.Board(); wheel(b, first, { name: 'A', r: 52 }); wheel(b, second, { at: [132, 0], name: 'B', r: 52 }); return b.svg(wheelSaid(first, 'A') + ' ' + wheelSaid(second, 'B')); };
  // 크기가 같은 정사각형 칸으로 나뉜 판. dark: 색칠한 칸의 번호(왼쪽 위부터 가로로 0, 1, 2, …)
  function cellsFig(rows, cols, dark) {
    const b = G.Board(), u = 30;
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) b.poly([[c * u, r * u], [(c + 1) * u, r * u], [(c + 1) * u, (r + 1) * u], [c * u, (r + 1) * u]], dark.includes(r * cols + c) ? 'fill:#94a3b8' : G.WHITE);
    return b.svg(`판: 크기가 같은 정사각형 ${rows * cols}칸(가로 ${cols}칸, 세로 ${rows}칸)으로 나뉘어 있고, 그 가운데 ${dark.length}칸이 색칠되어 있다.`);
  }
  // 달력. first: 1일의 요일(0 = 일요일), marked: 색칠한 날짜
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];
  function calendarFig(month, first, days, marked) {
    const cw = 36, ch = 24, x0 = 8, y0 = 50, rows = Math.ceil((first + days) / 7), W = x0 * 2 + cw * 7, H = y0 + rows * ch + 4, on = marked || [];
    let out = `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="7" style="fill:#fff;stroke:#8a96a3;stroke-width:1.2"/><text x="${W / 2}" y="19" text-anchor="middle" style="font-size:14px;font-weight:700;fill:#1f2933">${month}월</text>`
      + `<line x1="${x0}" y1="43" x2="${W - x0}" y2="43" style="stroke:#8a96a3;stroke-width:1"/>`;
    DOW.forEach((w, i) => { out += `<text x="${x0 + i * cw + cw / 2}" y="37" text-anchor="middle" style="font-size:12.5px;font-weight:600;fill:#52606d">${w}</text>`; });
    for (let day = 1; day <= days; day += 1) {
      const at = first + day - 1, x = x0 + (at % 7) * cw + cw / 2, y = y0 + Math.floor(at / 7) * ch + 12;
      if (on.includes(day)) out += `<circle cx="${x}" cy="${y - 4.5}" r="10.5" style="fill:#cbd5e1"/>`;
      out += `<text x="${x}" y="${y}" text-anchor="middle" style="font-size:12.5px;font-weight:600;fill:#1f2933">${day}</text>`;
    }
    const said = `${month}월 달력: 날짜는 1일부터 ${days}일까지이고 1일은 ${DOW[first]}요일이다. 한 줄에 왼쪽부터 일, 월, 화, 수, 목, 금, 토요일의 차례로 놓여 있다.` + (on.length ? ` 색칠한 날은 ${on.map((v) => v + '일').join(', ')}이다.` : '');
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }
  // 요일마다의 날수
  const dayCount = (first, days, dow) => range(1, days).filter((day) => (first + day - 1) % 7 === dow).length;
  // 수가 적힌 공이 든 주머니들(쪽 그림: 끈으로 묶은 주머니 둘, 아래에 이름). bags: [{ name, balls: [수, …] }] — 공은 3개나 4개
  function bagsFig(bags) {
    const W = 128, H = 132; let out = '';
    bags.forEach((bag, i) => {
      const cx = 64 + i * W, top = 26;
      out += `<path d="M${cx - 16} ${top}C${cx - 62} ${top + 14} ${cx - 58} ${top + 84} ${cx} ${top + 84}C${cx + 58} ${top + 84} ${cx + 62} ${top + 14} ${cx + 16} ${top}Z" style="fill:#fff8e1;stroke:#1f2933;stroke-width:1.5;stroke-linejoin:round"/>`
        + `<path d="M${cx - 16} ${top}L${cx - 23} ${top - 13}Q${cx} ${top - 7} ${cx + 23} ${top - 13}L${cx + 16} ${top}" style="fill:#fff8e1;stroke:#1f2933;stroke-width:1.5;stroke-linejoin:round"/><line x1="${cx - 17}" y1="${top}" x2="${cx + 17}" y2="${top}" style="stroke:#b42318;stroke-width:2.4;stroke-linecap:round"/>`;
      const spots = bag.balls.length === 3 ? [[0, 34], [-17, 62], [17, 62]] : [[-15, 34], [15, 34], [-15, 62], [15, 62]];
      bag.balls.forEach((v, k) => { const [dx, dy] = spots[k]; out += `<circle cx="${cx + dx}" cy="${top + dy}" r="11.5" style="fill:#e2e8f0;stroke:#52606d;stroke-width:1.2"/><text x="${cx + dx}" y="${top + dy + 4.5}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:#1f2933">${v}</text>`; });
      out += `<text x="${cx}" y="${H - 5}" text-anchor="middle" style="font-size:13.5px;font-weight:700;fill:#1f2933">${bag.name}</text>`;
    });
    const said = bags.map((bag) => `주머니 ${bag.name}에는 ${bag.balls.slice(0, -1).join(', ')}, ${josa(bag.balls[bag.balls.length - 1], '이/가')} 하나씩 적힌 공 ${bag.balls.length}개가 들어 있다.`).join(' ');
    return `<svg class="mb-geo" viewBox="0 0 ${W * bags.length} ${H}" width="${W * bags.length}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // ══ 확률의 뜻 ══
  const MEAN = [
    T('mean-die', '주사위 한 개 — 눈이 조건에 맞을 확률', '①1 ②2', (d) => {
      const c = d.pick([mult(3), mult(4), divOf(5), divOf(8), divOf(9), divOf(12), divOf(20), PRIME]), hit = range(1, 6).filter(c.ok);
      return ansP(`한 개의 주사위를 던질 때, ${c.eye}이 나올 확률은?`, P(hit.length, 6), { explain: `모든 경우의 수는 6이고, ${c.eye}은 ${listSaid(hit)}이므로 구하는 확률은 ${red(hit.length, 6)}이다.`, facts: kn(hit.length, 6) });
    }),
    T('mean-cards', '수 카드 한 장 — 적힌 수가 조건에 맞을 확률', '①2 ②2', (d) => {
      // 1부터 시작하는 카드에서는 약수·배수를, 1부터 시작하지 않는 카드에서는 소수를 센다(카드의 장수도 따로 세어야 한다).
      const first = d.bool(), lo = first ? 1 : d.pick([11, 21, 31]), hi = first ? d.pick([10, 12, 15, 16, 18, 20, 24, 30]) : lo + d.pick([9, 14, 19]), all = range(lo, hi);
      const c = first ? d.until(() => d.pick([mult(3), mult(4), mult(6), divOf(12), divOf(18), divOf(20), divOf(24), divOf(30)]), (k) => { const h = all.filter(k.ok).length; return h >= 2 && h <= hi - 2; }) : PRIME, hit = all.filter(c.ok);
      return ansP(`${lo}부터 ${hi}까지의 자연수가 하나씩 적힌 ${all.length}장의 카드 중에서 한 장을 뽑을 때, ${c.n}가 적힌 카드가 나올 확률은?`, P(hit.length, all.length), {
        explain: `모든 경우의 수는 ${all.length}이고, ${c.n}는 ${listSaid(hit)}이므로 구하는 확률은 ${red(hit.length, all.length)}이다.`, facts: kn(hit.length, all.length) });
    }),
    T('mean-bag', '색 구슬 주머니에서 한 개 — 지정한 색', '①3 ②1', (d) => {
      const v = d.until(() => [d.int(2, 7), d.int(2, 7), d.int(2, 7)], (a) => new Set(a).size === 3), i = d.int(0, 2), COL = ['빨간', '노란', '파란'], all = sum(v);
      return ansP(`빨간 구슬 ${v[0]}개, 노란 구슬 ${v[1]}개, 파란 구슬 ${v[2]}개가 들어 있는 주머니에서 구슬 한 개를 꺼낼 때, ${COL[i]} 구슬이 나올 확률은?`, P(v[i], all), {
        explain: `구슬은 모두 ${v.join(' + ')} = ${all}(개)이고 ${COL[i]} 구슬은 ${v[i]}개이므로 구하는 확률은 ${red(v[i], all)}이다.`, facts: { value: `${v[i]}/(${v.join('+')})` } });
    }),
    T('mean-divisors', '어떤 수의 약수 가운데 하나 고르기', '①4', (d) => {
      const [n, k] = d.until(() => [d.pick([24, 30, 36, 40, 48, 54, 60, 72]), d.pick([2, 3, 4, 5, 6, 8, 9])], ([m, j]) => { const h = divs(m).filter((v) => v % j === 0).length; return m % j === 0 && h >= 2 && h <= divs(m).length - 2; });
      const ds = divs(n), hit = ds.filter((v) => v % k === 0);
      return ansP(`${n}의 약수 중에서 하나를 고를 때, 그 수가 ${k}의 배수일 확률은?`, P(hit.length, ds.length), {
        explain: `${n}의 약수는 ${listSaid(ds, '개')}이고, 이 중에서 ${k}의 배수는 ${listSaid(hit, '개')}이므로 구하는 확률은 ${red(hit.length, ds.length)}이다.`, facts: kn(hit.length, ds.length) });
    }),
    T('mean-pairs', '조건에 맞는 순서쌍 가운데 하나 고르기', '①5', (d) => {
      const prods = (s) => range(1, s - 1).map((a) => a * (s - a));
      const [s, k] = d.until(() => [d.int(7, 12), d.pick([6, 8, 10, 12, 15, 18, 20, 24, 30])], ([m, j]) => { const h = prods(m).filter((v) => v > j).length; return h >= 2 && h <= m - 3 && !prods(m).includes(j); });
      const hit = range(1, s - 1).map((a) => [a, s - a]).filter(([a, b]) => a * b > k);
      return ansP(`${nb(`${V('a')} + ${V('b')} = ${s}`)}${tail(s, '을/를')} 만족시키는 자연수 ${V('a')}, ${V('b')}의 순서쌍 ${pt(V('a'), V('b'))} 중에서 하나를 고를 때, ${nb(`${V('a')}${V('b')} &gt; ${k}`)}일 확률은?`, P(hit.length, s - 1), {
        explain: `순서쌍은 (1, ${s - 1}), (2, ${s - 2}), …, (${s - 1}, 1)의 ${s - 1}개이다. 이 중에서 ${nb(`${V('a')}${V('b')} &gt; ${k}`)}인 것은 ${pairsSaid(hit)}이므로 구하는 확률은 ${red(hit.length, s - 1)}이다.`, facts: kn(hit.length, s - 1) });
    }),
    T('mean-letters', '자음과 모음을 하나씩 골라 만든 글자', '①6', (d) => {
      const cons = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'].slice(0, d.int(3, 5)), vows = ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ'].slice(0, d.int(2, 4)), byCon = d.bool(), one = d.pick(byCon ? cons : vows), m = cons.length, n = vows.length, hit = byCon ? n : m;
      return ansP(`자음 ${cons.join(', ')}과 모음 ${vows.join(', ')} 중에서 자음과 모음을 하나씩 골라 글자를 만들 때, 만들 수 있는 글자 중에서 하나를 고른다. 고른 글자에 「${one}」${byCon ? '이' : '가'} 들어 있을 확률은?`, P(hit, m * n), {
        explain: `만들 수 있는 글자는 ${m} × ${n} = ${m * n}(개)이고, 「${one}」${byCon ? '이' : '가'} 들어 있는 글자는 ${hit}개이므로 구하는 확률은 ${red(hit, m * n)}이다.`, facts: { value: `${hit}/(${m}*${n})`, unseen: [m, n] } });
    }),
    T('mean-calendar', '달력에서 한 날짜 고르기', '①7', (d) => {
      const [month, days] = d.pick([[4, 30], [5, 31], [6, 30], [7, 31], [9, 30], [10, 31], [11, 30]]), first = d.int(0, 6);
      const week = range(1, days).filter((day) => (first + day - 1) % 7 !== 0), off = range(1, days).filter((day) => (first + day - 1) % 7 === 0).concat(d.shuffle(week).slice(0, d.int(1, 3))).sort((a, b) => a - b), open = days - off.length;
      return ansP('어느 가게는 다음 달력에서 색칠한 날에 문을 닫는다. 이 달력에서 하루를 고를 때, 고른 날에 이 가게가 문을 열 확률은?', P(open, days), { figure: calendarFig(month, first, days, off),
        explain: `날짜는 모두 ${days}일이고 색칠한 날은 ${off.length}일이므로 문을 여는 날은 ${days} − ${off.length} = ${open}(일)이다. 따라서 구하는 확률은 ${red(open, days)}이다.`, facts: { value: `(${days}-${off.length})/${days}`, unseen: [off.length] } });
    }),
    T('mean-word', '낱말의 글자 카드에서 모음(자음)이 나올 확률', '②3', (d) => {
      const w = d.pick(['MOUNTAIN', 'TRIANGLE', 'FRACTION', 'PROBLEM', 'SQUARE', 'NUMBER', 'SCHOOL', 'STUDENT', 'PENCIL', 'ORANGE']), all = w.split(''), vowel = d.bool(), hit = all.filter((ch) => 'AEIOU'.includes(ch) === vowel), kind = vowel ? '모음' : '자음';
      return ansP(`${w}의 알파벳을 한 장에 하나씩 적은 ${all.length}장의 카드 중에서 한 장을 뽑을 때, ${kind}이 적힌 카드가 나올 확률은?`, P(hit.length, all.length), {
        explain: `카드는 모두 ${all.length}장이고, ${kind}이 적힌 카드는 ${listSaid(hit, '장')}이므로 구하는 확률은 ${red(hit.length, all.length)}이다.`, facts: kn(hit.length, all.length) });
    }),
    T('mean-table', '조사한 표에서 한 명 — 한 항목일 확률', '②4', (d) => {
      const S = d.pick([{ lead: '어느 중학교 2학년 학생들이 가입한 동아리', head: '동아리', items: ['합창', '축구', '농구', '독서', '미술'], who: (x) => `${x} 동아리에 가입한 학생` },
        { lead: '어느 반 학생들이 가장 좋아하는 과일', head: '과일', items: ['사과', '귤', '망고', '포도', '수박'], who: (x) => `${josa(x, '을/를')} 가장 좋아하는 학생` },
        { lead: '어느 동네 학생들이 사는 마을', head: '마을', items: ['햇살', '달빛', '별빛', '바람'], who: (x) => `${x} 마을에 사는 학생` }]);
      const k = S.items.length, total = d.pick(k === 4 ? [30, 36, 40] : [40, 50, 60]);
      const v = d.until(() => { const a = Array.from({ length: k - 1 }, () => d.int(4, Math.floor(total / 3))); return a.concat([total - sum(a)]); }, (a) => a[k - 1] >= 4 && new Set(a).size === k), i = d.int(0, k - 1);
      return ansP(`다음은 ${josa(S.lead, '을/를')} 조사하여 나타낸 표이다. 조사한 학생 중에서 한 명을 뽑을 때, 그 학생이 ${S.who(S.items[i])}일 확률은?`, P(v[i], total), { figure: table([S.head, '학생 수(명)'], S.items.map((x, j) => [x, v[j]]).concat([['합계', total]])),
        explain: `조사한 학생은 모두 ${total}명이고 ${S.who(S.items[i])}은 ${v[i]}명이므로 구하는 확률은 ${red(v[i], total)}이다.`, facts: { value: `${v[i]}/${total}` } });
    }),
    T('mean-freq', '도수분포표에서 정한 범위에 드는 한 명일 확률', '②5', (d) => {
      const S = d.pick([{ what: '한 달 동안 읽은 책의 수', head: '책의 수(권)', u: '권', lo: 0, w: 2 }, { what: '하루 운동 시간', head: '운동 시간(분)', u: '분', lo: 10, w: 10 }, { what: '통학 시간', head: '통학 시간(분)', u: '분', lo: 0, w: 10 }]), k = 5, total = d.pick([25, 30, 35, 40]);
      const f = d.until(() => { const a = Array.from({ length: k - 1 }, () => d.int(2, 12)); return a.concat([total - sum(a)]); }, (a) => a[k - 1] >= 2 && a[k - 1] <= 12), i = d.int(0, k - 2), at = (j) => S.lo + S.w * j, hit = f[i] + f[i + 1];
      return ansP(`다음은 어느 반 학생 ${total}명의 ${josa(S.what, '을/를')} 조사하여 나타낸 도수분포표이다. 이 반 학생 중에서 한 명을 뽑을 때, 그 학생의 ${josa(S.what, '이/가')} ${at(i)}${S.u} 이상 ${at(i + 2)}${S.u} 미만일 확률은?`, P(hit, total), {
        figure: table([S.head, '학생 수(명)'], f.map((x, j) => [`${at(j)} 이상 ${at(j + 1)} 미만`, x]).concat([['합계', total]])),
        explain: `${at(i)}${S.u} 이상 ${at(i + 2)}${S.u} 미만인 학생은 ${f[i]} + ${f[i + 1]} = ${hit}(명)이고 전체 학생은 ${total}명이므로 구하는 확률은 ${red(hit, total)}이다.`, facts: { value: `(${f[i]}+${f[i + 1]})/${total}` } });
    }),
    T('mean-coins', '동전 여러 개 — 앞면이 정해진 개수만큼 나올 확률', '①9 ②7', (d) => {
      const [n, k] = d.pick([[2, 1], [3, 1], [3, 2], [2, 1]]), ways = n === 2 ? 2 : 3, total = 2 ** n;
      const shown = { '2,1': '(앞, 뒤), (뒤, 앞)', '3,1': '(앞, 뒤, 뒤), (뒤, 앞, 뒤), (뒤, 뒤, 앞)', '3,2': '(앞, 앞, 뒤), (앞, 뒤, 앞), (뒤, 앞, 앞)' }[n + ',' + k];
      return ansP(`서로 다른 동전 ${n}개를 동시에 던질 때, 앞면이 ${k}개, 뒷면이 ${n - k}개 나올 확률은?`, P(ways, total), {
        explain: `일어날 가능성이 같은 모든 경우의 수는 ${Array(n).fill(2).join(' × ')} = ${total}이고, 앞면이 ${k}개, 뒷면이 ${n - k}개 나오는 경우는 ${shown}의 ${ways}가지이므로 구하는 확률은 ${red(ways, total)}이다.`, facts: kn(ways, total) });
    }),
    T('mean-count-back', '확률을 알 때 공의 개수 구하기', '①74 ②71', (d, n) => {
      if (n === 0) {
        // 개수를 모르는 색이 아닌 다른 색의 확률을 준다: b/(r + b + x) = p
        const [r, b, x] = d.until(() => [d.int(2, 8), d.int(2, 6), d.int(2, 9)], ([r0, b0, x0]) => r0 !== b0 && Q(b0, r0 + b0 + x0).q <= 6 && Q(b0, r0 + b0 + x0).p <= 2), p = Q(b, r + b + x), X = V('x');
        return N(`빨간 공 ${r}개, 파란 공 ${b}개와 흰 공 몇 개가 들어 있는 주머니에서 공 한 개를 꺼낼 때, 파란 공이 나올 확률이 ${tx(p)}이다. 이 주머니에 들어 있는 흰 공은 몇 개인가?`, x, { unit: '개',
          explain: `흰 공을 ${X}개라 하면 ${frac(b, `${r + b} + ${X}`)} = ${tx(p)}이므로 ${r + b} + ${X} = ${b * p.q / p.p}, ${X} = ${x}이다.`, facts: { calc: [[`${b}*${p.q}/${p.p}-${r}-${b}`, 0]] } });
      }
      // 개수를 모르는 바로 그 색의 확률을 준다: x/(a + x) = p
      const [w, k, x] = d.until(() => [d.int(2, 7), d.int(2, 7), d.int(2, 9)], ([w0, k0, x0]) => w0 !== k0 && Q(x0, w0 + k0 + x0).q <= 5), p = Q(x, w + k + x), X = V('x');
      return N(`흰 구슬 ${w}개, 검은 구슬 ${k}개와 노란 구슬 몇 개가 들어 있는 주머니에서 구슬 한 개를 꺼낼 때, 노란 구슬이 나올 확률이 ${tx(p)}이다. 이 주머니에 들어 있는 노란 구슬은 몇 개인가?`, x, { unit: '개',
        explain: `노란 구슬을 ${X}개라 하면 ${frac(X, `${w + k} + ${X}`)} = ${tx(p)}이므로 ${p.q}${X} = ${p.p === 1 ? '' : p.p + ' × ('}${w + k} + ${X}${p.p === 1 ? '' : ')'}, ${X} = ${x}이다.`, facts: { calc: [[`${p.p}*(${w}+${k})/(${p.q}-${p.p})`, 0]] } });
    }, { count: 2 })
  ];

  // ══ 여러 가지 상황에서의 확률 ══
  // 수 카드로 만든 두 자리 자연수의 조건
  const sizeCond = (d, lo, hi) => { const t = 10 * d.int(lo, hi) + d.int(1, hi), kind = d.pick(['이상', '미만', '초과']); return kind === '초과' ? { 일: `${t}보다 클`, 인: `${t}보다 큰`, ok: (v) => v > t } : { 일: `${t} ${kind}일`, 인: `${t} ${kind}인`, ok: (v) => (kind === '이상' ? v >= t : v < t) }; };
  const KINDS = [EVEN, ODD, mult(3), mult(4), mult(5)];
  const pickCond = (d, all, pool, lo) => d.until(() => (typeof pool === 'function' ? pool() : d.pick(pool)), (c) => { const h = all.filter(c.ok).length; return h >= (lo || 2) && h <= all.length - (lo || 2); });
  const CASES = [
    T('cases-dice', '두 주사위 — 눈의 수의 합·차·곱이 한 값일 확률', '①12 ②8 심4', (d, n) => {
      const word = ['합', '차', '곱'][n], v = n === 0 ? d.pick([4, 5, 6, 8, 9, 10]) : n === 1 ? d.int(1, 5) : d.pick([4, 6, 8, 10, 12, 15, 18, 20, 24, 30]);
      const f = [(a, b) => a + b, (a, b) => Math.abs(a - b), (a, b) => a * b][n], hit = DICE.filter(([a, b]) => f(a, b) === v);
      // 다른 길: 합이 v 인 순서쌍은 6 − |7 − v|가지, 차가 v 인 순서쌍은 2(6 − v)가지, 곱이 v 인 순서쌍은 6 이하인 약수의 짝의 수
      const other = n === 0 ? 6 - Math.abs(7 - v) : n === 1 ? 2 * (6 - v) : range(1, 6).filter((a) => v % a === 0 && v / a <= 6).length;
      return ansP(`${TWO}, 나오는 두 눈의 수의 ${josa(word, '이/가')} ${v}일 확률은?`, P(hit.length, 36), {
        explain: `모든 경우의 수는 6 × 6 = 36이고, 두 눈의 수의 ${josa(word, '이/가')} ${v}인 경우는 ${pairsSaid(hit)}이므로 구하는 확률은 ${red(hit.length, 36)}이다.`, facts: kn(other, 36) });
    }, { count: 3 }),
    T('cases-dice-eq', '두 눈이 등식을 만족시킬 확률', '①13 ②11', (d, n) => {
      if (n === 0) {
        // 등식을 바로 준다.
        const [p, q, c] = d.until(() => { const [p0, q0] = d.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [3, -1], [2, -1], [4, -1]]); return [p0, q0, d.int(1, 16)]; }, ([p0, q0, c0]) => { const h = DICE.filter(([x, y]) => p0 * x + q0 * y === c0).length; return h >= 2 && h <= 4; });
        const hit = DICE.filter(([x, y]) => p * x + q * y === c), eq = nb(`${poly([[p, V('x')], [q, V('y')]])} = ${c}`);
        return ansP(`${XY}, ${eq}일 확률은?`, P(hit.length, 36), { explain: `모든 경우의 수는 36이고, ${eq}인 순서쌍 ${pt(V('x'), V('y'))}는 ${pairsSaid(hit)}이므로 구하는 확률은 ${red(hit.length, 36)}이다.`, facts: kn(hit.length, 36) });
      }
      // 직선이 한 점을 지난다 → 점의 좌표를 넣어 등식으로 옮긴다.
      const [m, c] = d.until(() => [d.int(2, 3), d.int(6, 20)], ([m0, c0]) => DICE.filter(([a, b]) => m0 * a + b === c0).length >= 2), hit = DICE.filter(([a, b]) => m * a + b === c);
      return ansP(`${AB}, 직선 ${nb(`${V('y')} = ${V('a')}${V('x')} + ${V('b')}`)}가 점 (${m}, ${c})${tail(c, '을/를')} 지날 확률은?`, P(hit.length, 36), {
        explain: `직선이 점 (${m}, ${c})${tail(c, '을/를')} 지나면 ${nb(`${c} = ${m}${V('a')} + ${V('b')}`)}이다. 이를 만족시키는 순서쌍 ${pt(V('a'), V('b'))}는 ${pairsSaid(hit)}이므로 구하는 확률은 ${red(hit.length, 36)}이다.`, facts: kn(hit.length, 36) });
    }, { count: 2 }),
    T('cases-dice-ineq', '두 눈이 부등식을 만족시킬 확률', '①14 ②12 심7', (d, n) => {
      const byFirst = (hit, x, y) => range(1, 6).map((a) => [a, hit.filter((h) => h[0] === a).map((h) => h[1])]).filter((r) => r[1].length).map(([a, bs]) => `${x} = ${a}일 때 ${y} = ${bs.join(', ')}`).join(' / ');
      if (n === 0) {
        // 부등식을 바로 준다.
        const [p, c, lt] = d.until(() => [d.int(2, 3), d.int(5, 16), d.bool()], ([p0, c0, lt0]) => { const h = DICE.filter(([x, y]) => (lt0 ? p0 * x + y < c0 : p0 * x + y > c0)).length; return h >= 3 && h <= 9; });
        const hit = DICE.filter(([x, y]) => (lt ? p * x + y < c : p * x + y > c)), ineq = nb(`${poly([[p, V('x')], [1, V('y')]])} ${lt ? '&lt;' : '&gt;'} ${c}`);
        return ansP(`${XY}, ${ineq}일 확률은?`, P(hit.length, 36), { explain: `${ineq}인 경우는 ${byFirst(hit, V('x'), V('y'))}의 ${hit.length}가지이다. 모든 경우의 수는 36이므로 구하는 확률은 ${red(hit.length, 36)}이다.`, facts: kn(hit.length, 36) });
      }
      // 말로 준 조건을 부등식으로 옮긴다.
      const [p, q] = d.until(() => [d.int(2, 3), d.int(3, 10)], ([p0, q0]) => { const h = DICE.filter(([a, b]) => p0 * a > b + q0).length; return h >= 4 && h <= 20; }), hit = DICE.filter(([a, b]) => p * a > b + q);
      return ansP(`두 개의 주사위 A, B를 동시에 던질 때, 주사위 A에서 나온 눈의 수의 ${p}배가 주사위 B에서 나온 눈의 수에 ${josa(q, '을/를')} 더한 것보다 클 확률은?`, P(hit.length, 36), {
        explain: `주사위 A, B에서 나온 눈의 수를 각각 ${V('a')}, ${V('b')}라 하면 ${nb(`${p}${V('a')} &gt; ${V('b')} + ${q}`)}이다. 이를 만족시키는 경우는 ${byFirst(hit, V('a'), V('b'))}의 ${hit.length}가지이므로 구하는 확률은 ${red(hit.length, 36)}이다.`, facts: kn(hit.length, 36) });
    }, { count: 2 }),
    T('cases-dice-multiple', '한 눈의 수를 다른 눈의 수로 나눈 값이 자연수일 확률', '①15 심8', (d) => {
      const flip = d.bool(), top = flip ? 'a' : 'b', bottom = flip ? 'b' : 'a', hit = DICE.filter(([a, b]) => (flip ? a % b === 0 : b % a === 0));
      return ansP(`한 개의 주사위를 두 번 던져 처음에 나오는 눈의 수를 ${V('a')}, 나중에 나오는 눈의 수를 ${V('b')}라 할 때, ${frac(V(top), V(bottom))}가 자연수일 확률은?`, P(hit.length, 36), {
        explain: `${V(top)}가 ${V(bottom)}의 배수인 경우를 센다. ${V(bottom)}의 값이 1일 때 6가지, 2일 때 3가지, 3일 때 2가지, 4, 5, 6일 때 1가지씩이므로 6 + 3 + 2 + 1 + 1 + 1 = ${hit.length}(가지)이다. 따라서 구하는 확률은 ${red(hit.length, 36)}이다.`,
        facts: kn(range(1, 6).reduce((s, k) => s + Math.floor(6 / k), 0), 36) });
    }),
    T('cases-dice-round', '두 눈의 수로 만든 소수를 반올림한 값', '심13', (d) => {
      const t = d.int(1, 7), hit = DICE.filter(([a, b]) => Math.round((a * 10 + b) / 10) === t);
      return ansP(`한 개의 주사위를 두 번 던져 처음에 나온 눈의 수를 일의 자리의 숫자, 나중에 나온 눈의 수를 소수 첫째 자리의 숫자로 하는 소수를 만든다. 이 소수를 소수 첫째 자리에서 반올림한 값이 ${t}일 확률은?`, P(hit.length, 36), {
        explain: `만들 수 있는 소수는 36개이다. 반올림하여 ${josa(t, '이/가')} 되는 소수는 ${listSaid(hit.map(([a, b]) => a + '.' + b), '개')}이므로 구하는 확률은 ${red(hit.length, 36)}이다.`, facts: kn((t >= 2 ? 2 : 0) + (t <= 6 ? 4 : 0), 36) });
    }),
    T('cases-tetra', '정사면체 주사위를 두 번 던질 때의 확률', '②11 심14', (d) => {
      const TET = []; for (let x = 0; x <= 3; x += 1) for (let y = 0; y <= 3; y += 1) TET.push([x, y]);
      const [p, q, c] = d.until(() => { const [p0, q0] = d.pick([[1, 2], [2, 1], [1, 1], [1, 3], [3, 1]]); return [p0, q0, d.int(2, 9)]; }, ([p0, q0, c0]) => { const h = TET.filter(([x, y]) => p0 * x + q0 * y === c0).length; return h >= 2 && h <= 4; });
      const hit = TET.filter(([x, y]) => p * x + q * y === c), eq = nb(`${poly([[p, V('x')], [q, V('y')]])} = ${c}`);
      return ansP(`각 면에 0, 1, 2, 3이 하나씩 적힌 정사면체 모양의 주사위를 두 번 던져 바닥에 닿는 면에 적힌 수를 차례로 ${V('x')}, ${V('y')}라 할 때, ${eq}일 확률은?`, P(hit.length, 16), {
        explain: `면이 4개이므로 모든 경우의 수는 4 × 4 = 16이다. ${eq}인 순서쌍 ${pt(V('x'), V('y'))}는 ${pairsSaid(hit)}이므로 구하는 확률은 ${red(hit.length, 16)}이다.`, facts: kn(hit.length, 16) });
    }),
    T('cases-two-draw', '두 사람이 같은 수 묶음에서 하나씩 뽑을 때 더 큰 수', '②9', (d) => {
      const [A, Bn] = two(d), n = d.int(3, 5), hit = []; for (let a = 1; a <= n; a += 1) for (let b = 1; b < a; b += 1) hit.push([a, b]);
      return ansP(`${name(A, '과/와')} ${name(Bn, '이/가')} 1부터 ${n}까지의 자연수가 하나씩 적힌 공 ${n}개가 든 상자를 하나씩 가지고 있다. 두 사람이 저마다 자기 상자에서 공을 한 개씩 꺼낼 때, ${name(A, '이/가')} 꺼낸 공에 적힌 수가 ${name(Bn, '이/가')} 꺼낸 공에 적힌 수보다 클 확률은?`, P(hit.length, n * n), {
        explain: `모든 경우의 수는 ${n} × ${n} = ${n * n}이다. (${nick(A)}의 수, ${nick(Bn)}의 수)로 나타내면 ${nick(A)}의 수가 더 큰 경우는 ${pairsSaid(hit)}이므로 구하는 확률은 ${red(hit.length, n * n)}이다.`, facts: kn(n * (n - 1) / 2, n * n) });
    }),
    T('cases-two-boxes', '수의 범위가 다른 두 상자에서 하나씩 뽑아 곱이 정해진 값', '②10', (d) => {
      const hits = (m, n, k) => { const out = []; for (let a = 1; a <= m; a += 1) for (let b = 1; b <= n; b += 1) if (a * b === k) out.push([a, b]); return out; };
      const [m, n, k] = d.until(() => [d.int(3, 4), d.int(4, 6), d.pick([4, 6, 8, 10, 12, 15, 18, 20])], ([m0, n0, k0]) => m0 < n0 && hits(m0, n0, k0).length >= 2), hit = hits(m, n, k);
      return ansP(`상자 A에는 1부터 ${m}까지, 상자 B에는 1부터 ${n}까지의 자연수가 하나씩 적힌 카드가 들어 있다. 두 상자 A, B에서 카드를 한 장씩 뽑을 때, 뽑은 두 카드에 적힌 수의 곱이 ${k}일 확률은?`, P(hit.length, m * n), {
        explain: `모든 경우의 수는 ${m} × ${n} = ${m * n}이다. (A의 수, B의 수)로 나타내면 곱이 ${k}인 경우는 ${pairsSaid(hit)}이므로 구하는 확률은 ${red(hit.length, m * n)}이다.`, facts: kn(hit.length, m * n) });
    }),
    T('cases-cards', '0이 없는 수 카드 두 장으로 만든 두 자리 수', '②15 심16', (d, n) => {
      // 차례 0: 크기 조건. 차례 1: 배수·홀짝 조건.
      const m = d.int(4, 6), all = []; for (let a = 1; a <= m; a += 1) for (let b = 1; b <= m; b += 1) if (a !== b) all.push(10 * a + b);
      const c = n === 0 ? pickCond(d, all, () => sizeCond(d, 2, m - 1), 3) : pickCond(d, all, KINDS), hit = all.filter(c.ok).length;
      return ansP(`1부터 ${m}까지의 자연수가 하나씩 적힌 ${m}장의 카드 중에서 두 장을 뽑아 두 자리 자연수를 만들 때, 만든 수가 ${c.일} 확률은?`, P(hit, all.length), {
        explain: `만들 수 있는 두 자리 자연수는 ${m} × ${m - 1} = ${all.length}(개)이다. 이 중에서 ${countSaid(all, c)}이므로 구하는 확률은 ${red(hit, all.length)}이다.`, facts: kn(hit, all.length) });
    }, { count: 2 }),
    T('cases-cards-zero', '0이 낀 수 카드 두 장으로 만든 두 자리 수', '①16 ②16 심17', (d, n) => {
      // 0은 십의 자리에 올 수 없으므로 전체가 m × m 가지이다. 차례 0: 크기 조건. 차례 1: 홀짝·배수 조건(일의 자리가 0일 때와 아닐 때 개수가 다르다).
      const m = d.int(3, 5), all = []; for (let a = 1; a <= m; a += 1) for (let b = 0; b <= m; b += 1) if (a !== b) all.push(10 * a + b);
      const c = n === 0 ? pickCond(d, all, () => sizeCond(d, 1, m), 3) : pickCond(d, all, KINDS), hit = all.filter(c.ok).length;
      return ansP(`${range(0, m).join(', ')}${tail(m, '이/가')} 하나씩 적힌 ${m + 1}장의 카드 중에서 두 장을 뽑아 두 자리 자연수를 만들 때, 만든 수가 ${c.일} 확률은?`, P(hit, all.length), {
        explain: `십의 자리에는 0이 올 수 없으므로 만들 수 있는 두 자리 자연수는 ${m} × ${m} = ${all.length}(개)이다. 이 중에서 ${countSaid(all, c)}이므로 구하는 확률은 ${red(hit, all.length)}이다.`, facts: kn(hit, all.length) });
    }, { count: 2 }),
    T('cases-cards-bigfirst', '뽑은 두 장 가운데 큰 수를 십의 자리로', '①17', (d) => {
      const zero = d.bool(), m = zero ? d.int(4, 5) : d.int(4, 6), digits = range(zero ? 0 : 1, m), all = []; for (const a of digits) for (const b of digits) if (a > b) all.push(10 * a + b);
      const c = pickCond(d, all, KINDS), hit = all.filter(c.ok);
      return ansP(`${digits.join(', ')}${tail(m, '이/가')} 하나씩 적힌 ${digits.length}장의 카드 중에서 두 장을 동시에 뽑아, 큰 수를 십의 자리의 숫자로 하고 작은 수를 일의 자리의 숫자로 하는 두 자리 자연수를 만들 때, 만든 수가 ${c.일} 확률은?`, P(hit.length, all.length), {
        explain: `두 장을 뽑으면 수가 하나로 정해지므로 만들 수 있는 수는 ${listSaid(all, '개')}이다. 이 중에서 ${c.인} 수는 ${listSaid(hit, '개')}이므로 구하는 확률은 ${red(hit.length, all.length)}이다.`, facts: kn(hit.length, digits.length * (digits.length - 1) / 2) });
    }),
    T('cases-replace-number', '다시 넣고 두 번 뽑아 만든 두 자리 수', '①18', (d) => {
      const m = d.int(4, 5), all = []; for (let a = 1; a <= m; a += 1) for (let b = 1; b <= m; b += 1) all.push(10 * a + b);
      const c = pickCond(d, all, KINDS), hit = all.filter(c.ok).length;
      return ansP(`1부터 ${m}까지의 자연수가 하나씩 적힌 구슬 ${m}개가 들어 있는 상자에서 구슬 한 개를 꺼내 적힌 수를 십의 자리의 숫자로 하고, 꺼낸 구슬을 다시 넣은 다음 구슬 한 개를 또 꺼내 적힌 수를 일의 자리의 숫자로 하여 두 자리 자연수를 만든다. 만든 수가 ${c.일} 확률은?`, P(hit, all.length), {
        explain: `꺼낸 구슬을 다시 넣으므로 만들 수 있는 두 자리 자연수는 ${m} × ${m} = ${all.length}(개)이다. 이 중에서 ${countSaid(all, c)}이므로 구하는 확률은 ${red(hit, all.length)}이다.`, facts: kn(hit, m * m) });
    }),
    T('cases-line', '한 줄로 늘어놓을 때의 확률', '①19·20 ②18', (d, n) => {
      if (n === 0) {
        // 정해진 차례 하나
        const m = d.int(3, 4), total = fact(m);
        return ansP(`${range(1, m).join(', ')}${tail(m, '이/가')} 하나씩 적힌 ${m}장의 카드를 한 줄로 늘어놓을 때, 왼쪽부터 작은 수의 차례대로 놓일 확률은?`, P(1, total), {
          explain: `${m}장을 한 줄로 늘어놓는 경우의 수는 ${mulSaid(m)} = ${total}이고, 작은 수의 차례대로 놓이는 경우는 1가지이므로 구하는 확률은 ${frac(1, total)}이다.`, facts: kn(1, total) });
      }
      // 알파벳 이름이 받침 없이 끝나는 글자(L, M, N, R 이 없는 낱말)만 쓴다 — 뒤에 붙는 토씨가 「가·와」로 한결같다.
      const w = d.pick(n === 1 ? ['KITE', 'HOPE', 'DESK', 'BIKE', 'GATE', 'SHIP', 'TOY', 'SKY', 'BOX', 'CUP'] : ['KITE', 'HOPE', 'DESK', 'BIKE', 'HOUSE', 'WATCH', 'JUICE', 'BEACH']), m = w.length, [x, y] = d.shuffle(w.split('')).slice(0, 2), total = fact(m), part = fact(m - 1), lead = `${w.split('').join(', ')}가 하나씩 적힌 ${m}장의 카드를 한 줄로 늘어놓을 때`;
      if (n === 1) return ansP(`${lead}, ${x}와 ${y}가 이웃할 확률은?`, P(part * 2, total), {
        explain: `${m}장을 한 줄로 늘어놓는 경우의 수는 ${mulSaid(m)} = ${total}이다. ${x}와 ${y}를 한 묶음으로 보고 늘어놓는 경우의 수는 ${mulSaid(m - 1)} = ${part}이고, 묶음 안에서 두 장의 자리를 바꾸는 경우가 2가지이므로 이웃하는 경우의 수는 ${part} × 2 = ${part * 2}이다. 따라서 구하는 확률은 ${red(part * 2, total)}이다.`, facts: kn(part * 2, total) });
      return ansP(`${lead}, ${x} 또는 ${y}가 맨 앞에 놓일 확률은?`, P(2, m), {
        explain: `모든 경우의 수는 ${mulSaid(m)} = ${total}이다. 맨 앞에 ${x}가 놓이는 경우의 수는 나머지 ${m - 1}장을 늘어놓는 ${mulSaid(m - 1)} = ${part}이고, ${y}가 놓이는 경우의 수도 ${part}이다. 따라서 구하는 확률은 ${frac(part + ' + ' + part, total)} = ${tx(P(2, m))}이다.`, facts: kn(part * 2, total) });
    }, { count: 3 }),
    T('cases-pick-person', '여럿 가운데 2명을 뽑을 때 한 사람이 뽑힐 확률', '①21 ②19', (d) => {
      const m = d.int(4, 6), who = d.shuffle(NAMES).slice(0, m), x = d.pick(who), total = m * (m - 1) / 2;
      return ansP(`${who.join(', ')} ${m}명 중에서 청소 당번 2명을 뽑을 때, ${name(x, '이/가')} 뽑힐 확률은?`, P(m - 1, total), {
        explain: `${m}명 중에서 2명을 뽑는 경우의 수는 ${m} × ${m - 1} ÷ 2 = ${total}이고, ${name(x, '이/가')} 뽑히는 경우는 나머지 ${m - 1}명 중에서 1명을 더 뽑는 ${m - 1}가지이므로 구하는 확률은 ${red(m - 1, total)}이다.`, facts: { value: `(${m}-1)/(${m}*(${m}-1)/2)`, unseen: [1] } });
    }),
    T('cases-roles', '역할이 다른 두 사람을 정할 때 나머지에 들 확률', '심22', (d) => {
      const m = d.int(4, 5), who = d.shuffle(NAMES).slice(0, m), x = d.pick(who), total = m * (m - 1), hit = (m - 1) * (m - 2);
      return ansP(`${who.join(', ')} ${m}명이 교실을 청소하는데, 칠판을 닦을 사람 1명과 창문을 닦을 사람 1명을 정하고 나머지는 모두 바닥을 쓸기로 하였다. ${name(x, '이/가')} 바닥을 쓸게 될 확률은?`, P(hit, total), {
        explain: `칠판을 닦을 사람과 창문을 닦을 사람을 정하는 경우의 수는 ${m} × ${m - 1} = ${total}이다. ${name(x, '이/가')} 바닥을 쓰는 경우는 나머지 ${m - 1}명 중에서 두 사람을 정하는 ${m - 1} × ${m - 2} = ${hit}(가지)이므로 구하는 확률은 ${red(hit, total)}이다.`, facts: { value: `(${m}-2)/${m}`, unseen: [2] } });
    }),
    T('cases-rps', '가위바위보 한 번', '①10', (d) => {
      const [A, Bn] = two(d), k = d.int(0, 2), ask = [`${name(A, '이/가')} 이길 확률`, '두 사람이 비길 확률', '승부가 결정될 확률'][k], hit = [3, 3, 6][k];
      const why = [`${name(A, '이/가')} 이기는 경우는 (${nick(A)}, ${nick(Bn)})의 차례로 (가위, 보), (바위, 가위), (보, 바위)의 3가지`, '두 사람이 같은 것을 내어 비기는 경우는 3가지', '비기는 경우는 두 사람이 같은 것을 내는 3가지이고 나머지 6가지는 승부가 결정되는 경우'][k];
      return ansP(`${name(A, '과/와')} ${name(Bn, '이/가')} 가위바위보를 한 번 할 때, ${ask}은?`, P(hit, 9), { explain: `모든 경우의 수는 3 × 3 = 9이고, ${why}이므로 구하는 확률은 ${red(hit, 9)}이다.`, facts: kn(hit, 9) });
    }),
    T('cases-game-rule', '승패 규칙을 읽고 이길 확률', '①11', (d) => {
      const [A, Bn] = two(d), k = d.int(0, 2), c = [null, mult(3), PRIME][k], win = c ? range(1, 6).filter(c.ok).length : 1, sides = c ? 6 : 2, hit = win * (sides - win), total = sides * sides;
      const rule = c ? `주사위를 한 개씩 던져 ${c.eye}이 나온 사람이 이기고, 두 사람 모두 ${c.eye}이 나오거나 두 사람 모두 ${c.eye}이 나오지 않으면 비기는 것으로 한다. 주사위를 한 번씩 던질 때` : '동전을 한 개씩 던져 앞면이 나온 사람이 이기고, 두 사람 모두 같은 면이 나오면 비기는 것으로 한다. 동전을 한 번씩 던질 때';
      return ansP(`${name(A, '과/와')} ${name(Bn, '이/가')} ${rule}, ${name(A, '이/가')} 이길 확률은?`, P(hit, total), {
        explain: c ? `모든 경우의 수는 6 × 6 = 36이다. ${name(A, '이/가')} 이기는 경우는 ${nick(A)}는 ${c.eye}(${win}가지)이 나오고 ${nick(Bn)}는 그 밖의 눈(${6 - win}가지)이 나오는 ${win} × ${6 - win} = ${hit}(가지)이므로 구하는 확률은 ${red(hit, total)}이다.`
          : `모든 경우의 수는 2 × 2 = 4이고, ${name(A, '이/가')} 이기는 경우는 (${nick(A)}, ${nick(Bn)})의 차례로 (앞, 뒤)의 1가지이므로 구하는 확률은 ${frac(1, 4)}이다.`, facts: kn(hit, total) });
    })
  ];

  // ══ 확률의 성질 ══
  const p_ = V('p'), q_ = V('q');
  // 사건들. [사건, 종류(1: 반드시 일어난다, 0: 절대로 일어나지 않는다, 2: 그 밖), 까닭]
  const EVENTS = (w) => [
    ['한 개의 주사위를 던질 때, 6 이하의 눈이 나온다.', 1, '주사위의 눈은 모두 6 이하이다.'], ['한 개의 주사위를 던질 때, 1 이상의 눈이 나온다.', 1, '주사위의 눈은 모두 1 이상이다.'],
    ['서로 다른 두 개의 주사위를 동시에 던질 때, 두 눈의 수의 합이 12 이하이다.', 1, '두 눈의 수의 합은 가장 커도 12이다.'], [`흰 구슬만 ${w}개 들어 있는 주머니에서 구슬 한 개를 꺼낼 때, 흰 구슬이 나온다.`, 1, '주머니에 흰 구슬만 있다.'],
    ['서로 다른 두 개의 주사위를 동시에 던질 때, 두 눈의 수의 합이 2 이상이다.', 1, '두 눈의 수의 합은 가장 작아도 2이다.'],
    ['한 개의 주사위를 던질 때, 7 이상의 눈이 나온다.', 0, '주사위에 7 이상의 눈은 없다.'], ['한 개의 동전을 던질 때, 앞면과 뒷면이 동시에 나온다.', 0, '동전 한 개에서 두 면이 함께 나올 수는 없다.'],
    ['서로 다른 두 개의 주사위를 동시에 던질 때, 두 눈의 수의 합이 13이다.', 0, '두 눈의 수의 합은 가장 커도 12이다.'], ['서로 다른 두 개의 주사위를 동시에 던질 때, 두 눈의 수의 차가 6이다.', 0, '두 눈의 수의 차는 가장 커도 5이다.'],
    [`흰 구슬만 ${w}개 들어 있는 주머니에서 구슬 한 개를 꺼낼 때, 파란 구슬이 나온다.`, 0, '주머니에 파란 구슬이 없다.'],
    ['한 개의 주사위를 던질 때, 짝수의 눈이 나온다.', 2], ['한 개의 동전을 던질 때, 앞면이 나온다.', 2], ['서로 다른 동전 2개를 동시에 던질 때, 서로 다른 면이 나온다.', 2], ['두 사람이 가위바위보를 한 번 할 때, 비긴다.', 2],
    ['서로 다른 두 개의 주사위를 동시에 던질 때, 서로 같은 눈이 나온다.', 2], ['한 개의 주사위를 던질 때, 6의 약수의 눈이 나온다.', 2]
  ];
  const PROP = [
    T('prop-claims', '확률의 성질을 적은 문장의 참·거짓', '①23 ②24·25 심2', (d, n) => claimQ(d, `어떤 사건 A가 일어날 확률을 ${p_}, 사건 A가 일어나지 않을 확률을 ${q_}라 할 때, 다음 중 ${n === 0 ? '옳은' : '옳지 않은'} 것은?`, [
      `${nb(`0 ≤ ${p_} ≤ 1`)}이다.`, `${nb(`${p_} + ${q_} = 1`)}이다.`, `${nb(`${q_} = 1 − ${p_}`)}이다.`, `사건 A가 반드시 일어나면 ${nb(`${p_} = 1`)}이다.`, `사건 A가 절대로 일어나지 않으면 ${nb(`${p_} = 0`)}이다.`, `${nb(`${p_} = 1`)}이면 ${nb(`${q_} = 0`)}이다.`, `${nb(`0 ≤ ${q_} ≤ 1`)}이다.`
    ], [
      [`${nb(`${q_} = ${p_} − 1`)}이다.`, `사건 A가 일어나지 않을 확률은 ${nb(`${q_} = 1 − ${p_}`)}이다.`, `${nb(`${q_} = 1 − ${p_}`)}이다.`],
      [`${nb(`${p_} × ${q_} = 1`)}이다.`, `두 확률은 곱이 아니라 합이 1이다.`, `${nb(`${p_} + ${q_} = 1`)}이다.`],
      [`사건 A가 반드시 일어나면 ${nb(`${p_} = 0`)}이다.`, `반드시 일어나는 사건의 확률은 1이다.`, `사건 A가 반드시 일어나면 ${nb(`${p_} = 1`)}이다.`],
      [`사건 A가 절대로 일어나지 않으면 ${nb(`${q_} = 0`)}이다.`, `절대로 일어나지 않는 사건은 ${nb(`${p_} = 0`)}이므로 ${nb(`${q_} = 1`)}이다.`, `사건 A가 절대로 일어나지 않으면 ${nb(`${p_} = 0`)}이다.`],
      [`${nb(`${p_} + ${q_} &lt; 1`)}이다.`, `${nb(`${p_} + ${q_} = 1`)}이다.`, `${nb(`${p_} + ${q_} = 1`)}이다.`],
      [`${q_}의 값은 1보다 클 수도 있다.`, `확률은 0 이상 1 이하이므로 ${q_}의 값도 1보다 클 수 없다.`, `${nb(`0 ≤ ${q_} ≤ 1`)}이다.`],
      [`${p_}의 값은 0이나 1이 될 수 없다.`, `절대로 일어나지 않는 사건의 확률은 0, 반드시 일어나는 사건의 확률은 1이므로 ${nb(`0 ≤ ${p_} ≤ 1`)}이다.`, `${nb(`0 ≤ ${p_} ≤ 1`)}이다.`],
      [`${nb(`${p_} = ${q_}`)}이다.`, `${nb(`${p_} + ${q_} = 1`)}일 뿐, 두 확률이 늘 같은 것은 아니다.`]
    ], n === 0), { count: 2 }),
    T('prop-sure', '반드시 일어나는 사건·절대로 일어나지 않는 사건의 확률', '①24 ②22', (d, n) => {
      // 차례 0: 절대로 일어나지 않는 사건(0). 차례 1: 반드시 일어나는 사건(1).
      const w = d.int(2, 5), k = d.int(2, 5), m = d.pick([8, 10, 12, 15]);
      const S = d.pick([
        { lead: '한 개의 주사위를 던질 때', zero: ['7의 눈이 나올 확률', [frac(1, 6), frac(1, 7)], '주사위의 눈은 1부터 6까지이므로 7의 눈은 절대로 나오지 않는다.'], one: ['6 이하의 눈이 나올 확률', [frac(5, 6), frac(1, 6)], '주사위의 눈은 모두 6 이하이므로 6 이하의 눈은 반드시 나온다.'] },
        { lead: TWO, zero: ['나오는 두 눈의 수의 합이 1일 확률', [frac(1, 36), frac(1, 12)], '두 눈의 수의 합은 2 이상이므로 합이 1인 경우는 없다.'], one: ['나오는 두 눈의 수의 합이 12 이하일 확률', [frac(11, 12), frac(35, 36)], '두 눈의 수의 합은 가장 커도 12이므로 반드시 12 이하이다.'] },
        { lead: `흰 공 ${w}개, 검은 공 ${k}개가 들어 있는 주머니에서 공 한 개를 꺼낼 때`, zero: ['노란 공이 나올 확률', [frac(1, w + k), frac(1, 3)], '주머니에 노란 공이 없으므로 노란 공은 절대로 나오지 않는다.'], one: ['흰 공 또는 검은 공이 나올 확률', [frac(1, 2), frac(w + k - 1, w + k)], '주머니에는 흰 공과 검은 공만 있으므로 흰 공 또는 검은 공은 반드시 나온다.'] },
        { lead: `1부터 ${m}까지의 자연수가 하나씩 적힌 ${m}장의 카드 중에서 한 장을 뽑을 때`, zero: [`${m + 1} 이상의 수가 적힌 카드가 나올 확률`, [frac(1, m), frac(1, m + 1)], `카드에 적힌 수는 모두 ${m} 이하이므로 ${m + 1} 이상의 수는 절대로 나오지 않는다.`], one: [`${m} 이하의 수가 적힌 카드가 나올 확률`, [frac(m - 1, m), frac(1, m)], `카드에 적힌 수는 모두 ${m} 이하이므로 ${m} 이하의 수는 반드시 나온다.`] }
      ]);
      const [ask, wrong, why] = n === 0 ? S.zero : S.one, right = n === 0 ? '0' : '1', opts = d.shuffle(['0', '1'].concat(wrong));
      return C(`${S.lead}, ${ask}은?`, opts, opts.indexOf(right), { explain: `${why} ${n === 0 ? '절대로 일어나지 않는 사건의 확률은 0이다.' : '반드시 일어나는 사건의 확률은 1이다.'}`, facts: { truth: opts.map((o) => o === right), want: true } });
    }, { count: 2 }),
    T('prop-pick', '확률이 1인 사건·0인 사건 고르기', '①25 ②23 심1', (d, n) => {
      // 차례 0: 확률이 1인 것. 차례 1: 확률이 0인 것.
      const all = EVENTS(d.int(3, 6)), want = n === 0 ? 1 : 0, of = (kind) => d.shuffle(all.filter((e) => e[1] === kind));
      const rows = d.shuffle([of(want)[0], of(1 - want)[0]].concat(of(2).slice(0, 2))), at = rows.findIndex((e) => e[1] === want);
      return C(want === 1 ? '다음 중 확률이 1인 사건은?' : '다음 중 일어날 확률이 0인 것은?', rows.map((e) => e[0]), at, { explain: `${rows[at][2]} ${want === 1 ? '반드시 일어나는 사건의 확률은 1이다.' : '절대로 일어나지 않는 사건의 확률은 0이다.'}`, facts: { truth: rows.map((e) => e[1] === want), want: true } });
    }, { count: 2 }),
    T('prop-order', '사건의 확률을 작은 것부터 늘어놓기', '①26 ②28', (d) => {
      const POOL = [['서로 다른 동전 2개를 동시에 던질 때, 서로 다른 면이 나온다.', Q(1, 2)], ['서로 다른 두 개의 주사위를 동시에 던질 때, 두 눈의 수의 합이 13이다.', Q(0)], ['한 개의 주사위를 던질 때, 7보다 작은 눈이 나온다.', Q(1)], ['한 개의 주사위를 던질 때, 3의 배수의 눈이 나온다.', Q(1, 3)],
        ['서로 다른 동전 2개를 동시에 던질 때, 모두 앞면이 나온다.', Q(1, 4)], ['한 개의 주사위를 던질 때, 6의 약수의 눈이 나온다.', Q(2, 3)], ['서로 다른 두 개의 주사위를 동시에 던질 때, 서로 같은 눈이 나온다.', Q(1, 6)], ['한 개의 주사위를 던질 때, 8의 눈이 나온다.', Q(0)], ['서로 다른 두 개의 주사위를 동시에 던질 때, 두 눈의 수의 합이 2 이상이다.', Q(1)]];
      const ev = d.until(() => d.shuffle(POOL).slice(0, 3), (e) => new Set(e.map((x) => x[1].p + '/' + x[1].q)).size === 3 && e.some((x) => x[1].q === 1));
      const TAG = ['ㄱ', 'ㄴ', 'ㄷ'], order = [0, 1, 2].sort((i, j) => qcmp(ev[i][1], ev[j][1])), said = (o) => o.map((i) => TAG[i]).join(', '), same = (o) => o.join() === order.join();
      const others = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].filter((o) => !same(o) && o.join() !== order.slice().reverse().join());
      const opts = d.shuffle([order, order.slice().reverse()].concat(d.shuffle(others).slice(0, 2)));
      return C('다음 사건이 일어날 확률을 작은 것부터 차례대로 나열한 것은?', opts.map(said), opts.findIndex(same), { figure: tagged(ev.map((e) => e[0]), TAG),
        explain: `확률은 ${ev.map((e, i) => `${TAG[i]}이 ${tx(e[1])}`).join(', ')}이다. 작은 것부터 차례대로 나열하면 ${said(order)}이다.`, facts: { truth: opts.map(same), want: true } });
    }),
    T('prop-cards-claims', '한 상황에 대한 확률 문장 가운데 옳은 것', '②26', (d) => {
      // 카드에 적힌 수와 확률의 값을 헷갈리게 한 문장들이다.
      const m = d.pick([10, 12, 15, 20]), k = d.int(2, 5);
      const yes = d.pick([['0이 적힌 카드가 나올 확률은 0이다.', 'zero'], [`${m + 1} 이상의 수가 적힌 카드가 나올 확률은 0이다.`, 'over'], [`${m} 이하의 수가 적힌 카드가 나올 확률은 1이다.`, 'all'], [`${josa(k, '이/가')} 적힌 카드가 나올 확률은 ${frac(1, m)}이다.`, 'one']]);
      const no = d.shuffle([
        ['1이 적힌 카드가 나올 확률은 1이다.', `1이 적힌 카드는 한 장뿐이므로 그 확률은 ${frac(1, m)}이다.`, ''],
        [`${josa(k, '이/가')} 적힌 카드가 나올 확률은 ${frac(k, m)}이다.`, `${josa(k, '이/가')} 적힌 카드는 한 장뿐이므로 그 확률은 ${frac(1, m)}이다.`, 'one'],
        [`${m} 이하의 수가 적힌 카드가 나올 확률은 ${frac(m - 1, m)}이다.`, `모든 카드에 ${m} 이하의 수가 적혀 있으므로 그 확률은 1이다.`, 'all'],
        [`${m} 이상의 수가 적힌 카드가 나올 확률은 0이다.`, `${josa(m, '이/가')} 적힌 카드가 한 장 있으므로 그 확률은 ${frac(1, m)}이다.`, 'over'],
        [`0이 적힌 카드가 나올 확률은 ${frac(1, m)}이다.`, '0이 적힌 카드는 없으므로 그 확률은 0이다.', 'zero']
      ].filter((s) => s[2] !== yes[1])).slice(0, 3);
      const rows = d.shuffle([[yes[0], true, '']].concat(no.map((s) => [s[0], false, s[1]]))), at = rows.findIndex((r) => r[1]);
      return C(`1부터 ${m}까지의 자연수가 하나씩 적힌 ${m}장의 카드 중에서 한 장을 뽑을 때, 다음 중 옳은 것은?`, rows.map((r) => r[0]), at, { explain: rows.filter((r) => !r[1]).map((r) => r[2]).join(' '), facts: { truth: rows.map((r) => r[1]), want: true } });
    }),
    T('prop-right-values', '여러 상황의 확률을 바르게 구한 것 모두 고르기', '②27', (d) => {
      // [상황, 바른 값, 틀린 값, 바로잡는 말]. 동전 두 개의 「앞면이 한 개만」을 1/3로 적은 문장은 일어날 가능성이 같지 않은 세 경우(앞면 0개, 1개, 2개)로 센 것이다.
      const POOL = [
        ['한 개의 주사위를 던질 때, 4의 약수의 눈이 나올 확률', frac(1, 2), frac(2, 3), `4의 약수의 눈은 1, 2, 4의 3가지이므로 확률은 ${frac(1, 2)}이다.`],
        ['서로 다른 동전 2개를 동시에 던질 때, 앞면이 한 개만 나올 확률', frac(1, 2), frac(1, 3), `일어날 가능성이 같은 경우는 (앞, 앞), (앞, 뒤), (뒤, 앞), (뒤, 뒤)의 4가지이고 앞면이 한 개만 나오는 경우는 2가지이므로 확률은 ${frac(1, 2)}이다.`],
        ['서로 다른 동전 2개를 동시에 던질 때, 모두 앞면이 나올 확률', frac(1, 4), frac(1, 3), `일어날 가능성이 같은 4가지 경우 중 (앞, 앞)의 1가지이므로 확률은 ${frac(1, 4)}이다.`],
        ['서로 다른 두 개의 주사위를 동시에 던질 때, 두 눈의 수의 합이 13보다 작을 확률', '1', frac(11, 12), '두 눈의 수의 합은 늘 12 이하이므로 확률은 1이다.'],
        ['한 개의 주사위를 던질 때, 7의 눈이 나올 확률', '0', frac(1, 6), '7의 눈은 없으므로 확률은 0이다.'],
        ['두 사람이 가위바위보를 한 번 할 때, 비길 확률', frac(1, 3), frac(1, 2), `9가지 경우 중 비기는 경우는 3가지이므로 확률은 ${frac(1, 3)}이다.`],
        [`어떤 사건이 일어날 확률이 ${frac(1, 4)}일 때, 그 사건이 일어나지 않을 확률`, frac(3, 4), '0', `1 − ${frac(1, 4)} = ${frac(3, 4)}이다.`]
      ];
      const TAG = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], four = d.shuffle(POOL).slice(0, 4), ok = d.shuffle([true, true, false, false]), right = [0, 1, 2, 3].filter((i) => ok[i]), same = (o) => o.join() === right.join();
      const opts = d.shuffle([right].concat(d.shuffle([[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]].filter((o) => !same(o))).slice(0, 3)));
      return C('다음 중 확률을 바르게 구한 것을 모두 고른 것은?', opts.map((o) => o.map((i) => TAG[i]).join(', ')), opts.findIndex(same), { figure: tagged(four.map((s, i) => `${s[0]}은 ${ok[i] ? s[1] : s[2]}이다.`), TAG),
        explain: [0, 1, 2, 3].filter((i) => !ok[i]).map((i) => `${TAG[i]}. ${four[i][3]}`).join(' '), facts: { truth: opts.map(same), want: true } });
    })
  ];

  // ══ 어떤 사건이 일어나지 않을 확률 ══
  const NOT = [
    T('not-given', '일어날 확률을 주고 일어나지 않을 확률', '①28 ②29', (d) => {
      const p = d.until(() => Q(d.int(1, 11), d.pick([5, 7, 8, 9, 10, 11, 12])), (x) => isP(x) && x.q >= 5), k = d.int(0, 2);
      const text = [`A, B 두 팀이 경기를 할 때 A 팀이 이길 확률은 ${tx(p)}이다. 비기는 경우는 없다고 할 때, B 팀이 이길 확률은?`, `내일 비가 올 확률이 ${tx(p)}일 때, 내일 비가 오지 않을 확률은?`, `어떤 사건 A가 일어날 확률이 ${tx(p)}일 때, 사건 A가 일어나지 않을 확률은?`][k];
      return ansP(text, non(p), { explain: `${k === 0 ? '비기는 경우가 없으므로 B 팀이 이기는 것은 A 팀이 이기지 않는 것과 같다. ' : ''}(일어나지 않을 확률) = 1 − (일어날 확률)이므로 1 − ${tx(p)} = ${tx(non(p))}이다.`, facts: vf(`1-${js(p)}`) });
    }),
    T('not-count', '전체와 일부의 개수를 주고 「~가 아닐」 확률', '①29 ②30', (d) => {
      const k = d.int(0, 2), n = [d.pick([24, 30, 32, 36]), d.pick([8, 10, 12, 15]), d.pick([20, 24, 40, 50])][k], a = [d.int(6, n / 2), d.int(2, 4), d.int(2, 5)][k];
      const text = [`${n}명의 학생 중에서 ${a}명이 반려동물을 기른다. 이 ${n}명 중에서 한 명을 뽑을 때, 반려동물을 기르지 않는 학생이 뽑힐 확률은?`, `${n}개의 제비 중에 당첨 제비가 ${a}개 들어 있다. 이 중에서 제비 한 개를 뽑을 때, 당첨 제비를 뽑지 못할 확률은?`, `${n}개의 제품 중에 불량품이 ${a}개 섞여 있다. 이 중에서 제품 한 개를 고를 때, 불량품이 아닌 제품을 고를 확률은?`][k];
      const what = ['반려동물을 기르는 학생이 뽑힐', '당첨 제비를 뽑을', '불량품을 고를'][k];
      return ansP(text, P(n - a, n), { explain: `${what} 확률은 ${red(a, n)}이므로 구하는 확률은 1 − ${tx(P(a, n))} = ${tx(P(n - a, n))}이다.`, facts: vf(`1-${a}/${n}`) });
    }),
    T('not-cards', '수 카드에서 「~가 아닌 수」가 나올 확률', '①29 ②31', (d) => {
      const m = d.pick([12, 15, 16, 18, 20]), c = d.until(() => d.pick([divOf(m), PRIME, mult(3), mult(4), mult(5)]), (x) => { const h = range(1, m).filter(x.ok).length; return h >= 3 && h <= m - 3; }), hit = range(1, m).filter(c.ok), k = hit.length;
      return ansP(`1부터 ${m}까지의 자연수가 하나씩 적힌 ${m}장의 카드 중에서 한 장을 뽑을 때, ${c.n}가 아닌 수가 적힌 카드가 나올 확률은?`, P(m - k, m), {
        explain: `${c.n}는 ${listSaid(hit, '개')}이므로 ${c.n}가 적힌 카드가 나올 확률은 ${red(k, m)}이다. 따라서 구하는 확률은 1 − ${tx(P(k, m))} = ${tx(P(m - k, m))}이다.`, facts: vf(`1-${k}/${m}`, [k]) });
    }),
    T('not-dice-value', '두 주사위 — 합·차가 한 값이 아닐 확률', '①31', (d) => {
      const isSum = d.bool(), v = isSum ? d.pick([4, 5, 6, 8, 9, 10]) : d.int(1, 4), word = isSum ? '합' : '차', hit = DICE.filter(([a, b]) => (isSum ? a + b : Math.abs(a - b)) === v), k = isSum ? 6 - Math.abs(7 - v) : 2 * (6 - v);
      return ansP(`${TWO}, 나오는 두 눈의 수의 ${josa(word, '이/가')} ${josa(v, '이/가')} 아닐 확률은?`, P(36 - hit.length, 36), {
        explain: `두 눈의 수의 ${josa(word, '이/가')} ${v}인 경우는 ${pairsSaid(hit)}이므로 그 확률은 ${red(hit.length, 36)}이다. 따라서 구하는 확률은 1 − ${tx(P(hit.length, 36))} = ${tx(P(36 - hit.length, 36))}이다.`, facts: vf(`1-${k}/36`, [k, 36]) });
    }),
    T('not-differ', '두 결과가 서로 다를 확률', '①32 ②32', (d) => {
      const [A, Bn] = two(d), k = d.int(0, 3), n = [6, 6, 4, 5][k], both = `${name(A, '과/와')} ${name(Bn, '이/가')}`;
      const text = [`${TWO}, 나오는 두 눈의 수가 서로 다를 확률은?`, `${both} 주사위를 한 번씩 던져 나온 눈의 수가 큰 사람이 이기는 놀이를 한다. 주사위를 한 번씩 던질 때, 승패가 결정될 확률은?`,
        `${both} 봄, 여름, 가을, 겨울 중에서 한 계절을 각자 임의로 고를 때, 두 사람이 서로 다른 계절을 고를 확률은?`, `${both} 월요일부터 금요일까지의 5일 중에서 하루를 각자 임의로 고를 때, 두 사람이 서로 다른 요일을 고를 확률은?`][k];
      const same = ['두 눈의 수가 서로 같은', '두 사람의 눈의 수가 같아 승패가 결정되지 않는', '두 사람이 같은 계절을 고르는', '두 사람이 같은 요일을 고르는'][k];
      return ansP(text, P(n - 1, n), { explain: `모든 경우의 수는 ${n} × ${n} = ${n * n}이고, ${same} 경우는 ${n}가지이므로 그 확률은 ${red(n, n * n)}이다. 따라서 구하는 확률은 1 − ${frac(1, n)} = ${frac(n - 1, n)}이다.`, facts: vf(`1-${n}/(${n}*${n})`, [n]) });
    }),
    T('not-dice-bound', '두 주사위 — 합·곱이 얼마 이상일 확률(반대쪽 세기)', '심6', (d) => {
      const isSum = d.bool(), v = isSum ? d.int(4, 6) : d.int(3, 6), word = isSum ? '합' : '곱', low = DICE.filter(([a, b]) => (isSum ? a + b : a * b) < v);
      return ansP(`${TWO}, 나오는 두 눈의 수의 ${word}이 ${v} 이상일 확률은?`, P(36 - low.length, 36), {
        explain: `두 눈의 수의 ${word}이 ${v} 미만인 경우는 ${pairsSaid(low)}이므로 그 확률은 ${red(low.length, 36)}이다. 따라서 구하는 확률은 1 − ${tx(P(low.length, 36))} = ${tx(P(36 - low.length, 36))}이다.`, facts: vf(`1-${low.length}/36`, [low.length, 36]) });
    }),
    T('not-atleast-half', '동전·○× 문제에서 「적어도 하나」', '①33·34 ②33·34', (d) => {
      const coin = d.bool(), n = coin ? d.int(2, 4) : d.int(3, 5), total = 2 ** n, side = d.pick(['앞면', '뒷면']), other = side === '앞면' ? '뒷면' : '앞면';
      const text = coin ? `서로 다른 동전 ${n}개를 동시에 던질 때, 적어도 한 개는 ${side}이 나올 확률은?` : `○, ×로 답하는 문제 ${n}개에 임의로 답할 때, 적어도 한 문제는 맞힐 확률은?`;
      return ansP(text, P(total - 1, total), { explain: `모든 경우의 수는 ${Array(n).fill(2).join(' × ')} = ${total}이고, ${coin ? `${n}개 모두 ${other}이 나오는` : `${n}문제를 모두 틀리는`} 경우는 1가지이므로 그 확률은 ${frac(1, total)}이다. 따라서 구하는 확률은 1 − ${frac(1, total)} = ${frac(total - 1, total)}이다.`, facts: vf(`1-1/(2**${n})`, [2]) });
    }),
    T('not-dice-atleast-one', '두 주사위에서 「적어도 하나는 ~의 눈」', '①35 ②35', (d) => {
      const c = d.pick([ODD, EVEN, mult(3), PRIME, atMost(4), atLeast(5), divOf(6)]), bad = range(1, 6).filter((v) => !c.ok(v)), none = DICE.filter(([a, b]) => !c.ok(a) && !c.ok(b)).length;
      return ansP(`${TWO}, 적어도 한 개는 ${c.eye}이 나올 확률은?`, P(36 - none, 36), {
        explain: `두 개 모두 ${c.eye}이 나오지 않는 경우는 두 눈이 모두 ${bad.join(', ')} 중 하나인 ${bad.length} × ${bad.length} = ${none}(가지)이므로 그 확률은 ${red(none, 36)}이다. 따라서 구하는 확률은 1 − ${tx(P(none, 36))} = ${tx(P(36 - none, 36))}이다.`, facts: vf(`1-(${bad.length}*${bad.length})/36`, [bad.length, 36]) });
    }),
    T('not-pick-atleast', '뽑힌 두 사람 가운데 적어도 한 명', '①36 심26·27·32', (d, n) => {
      // 차례 0: 자격이 같은 대표 2명(차례가 없다). 차례 1: 회장과 부회장(자리가 다르다).
      const [m, w] = d.until(() => [d.int(2, 5), d.int(n === 0 ? 2 : 3, 5)], ([m0, w0]) => m0 + w0 >= (n === 0 ? 5 : 7) && m0 + w0 <= (n === 0 ? 6 : 8)), all = m + w, half = n === 0 ? ' ÷ 2' : '', total = all * (all - 1) / (n === 0 ? 2 : 1), none = w * (w - 1) / (n === 0 ? 2 : 1);
      const text = n === 0 ? `남학생 ${m}명, 여학생 ${w}명 중에서 대표 2명을 뽑을 때, 남학생이 적어도 한 명 뽑힐 확률은?` : `남학생 ${m}명, 여학생 ${w}명 중에서 회장 1명, 부회장 1명을 뽑을 때, 회장과 부회장 중 적어도 한 명이 남학생일 확률은?`;
      return ansP(text, P(total - none, total), {
        explain: `${all}명 중에서 ${n === 0 ? '대표 2명' : '회장과 부회장'}을 뽑는 경우의 수는 ${all} × ${all - 1}${half} = ${total}이고, 두 명 모두 여학생을 뽑는 경우의 수는 ${w} × ${w - 1}${half} = ${none}이므로 그 확률은 ${red(none, total)}이다. 따라서 구하는 확률은 1 − ${tx(P(none, total))} = ${tx(P(total - none, total))}이다.`,
        facts: vf(`1-(${w}*(${w}-1))/((${m}+${w})*(${m}+${w}-1))`) });
    }, { count: 2 }),
    T('not-days', '두 사람이 고른 날이 겹칠 확률', '②36', (d) => {
      const [A, Bn] = two(d), n = d.int(4, 5), ways = n - 1, total = ways * ways, apart = (ways - 2) * (ways - 1), two2 = (i) => `(${DOW[i + 1]}, ${DOW[i + 2]})`, list = range(0, ways - 1).map(two2).join(', ');
      const far = []; for (let i = 0; i < ways; i += 1) for (let j = i + 2; j < ways; j += 1) far.push(`${two2(i)} · ${two2(j)}`);
      return ansP(`${name(A, '과/와')} ${name(Bn, '이/가')} 월요일부터 ${DOW[n]}요일까지의 ${n}일 중에서 연속한 2일을 각자 임의로 골라 도서관에 가기로 하였다. 두 사람이 도서관에 가는 날이 하루 이상 겹칠 확률은?`, P(total - apart, total), {
        explain: `연속한 2일을 고르는 방법은 ${list}의 ${ways}가지이므로 모든 경우의 수는 ${ways} × ${ways} = ${total}이다. 하루도 겹치지 않는 짝은 ${far.join(', ')}의 ${far.length}가지이고 두 사람이 이를 나누어 고르는 방법이 2가지씩이므로, 겹치지 않는 경우는 ${far.length} × 2 = ${apart}(가지)이고 그 확률은 ${red(apart, total)}이다. 따라서 구하는 확률은 1 − ${tx(P(apart, total))} = ${tx(P(total - apart, total))}이다.`, facts: kn(total - apart, total) });
    })
  ];

  B.addUnit({
    id: '8-2-7', grade: 8, semester: 2, no: 7, title: '확률', version: 3,
    groups: [
      { id: 'mean', title: '확률의 뜻', standard: STD, types: MEAN },
      { id: 'cases', title: '여러 가지 상황에서의 확률', standard: STD, types: CASES },
      { id: 'prop', title: '확률의 성질', standard: STD, types: PROP },
      { id: 'not', title: '어떤 사건이 일어나지 않을 확률', standard: STD, types: NOT },
      { id: 'or', title: '사건 A 또는 사건 B가 일어날 확률', standard: STD, types: [] },
      { id: 'and', title: '두 사건 A와 B가 동시에 일어날 확률', standard: STD, types: [] },
      { id: 'draw', title: '연속하여 뽑는 경우의 확률', standard: STD, types: [] },
      { id: 'shape', title: '도형에서의 확률', standard: STD, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(8-2-7b.js, 8-2-7c.js)이 함께 쓰는 도구
  B.kit.m827 = {
    STD, T, sourceOf, sum, isPrime, divs, fact, P, ONE, non, isP, DICE, pairsSaid, listSaid, red, two, mulSaid, cond, mult, divOf, PRIME, ODD, EVEN, atLeast, atMost, countSaid, TWO, AB, XY, pt,
    ansP, kn, vf, PP, probs, wheel, wheelSaid, wheelFig, wheelsFig, cellsFig, DOW, calendarFig, dayCount, bagsFig, KINDS, pickCond
  };
})(typeof window !== 'undefined' ? window : globalThis);
