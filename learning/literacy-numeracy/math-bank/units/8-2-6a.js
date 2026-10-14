// 중학교 2학년 2학기 6단원 경우의 수 — 단원 틀·단원 안의 도구와 앞쪽 묶음(사건과 경우의 수, 두 주사위와 가위바위보, 돈을 지불하는 방법, 「또는」, 「동시에」).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 77꼴, 심화꼴 48꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/8-2-6/싣기_대조표.md 에 있다.
// (길, 한 줄로 세우기, 자연수 만들기, 대표 뽑기, 도형과 색칠 묶음은 8-2-6b.js 에, 실력 문항은 8-2-6c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 자료와 가능성. 성취기준은 9수04-05 「경우의 수를 구할 수 있다」 하나이다.
//
// 싣는 기준
//  - 교육과정: 「경우의 수는 두 경우의 수를 합하거나 곱하는 경우 정도로만 다루고, 순열과 조합을 이용하면 쉽게 해결되는 등의 복잡한 경우의 수를 구하는 문제는 다루지 않는다.」
//    빠짐없이 세기(나열·표·나뭇가지 모양의 그림), 「또는」(더하기 — 두 사건에 모두 드는 경우는 한 번만 센다), 「동시에」(곱하기),
//    한 줄로 세우기(전체, 자리가 정해진 사람), 자연수 만들기(0이 없는 카드·있는 카드, 짝수·홀수, 크기 조건), 대표 뽑기(자격이 다른 2~3명, 자격이 같은 2명), 세 영역·네 영역 색칠까지 싣는다.
//  - 하는 일이 다르면 다른 문제다: 주는 것(글 / 표 / 길 그림 / 영역 그림 / 원판 / 수직선)과 세는 법(나열 / 더하기 / 곱하기 / 겹친 것 빼기 / 전체에서 빼기 / 2로 나누기)이 다를 때만 따로 싣는다.
//    소재와 수만 다른 것은 한 번만 싣는다.
//  - 답은 모든 경우를 코드가 하나씩 늘어놓고 세어 정한다(공식으로만 셈하지 않는다). 사건에 드는 경우를 가린 목록을 검사 근거(facts.count)로 싣고, 곱으로 정해지는 것은 식(facts.calc)을 함께 싣는다.
//  - 용어는 교육과정의 것(사건, 경우의 수)만 쓴다. 합의 법칙·곱의 법칙·순열·조합·팩토리얼 같은 말은 쓰지 않는다. 확률을 묻는 것은 다음 단원(8-2-7)이다.
//  - 「서로 다른」이 빠지면 뜻이 갈리는 곳(공, 동전, 깃발, 과일)에는 「서로 다른」을 넣어 썼다.
//  - 답의 단위는 「가지」이고, 원문이 개수·횟수를 묻는 꼴은 「개」「번」「번째」로 받는다. 음수가 답인 문항이 없으므로 부호 단추는 달지 않는다.
//  - 그림: 뽑은 글에는 그림이 없어 쪽 그림(미래엔 2022 소단원 수준별·대단원 평가, 2015 지도서 중단원 수준별, 2015 교과서)을 직접 보고 지었다.
//    세 지점을 잇는 길(지점 사이를 위·아래로 휜 선 여러 개로 잇고, 바로 가는 길은 가운데 지점 바깥으로 크게 돈다), 마름모 꼴로 놓인 네 도시의 길,
//    원을 세 영역·네 영역으로 나눈 그림, 수가 뒤섞여 적힌 원판과 꼭대기의 바늘, 나뭇가지 모양의 그림(칸에서 가지가 둘로 갈라진다). 수와 상황은 모두 새로 정했다.
//    그림 설명(aria-label)에는 길의 수와 이웃한 영역을 말로 적었다.
//  - 꼴 목록에 적힌 원문 답지의 잘못(미래엔 2015 중단원 마무리 03·21 등)은 따르지 않는다.
//
// 뺀 것과 까닭(8-2-6b.js, 8-2-6c.js 의 것까지 여기에 모아 적는다)
//  - 처음 지을 때는 「두 경우의 수를 합하거나 곱하는 정도」라는 선과 꼬임·여러 갈래라는 까닭으로 아래 꼴을 뺐으나, 다시 보아 하나씩 늘어놓거나 더하고 곱하여 풀 수 있는 것은 모두 실었다
//    (8-2-6c.js 끝의 「다시 실은 꼴」). 계승·순열·조합의 기호와 식은 쓰지 않는다.
//    격자 길의 최단 경로(①47 심27), 남녀가 번갈아 서기(①51), 제 번호 의자에 몇 명만 앉기(①52 심11), 동전을 던져 움직이는 점(심28), 같은 것을 나누기(①75·76 심6·8), 세 점·네 점 뽑기(①71·72 심45·46),
//    크기 조건이 붙은 세 자리 수(①59), 한 사람이 다른 사람보다 앞에 서기(심31), 합이 정해진 짝수와 3의 배수(①11), 원 위의 점으로 만드는 삼각형(①70), 3의 배수인 두 자리 수(①60), 길 더 놓기(①46),
//    횟수가 열려 있는 점의 이동(심29), 소인수분해와 서로소(심47), 절편으로 식을 세우는 그래프 위의 점(심16), 교점의 x좌표가 배수인 경우(심15의 변형), 세 종류 동전의 금액(①22의 둘째 대표),
//    한 명만 빼고 뽑기(심42), 세 명이 모두 이웃하여 서기(①50·심32의 둘째 대표).
//  - 지금도 빼 둔 것: 쌓기나무의 면 세기(①77 — 그림도 답도 모름), 네 자리 4의 배수(심37 — 4의 배수 판정법은 교육과정 밖), 둔각삼각형 세기(①70의 셋째 대표 — 원주각은 3학년),
//    쪽 그림에서 모양을 알 수 없는 영역 그림(심48의 은1-11 — 이웃 관계만 풀이로 알고, 하는 일은 실린 color4와 같다).
//  - 수만 키우거나 조건만 바꾼 것(실린 유형과 하는 일이 같다): 금액이 겹치는 세 종류 동전을 종류마다 한 개 이상 쓰는 꼴(①23의 변형 — 원문 답도 어긋남), 0~9의 카드로 만드는 세 자리 5의 배수(①57의 둘째 대표).
//  - 뜻 없는 셈: 두 경우의 수의 합·차(①18의 a + b, ①68의 x − y, 심21의 a + b)는 두 값을 따로 묻거나 뜻이 있는 물음(성별이 같은 두 명)으로 바꾸었다.
//  - 낱말을 적어야 하는 빈칸(①37)은 고르기로 바꾸었다. 그림이 필요해 미룬 것은 없다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, table, N, M, C } = B.kit;
  const { LAB, MINUS, range, gcd, lcm, tail, V, nb, poly, nline } = B.kit.mid;
  const { at, dist, mid, XY, textW, sv, WHITE, CLEAR, Board } = B.kit.mgeo;
  const STD = '9수04-05';
  const sourceOf = (ref) => (/①/.test(ref) && /심/.test(ref) ? '수집본 자료(' : /①/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make }, more || {});

  // ── 세는 도구 ──
  const sum = (a) => a.reduce((s, v) => s + v, 0);
  const hits = (flags) => flags.filter(Boolean).length;
  const isPrime = (n) => n > 1 && range(2, n - 1).every((k) => n % k !== 0);
  const divs = (n) => range(1, n).filter((k) => n % k === 0);
  const DIE = range(1, 6);
  // 주사위 두 개(또는 한 개를 두 번)의 눈의 순서쌍 36가지
  const PAIRS = DIE.reduce((all, a) => all.concat(DIE.map((b) => [a, b])), []);
  // list 에서 k 개를 골라 한 줄로 늘어놓은 것 전부 / 차례 없이 k 개를 고른 것 전부 / 여러 목록에서 하나씩 고른 것 전부
  const perms = (list, k) => (k === 0 ? [[]] : list.reduce((all, x, i) => all.concat(perms(list.filter((_, j) => j !== i), k - 1).map((rest) => [x].concat(rest))), []));
  const combos = (list, k) => (k === 0 ? [[]] : list.length < k ? [] : combos(list.slice(1), k - 1).map((rest) => [list[0]].concat(rest)).concat(combos(list.slice(1), k)));
  const cart = (lists) => lists.reduce((acc, l) => acc.reduce((all, row) => all.concat(l.map((x) => row.concat([x]))), []), [[]]);
  const told = (list) => list.join(', ');
  const pairsTold = (list) => list.map((p) => '(' + p.join(', ') + ')').join(', ');
  // 낱말 뒤 토씨만
  const pt = (word, pair) => josa(word, pair).slice(String(word).length);
  // 음수는 빼기표로
  const sg = (v) => (v < 0 ? MINUS + -v : String(v));

  // ── 답 ──
  // 경우의 수를 답하는 문항. flags: 일어날 수 있는 경우를 하나씩 늘어놓고 그 사건에 드는지 가린 것 — 답은 그 개수이고, 검사는 이 목록을 다시 센다.
  const Q = (text, flags, o) => N(text, hits(flags), Object.assign({ unit: '가지' }, o, { facts: Object.assign({ count: flags }, (o && o.facts) || {}) }));
  // 곱·합의 식으로 정해지는 경우의 수: 값 n 은 늘어놓아 센 것이고, 검사는 식 expr 을 따로 셈해 맞춰 본다(식의 수는 문제 글·그림 설명에 있거나 unseen 에 밝힌다).
  const QA = (text, n, expr, o) => N(text, n, Object.assign({ unit: '가지' }, o, { facts: Object.assign({ calc: [[expr, 0]] }, (o && o.facts) || {}) }));

  // ── 사건의 조건 ── eye: 주사위의 눈으로 적은 말, num: 카드의 수로 적은 말
  const CD = {
    prime: () => ({ eye: '소수의 눈', num: '소수', test: isPrime }),
    odd: () => ({ eye: '홀수의 눈', num: '홀수', test: (v) => v % 2 === 1 }),
    even: () => ({ eye: '짝수의 눈', num: '짝수', test: (v) => v % 2 === 0 }),
    mult: (k) => ({ eye: `${k}의 배수의 눈`, num: `${k}의 배수`, test: (v) => v % k === 0 }),
    div: (k) => ({ eye: `${k}의 약수의 눈`, num: `${k}의 약수`, test: (v) => k % v === 0 }),
    over: (k) => ({ eye: `${k}보다 큰 눈`, num: `${k}보다 큰 수`, test: (v) => v > k }),
    under: (k) => ({ eye: `${k}보다 작은 눈`, num: `${k}보다 작은 수`, test: (v) => v < k }),
    least: (k) => ({ eye: `${k} 이상의 눈`, num: `${k} 이상인 수`, test: (v) => v >= k }),
    most: (k) => ({ eye: `${k} 이하의 눈`, num: `${k} 이하인 수`, test: (v) => v <= k })
  };

  // ── 그림 ──
  // 길 그림. nodes: [{ name, p: [x, y] }], links: [[앞 지점, 뒤 지점, 휜 정도들]] — 두 지점 사이를 휜 정도마다 한 가닥씩 잇는다(0이면 곧은 길, 양수이면 가는 쪽의 오른쪽으로 휜다).
  // 지점은 이름이 든 동그라미이고, 길은 동그라미 밖에 있는 부분만 긋는다. say: 그림 설명(길의 수를 말로 적는다).
  const quad = (p0, c, p2, t) => [0, 1].map((k) => (1 - t) * (1 - t) * p0[k] + 2 * (1 - t) * t * c[k] + t * t * p2[k]);
  function roadFig(nodes, links, say) {
    const b = Board(), rad = (nm) => Math.max(13, textW(nm) / 2 + 5);
    for (const [i, j, peaks] of links) {
      const p0 = nodes[i].p, p2 = nodes[j].p, L = dist(p0, p2), nx = -(p2[1] - p0[1]) / L, ny = (p2[0] - p0[0]) / L, m = mid(p0, p2);
      for (const peak of peaks) {
        const c = [m[0] + nx * 2 * peak, m[1] + ny * 2 * peak];
        let t0 = 0, t1 = 1;
        while (dist(quad(p0, c, p2, t0), p0) < rad(nodes[i].name) && t0 < 0.45) t0 += 0.005;
        while (dist(quad(p0, c, p2, t1), p2) < rad(nodes[j].name) && t1 > 0.55) t1 -= 0.005;
        const q0 = quad(p0, c, p2, t0), q2 = quad(p0, c, p2, t1);
        const cc = [0, 1].map((k) => (1 - t0) * (1 - t1) * p0[k] + ((1 - t0) * t1 + t0 * (1 - t1)) * c[k] + t0 * t1 * p2[k]);
        b.shape(`M${XY(q0)}Q${XY(cc)} ${XY(q2)}`, [q0, quad(p0, c, p2, 0.3), quad(p0, c, p2, 0.5), quad(p0, c, p2, 0.7), q2], CLEAR);
      }
    }
    for (const node of nodes) { b.disk(node.p, rad(node.name), WHITE); b.text(node.p, node.name, { plain: true }); }
    return b.svg(say);
  }
  // 길이 n 가닥일 때의 휜 정도
  const SPREAD = { 1: [0], 2: [-13, 13], 3: [-18, 0, 18], 4: [-27, -9, 9, 27] };
  // 세 지점이 가로 한 줄로 놓인 길. a: 첫 구간의 길의 수, c: 둘째 구간의 길의 수, direct: 가운데 지점을 거치지 않고 양 끝을 바로 잇는 길의 수(0~2)
  function rowRoads(names, a, c, direct) {
    const nodes = names.map((nm, i) => ({ name: nm, p: [i * 108, 0] })), links = [[0, 1, SPREAD[a]], [1, 2, SPREAD[c]]];
    if (direct) links.push([0, 2, direct === 1 ? [-48] : [-48, 48]]);
    return roadFig(nodes, links, `길 그림: ${names[0]}, ${names[1]}, ${josa(names[2], '이/가')} 가로로 한 줄로 놓여 있다. ${josa(names[0], '과/와')} ${names[1]} 사이에 길 ${a}개, ${josa(names[1], '과/와')} ${names[2]} 사이에 길 ${c}개가 있다.`
      + (direct ? ` ${josa(names[1], '을/를')} 거치지 않고 ${josa(names[0], '과/와')} ${josa(names[2], '을/를')} 바로 잇는 길이 ${direct}개 있다.` : ` ${josa(names[0], '과/와')} ${josa(names[2], '을/를')} 바로 잇는 길은 없다.`));
  }
  // 마름모 꼴로 놓인 네 도시 A(왼쪽), C(위), B(오른쪽), D(아래)의 길. ac, cb, ad, db: 구간마다의 길의 수. C와 D를 바로 잇는 길은 없다.
  function diamondRoads(ac, cb, ad, db) {
    const nodes = [{ name: 'A', p: [0, 62] }, { name: 'C', p: [124, 0] }, { name: 'B', p: [248, 62] }, { name: 'D', p: [124, 124] }];
    const few = { 1: [0], 2: [-10, 10], 3: [-14, 0, 14] };
    return roadFig(nodes, [[0, 1, few[ac]], [1, 2, few[cb]], [0, 3, few[ad]], [3, 2, few[db]]],
      `길 그림: 도시 A는 왼쪽, C는 위, B는 오른쪽, D는 아래에 있다. A와 C 사이에 길 ${ac}개, C와 B 사이에 길 ${cb}개, A와 D 사이에 길 ${ad}개, D와 B 사이에 길 ${db}개가 있다. C와 D를 바로 잇는 길, A와 B를 바로 잇는 길은 없다.`);
  }
  // 원을 세 영역 A(왼쪽 위), B(오른쪽 위), C(아래)로 나눈 그림. 세 영역은 서로 모두 이웃한다.
  function region3Fig() {
    const b = Board(), c = [0, 0], R = 58, L = at(c, R, 200), Rt = at(c, R, 340), top = at(c, R, 78);
    b.disk(c, R, WHITE);
    b.shape(`M${XY(L)}Q0 -36 ${XY(Rt)}`, [L, Rt], CLEAR);
    b.shape(`M4 -7.9Q-5 -32 ${XY(top)}`, [top], CLEAR);
    b.text([-26, -24], 'A', { plain: true }).text([30, -20], 'B', { plain: true }).text([0, 30], 'C', { plain: true });
    return b.svg('원을 세 영역 A, B, C로 나눈 그림: A는 왼쪽 위, B는 오른쪽 위, C는 아래에 있다. A와 B, B와 C, A와 C가 서로 이웃한다.');
  }
  // 원을 네 영역 A(위), B(왼쪽), C(오른쪽), D(아래)로 나눈 그림. A와 D만 이웃하지 않는다.
  const REGION4 = { names: ['A', 'B', 'C', 'D'], near: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3]] };
  function region4Fig() {
    const b = Board(), c = [0, 0], R = 60, y = -30, x = Math.sqrt(R * R - y * y), hub = [0, 8];
    b.disk(c, R, WHITE);
    b.seg([-x, y], [x, y]).seg([0, y], hub).seg(hub, at(c, R, 225)).seg(hub, at(c, R, 315));
    b.text([0, -44], 'A', { plain: true }).text([-30, 0], 'B', { plain: true }).text([30, 0], 'C', { plain: true }).text([0, 37], 'D', { plain: true });
    return b.svg('원을 네 영역 A, B, C, D로 나눈 그림: A는 위, B는 왼쪽, C는 오른쪽, D는 아래에 있다. A는 B, C와 이웃하고, B는 A, C, D와 이웃하고, C는 A, B, D와 이웃하고, D는 B, C와 이웃한다. A와 D는 이웃하지 않는다.');
  }
  // 원 위의 점 n 개(같은 간격). 이름은 A부터 시계 방향으로.
  function circlePoints(n) {
    const b = Board(), c = [0, 0], R = 52;
    b.disk(c, R, WHITE);
    for (let i = 0; i < n; i += 1) { const a = 90 - i * 360 / n; b.dot(at(c, R, a), 3).text(at(c, R + 12, a), 'ABCDEFGH'[i], { plain: true }); }
    return b.svg(`원 위에 서로 다른 점 ${n}개가 있다. 점의 이름은 차례로 ${'ABCDEFGH'.slice(0, n).split('').join(', ')}이다.`);
  }
  // 평행한 두 직선 l(위), m(아래)과 그 위의 점
  function parallelPoints(a, c) {
    const b = Board(), W = 216, row = (y, k, nm) => { b.seg([0, y], [W, y]); for (let i = 0; i < k; i += 1) b.dot([W * (i + 1) / (k + 1), y], 3.2); b.text([W + 11, y], sv(nm), { plain: true }); };
    row(0, a, 'l'); row(56, c, 'm');
    return b.svg(`평행한 두 직선 l, m: 위쪽 직선 l 위에 점 ${a}개, 아래쪽 직선 m 위에 점 ${c}개가 있다.`);
  }
  // 수를 적은 원판. nums: 맨 위 칸부터 시계 방향으로 적힌 수. 꼭대기에 바늘이 있다.
  function spinnerFig(nums) {
    const b = Board(), c = [0, 0], R = 60, n = nums.length, step = 360 / n;
    b.disk(c, R, WHITE);
    for (let i = 0; i < n; i += 1) b.seg(c, at(c, R, 90 + step / 2 - i * step), 'thin');
    nums.forEach((v, i) => b.text(at(c, R * 0.68, 90 - i * step), String(v), { plain: true }));
    b.poly([[0, -R + 4], [-6, -R - 10], [6, -R - 10]], 'fill:#1f2933');
    b.dot(c, 3);
    return b.svg(`원판 그림: 원을 똑같이 ${n}칸으로 나누고 칸마다 수를 하나씩 적었다. 맨 위 칸부터 시계 방향으로 ${nums.join(', ')}이다. 원판의 꼭대기에 맨 위 칸을 가리키는 바늘이 있다.`);
  }
  // 나뭇가지 모양의 그림. heads: 칸의 이름(동전 셋), cols: 칸마다 위에서부터 적힌 글(2개, 4개, 8개). 가린 칸은 ㉠·㉡·㉢을 네모 안에 적는다.
  function treeFig(heads, cols) {
    const b = Board(), xs = [0, 86, 172], gap = 24;
    const ys = [range(0, 1).map((i) => gap * (4 * i + 1.5)), range(0, 3).map((i) => gap * (2 * i + 0.5)), range(0, 7).map((i) => gap * i)];
    heads.forEach((h, k) => b.text([xs[k], -26], h, { plain: true, size: 12.5 }));
    for (let k = 0; k < 2; k += 1) ys[k].forEach((y, i) => { for (const j of [2 * i, 2 * i + 1]) b.seg([xs[k] + 16, y], [xs[k + 1] - 16, ys[k + 1][j]], 'thin'); });
    cols.forEach((col, k) => col.forEach((word, i) => {
      const p = [xs[k], ys[k][i]];
      const blank = LAB.includes(word);
      if (blank) b.poly([[p[0] - 13, p[1] - 10], [p[0] + 13, p[1] - 10], [p[0] + 13, p[1] + 10], [p[0] - 13, p[1] + 10]], WHITE);
      b.text(p, word, { plain: true, size: blank ? 15 : 13 });
    }));
    return b.svg(`나뭇가지 모양의 그림: 칸이 왼쪽부터 ${heads.join(', ')}의 세 줄이고, 왼쪽 칸의 글마다 가지가 둘로 갈라져 오른쪽 칸의 글 두 개로 이어진다. `
      + cols.map((col, k) => `${heads[k]} 칸에는 위에서부터 ${col.join(', ')}`).join('. ') + '.');
  }

  // 차림표: 종류마다 이름을 늘어놓는다(이름은 줄 끝에서 갈리지 않는다).
  const menuFig = (rows) => '<div class="mb-lines" style="grid-template-columns:auto 1fr;column-gap:14px;align-items:start">' + rows.map(([kind, names]) => `<span style="font-weight:700;white-space:nowrap">${kind}</span><span style="word-break:keep-all">${names.join(', ')}</span>`).join('') + '</div>';
  // 표(세로로 긴 두 칸)
  const tbl = (head, rows) => table(head, rows);
  // 이름 k 개
  const pickNames = (d, k) => d.shuffle(NAMES).slice(0, k);

  B.addUnit({
    id: '8-2-6', grade: 8, semester: 2, no: 6, title: '경우의 수', version: 2,
    groups: [
      {
        id: 'event', title: '사건과 경우의 수', standard: STD,
        types: [
          T('event-die', '주사위 한 개에서 조건에 맞는 눈', '①1', (d, n) => {
            if (n === 0) {
              const c = d.pick([CD.prime(), CD.mult(2), CD.mult(3), CD.div(4), CD.div(6), CD.over(d.int(2, 4)), CD.under(d.int(3, 5)), CD.least(d.int(3, 5))]), got = DIE.filter(c.test);
              return Q(`주사위 한 개를 던질 때, ${c.eye}이 나오는 경우의 수는?`, DIE.map(c.test), { explain: `${c.eye}은 ${told(got)}의 ${got.length}가지이다.` });
            }
            // 주사위에 없는 약수가 끼는 것: 약수를 모두 적은 뒤 1부터 6까지의 수만 남긴다.
            if (d.bool()) {
              const k = d.pick([8, 10, 12, 15, 18, 20, 35]), got = DIE.filter((v) => k % v === 0);
              return Q(`주사위 한 개를 던질 때, 나오는 눈의 수가 ${k}의 약수인 경우의 수는?`, DIE.map((v) => k % v === 0), { explain: `${k}의 약수는 ${told(divs(k))}이다. 이 가운데 주사위의 눈인 것은 ${told(got)}의 ${got.length}가지이다.` });
            }
            const [p, q] = d.pick([[16, 24], [20, 30], [24, 36], [30, 45], [16, 40]]), g = gcd(p, q), got = DIE.filter((v) => g % v === 0);
            return Q(`주사위 한 개를 던질 때, 나오는 눈의 수가 ${josa(p, '과/와')} ${q}의 공약수인 경우의 수는?`, DIE.map((v) => p % v === 0 && q % v === 0), { explain: `${josa(p, '과/와')} ${q}의 공약수는 ${told(divs(g))}이다. 이 가운데 주사위의 눈인 것은 ${told(got)}의 ${got.length}가지이다.` });
          }, { count: 2 }),
          T('event-card', '수가 적힌 카드·공 한 개를 뽑을 때 조건에 맞는 경우', '①2', (d, n) => {
            if (n === 0) {
              const [N0, k] = d.until(() => [d.pick([15, 16, 18, 20]), d.pick([12, 18, 20, 24, 30, 36])], ([a, c]) => divs(c).filter((v) => v <= a).length >= 5), all = range(1, N0), got = all.filter((v) => k % v === 0);
              return Q(`1부터 ${N0}까지의 자연수가 하나씩 적힌 카드 ${N0}장 가운데 한 장을 뽑을 때, ${k}의 약수가 적힌 카드가 나오는 경우의 수는?`, all.map((v) => k % v === 0),
                { explain: `${k}의 약수${divs(k).some((v) => v > N0) ? ` 가운데 ${N0} 이하인 수` : ''}는 ${told(got)}의 ${got.length}가지이다.` });
            }
            const N0 = d.pick([20, 25, 30]), all = range(1, N0), got = all.filter(isPrime);
            return Q(`1부터 ${N0}까지의 자연수가 하나씩 적힌 공 ${N0}개가 들어 있는 주머니에서 공 한 개를 꺼낼 때, 소수가 적힌 공이 나오는 경우의 수는?`, all.map(isPrime), { explain: `1부터 ${N0}까지의 자연수 가운데 소수는 ${told(got)}의 ${got.length}가지이다. 1은 소수가 아니다.` });
          }, { count: 2 }),
          T('event-multiples', '범위 안에 있는 배수의 개수', '①2 심2', (d, n) => {
            if (n === 0) {
              const [N0, k] = d.until(() => [d.int(50, 99), d.pick([4, 6, 7, 8, 9])], ([a, c]) => a % c !== 0), all = range(1, N0), q = Math.floor(N0 / k);
              return Q(`1부터 ${N0}까지의 자연수가 하나씩 적힌 구슬 ${N0}개 가운데 한 개를 고를 때, ${k}의 배수가 적힌 구슬이 나오는 경우의 수는?`, all.map((v) => v % k === 0),
                { explain: `${N0} ÷ ${k}의 몫이 ${q}이므로 ${k}의 배수는 ${k}, ${2 * k}, …, ${q * k}의 ${q}가지이다.`, facts: { calc: [[`(${N0}-${N0}%${k})/${k}`, 0]] } });
            }
            const [a, c, k] = d.until(() => [d.pick([11, 21, 31]), d.pick([60, 70, 80, 90]), d.pick([3, 4, 6, 7])], ([x, , z]) => (x - 1) % z !== 0), all = range(a, c), up = Math.floor(c / k), low = Math.floor((a - 1) / k);
            return Q(`${a}부터 ${c}까지의 자연수가 하나씩 적힌 카드 ${c - a + 1}장 가운데 한 장을 뽑을 때, 카드에 적힌 수가 ${k}의 배수인 경우의 수는?`, all.map((v) => v % k === 0),
              { explain: `1부터 ${c}까지의 자연수 가운데 ${k}의 배수는 ${up}개이고, 1부터 ${a - 1}까지의 자연수 가운데 ${k}의 배수는 ${low}개이다. 따라서 ${up} − ${low} = ${up - low}(가지)이다.` });
          }, { count: 2 }),
          T('event-ones', '일의 자리 숫자가 정해진 수', '①2', (d) => {
            const [N0, k] = d.until(() => [d.int(26, 49), d.int(1, 9)], ([a, c]) => a % 10 !== c), all = range(1, N0), got = all.filter((v) => v % 10 === k);
            return Q(`1부터 ${N0}까지의 자연수가 하나씩 적힌 카드 ${N0}장 가운데 한 장을 뽑을 때, 일의 자리 숫자가 ${k}인 수가 적힌 카드가 나오는 경우의 수는?`, all.map((v) => v % 10 === k), { explain: `일의 자리 숫자가 ${k}인 수는 ${told(got)}의 ${got.length}가지이다.` });
          }),
          T('event-spinner', '등분한 원판의 바늘이 가리키는 수', '①3', (d) => {
            const n = 8, nums = d.shuffle(range(1, n)), [a, c] = d.until(() => [d.int(1, 3), d.int(6, 8)], ([x, y]) => y - x >= 4), got = range(1, n).filter((v) => v > a && v < c);
            return Q(`그림과 같이 ${n}등분한 원판의 칸마다 1부터 ${n}까지의 자연수가 하나씩 적혀 있다. 이 원판을 돌려 멈추었을 때 바늘이 가리키는 칸에 적힌 수가 ${a}보다 크고 ${c}보다 작은 경우의 수는? (단, 바늘이 경계선을 가리키는 경우는 없다.)`, nums.map((v) => v > a && v < c),
              { figure: spinnerFig(nums), explain: `${a}보다 크고 ${c}보다 작은 수는 ${told(got)}의 ${got.length}가지이다. ${josa(a, '과/와')} ${josa(c, '은/는')} 들지 않는다.` });
          }),
          T('event-pick-kind', '글자·색이 다른 것에서 하나 꺼내기', '①4', (d, n) => {
            if (n === 0) {
              const word = d.pick(['SMILE', 'MUSIC', 'HOUSE', 'WATER', 'TIGER', 'PLANET', 'ORANGE', 'FRIEND']).split(''), vowel = d.bool(), isV = (ch) => 'AEIOU'.includes(ch), got = word.filter((ch) => isV(ch) === vowel);
              return Q(`${told(word)}의 알파벳이 하나씩 적힌 카드 ${word.length}장 가운데 한 장을 뽑을 때, ${vowel ? '모음' : '자음'}이 적힌 카드가 나오는 경우의 수는?`, word.map((ch) => isV(ch) === vowel),
                { explain: `모음은 A, E, I, O, U이다. 카드에 적힌 알파벳 가운데 ${vowel ? '모음' : '자음'}은 ${told(got)}의 ${got.length}가지이다.` });
            }
            const [w, r, bl] = d.until(() => [d.int(2, 5), d.int(2, 5), d.int(2, 5)], (v) => new Set(v).size === 3), colors = ['흰', '빨간', '파란'], at0 = d.int(0, 2), counts = [w, r, bl];
            return Q(`주머니에 서로 다른 흰 공 ${w}개, 서로 다른 빨간 공 ${r}개, 서로 다른 파란 공 ${bl}개가 들어 있다. 이 주머니에서 공 한 개를 꺼낼 때, ${colors[at0]} 공이 나오는 경우의 수는?`,
              counts.reduce((all, k, i) => all.concat(range(1, k).map(() => i === at0)), []), { explain: `${colors[at0]} 공 ${counts[at0]}개는 서로 다른 공이므로 어느 공이 나오는가에 따라 ${counts[at0]}가지이다.` });
          }, { count: 2 }),
          T('event-menu', '차림표에서 값이 조건에 맞는 음식', '①5', (d) => {
            const foods = d.shuffle(['떡볶이', '순대', '라볶이', '김밥', '참치 김밥', '치즈 김밥', '라면', '만두', '어묵', '튀김', '쫄면', '우동']).slice(0, 7);
            const rel = d.pick([['미만', (v, p) => v < p], ['이하', (v, p) => v <= p], ['이상', (v, p) => v >= p]]);
            const [prices, p] = d.until(() => [foods.map(() => 500 * d.int(4, 10)), 500 * d.int(5, 8)], ([list, cut]) => { const k = list.filter((v) => rel[1](v, cut)).length; return k >= 2 && k <= 5 && list.includes(cut) && new Set(list).size >= 5; });
            const got = foods.filter((f, i) => rel[1](prices[i], p));
            return Q(`다음 차림표를 보고 음식을 한 가지 주문할 때, 음식값이 ${p}원 ${rel[0]}인 경우의 수는?`, prices.map((v) => rel[1](v, p)),
              { figure: tbl(['음식', '값(원)'], foods.map((f, i) => [f, prices[i]])), explain: `${p}원 ${rel[0]}인 음식은 ${told(got)}의 ${got.length}가지이다. ${p}원인 음식은 ${rel[0] === '미만' ? '들지 않는다' : '든다'}.` });
          }),
          T('event-compare', '여러 사건의 경우의 수 견주기', '①6 심1', (d, n) => {
            if (n === 0) {
              // 정십이면체 주사위의 네 사건 가운데 경우의 수가 가장 작은(큰) 것
              const small = d.bool(), all = range(1, 12), pool = [CD.prime(), CD.odd(), CD.mult(3), CD.mult(4), CD.mult(5), CD.div(12), CD.div(8), CD.div(10), CD.under(d.int(4, 6)), CD.least(d.int(9, 11)), CD.over(d.int(7, 9))];
              const picked = d.until(() => d.shuffle(pool).slice(0, 4), (list) => { const k = list.map((c) => all.filter(c.test).length), best = small ? Math.min(...k) : Math.max(...k); return k.filter((v) => v === best).length === 1 && new Set(k).size >= 3; });
              const k = picked.map((c) => all.filter(c.test).length), best = small ? Math.min(...k) : Math.max(...k), hit = k.indexOf(best);
              return C(`각 면에 1부터 12까지의 자연수가 하나씩 적힌 정십이면체 모양의 주사위를 한 번 던질 때, 다음 사건 가운데 일어나는 경우의 수가 가장 ${small ? '작은' : '큰'} 것은?`, picked.map((c) => `${c.num}가 나온다.`), hit,
                { explain: `사건마다 경우의 수를 구하면 차례로 ${told(k)}이다. ${picked[hit].num}는 ${told(all.filter(picked[hit].test))}의 ${best}가지이다.`, facts: { truth: k.map((v) => v === best), want: true } });
            }
            // 주사위 한 개에 대한 설명 가리기: [조건, 틀리게 적을 수]
            const wantTrue = d.bool(), pool = d.shuffle([[CD.prime(), d.pick([2, 4])], [CD.mult(5), 2], [CD.div(4), 2], [CD.div(6), 3], [CD.over(3), 4], [CD.under(8), d.pick([7, 8])], [CD.under(1), 1], [CD.mult(2), 2], [CD.least(4), d.pick([2, 4])]]).slice(0, 4);
            const hit = d.int(0, 3), rows = pool.map(([c, wrong], i) => { const real = DIE.filter(c.test).length, ok = (i === hit) === wantTrue; return { c, real, said: ok ? real : wrong, ok }; });
            const why = (r) => (r.real === 0 ? `${r.c.eye}은 없으므로 경우의 수는 0이다.` : `${r.c.eye}은 ${told(DIE.filter(r.c.test))}의 ${r.real}가지이다.`);
            return C(`주사위 한 개를 던질 때, 다음 설명 가운데 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows.map((r) => `${r.c.eye}이 나오는 경우의 수는 ${r.said}이다.`), hit,
              { explain: wantTrue ? rows.filter((r) => !r.ok).map(why).join(' ') : why(rows[hit]), facts: { claimed: rows.map((r) => [String(r.real), r.said]), claimedWant: wantTrue } });
          }, { count: 2 }),
          T('event-coins', '동전을 여러 번(여러 개) 던질 때 앞면의 수', '①7', (d, n) => {
            if (n === 0) {
              const [t, k] = d.pick([[3, 1], [3, 2], [4, 1], [4, 2], [4, 3]]), face = d.pick(['앞', '뒤']), all = cart(range(1, t).map(() => ['앞', '뒤'])), ok = (row) => row.filter((v) => v === face).length === k;
              return Q(`동전 한 개를 ${t}번 던질 때, ${face === '앞' ? '앞면' : '뒷면'}이 ${k}번 나오는 경우의 수는?`, all.map(ok), { explain: `나온 면을 던진 차례대로 적으면 ${pairsTold(all.filter(ok))}의 ${all.filter(ok).length}가지이다.` });
            }
            const t = d.pick([3, 4]), all = cart(range(1, t).map(() => ['앞', '뒤'])), same = all.filter((row) => new Set(row).size === 1);
            return M(`서로 다른 동전 ${t}개를 동시에 던질 때, 일어나는 모든 경우의 수와 ${t}개 모두 같은 면이 나오는 경우의 수는?`, [{ label: '모든 경우', answer: all.length, unit: '가지' }, { label: '모두 같은 면', answer: same.length, unit: '가지' }],
              { explain: `동전 한 개마다 앞면, 뒷면의 2가지이므로 모든 경우의 수는 ${range(1, t).map(() => 2).join(' × ')} = ${all.length}이다. 모두 같은 면이 나오는 경우는 모두 앞면, 모두 뒷면의 2가지이다.`, facts: { calc: [[range(1, t).map(() => 2).join('*'), 0], ['2', 1]], unseen: [2] } });
          }, { count: 2 }),
          T('event-two-prices', '두 개의 값이 될 수 없는 금액', '①8', (d) => {
            const sumsOf = (p) => [2 * p[0], p[0] + p[1], p[0] + p[2], 2 * p[1], p[1] + p[2], 2 * p[2]];
            const prices = d.until(() => d.shuffle(range(8, 20)).slice(0, 3).sort((x, y) => x - y).map((v) => v * 100), (p) => new Set(sumsOf(p)).size === 6 && p[2] - p[0] >= 400);
            const sums = sumsOf(prices), bad = d.pick(range(prices[0] / 50, prices[2] / 50).map((v) => v * 100).filter((v) => !sums.includes(v)));
            const options = d.shuffle(d.shuffle(sums).slice(0, 3).concat([bad]));
            return C(`한 송이의 값이 ${prices[0]}원, ${prices[1]}원, ${prices[2]}원인 세 종류의 꽃 가운데 두 송이를 사려고 한다. 다음 가운데 두 송이의 값의 합이 될 수 없는 것은? (단, 같은 종류의 꽃을 두 송이 살 수도 있다.)`, options.map((v) => `${v}원`), options.indexOf(bad),
              { explain: `두 송이의 값의 합은 ${sums.slice().sort((x, y) => x - y).map((v) => v + '원').join(', ')}의 6가지이다. ${bad}원은 이 가운데 없다.`, facts: { truth: options.map((v) => sums.includes(v)), want: false } });
          }),
          T('event-digit-sum', '자리 숫자의 합이 정해진 두 자리 수', '①9', (d) => {
            const s = d.int(5, 12), all = range(10, 99), ok = (v) => Math.floor(v / 10) + v % 10 === s, got = all.filter(ok);
            return Q(`10부터 99까지의 두 자리 자연수 가운데 하나를 고를 때, 십의 자리 숫자와 일의 자리 숫자의 합이 ${s}인 경우의 수는?`, all.map(ok), { explain: `십의 자리 숫자가 작은 것부터 적으면 ${told(got)}의 ${got.length}가지이다.` });
          }),
          T('event-numberline', '수직선의 점에서 거리가 정해진 두 점', '①10', (d) => {
            const k = d.pick([3, 4]), dd = d.int(2, k), pts = range(-k, k), all = combos(pts, 2), ok = ([x, y]) => y - x === dd, got = all.filter(ok);
            return Q(`다음 수직선 위에는 좌표가 ${MINUS}${k}부터 ${k}까지의 정수인 점 ${2 * k + 1}개가 있다. 이 가운데 두 점을 고를 때, 두 점 사이의 거리가 ${dd}인 경우의 수는?`, all.map(ok),
              { figure: nline(-k, k), explain: `두 점의 좌표를 작은 것부터 적으면 ${got.map(([x, y]) => `(${sg(x)}, ${sg(y)})`).join(', ')}의 ${got.length}가지이다.` });
          })
        ]
      },
      {
        id: 'dice', title: '두 주사위와 가위바위보', standard: STD,
        types: [
          T('dice-sum', '두 눈의 수의 합이 정해진 값', '①12', (d, n) => {
            if (n === 0) {
              const s = d.pick([4, 5, 6, 8, 9, 10]), ok = ([a, c]) => a + c === s, got = PAIRS.filter(ok);
              return Q(`서로 다른 두 개의 주사위를 동시에 던질 때, 나오는 두 눈의 수의 합이 ${s}인 경우의 수는?`, PAIRS.map(ok), { explain: `두 눈의 수를 순서쌍으로 나타내면 ${pairsTold(got)}의 ${got.length}가지이다.` });
            }
            // 음수가 적힌 정사면체 주사위를 두 번 던진다.
            const faces = d.pick([[-2, -1, 0, 1], [-1, 0, 1, 2]]), all = cart([faces, faces]);
            const s = d.until(() => d.int(-2, 2), (v) => { const k = all.filter(([a, c]) => a + c === v).length; return k >= 2 && k <= 4; }), ok = ([a, c]) => a + c === s, got = all.filter(ok);
            return Q(`네 면에 ${faces.map(sg).join(', ')}${tail(Math.abs(faces[3]), '이/가')} 하나씩 적힌 정사면체 모양의 주사위를 두 번 던질 때, 바닥에 닿은 면에 적힌 두 수의 합이 ${sg(s)}인 경우의 수는?`, all.map(ok),
              { explain: `처음 수와 나중 수를 순서쌍으로 나타내면 ${got.map(([a, c]) => `(${sg(a)}, ${sg(c)})`).join(', ')}의 ${got.length}가지이다.` });
          }, { count: 2 }),
          T('dice-diff', '두 눈의 수의 차가 정해진 값', '①13', (d) => {
            const k = d.int(2, 4), ok = ([a, c]) => Math.abs(a - c) === k, got = PAIRS.filter(ok);
            return Q(`한 개의 주사위를 두 번 던질 때, 나오는 두 눈의 수의 차가 ${k}인 경우의 수는?`, PAIRS.map(ok), { explain: `처음 눈과 나중 눈을 순서쌍으로 나타내면 ${pairsTold(got)}의 ${got.length}가지이다.` });
          }),
          T('dice-product', '두 눈의 수의 곱이 홀수·짝수', '①14', (d, n) => {
            const odd = n === 0, ok = ([a, c]) => (a * c) % 2 === (odd ? 1 : 0);
            return Q(`서로 다른 두 개의 주사위 A, B를 동시에 던질 때, 나오는 두 눈의 수의 곱이 ${odd ? '홀수' : '짝수'}인 경우의 수는?`, PAIRS.map(ok),
              { explain: odd ? '곱이 홀수이려면 두 눈이 모두 홀수이어야 한다. 홀수의 눈은 1, 3, 5의 3가지이므로 3 × 3 = 9(가지)이다.' : '모든 경우의 수는 6 × 6 = 36이고, 곱이 홀수인 경우는 두 눈이 모두 홀수인 3 × 3 = 9(가지)이다. 따라서 곱이 짝수인 경우의 수는 36 − 9 = 27이다.',
                facts: { calc: [[odd ? '3*3' : '6*6-3*3', 0]], unseen: [3, 6] } });
          }, { count: 2 }),
          T('dice-equation', '두 눈의 수가 일차방정식을 만족하는 경우', '①15 심12', (d) => {
            const [p, q, c] = d.until(() => { const [a, e] = d.pick([[2, 1], [1, 2], [3, 1], [1, 3], [2, 3], [3, 2], [2, -1], [3, -1]]); return [a, e, d.int(1, 18)]; }, ([a, e, v]) => { const k = PAIRS.filter(([x, y]) => a * x + e * y === v).length; return k >= 2 && k <= 4; });
            const ok = ([x, y]) => p * x + q * y === c, got = PAIRS.filter(ok), eq = nb(`${poly([[p, V('x')], [q, V('y')]])} = ${c}`);
            return Q(`한 개의 주사위를 두 번 던져서 처음에 나오는 눈의 수를 ${V('x')}, 나중에 나오는 눈의 수를 ${V('y')}라 할 때, ${eq}${tail(c, '을/를')} 만족시키는 경우의 수는?`, PAIRS.map(ok),
              { explain: `${V('x')}에 1부터 6까지의 수를 차례로 넣어 ${V('y')}가 1부터 6까지의 자연수가 되는 것을 찾는다. (${V('x')}, ${V('y')})는 ${pairsTold(got)}의 ${got.length}가지이다.` });
          }),
          T('dice-root', '두 눈의 수로 정한 방정식의 해', '①17', (d) => {
            const [k, c] = d.until(() => [d.int(1, 3), d.int(-6, 3)], ([r, v]) => { const m = PAIRS.filter(([a, e]) => a * r - e + v === 0).length; return v !== 0 && m >= 2 && m <= 5; });
            const ok = ([a, e]) => a * k - e + c === 0, got = PAIRS.filter(ok);
            return Q(`서로 다른 두 개의 주사위 A, B를 동시에 던져서 나오는 눈의 수를 각각 ${V('a')}, ${V('b')}라 할 때, ${V('x')}에 대한 방정식 ${nb(`${V('a')}${V('x')} ${MINUS} ${V('b')} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} = 0`)}의 해가 ${k}인 경우의 수는?`, PAIRS.map(ok),
              { explain: `${nb(`${V('x')} = ${k}`)}${tail(k, '을/를')} 넣으면 ${nb(`${poly([[k, V('a')], [-1, V('b')], [c, '']])} = 0`)}이므로 ${nb(`${V('b')} = ${poly([[k, V('a')], [c, '']])}`)}이다. 이를 만족시키는 (${V('a')}, ${V('b')})는 ${pairsTold(got)}의 ${got.length}가지이다.` });
          }),
          T('dice-rps2', '두 사람의 가위바위보', '①18', (d) => {
            const [A, Bn] = pickNames(d, 2), hands = ['가위', '바위', '보'], all = cart([hands, hands]), beats = (x, y) => (hands.indexOf(x) - hands.indexOf(y) + 3) % 3 === 1, win = all.filter(([x, y]) => beats(x, y));
            return M(`${name(A, '과/와')} ${name(Bn, '이/가')} 가위바위보를 한 번 할 때, 일어나는 모든 경우의 수와 ${name(A, '이/가')} 이기는 경우의 수는?`, [{ label: '모든 경우', answer: all.length, unit: '가지' }, { label: `${name(A, '이/가')} 이기는 경우`, answer: win.length, unit: '가지' }],
              { explain: `두 사람이 각각 가위, 바위, 보의 3가지를 낼 수 있으므로 모든 경우의 수는 3 × 3 = 9이다. ${name(A, '이/가')} 이기는 경우를 (${A}, ${Bn})${pt(Bn, '으로/로')} 나타내면 ${pairsTold(win)}의 3가지이다.`, facts: { calc: [['3*3', 0], ['3', 1]], unseen: [3] } });
          })
        ]
      },
      {
        id: 'pay', title: '돈을 지불하는 방법', standard: STD,
        types: [
          T('pay-ways', '정해진 금액을 지불하는 방법의 수', '①20 심3', (d, n) => {
            if (n === 0) {
              const [a, c, t] = d.until(() => [d.int(6, 10), d.int(5, 10), 50 * d.int(6, 16)], ([x, y, v]) => { const k = cart([range(0, x), range(0, y)]).filter(([i, j]) => 50 * i + 100 * j === v).length; return k >= 3 && k <= 6; });
              const all = cart([range(0, c), range(0, a)]), ok = ([j, i]) => 100 * j + 50 * i === t, got = all.filter(ok).reverse();
              return Q(`50원짜리 동전 ${a}개와 100원짜리 동전 ${c}개가 있다. 이 동전을 사용하여 ${t}원을 거스름돈 없이 지불하는 방법의 수는?`, all.map(ok),
                { explain: `100원짜리 동전의 개수를 많은 것부터 정하면 50원짜리 동전의 개수가 정해진다. (100원짜리의 개수, 50원짜리의 개수)는 ${pairsTold(got)}의 ${got.length}가지이다.` });
            }
            const [coins, k, t] = d.until(() => { const set = d.pick([[500, 100, 50], [100, 50, 10]]); return [set, 5, set[2] * d.int(8, 34)]; }, ([set, m, v]) => { const w = cart([range(0, m), range(0, m), range(0, m)]).filter((r) => sum(r.map((x, i) => x * set[i])) === v).length; return w >= 3 && w <= 6 && (set[2] !== 10 || v % 50 === 0); });
            const all = cart([range(0, k), range(0, k), range(0, k)]), ok = (r) => sum(r.map((x, i) => x * coins[i])) === t, got = all.filter(ok).reverse();
            return Q(`${coins[0]}원, ${coins[1]}원, ${coins[2]}원짜리 동전이 각각 ${k}개씩 있다. 이 동전을 사용하여 ${t}원을 거스름돈 없이 지불하는 방법의 수는?`, all.map(ok),
              { explain: `큰 동전의 개수부터 정한다. (${coins[0]}원짜리, ${coins[1]}원짜리, ${coins[2]}원짜리)의 개수는 ${pairsTold(got)}의 ${got.length}가지이다.` });
          }, { count: 2 }),
          T('pay-amounts', '지불할 수 있는 방법·금액의 가짓수', '①21 ①23 심4', (d, n) => {
            if (n === 0) {
              // 종류마다 한 개 이상 쓴다. 50원짜리가 2개 이하, 100원짜리가 4개 이하이면 금액이 모두 다르다.
              const a = 2, c = d.int(3, 4), e = d.int(2, 3), all = cart([range(1, a), range(1, c), range(1, e)]);
              if (new Set(all.map(([i, j, k]) => 50 * i + 100 * j + 500 * k)).size !== all.length) throw new Error('금액이 겹친다');
              return QA(`50원짜리 동전 ${a}개, 100원짜리 동전 ${c}개, 500원짜리 동전 ${e}개가 있다. 세 종류의 동전을 각각 한 개 이상 사용하여 돈을 지불하는 방법의 수는?`, all.length, `${a}*${c}*${e}`,
                { explain: `50원짜리는 1개부터 ${a}개까지의 ${a}가지, 100원짜리는 ${c}가지, 500원짜리는 ${e}가지로 쓸 수 있다. 따라서 ${a} × ${c} × ${e} = ${all.length}(가지)이다.` });
            }
            const [a, c] = d.until(() => [d.int(2, 4), d.int(2, 4)], ([x, y]) => x !== y), amounts = new Set(cart([range(0, a), range(0, c)]).filter(([i, j]) => i + j > 0).map(([i, j]) => 500 * i + 100 * j));
            return QA(`500원짜리 동전 ${a}개와 100원짜리 동전 ${c}개가 있다. 이 동전을 한 개 이상 사용하여 거스름돈 없이 지불할 수 있는 금액은 모두 몇 가지인가?`, amounts.size, `(${a}+1)*(${c}+1)-1`,
              { explain: `500원짜리는 0개부터 ${a}개까지의 ${a + 1}가지, 100원짜리는 0개부터 ${c}개까지의 ${c + 1}가지로 쓸 수 있고 금액은 모두 다르다. 두 동전을 모두 0개 쓰는 것은 지불하는 것이 아니므로 ${a + 1} × ${c + 1} − 1 = ${amounts.size}(가지)이다.`, facts: { unseen: [1] } });
          }, { count: 2 })
        ]
      },
      {
        id: 'or', title: '사건 A 또는 사건 B가 일어나는 경우의 수', standard: STD,
        types: [
          T('or-kinds', '여러 종류 가운데 하나 고르기', '①24 ①25 심17', (d, n) => {
            if (n === 0) {
              const [a, c] = d.until(() => [d.int(2, 6), d.int(2, 6)], ([x, y]) => x !== y);
              const ctx = d.pick([
                [`집에서 박물관까지 가는 버스 노선이 ${a}가지, 지하철 노선이 ${c}가지 있다. 버스 또는 지하철을 한 번만 타고 집에서 박물관까지 가는 경우의 수는?`, '버스를 타는 경우', '지하철을 타는 경우'],
                [`어느 식당의 차림표에 밥 종류가 ${a}가지, 면 종류가 ${c}가지 있다. 이 식당에서 음식을 한 가지만 주문하는 경우의 수는?`, '밥 종류를 주문하는 경우', '면 종류를 주문하는 경우']
              ]);
              return QA(ctx[0], cart([range(1, a)]).length + cart([range(1, c)]).length, `${a}+${c}`, { explain: `${ctx[1]}가 ${a}가지, ${ctx[2]}가 ${c}가지이고 두 사건은 동시에 일어나지 않는다. 따라서 ${a} + ${c} = ${a + c}(가지)이다.` });
            }
            // 세 종류 가운데 두 종류에서 하나: 묻지 않은 종류의 수는 쓰지 않는다.
            const [a, c, e] = d.until(() => [d.int(2, 8), d.int(2, 8), d.int(2, 8)], (v) => new Set(v).size === 3 && new Set([v[0] + v[1], v[0] + v[2], v[1] + v[2]]).size === 3);
            const ctx = d.pick([{ lead: '어느 꽃집에', kinds: ['장미', '튤립', '국화'], u: '종류', tail0: '가 있다', what: '꽃 한 종류를 살 때' }, { lead: '가족 여행을 갈 곳으로', kinds: ['바닷가', '산', '계곡'], u: '곳', tail0: '을 골라 두었다', what: '여행 갈 곳 한 곳을 정할 때' }, { lead: '책꽂이에 서로 다른', kinds: ['소설책', '만화책', '시집'], u: '권', tail0: '이 꽂혀 있다', what: '책 한 권을 꺼낼 때' }]);
            const [i, j] = d.pick([[0, 1], [0, 2], [1, 2]]), counts = [a, c, e], rest = 3 - i - j;
            return QA(`${ctx.lead} ${ctx.kinds[0]} ${a}${ctx.u}, ${ctx.kinds[1]} ${c}${ctx.u}, ${ctx.kinds[2]} ${e}${ctx.u}${ctx.tail0}. 이 가운데 ${ctx.what}, ${ctx.kinds[i]} 또는 ${josa(ctx.kinds[j], '을/를')} 고르는 경우의 수는?`, counts[i] + counts[j], `${counts[i]}+${counts[j]}`,
              { explain: `${josa(ctx.kinds[i], '을/를')} 고르는 경우가 ${counts[i]}가지, ${josa(ctx.kinds[j], '을/를')} 고르는 경우가 ${counts[j]}가지이므로 ${counts[i]} + ${counts[j]} = ${counts[i] + counts[j]}(가지)이다. ${ctx.kinds[rest]}의 ${counts[rest]}${ctx.u}${pt(ctx.u, '은/는')} 세지 않는다.` });
          }, { count: 2 }),
          T('or-table', '표에서 「A 또는 B」', '①26', (d) => {
            const ctx = d.pick([{ what: '혈액형', kinds: ['A형', 'B형', 'O형', 'AB형'] }, { what: '태어난 계절', kinds: ['봄', '여름', '가을', '겨울'] }, { what: '좋아하는 운동', kinds: ['축구', '농구', '배구', '수영'] }]);
            const counts = d.until(() => ctx.kinds.map(() => d.int(4, 13)), (v) => new Set(v).size === 4), [i, j] = d.pick([[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]);
            return QA(`다음은 어느 반 학생 ${sum(counts)}명의 ${josa(ctx.what, '을/를')} 조사하여 나타낸 표이다. 이 반 학생 가운데 한 명을 뽑을 때, ${josa(ctx.what, '이/가')} ${ctx.kinds[i]} 또는 ${ctx.kinds[j]}인 학생이 뽑히는 경우의 수는?`, counts[i] + counts[j], `${counts[i]}+${counts[j]}`,
              { figure: tbl([ctx.what, '학생 수(명)'], ctx.kinds.map((kd, k) => [kd, counts[k]])), explain: `${ctx.kinds[i]}인 학생이 ${counts[i]}명, ${ctx.kinds[j]}인 학생이 ${counts[j]}명이고, 한 학생이 두 가지에 모두 들 수는 없다. 따라서 ${counts[i]} + ${counts[j]} = ${counts[i] + counts[j]}(가지)이다.` });
          }),
          T('or-die', '주사위 한 개에서 A 또는 B', '①27', (d, n) => {
            if (n === 0) {
              if (d.bool()) {
                const [k, m] = d.pick([[4, 3], [4, 5], [8, 3], [10, 3], [9, 2], [8, 5]]), ok = (v) => k % v === 0 || v % m === 0;
                return Q(`주사위 한 개를 던질 때, ${k}의 약수 또는 ${m}의 배수의 눈이 나오는 경우의 수는?`, DIE.map(ok),
                  { explain: `${k}의 약수의 눈은 ${told(DIE.filter((v) => k % v === 0))}이고 ${m}의 배수의 눈은 ${told(DIE.filter((v) => v % m === 0))}이다. 두 사건에 모두 드는 눈은 없으므로 ${DIE.filter((v) => k % v === 0).length} + ${DIE.filter((v) => v % m === 0).length} = ${hits(DIE.map(ok))}(가지)이다.` });
              }
              const [a, c] = d.pick([[3, 5], [3, 4], [2, 4], [4, 5]]), ok = (v) => v < a || v > c;
              return Q(`주사위 한 개를 던질 때, ${a}보다 작거나 ${c}보다 큰 눈이 나오는 경우의 수는?`, DIE.map(ok), { explain: `${a}보다 작은 눈은 ${told(DIE.filter((v) => v < a))}이고 ${c}보다 큰 눈은 ${told(DIE.filter((v) => v > c))}이므로 ${a - 1} + ${6 - c} = ${hits(DIE.map(ok))}(가지)이다.` });
            }
            // 두 사건에 모두 드는 눈이 있다.
            const [x, y] = d.pick([[CD.mult(2), CD.div(6)], [CD.prime(), CD.even()], [CD.mult(2), CD.div(4)], [CD.odd(), CD.prime()], [CD.div(4), CD.div(6)], [CD.mult(3), CD.prime()]]);
            const ok = (v) => x.test(v) || y.test(v), both = DIE.filter((v) => x.test(v) && y.test(v)), ka = DIE.filter(x.test).length, kb = DIE.filter(y.test).length;
            return Q(`주사위 한 개를 던질 때, 나오는 눈의 수가 ${x.num} 또는 ${y.num}인 경우의 수는?`, DIE.map(ok),
              { explain: `${x.num}인 눈은 ${told(DIE.filter(x.test))}이고 ${y.num}인 눈은 ${told(DIE.filter(y.test))}이다. ${told(both)}${tail(both[both.length - 1], '은/는')} 두 사건에 모두 들어 있어 한 번만 세어야 하므로 ${ka} + ${kb} − ${both.length} = ${hits(DIE.map(ok))}(가지)이다.` });
          }, { count: 2 }),
          T('or-cards', '수 카드에서 배수 또는 배수·약수', '①28 ①29 ①30 심18', (d, n) => {
            if (n === 0) {
              const [N0, p, q] = d.until(() => [d.pick([10, 12, 15, 20]), d.int(3, 7), d.int(3, 7)], ([a, x, y]) => x < y && lcm(x, y) > a && y * 2 <= a), all = range(1, N0), ok = (v) => v % p === 0 || v % q === 0;
              return Q(`1부터 ${N0}까지의 자연수가 하나씩 적힌 카드 ${N0}장 가운데 한 장을 뽑을 때, ${p}의 배수 또는 ${q}의 배수가 적힌 카드가 나오는 경우의 수는?`, all.map(ok),
                { explain: `${p}의 배수는 ${told(all.filter((v) => v % p === 0))}의 ${Math.floor(N0 / p)}가지, ${q}의 배수는 ${told(all.filter((v) => v % q === 0))}의 ${Math.floor(N0 / q)}가지이다. 두 사건에 모두 드는 수는 없으므로 ${Math.floor(N0 / p)} + ${Math.floor(N0 / q)} = ${hits(all.map(ok))}(가지)이다.`, facts: { calc: [[`(${N0}-${N0}%${p})/${p}+(${N0}-${N0}%${q})/${q}`, 0]] } });
            }
            if (n === 1) {
              // 공배수가 두 사건에 모두 든다.
              const [N0, p, q] = d.until(() => { const [x, y] = d.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 6], [5, 6], [3, 7], [2, 7]]); return [d.pick([20, 24, 30, 35, 40, 50]), x, y]; }, ([a, x, y]) => lcm(x, y) <= a), all = range(1, N0), ok = (v) => v % p === 0 || v % q === 0, L = lcm(p, q);
              const ka = Math.floor(N0 / p), kb = Math.floor(N0 / q), kc = Math.floor(N0 / L);
              return Q(`1부터 ${N0}까지의 자연수가 하나씩 적힌 공 ${N0}개가 들어 있는 상자에서 공 한 개를 꺼낼 때, 공에 적힌 수가 ${p}의 배수 또는 ${q}의 배수인 경우의 수는?`, all.map(ok),
                { explain: `${p}의 배수는 ${ka}가지, ${q}의 배수는 ${kb}가지이다. ${josa(p, '과/와')} ${q}의 공배수인 ${told(all.filter((v) => v % L === 0))}의 ${kc}가지는 두 사건에 모두 들어 있어 한 번만 세어야 하므로 ${ka} + ${kb} − ${kc} = ${ka + kb - kc}(가지)이다.` });
            }
            const [N0, p] = d.until(() => [d.pick([16, 18, 20, 25]), d.int(3, 7)], ([a, x]) => a % x !== 0), all = range(1, N0), ok = (v) => v % p === 0 || N0 % v === 0;
            return Q(`1부터 ${N0}까지의 자연수가 하나씩 적힌 카드 ${N0}장 가운데 한 장을 뽑을 때, 카드에 적힌 수가 ${p}의 배수 또는 ${N0}의 약수인 경우의 수는?`, all.map(ok),
              { explain: `${p}의 배수는 ${told(all.filter((v) => v % p === 0))}의 ${Math.floor(N0 / p)}가지, ${N0}의 약수는 ${told(divs(N0))}의 ${divs(N0).length}가지이다. 두 사건에 모두 드는 수는 없으므로 ${Math.floor(N0 / p)} + ${divs(N0).length} = ${hits(all.map(ok))}(가지)이다.` });
          }, { count: 3 }),
          T('or-dice', '두 주사위의 눈의 합·차·곱이 a 또는 b', '①31 ①32 ①33 ①34', (d, n) => {
            const kind = ['합', '차', '곱', '합'][n], f = n === 1 ? (a, c) => Math.abs(a - c) : n === 2 ? (a, c) => a * c : (a, c) => a + c, k = (v) => PAIRS.filter(([a, c]) => f(a, c) === v).length;
            if (n === 3) {
              // 합이 어떤 수 이상(이하): 두세 갈래를 더한다.
              const up = d.bool(), t = up ? d.pick([9, 10]) : d.pick([4, 5]), ok = ([a, c]) => (up ? a + c >= t : a + c <= t), vals = up ? range(t, 12) : range(2, t);
              return Q(`서로 다른 두 개의 주사위를 동시에 던질 때, 나오는 두 눈의 수의 합이 ${t} ${up ? '이상' : '이하'}인 경우의 수는?`, PAIRS.map(ok),
                { explain: `합이 ${told(vals)}인 경우의 수는 차례로 ${told(vals.map(k))}이다. 따라서 ${vals.map(k).join(' + ')} = ${hits(PAIRS.map(ok))}(가지)이다.` });
            }
            const pool = n === 0 ? range(3, 11) : n === 1 ? range(1, 5) : [4, 6, 8, 10, 12, 15, 18, 20];
            const [u, w] = d.until(() => d.shuffle(pool).slice(0, 2).sort((x, y) => x - y), ([x, y]) => k(x) !== k(y) && k(x) + k(y) <= 10), ok = ([a, c]) => f(a, c) === u || f(a, c) === w;
            const lead = n === 1 ? '한 개의 주사위를 두 번 던질 때' : n === 2 ? '서로 다른 두 개의 주사위 A, B를 동시에 던질 때' : '서로 다른 두 개의 주사위를 동시에 던질 때';
            return Q(`${lead}, 나오는 두 눈의 수의 ${kind}${pt(kind, '이/가')} ${u} 또는 ${w}인 경우의 수는?`, PAIRS.map(ok),
              { explain: `${kind}${pt(kind, '이/가')} ${u}인 경우는 ${pairsTold(PAIRS.filter(([a, c]) => f(a, c) === u))}의 ${k(u)}가지, ${w}인 경우는 ${pairsTold(PAIRS.filter(([a, c]) => f(a, c) === w))}의 ${k(w)}가지이다. 두 사건은 동시에 일어나지 않으므로 ${k(u)} + ${k(w)} = ${k(u) + k(w)}(가지)이다.` });
          }, { count: 4 })
        ]
      },
      {
        id: 'and', title: '두 사건 A와 B가 동시에 일어나는 경우의 수', standard: STD,
        types: [
          T('and-kinds', '종류마다 하나씩 고르기', '①35 심20', (d, n) => {
            if (n === 0) {
              // 차림표에서 이름을 세어 곱한다.
              const ra = d.shuffle(['김치라면', '치즈라면', '만두라면', '해물라면', '떡라면']), tt = d.shuffle(['국물떡볶이', '짜장떡볶이', '치즈떡볶이', '카레떡볶이', '크림떡볶이']);
              const [a, c] = d.until(() => [d.int(2, 4), d.int(3, 5)], ([x, y]) => x !== y), all = cart([ra.slice(0, a), tt.slice(0, c)]);
              return QA('다음은 어느 분식집의 차림표이다. 이 분식집에서 라면과 떡볶이를 각각 한 가지씩 주문하는 경우의 수는?', all.length, `${a}*${c}`,
                { figure: menuFig([['라면', ra.slice(0, a)], ['떡볶이', tt.slice(0, c)]]), explain: `라면은 ${a}가지, 떡볶이는 ${c}가지이다. 라면 한 가지마다 떡볶이를 ${c}가지로 고를 수 있으므로 ${a} × ${c} = ${all.length}(가지)이다.`, facts: { unseen: [a, c] } });
            }
            if (n === 1) {
              const [a, c] = d.until(() => [d.int(3, 5), d.int(3, 5)], ([x, y]) => x !== y), cons = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'].slice(0, a), vows = ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅣ'].slice(0, c), all = cart([cons, vows]);
              return QA(`자음 ${told(cons)} 가운데 한 개, 모음 ${told(vows)} 가운데 한 개를 골라 짝 지어 만들 수 있는 글자는 모두 몇 개인가?`, all.length, `${a}*${c}`,
                { unit: '개', explain: `자음은 ${a}개, 모음은 ${c}개이다. 자음 한 개마다 모음을 ${c}가지로 고를 수 있으므로 ${a} × ${c} = ${all.length}(개)이다.`, facts: { unseen: [a, c] } });
            }
            const [a, c, e] = d.until(() => [d.int(2, 5), d.int(2, 5), d.int(2, 5)], (v) => new Set(v).size === 3), ctx = d.pick([['어느 식당의 세트는 음료수', '샐러드', '피자', '세트를 주문하는'], ['어느 가게의 선물 꾸러미는 상자', '포장지', '리본', '선물 꾸러미를 꾸미는']]);
            return QA(`${ctx[0]} ${a}종류, ${ctx[1]} ${c}종류, ${ctx[2]} ${e}종류 가운데 각각 한 가지씩 골라 정한다. ${ctx[3]} 경우의 수는?`, cart([range(1, a), range(1, c), range(1, e)]).length, `${a}*${c}*${e}`, { explain: `세 종류에서 각각 하나씩 고르므로 ${a} × ${c} × ${e} = ${a * c * e}(가지)이다.` });
          }, { count: 3 }),
          T('and-coins-dice', '동전과 주사위를 함께 던질 때 모든 경우의 수', '①36', (d) => {
            const [a, c] = d.pick([[2, 1], [1, 2], [3, 1], [2, 2]]), all = cart(range(1, a).map(() => ['앞', '뒤']).concat(range(1, c).map(() => DIE))), parts = range(1, a).map(() => 2).concat(range(1, c).map(() => 6));
            return QA(`${a === 1 ? '동전 1개' : `서로 다른 동전 ${a}개`}와 ${c === 1 ? '주사위 1개' : `서로 다른 주사위 ${c}개`}를 동시에 던질 때, 일어나는 모든 경우의 수는?`, all.length, parts.join('*'),
              { explain: `동전 한 개는 2가지, 주사위 한 개는 6가지로 나오므로 ${parts.join(' × ')} = ${all.length}(가지)이다.`, facts: { unseen: [2, 6] } });
          }),
          T('and-tree', '나뭇가지 모양의 그림의 빈칸', '①37', (d) => {
            // 칸마다 위 가지가 앞, 아래 가지가 뒤이다. 가린 칸: 가운데 줄 하나(㉠), 오른쪽 줄 둘(㉡, ㉢).
            const face = (i) => (i % 2 === 0 ? '앞' : '뒤'), r1 = d.int(0, 3), [r2, r3] = d.until(() => [d.int(0, 3), d.int(4, 7)], ([x, y]) => x % 2 !== y % 2 || d.bool());
            const cols = [range(0, 1).map(face), range(0, 3).map((i) => (i === r1 ? LAB[0] : face(i))), range(0, 7).map((i) => (i === r2 ? LAB[1] : i === r3 ? LAB[2] : face(i)))];
            const right = [face(r1), face(r2), face(r3)].join(', '), options = d.shuffle([right].concat(d.shuffle(cart([['앞', '뒤'], ['앞', '뒤'], ['앞', '뒤']]).map((r) => r.join(', ')).filter((s) => s !== right)).slice(0, 3)));
            return C('다음은 10원, 100원, 500원짜리 동전을 한 개씩 동시에 던질 때 일어나는 모든 경우를 나뭇가지 모양의 그림으로 나타낸 것이다. ㉠, ㉡, ㉢에 알맞은 것을 차례로 적은 것은?', options, options.indexOf(right),
              { figure: treeFig(['10원', '100원', '500원'], cols), explain: `칸마다 가지가 앞, 뒤의 둘로 갈라지고 위쪽 가지에 앞, 아래쪽 가지에 뒤를 적었다. 따라서 ㉠은 ${face(r1)}, ㉡은 ${face(r2)}, ㉢은 ${face(r3)}이다. 모든 경우의 수는 2 × 2 × 2 = 8이다.`, facts: { truth: options.map((s) => s === right), want: true } });
          }),
          T('and-each-condition', '던진 것마다 조건이 붙은 경우', '①38 심23', (d, n) => {
            if (n === 0) {
              const [x, y] = d.until(() => d.shuffle([CD.prime(), CD.even(), CD.div(4), CD.div(6), CD.mult(3), CD.least(5), CD.most(4), CD.div(10)]).slice(0, 2), ([p, q]) => DIE.filter(p.test).length !== DIE.filter(q.test).length);
              const ok = ([a, c]) => x.test(a) && y.test(c), ka = DIE.filter(x.test).length, kb = DIE.filter(y.test).length;
              return Q(`서로 다른 두 개의 주사위 A, B를 동시에 던질 때, A 주사위는 ${x.eye}이 나오고 B 주사위는 ${y.eye}이 나오는 경우의 수는?`, PAIRS.map(ok),
                { explain: `${x.eye}은 ${told(DIE.filter(x.test))}의 ${ka}가지, ${y.eye}은 ${told(DIE.filter(y.test))}의 ${kb}가지이다. A 주사위의 눈 하나마다 B 주사위의 눈을 ${kb}가지로 정할 수 있으므로 ${ka} × ${kb} = ${ka * kb}(가지)이다.` });
            }
            if (n === 1) {
              const k = d.int(3, 5), all = cart([['앞', '뒤'], ['앞', '뒤'], DIE]), ok = (r) => r[2] >= k;
              return Q(`서로 다른 동전 두 개와 주사위 한 개를 동시에 던질 때, 주사위는 ${k} 이상의 눈이 나오는 경우의 수는?`, all.map(ok),
                { explain: `동전 두 개가 나오는 경우는 2 × 2 = 4(가지)이고, ${k} 이상의 눈은 ${told(DIE.filter((v) => v >= k))}의 ${7 - k}가지이다. 따라서 4 × ${7 - k} = ${4 * (7 - k)}(가지)이다.` });
            }
            // 두 번 던지는 것이므로 두 조건에 모두 드는 수가 있어도 빼지 않는다.
            const faces = range(1, 12), [x, y] = d.pick([[CD.mult(3), CD.mult(4)], [CD.div(8), CD.mult(4)], [CD.div(12), CD.mult(5)], [CD.mult(2), CD.mult(3)], [CD.div(12), CD.mult(4)], [CD.prime(), CD.mult(6)]]), all = cart([faces, faces]), ok = ([a, c]) => x.test(a) && y.test(c);
            const ka = faces.filter(x.test).length, kb = faces.filter(y.test).length;
            return Q(`각 면에 1부터 12까지의 자연수가 하나씩 적힌 정십이면체 모양의 주사위를 두 번 던질 때, 처음에는 ${x.num}가 나오고 나중에는 ${y.num}가 나오는 경우의 수는?`, all.map(ok),
              { explain: `${x.num}는 ${told(faces.filter(x.test))}의 ${ka}가지, ${y.num}는 ${told(faces.filter(y.test))}의 ${kb}가지이다. 처음과 나중은 따로 던지는 것이므로 ${ka} × ${kb} = ${ka * kb}(가지)이다.` });
          }, { count: 3 }),
          T('and-flags', '깃발 신호', '①39', (d) => {
            const k = d.int(3, 6), all = cart(range(1, k).map(() => ['올림', '내림']));
            return QA(`서로 다른 깃발 ${k}개를 각각 올리거나 내려서 신호를 만들 때, 만들 수 있는 신호는 모두 몇 가지인가? (단, 깃발을 모두 내린 것도 하나의 신호로 본다.)`, all.length, range(1, k).map(() => 2).join('*'),
              { explain: `깃발 한 개마다 올리는 것과 내리는 것의 2가지가 있으므로 ${range(1, k).map(() => 2).join(' × ')} = ${all.length}(가지)이다.`, facts: { unseen: [2] } });
          }),
          T('and-each-person', '여러 사람이 각각 고르기', '①41', (d) => {
            const [k, m] = d.pick([[3, 3], [2, 4], [3, 4], [2, 5], [4, 3], [2, 6]]), all = cart(range(1, k).map(() => range(1, m)));
            return QA(`학생 ${k}명이 서로 다른 동아리 ${m}개 가운데 하나씩 골라 가입하는 경우의 수는? (단, 여러 학생이 같은 동아리를 골라도 된다.)`, all.length, range(1, k).map(() => m).join('*'),
              { explain: `학생 한 명마다 동아리를 ${m}가지로 고를 수 있으므로 ${range(1, k).map(() => m).join(' × ')} = ${all.length}(가지)이다.` });
          }),
          T('and-vs-or', '한 가지만 고르기와 각각 하나씩 고르기', '심21', (d) => {
            const [a, c] = d.until(() => [d.int(2, 7), d.int(2, 7)], ([x, y]) => x !== y && x + y !== x * y), ctx = d.pick([['어느 가게에', '아이스크림', '주스', '종류'], ['어느 옷 가게에', '모자', '목도리', '종류'], ['어느 빵집에', '빵', '음료수', '종류']]);
            return M(`${ctx[0]} ${ctx[1]} ${a}${ctx[3]}와 ${ctx[2]} ${c}${ctx[3]}가 있다. ${josa(ctx[1], '과/와')} ${ctx[2]} 가운데 한 가지만 고르는 경우의 수와, ${josa(ctx[1], '과/와')} ${josa(ctx[2], '을/를')} 각각 한 가지씩 고르는 경우의 수는?`,
              [{ label: '한 가지만', answer: range(1, a).length + range(1, c).length, unit: '가지' }, { label: '각각 한 가지씩', answer: cart([range(1, a), range(1, c)]).length, unit: '가지' }],
              { explain: `한 가지만 고르는 경우는 ${ctx[1]} 또는 ${josa(ctx[2], '을/를')} 고르는 것이므로 ${a} + ${c} = ${a + c}(가지)이다. 각각 한 가지씩 고르는 경우는 ${ctx[1]} 한 가지마다 ${josa(ctx[2], '을/를')} ${c}가지로 고를 수 있으므로 ${a} × ${c} = ${a * c}(가지)이다.`, facts: { calc: [[`${a}+${c}`, 0], [`${a}*${c}`, 1]] } });
          })
        ]
      },
      { id: 'road', title: '길', standard: STD, types: [] },
      { id: 'line', title: '한 줄로 세우기', standard: STD, types: [] },
      { id: 'number', title: '자연수 만들기', standard: STD, types: [] },
      { id: 'pick', title: '대표 뽑기', standard: STD, types: [] },
      { id: 'shape', title: '도형과 색칠', standard: STD, types: [] }
    ]
  });

  // 같은 단원의 b·c 파일이 함께 쓰는 것
  B.kit.m826 = { STD, T, H, sum, hits, isPrime, divs, DIE, PAIRS, perms, combos, cart, told, pairsTold, pt, sg, Q, QA, CD, roadFig, rowRoads, diamondRoads, region3Fig, region4Fig, REGION4, circlePoints, parallelPoints, spinnerFig, treeFig, tbl, pickNames };
})(typeof window !== 'undefined' ? window : globalThis);
