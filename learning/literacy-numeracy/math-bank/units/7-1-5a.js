// 중학교 1학년 1학기 5단원 좌표평면과 그래프 — 단원 틀·도구와 앞쪽 묶음(수직선 위의 점의 좌표, 순서쌍과 좌표평면 위의 점, 축 위의 점, 사분면, 좌표평면 위의 도형의 넓이).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 76꼴, 심화꼴 50꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/7-1-5/싣기_대조표.md 에 있다.
// (그래프 묶음 셋은 7-1-5b.js 에, 실력 문항은 7-1-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번, 교n = 미래엔 2015 교과서 n쪽(그림을 본 곳).
// 영역은 변화와 관계. 성취기준은 9수02-05(순서쌍과 좌표를 이해하고, 그 편리함을 인식할 수 있다), 9수02-06(다양한 상황을 그래프로 나타내고, 주어진 그래프를 해석할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(좌표·그림·식·조건·상황 글·그래프), 묻는 것(좌표·사분면·넓이·값·때·고르기)이 다르면 따로 싣는다.
//    상황과 수만 다른 그래프 읽기는 한 번만 싣는다(가장 높은 값 / 머문 시간 / 구간의 빠르기 / 값이 같은 횟수 / 두 그래프가 만나는 때 / 되풀이되는 시간은 서로 다른 일이다).
//  - 답: 점의 좌표는 두 칸(pointAns), 좌표 하나나 문자의 값은 부호 단추가 붙은 칸, 사분면은 늘 제1·2·3·4사분면 차례의 고르기, 넓이·시간·거리는 부호 단추 없는 칸.
//    좌표가 분수인 꼴은 고르기로, 「모두 구하시오」는 작은 값·큰 값 두 칸으로, 직접 그리는 꼴(작도)은 고르기로 바꾸었다.
//  - 그림: 좌표평면은 공용 도구 plane, 상황 그래프는 graph 로 그린다. 그래프에서 읽는 값은 모두 눈금 선 위에 놓인다.
//    고르는 그래프는 작게 그려(너비 132) 고르기 단추에 넣는다. 틀린 그래프는 저마다 아이들이 실제로 하는 잘못 하나로 만들었다(주석에 적었다).
//    뽑은 글에는 그림이 없어, 그래프와 그릇의 생김새는 미래엔 2022 소단원 수준별 문제·대단원 평가 문제, 미래엔 2015 교과서의 쪽 그림을 보고 지었다. 수와 상황은 모두 새로 정했다.
//  - 물을 붓는 그릇: 옆모습의 폭이 w 인 곳의 단면의 넓이는 w² 에 비례한다고 보고(둥근 그릇) 물의 높이의 그래프를 셈해 그린다. 폭이 좁은 곳에서 그래프가 가파르다.
//  - 용어는 교육과정의 것(변수, 좌표, 순서쌍, x좌표, y좌표, 원점, 좌표축, x축, y축, 좌표평면, 제1사분면~제4사분면, 그래프)만 쓴다.
//    「함수」「기울기」「절편」「주기」는 쓰지 않는다(「같은 모양이 되풀이된다」「가파르다」로 적는다).
//  - 꼴 목록에 적힌 원문 답지의 잘못은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(7-1-5b.js, 7-1-5c.js 의 것까지 여기에 모아 적는다)
//  ※ 2026-10-13 다시 싣기: 아래 가운데 꼬임·조건 여럿·여러 번 잇기라는 까닭으로 뺐던 꼴은 7-1-5c.js 끝에 실력 문항으로 다시 실었다
//    — 부호 조건을 거듭 푸는 사분면(①28 심16·17·18·19), 대칭의 문자 조건과 두 번 옮기기(①31·37 심20·21), 경우를 나누는 넓이(심30), 같은 요령의 사각형(심29), 호스 둘의 셈(①68).
//    지금도 빼 둔 것은 다음 단원(①69), 뒤 학년(①41), 뜻 없는 셈, 서술형, 그림을 끝내 알 수 없는 것(①56·67 심44), 같은 일(①46 심2)뿐이다.
//  - 다음 단원(정비례와 반비례): 곱이 일정한 두 자연수의 점 그래프(①69). 관계를 말로 주고 표를 채우는 꼴(①40)은 정비례가 아닌 관계(식탁의 수)로 실었다.
//  - 뒤 학년: 미지수가 둘인 일차방정식의 자연수 해(①41 — 중2).
//  - 부호 조건을 거듭 풀어야 하는 사분면(①28 심16·17·18·19). 조건 둘을 한 번 풀어 가리는 꼴(①27 심14·15)과 한 번 거꾸로 푸는 꼴(①26)은 실력에 실었다.
//  - 대칭인 점: 천재 두 종과 미래엔 2022의 기본 문서에는 없어 기본에는 싣지 않고 실력에 두 유형만 실었다(좌표·사분면 ①29·30, 넓이 심22·23).
//    문자 조건(①31·37 심20), 대칭을 두 번 옮기기(심21)는 뺐다.
//  - 경우를 나누는 넓이(심30), 같은 요령을 한 번 더 쓰는 사각형(심29 — 둘러싼 직사각형에서 빼는 일은 삼각형으로 한 번 실었다).
//  - 조건 풀이·셈이 대부분인 것: 호스 둘의 양을 빼고 나누는 셈(①68), 그래프와 표를 번갈아 두 번 바꿔 읽기(①67 — 그림도 끝내 알 수 없다).
//  - 뜻 없는 셈: 읽은 좌표로 ac − bd(①9의 변형), a + b·ab·a − b 로 묶어 묻기(①6·7·16·17·22 심1·8 — 문자의 값이나 점의 좌표를 그대로 묻는다), 두 값의 합 a + b(심50).
//  - 서술형으로만 할 수 있는 것: 변수·그래프의 뜻 쓰기(①38의 변형), 그래프의 변화를 글로 쓰기(①62의 변형 ①66 — 옳은 설명 고르기로 바꾸어 실었다).
//  - 그림을 끝내 알 수 없는 것: 블록 명령어를 차례로 늘어놓기(①56), 이레 동안의 기온 그래프(심44), 수직선에 놓인 세 수(심19 — 부호 가리기 여덟 번이라 어차피 뺀다).
//    원문 그림은 끝내 못 보았으나 묻는 일이 그림의 꼴을 정하는 것은 새로 지어 실었다: 점을 찍은 좌표평면(①14 심4·5), 일정한 속력의 수평선(①50), 그래프에 알맞은 상황(①54),
//    더 가팔라지는 꺾인 점(①65), 점점 가팔라지는 굽은 선(심34), 오르기만 하는 꺾은선의 가장 가파른 구간(심42). 받는 쪽에서 빼려면 대조표 끝의 유형 이름을 본다.
//  - 같은 일이어서 한 번만 실은 것: 모양이 다른 그릇 여럿과 그래프 짝짓기(①46 — 그릇 하나하나의 판단은 ①44·45·47과 같다), 순서쌍의 개수(심2 — ①8의 순서쌍 가리기로 실었다).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, numbers, N, M, C } = B.kit;
  const { LAB, MINUS, GT, LT, range, gcd, Q, dc, fl, tx, nb, tail, lastOf, js, V, f1, nz, pm, ansV, claimQ, lin, poly, pointAns, plane, graph, nline } = B.kit.mid;
  const UNIT = '7-1-5', STD5 = '9수02-05', STD6 = '9수02-06';
  // ref 에 기본꼴(①)·교과서(교)만 있으면 기본 자료, 심화꼴(심)만 있으면 심화 자료
  const sourceOf = (ref) => '수집본 ' + (/①|교/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make }, more || {});

  // ── 글 ──
  const va = V('a'), vb = V('b'), vx = V('x'), vy = V('y');
  const XA = vx + '축', YA = vy + '축', XC = vx + '좌표', YC = vy + '좌표';
  // 정수를 적는 글(−3·3), 검사 식에 적는 글((-3)·3), 순서쌍 (−3, 2), 이름을 붙인 점 A(−3, 2), 그 뒤에 토씨를 붙인 것
  const iq = (n) => (n < 0 ? MINUS + -n : String(n));
  const jx = (n) => (n < 0 ? '(-' + -n + ')' : String(n));
  const pt = (x, y) => nb('(' + iq(x) + ', ' + iq(y) + ')');
  const P = (name, x, y) => nb(name + '(' + iq(x) + ', ' + iq(y) + ')');
  const ptj = (x, y, pair) => pt(x, y) + tail(Math.abs(y), pair);
  const Pj = (name, x, y, pair) => P(name, x, y) + tail(Math.abs(y), pair);
  // 뺄셈을 적는 글: 5 − (−1)
  const minus = (hi, lo) => `${iq(hi)} ${MINUS} ${lo < 0 ? '(' + iq(lo) + ')' : lo}`;
  // 그림 설명의 칸 수로 다시 셈하는 길이: 두 좌표 사이의 거리를 절댓값으로 적은 식
  const span = (u, v) => { const lo = Math.min(u, v), hi = Math.max(u, v); return { len: hi - lo, ex: lo < 0 && hi > 0 ? `(${hi}+${-lo})` : lo >= 0 ? `(${hi}-${lo})` : `(${-lo}-${-hi})` }; };

  // ── 사분면 ──
  const QN = ['제1사분면', '제2사분면', '제3사분면', '제4사분면'], NONE = '어느 사분면에도 속하지 않는다';
  // 사분면의 번호(0~3). 좌표축 위의 점은 4.
  const quadOf = (x, y) => (x === 0 || y === 0 ? 4 : x > 0 ? (y > 0 ? 0 : 3) : (y > 0 ? 1 : 2));
  // 사분면마다 (x좌표의 부호, y좌표의 부호)
  const QS = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
  const signWord = (s) => (s > 0 ? '양수' : '음수');
  const cmp0 = (h, s) => nb(`${h} ${s > 0 ? GT : LT} 0`);
  // 사분면을 고르는 문항: 보기는 늘 제1·2·3·4사분면 차례이다.
  const quadQ = (text, q, explain, more) => C(text, QN, q, { explain, facts: Object.assign({ truth: QN.map((_, i) => i === q), want: true }, more || {}) });
  // a, b 의 부호가 정해지면 부호가 정해지는 식. s(sa, sb): 식의 부호(정해지지 않으면 0).
  const EX = {
    a: { h: va, s: (sa) => sa }, b: { h: vb, s: (sa, sb) => sb },
    na: { h: MINUS + va, s: (sa) => -sa }, nb: { h: MINUS + vb, s: (sa, sb) => -sb },
    ab: { h: va + vb, s: (sa, sb) => sa * sb }, nab: { h: MINUS + va + vb, s: (sa, sb) => -sa * sb },
    amb: { h: `${va} ${MINUS} ${vb}`, s: (sa, sb) => (sa !== sb ? sa : 0) }, bma: { h: `${vb} ${MINUS} ${va}`, s: (sa, sb) => (sa !== sb ? sb : 0) },
    apb: { h: `${va} + ${vb}`, s: (sa, sb) => (sa === sb ? sa : 0) }
  };
  const exPoint = (k1, k2) => nb('(' + EX[k1].h + ', ' + EX[k2].h + ')');
  const exQuad = (k1, k2, sa, sb) => { const s1 = EX[k1].s(sa, sb), s2 = EX[k2].s(sa, sb); return s1 && s2 ? QS.findIndex(([x, y]) => x === s1 && y === s2) : -1; };
  // 식의 부호를 적은 글: ab < 0, −b > 0 (a, b 그대로인 식은 적지 않는다)
  const exWhy = (keys, sa, sb) => keys.filter((k, i) => k !== 'a' && k !== 'b' && keys.indexOf(k) === i).map((k) => cmp0(EX[k].h, EX[k].s(sa, sb))).join(', ');
  // 식으로 된 점이 어느 사분면 위에 있는지 풀어 적은 글
  const exTold = (k1, k2, sa, sb, name) => {
    const why = exWhy([k1, k2], sa, sb);
    return `${why ? why + '이므로 ' : ''}점 ${name || ''}${exPoint(k1, k2)}는 ${XC}가 ${signWord(EX[k1].s(sa, sb))}, ${YC}가 ${signWord(EX[k2].s(sa, sb))}이다. 따라서 ${QN[exQuad(k1, k2, sa, sb)]} 위의 점이다.`;
  };
  // 부호가 정해지는 식의 짝 가운데 (a, b) 그대로가 아닌 것 모두
  const exPairs = (sa, sb) => { const keys = Object.keys(EX).filter((k) => EX[k].s(sa, sb) !== 0), out = []; for (const k1 of keys) for (const k2 of keys) if (k1 !== k2 && !(k1 === 'a' && k2 === 'b')) out.push([k1, k2]); return out; };

  // ── 좌표평면 위의 점 ──
  // 이름표가 축에서 멀어지는 쪽에 놓이게 한다.
  const sideOf = (x, y) => (y >= 0 ? 'u' : 'd') + (x >= 0 ? 'r' : 'l');
  const dot = (name, x, y) => ({ x, y, name, side: sideOf(x, y) });
  // 두 점의 이름표가 겹치지 않을 만큼 떨어져 있는가
  const far = (p, q) => Math.abs(p[0] - q[0]) >= 2 || Math.abs(p[1] - q[1]) >= 2;
  const allFar = (list) => list.every((p, i) => list.every((q, j) => j <= i || far(p, q)));
  const inQuad = (d, q, lo, hi) => [QS[q][0] * d.int(lo || 1, hi || 4), QS[q][1] * d.int(lo || 1, hi || 4)];
  const NAMES4 = ['A', 'B', 'C', 'D'];

  // 한 줄로 늘어선 안내판: 같은 간격의 눈금 위에 곳의 이름을 적는다. places: [{ name, at }] (at 은 눈금의 차례), base: 기준이 되는 곳의 이름.
  function placeLine(places, base) {
    const list = places.slice().sort((p, q) => p.at - q.at), lo = list[0].at, hi = list[list.length - 1].at, u = Math.min(40, 248 / (hi - lo)), x = (v) => f1(26 + (v - lo) * u), y = 38, W = 52 + (hi - lo) * u;
    const zero = list.find((p) => p.name === base).at;
    let out = `<line class="mb-axis" x1="${x(lo) - 14}" y1="${y}" x2="${x(hi) + 14}" y2="${y}"/>`;
    for (let v = lo; v <= hi; v += 1) out += `<line class="mb-axis" x1="${x(v)}" y1="${y - 4.5}" x2="${x(v)}" y2="${y + 4.5}"/>`;
    list.forEach((p, i) => { out += `<circle class="mb-dot" cx="${x(p.at)}" cy="${y}" r="3.3"/><text x="${x(p.at)}" y="${i % 2 ? y - 13 : y + 21}" text-anchor="middle" style="font-size:12.5px;font-weight:700;fill:#1f2933">${p.name}</text>`; });
    const said = list.map((p) => (p.at === zero ? '' : ` ${p.name}: ${base}에서 ${p.at > zero ? '오른쪽' : '왼쪽'}으로 ${Math.abs(p.at - zero)}칸.`)).join('');
    return `<svg class="mb-numberline" viewBox="0 0 ${f1(W)} 66" width="${Math.round(W)}" role="img" aria-label="등산로 안내판: 곧은 길 위에 같은 간격으로 눈금이 있고, 눈금 위에 왼쪽부터 ${list.map((p) => p.name).join(', ')}가 표시되어 있다.${said}">${out}</svg>`;
  }

  // ── 그래프 묶음과 실력이 함께 쓰는 그림 ──
  // 보기 그림을 고르기 단추에 넣는다. 그림만 있는 보기는 글이 없어 서로 가려지지 않으므로 앞에 기호(㉠㉡…)를 붙인다.
  const figOpt = (tag, fig) => `<span style="display:inline-flex;align-items:flex-start;gap:6px"><span style="font-weight:700">${tag}</span>${fig}</span>`;
  // rows: [{ fig, ok }] — ok 인 것이 하나뿐이다. o.explain 은 글이거나 (정답의 기호) => 글.
  function figChoice(d, text, rows, o) {
    const list = d.shuffle(rows), at = list.findIndex((r) => r.ok);
    return C(text, list.map((r, i) => figOpt(LAB[i], r.fig)), at, { figure: o.figure, explain: typeof o.explain === 'function' ? o.explain(LAB[at]) : o.explain, facts: Object.assign({ truth: list.map((r) => Boolean(r.ok)), want: true }, o.facts || {}) });
  }
  // 눈금 없이 모양만 그린 작은 그래프(보기 그림). paths 의 원소는 점의 배열이거나 { pts, smooth }.
  const mini = (xname, yname, xmax, ymax, paths) => graph({ plain: true, w: 132, xname, yname, xmax, ymax, paths: paths.map((p) => (Array.isArray(p) ? { pts: p } : p)) });
  const curve = (pts) => ({ pts, smooth: true });
  const r2 = (v) => Number(v.toFixed(2));

  // 그릇의 옆모습. list: [{ parts, name }] — parts 는 아래부터 위로 [{ h 높이, w0 아래 폭, w1 위 폭 }] (폭이 일정하면 w0 = w1).
  // o.ruler { step, unit }: 그릇 옆에 높이 눈금을 그린다(높이는 parts 의 h 그대로). o.kx 폭 1의 px, o.hpx 가장 높은 그릇의 px.
  // 그림 설명에는 부분마다 폭과 높이를 수로 적는다(그래프는 적지 않는다). 눈금이 없으면 높이는 단위 없이 적는다.
  function vessels(list, o) {
    const opt = o || {}, kx = opt.kx || 13, Hmax = Math.max(...list.map((v) => v.parts.reduce((s, p) => s + p.h, 0))), ky = (opt.hpx || 78) / Hmax, top = opt.ruler ? 24 : 10, base = top + Hmax * ky, r = opt.ruler;
    const xy = ([px, py]) => f1(px) + ' ' + f1(py), said = [];
    let out = '', x0 = 4;
    for (const v of list) {
      const wmax = Math.max(...v.parts.map((p) => Math.max(p.w0, p.w1))), cell = Math.max(wmax * kx + 14, r ? 0 : 58), cx = x0 + cell / 2, L = [], R = [], joints = [];
      let y = base, h = 0;
      v.parts.forEach((p, i) => {
        L.push([cx - p.w0 * kx / 2, y]); R.push([cx + p.w0 * kx / 2, y]);
        y -= p.h * ky; h += p.h;
        L.push([cx - p.w1 * kx / 2, y]); R.push([cx + p.w1 * kx / 2, y]);
        if (i < v.parts.length - 1) joints.push([cx + Math.max(p.w1, v.parts[i + 1].w0) * kx / 2, y, h]);
      });
      out += `<path class="mb-vessel" d="M${L.slice().reverse().map(xy).join('L')}L${R.map(xy).join('L')}"/>`
        + `<ellipse cx="${f1(cx)}" cy="${f1(y)}" rx="${f1(v.parts[v.parts.length - 1].w1 * kx / 2)}" ry="2.8" style="fill:none;stroke:#1f2933;stroke-width:1.1"/>`;
      if (v.name) out += `<text x="${f1(cx)}" y="${f1(base + 17)}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:#1f2933">${v.name}</text>`;
      if (r) {
        const xr = f1(x0 + cell + 8);
        out += `<line class="mb-axis" x1="${xr}" y1="${f1(base)}" x2="${xr}" y2="${f1(base - Hmax * ky)}"/><text class="mb-axis-label" style="font-size:10px" x="${xr}" y="${f1(base - Hmax * ky - 9)}" text-anchor="middle">(${r.unit})</text>`;
        for (let t = 0; t <= Hmax + 1e-9; t += r.step) { const yy = f1(base - t * ky); out += `<line class="mb-axis" x1="${xr - 4}" y1="${yy}" x2="${xr + 4}" y2="${yy}"/><text class="mb-axis-label" style="font-size:10.5px" x="${xr + 7}" y="${yy + 3.6}">${t}</text>`; }
        for (const [jx0, jy] of joints) out += `<line x1="${f1(jx0)}" y1="${f1(jy)}" x2="${xr}" y2="${f1(jy)}" style="stroke:#8a96a3;stroke-width:0.8;stroke-dasharray:2 2"/>`;
      }
      let from = 0;
      const told = v.parts.map((p) => { const lo = from, tall = r ? '' : `, 높이 ${p.h}`; from += p.h; return (r ? `높이 ${lo} ${r.unit}부터 ${from} ${r.unit}까지 ` : '') + (p.w0 === p.w1 ? `폭이 일정한 부분(폭 ${p.w0}${tall})` : `위로 갈수록 폭이 ${p.w1 > p.w0 ? '넓어지는' : '좁아지는'} 부분(아래 폭 ${p.w0}, 위 폭 ${p.w1}${tall})`); });
      said.push(`그릇${v.name ? ' ' + v.name : ''}의 옆모습: 아래부터 ${told.join(', 그 위에 ')}.`);
      x0 += cell + (r ? 34 : 8);
    }
    const W = Math.max(64, x0 + 2), H = base + (list.some((v) => v.name) ? 24 : 8);
    return `<svg class="mb-geo" viewBox="0 0 ${f1(W)} ${f1(H)}" width="${Math.round(W)}" role="img" aria-label="${said.join(' ')}">${out}</svg>`;
  }
  // 물을 일정하게 넣을 때 시간에 따른 물의 높이: [[시간, 높이], …]. 다 찰 때까지의 시간을 T 로 맞춘다.
  // 폭이 w 인 곳의 단면의 넓이는 w² 에 비례한다. 폭이 달라지는 부분은 잘게 나누어 굽은 선이 되게 한다(smooth 로 그린다).
  function fillPts(parts, T, smooth) {
    const pts = [[0, 0]]; let vol = 0, h = 0;
    for (const p of parts) {
      const steps = p.w0 === p.w1 ? (smooth ? 3 : 1) : 6;
      for (let i = 1; i <= steps; i += 1) {
        const wa = p.w0 + (p.w1 - p.w0) * (i - 1) / steps, wb = p.w0 + (p.w1 - p.w0) * i / steps;
        vol += p.h / steps * (wa * wa + wa * wb + wb * wb) / 3;
        pts.push([vol, h + p.h * i / steps]);
      }
      h += p.h;
    }
    return pts.map(([v, z]) => [r2(v / vol * T), r2(z)]);
  }
  // 가득 찬 물을 일정하게 빼낼 때 시간에 따른 물의 높이(위쪽부터 비워진다)
  const drainPts = (parts, T, smooth) => fillPts(parts, T, smooth).map(([t, z]) => [r2(T - t), z]).reverse();
  const curved = (parts) => parts.some((p) => p.w0 !== p.w1);
  const heightOf = (parts) => parts.reduce((s, p) => s + p.h, 0);
  // 그릇에 물을 넣을 때(빼낼 때)의 작은 그래프
  const fillMini = (parts, drain) => { const s = curved(parts), H = heightOf(parts), pts = (drain ? drainPts : fillPts)(parts, 10, s); return mini('시간', '물의 높이', 11.5, H * 1.14, [s ? curve(pts) : pts]); };
  // 그릇의 모양
  const flat = (h, w) => ({ h, w0: w, w1: w }), cone = (h, w0, w1) => ({ h, w0, w1 });

  // 점으로 된 그래프(제1사분면의 모눈에 점만 찍는다). pts: [[x, y], …], o: { xmax, ymax, u 한 칸의 px }
  function dotPlot(pts, o) {
    const xmax = o.xmax, ymax = o.ymax, u = o.u || 15, L = 20, Bm = 18, Tp = 14, R = 16, W = L + R + xmax * u, H = Tp + Bm + ymax * u, X = (v) => f1(L + v * u), Y = (v) => f1(Tp + (ymax - v) * u);
    const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
    let out = '';
    for (let v = 1; v <= xmax; v += 1) out += `<line class="mb-gridline" x1="${X(v)}" y1="${Y(0)}" x2="${X(v)}" y2="${Y(ymax)}"/><text class="mb-axis-label" style="font-size:9.5px" x="${X(v)}" y="${Y(0) + 11}" text-anchor="middle">${v}</text>`;
    for (let v = 1; v <= ymax; v += 1) out += `<line class="mb-gridline" x1="${X(0)}" y1="${Y(v)}" x2="${X(xmax)}" y2="${Y(v)}"/><text class="mb-axis-label" style="font-size:9.5px" x="${X(0) - 4}" y="${Y(v) + 3.4}" text-anchor="end">${v}</text>`;
    out += `<line class="mb-axis" x1="${X(0)}" y1="${Y(0)}" x2="${W - 5}" y2="${Y(0)}"/><path d="M${W - 2} ${Y(0)}l-6 -3v6z" style="fill:#1f2933"/><line class="mb-axis" x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="6"/><path d="M${X(0)} 3l-3 6h6z" style="fill:#1f2933"/>`
      + `<text x="${X(0) - 6}" y="${Y(0) + 11}" text-anchor="middle" style="font-size:10px;fill:#1f2933;font-weight:600">O</text><text x="${W - 5}" y="${Y(0) + 13}" text-anchor="middle" style="font-size:11.5px;fill:#1f2933;${ITALIC}">x</text><text x="${X(0) + 8}" y="10" text-anchor="middle" style="font-size:11.5px;fill:#1f2933;${ITALIC}">y</text>`;
    for (const [x, y] of pts) out += `<circle class="mb-dot" cx="${X(x)}" cy="${Y(y)}" r="2.7"/>`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="점으로 된 그래프: 가로축은 x, 세로축은 y이고 모눈 한 칸은 1이다. 점 ${pts.map(([x, y]) => `(${x}, ${y})`).join(', ')}.">${out}</svg>`;
  }

  // ── 참·거짓을 가리는 문장 ──
  const AXIS_TRUE = [`${XA} 위의 모든 점의 ${YC}는 0이다.`, `${YA} 위의 모든 점의 ${XC}는 0이다.`, '원점의 좌표는 (0, 0)이다.', `점 (${MINUS}3, 0)은 ${XA} 위의 점이다.`, `점 (0, 5)는 ${YA} 위의 점이다.`, `점 (1, 2)와 점 (2, 1)은 서로 다른 점이다.`, `원점은 ${XA} 위의 점이면서 ${YA} 위의 점이다.`, `${YC}가 0인 점은 모두 ${XA} 위에 있다.`];
  const AXIS_FALSE = [
    [`${YA} 위의 모든 점의 ${YC}는 0이다.`, `${YA} 위의 점은 ${XC}가 0이다.`, `${YA} 위의 모든 점의 ${XC}는 0이다.`],
    [`${XA} 위의 모든 점의 ${XC}는 0이다.`, `${XA} 위의 점은 ${YC}가 0이다.`, `${XA} 위의 모든 점의 ${YC}는 0이다.`],
    [`점 (2, 0)은 ${YA} 위의 점이다.`, `점 (2, 0)은 ${YC}가 0이므로 ${XA} 위의 점이다.`],
    [`점 (0, ${MINUS}4)는 ${XA} 위의 점이다.`, `점 (0, ${MINUS}4)는 ${XC}가 0이므로 ${YA} 위의 점이다.`],
    [`점 (3, ${MINUS}5)와 점 (${MINUS}5, 3)은 같은 점이다.`, '순서쌍은 두 수의 순서가 다르면 서로 다르다.', '점 (1, 2)와 점 (2, 1)은 서로 다른 점이다.'],
    ['원점의 좌표는 (0, 1)이다.', '원점의 좌표는 (0, 0)이다.', '원점의 좌표는 (0, 0)이다.'],
    [`${XC}가 0인 점은 모두 ${XA} 위에 있다.`, `${XC}가 0인 점은 ${YA} 위에 있다.`, `${YC}가 0인 점은 모두 ${XA} 위에 있다.`]
  ];
  const QUAD_TRUE = ['좌표축 위의 점은 어느 사분면에도 속하지 않는다.', `점 (0, ${MINUS}2)는 어느 사분면에도 속하지 않는다.`, `제2사분면 위의 점은 ${XC}가 음수이고 ${YC}가 양수이다.`, `점 (4, ${MINUS}1)은 제4사분면 위의 점이다.`, `점 (${MINUS}3, ${MINUS}6)은 제3사분면 위의 점이다.`, '원점은 어느 사분면에도 속하지 않는다.', `제4사분면 위의 점은 ${XC}가 양수이고 ${YC}가 음수이다.`, `점 (2, ${MINUS}5)와 점 (${MINUS}5, 2)는 서로 다른 사분면 위에 있다.`];
  const QUAD_FALSE = [
    ['점 (0, 3)은 제1사분면 위의 점이다.', `점 (0, 3)은 ${YA} 위의 점이므로 어느 사분면에도 속하지 않는다.`],
    ['원점은 제1사분면 위의 점이다.', '원점은 두 좌표축이 만나는 점이므로 어느 사분면에도 속하지 않는다.', '원점은 어느 사분면에도 속하지 않는다.'],
    [`점 (${MINUS}2, 5)는 제4사분면 위의 점이다.`, `점 (${MINUS}2, 5)는 ${XC}가 음수, ${YC}가 양수이므로 제2사분면 위의 점이다.`],
    [`점 (2, ${MINUS}5)와 점 (${MINUS}5, 2)는 같은 사분면 위에 있다.`, `점 (2, ${MINUS}5)는 제4사분면, 점 (${MINUS}5, 2)는 제2사분면 위의 점이다.`, `점 (2, ${MINUS}5)와 점 (${MINUS}5, 2)는 서로 다른 사분면 위에 있다.`],
    [`${XC}가 음수인 점은 모두 제2사분면 위에 있다.`, `점 (${MINUS}1, ${MINUS}1)은 ${XC}가 음수이지만 제3사분면 위의 점이다.`],
    [`제3사분면 위의 점은 ${XC}가 음수이고 ${YC}가 양수이다.`, `제3사분면 위의 점은 ${XC}와 ${YC}가 모두 음수이다.`],
    [`점 (${MINUS}4, 0)은 제2사분면 위의 점이다.`, `점 (${MINUS}4, 0)은 ${XA} 위의 점이므로 어느 사분면에도 속하지 않는다.`, '좌표축 위의 점은 어느 사분면에도 속하지 않는다.'],
    ['좌표평면 위의 모든 점은 네 사분면 가운데 어느 하나에 속한다.', '좌표축 위의 점은 어느 사분면에도 속하지 않는다.', '좌표축 위의 점은 어느 사분면에도 속하지 않는다.']
  ];

  B.addUnit({
    id: '7-1-5', grade: 7, semester: 1, no: 5, title: '좌표평면과 그래프', version: 2,
    groups: [
      {
        id: 'line', title: '수직선 위의 점의 좌표', standard: STD5,
        types: [
          T('line-read', '수직선 위의 점의 좌표 읽기', '①1', (d, n) => {
            // 첫째는 정수 좌표(수를 적은 눈금은 0과 1뿐이다), 둘째는 정수가 아닌 유리수 좌표.
            if (n === 0) {
              const a = -d.int(2, 5), b = d.int(2, 5);
              return M('수직선 위의 두 점 A, B의 좌표는?', [{ label: 'A', answer: a, signed: true }, { label: 'B', answer: b, signed: true }], {
                figure: nline(-6, 6, { labels: [0, 1], points: [{ at: Q(a), name: 'A' }, { at: Q(b), name: 'B' }] }),
                explain: `수직선 위의 점이 나타내는 수가 그 점의 좌표이다. 점 A는 원점에서 왼쪽으로 ${-a}칸 간 곳에 있으므로 좌표는 ${iq(a)}이고, 점 B는 원점에서 오른쪽으로 ${b}칸 간 곳에 있으므로 좌표는 ${b}이다. 기호로 A(${iq(a)}), B(${b})로 나타낸다.`,
                facts: { calc: [['-' + -a, 0], [String(b), 1]], rule: 'line-int' }
              });
            }
            const parts = d.pick([2, 3]), k = d.until(() => d.int(parts + 1, 4 * parts - 1), (v) => gcd(v, parts) === 1), s = pm(d), v = Q(s * k, parts);
            return ansV('수직선 위의 점 A의 좌표는?', v, 'frac', {
              figure: nline(-4, 4, { parts, points: [{ at: v, name: 'A' }] }),
              explain: `작은 눈금 한 칸은 ${frac(1, parts)}이다. 점 A는 원점에서 ${s < 0 ? '왼쪽' : '오른쪽'}으로 작은 눈금 ${k}칸 간 곳에 있으므로 좌표는 ${tx(v)}이고, 기호로 A(${tx(v)})로 나타낸다.`,
              facts: { value: js(v), rule: 'line-frac' }
            });
          }, { count: 2 }),
          T('line-match-wrong', '수직선 위의 점과 좌표의 짝이 옳지 않은 것 찾기', '①2', (d) => {
            // 분수 좌표의 분자와 분모를 뒤바꾼 것을 하나 섞는다(−3/2을 −2/3으로 적는 잘못).
            const parts = d.pick([2, 3]), free = (lo, hi) => d.until(() => d.int(lo, hi), (v) => v % parts !== 0);
            const ks = d.until(() => [-d.int(3, 4) * parts, -free(parts + 1, 3 * parts - 2), free(parts + 1, 3 * parts - 1), d.int(3, 4) * parts], (list) => list.every((v, i) => i === 0 || v - list[i - 1] >= 2));
            const wrongAt = d.pick([1, 2]), k = Math.abs(ks[wrongAt]), real = ks.map((v) => Q(v, parts)), slip = Q(Math.sign(ks[wrongAt]) * parts, k), said = real.map((v, i) => (i === wrongAt ? slip : v));
            return C('수직선 위의 네 점 A, B, C, D의 좌표를 기호로 나타낸 것으로 옳지 않은 것은?', NAMES4.map((name, i) => `${name}(${tx(said[i])})`), wrongAt, {
              figure: nline(-4, 4, { parts, points: real.map((v, i) => ({ at: v, name: NAMES4[i] })) }),
              explain: `작은 눈금 한 칸은 ${frac(1, parts)}이다. 점 ${NAMES4[wrongAt]}는 원점에서 ${ks[wrongAt] < 0 ? '왼쪽' : '오른쪽'}으로 작은 눈금 ${k}칸 간 곳에 있으므로 좌표는 ${tx(real[wrongAt])}이다. 분자와 분모를 바꾸어 적으면 다른 수가 된다.`,
              facts: { truth: NAMES4.map((name, i) => i !== wrongAt), want: false }
            });
          }),
          T('line-find', '좌표가 주어진 점을 수직선에서 찾기', '①3', (d) => {
            // 수직선 위에 점을 나타내는 꼴(작도)을 고르기로 바꾸었다.
            // 틀린 점: 부호를 바꾼 곳, 정수 부분만큼 간 뒤 분수만큼 거꾸로 간 곳(−3/2을 −1에서 오른쪽으로 1/2 간 곳에 찍는 잘못), 한 칸(1)을 더 간 곳.
            const parts = d.pick([2, 3]), s = pm(d), m = d.int(1, 2), r = d.int(1, parts - 1), k = m * parts + r, t = s * k;
            const others = d.shuffle([-t, s * (k - 2 * r), -s * (k - 2 * r), s * (k + parts)]).slice(0, 3), all = [t].concat(others).sort((x, y) => x - y), v = Q(t, parts);
            return C(`수직선 위의 네 점 A, B, C, D 가운데 좌표가 ${tx(v)}인 점은?`, NAMES4, all.indexOf(t), {
              figure: nline(-4, 4, { parts, points: all.map((p, i) => ({ at: Q(p, parts), name: NAMES4[i] })) }),
              explain: `작은 눈금 한 칸은 ${frac(1, parts)}이다. 좌표가 ${tx(v)}인 점은 원점에서 ${s < 0 ? '왼쪽' : '오른쪽'}으로 작은 눈금 ${k}칸 간 곳에 있는 점 ${NAMES4[all.indexOf(t)]}이다.`,
              facts: { truth: all.map((p) => p === t), want: true }
            });
          }),
          T('line-mid', '수직선 위의 두 점에서 같은 거리에 있는 점의 좌표', '①4', (d) => {
            const [a, k] = d.until(() => [-d.int(1, 6), d.int(2, 5)], ([x, y]) => x + 2 * y > 0 && x + y !== 0), b = a + 2 * k, c = a + k;
            return N(`수직선 위의 두 점 A(${iq(a)}), B(${b})에서 같은 거리에 있는 점 C의 좌표는?`, c, {
              signed: true,
              explain: `두 점 A, B 사이의 거리는 ${minus(b, a)} = ${2 * k}이다. 점 C는 점 A에서 오른쪽으로 ${2 * k} ÷ 2 = ${k}만큼 떨어진 곳에 있으므로 좌표는 ${iq(a)} + ${k} = ${iq(c)}이다.`,
              facts: { value: `(${jx(a)}+${b})/2`, unseen: [2] }
            });
          }),
          T('line-places', '기준이 되는 곳을 정하여 위치를 좌표로 나타내기', '①5', (d) => {
            const names = ['입구', '매표소', '쉼터', '약수터', '전망대'], at = [0];
            for (let i = 1; i < 5; i += 1) at.push(at[i - 1] + d.int(1, 2));
            const ref = d.pick([1, 3]), co = at.map((v) => v - at[2]);
            return M(`어느 등산로의 안내판에 다섯 곳의 위치가 같은 간격의 눈금 위에 표시되어 있다. ${names[2]}의 위치를 O(0), ${names[ref]}의 위치를 A(${iq(co[ref])})로 나타낼 때, ${names[0]}와 ${names[4]}의 위치의 좌표는?`,
              [{ label: names[0], answer: co[0], signed: true }, { label: names[4], answer: co[4], signed: true }], {
                figure: placeLine(names.map((name, i) => ({ name, at: at[i] })), names[2]),
                explain: `${names[ref]}가 ${names[2]}에서 ${ref === 1 ? '왼쪽' : '오른쪽'}으로 ${Math.abs(co[ref])}칸 떨어진 곳에 있고 좌표가 ${iq(co[ref])}이므로 눈금 한 칸의 거리는 1이고, 오른쪽이 양의 방향이다. ${names[0]}는 ${names[2]}에서 왼쪽으로 ${-co[0]}칸 떨어져 있으므로 좌표는 ${iq(co[0])}이고, ${names[4]}는 오른쪽으로 ${co[4]}칸 떨어져 있으므로 좌표는 ${co[4]}이다.`,
                facts: { calc: [['-' + -co[0], 0], [String(co[4]), 1]] }
              });
          })
        ]
      },
      {
        id: 'point', title: '순서쌍과 좌표평면 위의 점', standard: STD5,
        types: [
          T('pair-equal', '두 순서쌍이 같을 때 문자의 값 구하기(자리끼리 바로 견주기)', '①6', (d) => {
            const a = nz(d, -5, 6), p = nz(d, -4, 4), c = d.pick([-1, 2, -2, 3]), b = nz(d, -4, 4), q = c * b, r = a + p;
            return M(`두 순서쌍 ${nb('(' + lin(1, p, va) + ', ' + iq(q) + ')')}, ${nb('(' + iq(r) + ', ' + poly([[c, vb]]) + ')')}가 서로 같을 때, ${va}, ${vb}의 값은?`, [{ label: 'a', answer: a, signed: true }, { label: 'b', answer: b, signed: true }], {
              explain: `두 순서쌍이 서로 같으면 앞의 수끼리, 뒤의 수끼리 같다. ${lin(1, p, va)} = ${iq(r)}에서 ${va} = ${iq(a)}이고, ${poly([[c, vb]])} = ${iq(q)}에서 ${vb} = ${iq(b)}이다.`,
              facts: { calc: [[`${jx(r)}-${jx(p)}`, 0], [`${jx(q)}/${jx(c)}`, 1]], unseen: [1], rule: 'pair-direct' }
            });
          }),
          T('pair-solve', '두 순서쌍이 같을 때 문자의 값 구하기(일차방정식 풀기)', '①7 심1', (d, n) => {
            // 첫째는 두 자리 모두 양쪽에 문자가 있다. 둘째는 앞자리에서 구한 a 의 값을 뒷자리에 넣어 b 의 값을 구한다.
            const ask = ` 서로 같을 때, ${va}, ${vb}의 값은?`, inputs = (a, b) => [{ label: 'a', answer: a, signed: true }, { label: 'b', answer: b, signed: true }];
            if (n === 0) {
              const a = nz(d, -4, 4), b = nz(d, -4, 4);
              const [m1, m2, p1, p2] = d.until(() => { const x = d.int(2, 4), y = d.pick([-2, -1, 1]), p = nz(d, -6, 6); return [x, y, p, (x - y) * a + p]; }, (v) => v[3] !== 0 && Math.abs(v[3]) <= 12);
              const [n1, n2, s1, s2] = d.until(() => { const x = d.pick([1, 2]), y = d.pick([-2, -1, 3]), s = nz(d, -6, 6); return [x, y, s, (x - y) * b + s]; }, (v) => v[3] !== 0 && Math.abs(v[3]) <= 12);
              return M(`두 순서쌍 ${nb('(' + lin(m1, p1, va) + ', ' + lin(n1, s1, vb) + ')')}, ${nb('(' + lin(m2, p2, va) + ', ' + lin(n2, s2, vb) + ')')}${tail(Math.abs(s2), '이/가')}${ask}`, inputs(a, b), {
                explain: `앞의 수끼리 같으므로 ${lin(m1, p1, va)} = ${lin(m2, p2, va)}, ${poly([[m1 - m2, va]])} = ${iq(p2 - p1)}, ${va} = ${iq(a)}이다. 뒤의 수끼리 같으므로 ${lin(n1, s1, vb)} = ${lin(n2, s2, vb)}, ${poly([[n1 - n2, vb]])} = ${iq(s2 - s1)}, ${vb} = ${iq(b)}이다.`,
                facts: { calc: [[`(${jx(p2)}-${jx(p1)})/(${jx(m1)}-${jx(m2)})`, 0], [`(${jx(s2)}-${jx(s1)})/(${jx(n1)}-${jx(n2)})`, 1]], unseen: [1], rule: 'pair-both-sides' }
              });
            }
            const a = nz(d, -3, 4), m = d.int(2, 3), p = nz(d, -5, 5), r = m * a + p, k = d.int(2, 3), t = nz(d, -5, 5);
            const s = d.until(() => nz(d, -4, 4), (v) => k * a + t - v !== 0), b = k * a + t - s;
            return M(`두 순서쌍 ${nb('(' + lin(m, p, va) + ', ' + lin(1, s, vb) + ')')}, ${nb('(' + iq(r) + ', ' + lin(k, t, va) + ')')}${tail(Math.abs(t), '이/가')}${ask}`, inputs(a, b), {
              explain: `앞의 수끼리 같으므로 ${lin(m, p, va)} = ${iq(r)}, ${poly([[m, va]])} = ${iq(r - p)}, ${va} = ${iq(a)}이다. 뒤의 수끼리 같으므로 ${lin(1, s, vb)} = ${lin(k, t, va)}이고, ${va} = ${iq(a)}${tail(Math.abs(a), '을/를')} 넣으면 ${lin(1, s, vb)} = ${iq(k * a + t)}, ${vb} = ${iq(b)}이다.`,
              facts: { calc: [[`(${jx(r)}-${jx(p)})/${m}`, 0], [`${k}*(${jx(r)}-${jx(p)})/${m}+${jx(t)}-${jx(s)}`, 1]], rule: 'pair-chain' }
            });
          }, { count: 2 }),
          T('pair-abs', '절댓값이 주어진 두 수로 만든 순서쌍 가리기', '①8 심2', (d) => {
            // 틀린 보기는 두 수의 자리를 바꾼 순서쌍 하나뿐이다. 음수가 든 순서쌍은 모두 될 수 있다.
            const [A, Bv] = d.until(() => [d.int(1, 6), d.int(1, 6)], ([x, y]) => x !== y);
            const good = d.shuffle([[A, Bv], [A, -Bv], [-A, Bv], [-A, -Bv]]).slice(0, 3), bad = [pm(d) * Bv, pm(d) * A], rows = d.shuffle(good.concat([bad]));
            return C(`|${va}| = ${A}, |${vb}| = ${Bv}일 때, 다음 중 순서쌍 ${nb('(' + va + ', ' + vb + ')')}가 될 수 없는 것은?`, rows.map(([x, y]) => pt(x, y)), rows.indexOf(bad), {
              explain: `|${va}| = ${A}이므로 ${va}의 값은 ${A} 또는 ${iq(-A)}이고, |${vb}| = ${Bv}이므로 ${vb}의 값은 ${Bv} 또는 ${iq(-Bv)}이다. 순서쌍 ${nb('(' + va + ', ' + vb + ')')}는 ${pt(A, Bv)}, ${pt(A, -Bv)}, ${pt(-A, Bv)}, ${pt(-A, -Bv)}의 4개이다. ${ptj(bad[0], bad[1], '은/는')} 두 수의 순서가 바뀌었다.`,
              facts: { truth: rows.map(([x, y]) => Math.abs(x) === A && Math.abs(y) === Bv), want: false }
            });
          }),
          T('point-read', '좌표평면 위의 점의 좌표 읽기', '①9 교115', (d, n) => {
            // 첫째는 사분면 위의 점, 둘째는 좌표축 위의 점(0을 어느 자리에 적는가).
            if (n === 0) {
              const qs = d.shuffle([0, 1, 2, 3]).slice(0, 3), pts = d.until(() => qs.map((q) => inQuad(d, q)), (list) => allFar(list) && list.every(([x, y]) => Math.abs(x) !== Math.abs(y)));
              const at = d.int(0, 2), [x, y] = pts[at], name = NAMES4[at];
              return pointAns(`좌표평면 위의 점 ${name}의 좌표는?`, x, y, {
                figure: plane({ points: pts.map(([px, py], i) => dot(NAMES4[i], px, py)) }),
                explain: `점 ${name}에서 ${XA}, ${YA}에 각각 수선을 그으면 ${XA}과는 ${iq(x)}${tail(Math.abs(x), '을/를')} 나타내는 점에서, ${YA}과는 ${iq(y)}${tail(Math.abs(y), '을/를')} 나타내는 점에서 만난다. ${XC}는 ${iq(x)}, ${YC}는 ${iq(y)}이므로 ${P(name, x, y)}이다.`,
                facts: { calc: [[jx(x), 0], [jx(y), 1]], rule: 'read-quadrant' }
              });
            }
            const onX = d.bool(), k = nz(d, -4, 4), [x, y] = onX ? [k, 0] : [0, k];
            const others = d.until(() => [inQuad(d, d.int(0, 3)), onX ? [0, nz(d, -4, 4)] : [nz(d, -4, 4), 0]], (list) => allFar(list.concat([[x, y]]))), pts = d.shuffle([[x, y]].concat(others)), name = NAMES4[pts.findIndex((p) => p[0] === x && p[1] === y)];
            return pointAns(`좌표평면 위의 점 ${name}의 좌표는?`, x, y, {
              figure: plane({ points: pts.map(([px, py], i) => dot(NAMES4[i], px, py)) }),
              explain: `점 ${name}는 ${onX ? XA : YA} 위에 있으므로 ${onX ? YC : XC}가 0이다. ${onX ? XC : YC}는 ${iq(k)}이므로 ${P(name, x, y)}이다.`,
              facts: { calc: [[jx(x), 0], [jx(y), 1]], unseen: [0], rule: 'read-axis' }
            });
          }, { count: 2 }),
          T('point-match', '좌표평면 위의 점과 좌표의 짝 가리기', '①10 심3', (d, n) => {
            // 첫째는 옳은 것 하나, 둘째는 옳지 않은 것 하나. 틀린 짝: x좌표와 y좌표의 자리를 바꾼 것, 부호 하나를 바꾼 것, 좌표축 위의 점을 다른 축 위의 점으로 적은 것.
            const wantTrue = n === 0, qs = d.shuffle([0, 1, 2, 3]).slice(0, 3);
            const pts = d.shuffle(d.until(() => qs.map((q) => inQuad(d, q)).concat([d.bool() ? [nz(d, -4, 4), 0] : [0, nz(d, -4, 4)]]), (list) => allFar(list) && list.every(([x, y]) => Math.abs(x) !== Math.abs(y))));
            const slip = ([x, y], i) => (x === 0 || y === 0 ? [y, x] : i % 2 ? [y, x] : d.bool() ? [-x, y] : [x, -y]);
            const at = d.int(0, 3), said = pts.map((p, i) => ((i === at) === wantTrue ? p : slip(p, i)));
            return C(`좌표평면 위의 네 점 A, B, C, D의 좌표를 나타낸 것으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, said.map(([x, y], i) => P(NAMES4[i], x, y)), at, {
              figure: plane({ points: pts.map(([x, y], i) => dot(NAMES4[i], x, y)) }),
              explain: `네 점의 좌표는 ${pts.map(([x, y], i) => P(NAMES4[i], x, y)).join(', ')}이다. 좌표는 ${XC}를 먼저, ${YC}를 나중에 적는다.`,
              facts: { truth: said.map(([x, y], i) => x === pts[i][0] && y === pts[i][1]), want: wantTrue }
            });
          }, { count: 2 }),
          T('point-claims', '좌표평면 위의 점에 대한 설명 가리기', '①11', (d) => {
            // 틀린 설명: x좌표를 y좌표로 읽은 것, 좌표축을 거꾸로 댄 것, 좌표축 위의 점의 0이 아닌 좌표를 0이라 한 것, 원점의 좌표와 견준 크기를 거꾸로 말한 것.
            const onX = d.bool(), on = onX ? vx : vy, off = onX ? vy : vx, [qa, qc] = d.shuffle([0, 1, 2, 3]);
            const [a, c, k] = d.until(() => [inQuad(d, qa), inQuad(d, qc), nz(d, -4, 4)], ([p, q, v]) => allFar([p, q, onX ? [v, 0] : [0, v]]) && p[0] !== p[1] && q[0] !== q[1]), b = onX ? [k, 0] : [0, k];
            const yes = [`점 B의 ${off}좌표는 원점의 ${off}좌표와 같다.`, `점 B는 ${on}축 위의 점이다.`, `점 A의 ${XC}는 ${iq(a[0])}이다.`, `점 C의 ${YC}는 ${iq(c[1])}이다.`];
            const no = [`점 A의 ${YC}는 ${iq(a[0])}이다.`, `점 B는 ${off}축 위의 점이다.`, `점 B의 ${on}좌표는 0이다.`, `점 C의 ${XC}는 ${iq(c[1])}이다.`, `점 C의 ${YC}는 원점의 ${YC}보다 ${c[1] < 0 ? '크다' : '작다'}.`];
            const rows = d.shuffle([[d.pick(yes), true]].concat(d.shuffle(no).slice(0, 3).map((s) => [s, false])));
            return C('좌표평면 위의 세 점 A, B, C에 대한 설명으로 옳은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: plane({ points: [dot('A', a[0], a[1]), dot('B', b[0], b[1]), dot('C', c[0], c[1])] }),
              explain: `세 점의 좌표는 ${P('A', a[0], a[1])}, ${P('B', b[0], b[1])}, ${P('C', c[0], c[1])}이다. 점 B는 ${on}축 위의 점이므로 ${off}좌표가 0이고, 원점의 좌표는 (0, 0)이다.`,
              facts: { truth: rows.map((r) => r[1]), want: true }
            });
          }),
          T('point-find', '좌표가 주어진 점을 좌표평면에서 찾기', '①12', (d) => {
            // 좌표평면 위에 점을 나타내는 꼴(작도)을 고르기로 바꾸었다. 틀린 점: x좌표와 y좌표의 자리를 바꾼 곳, x좌표의 부호를 바꾼 곳, y좌표의 부호를 바꾼 곳.
            const [x, y] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([p, q]) => Math.abs(p) !== Math.abs(q) && allFar([[p, q], [q, p], [-p, q], [p, -q]]));
            const pts = d.shuffle([[x, y], [y, x], [-x, y], [x, -y]]), at = pts.findIndex((p) => p[0] === x && p[1] === y);
            return C(`좌표평면 위의 네 점 A, B, C, D 가운데 좌표가 ${pt(x, y)}인 점은?`, NAMES4, at, {
              figure: plane({ points: pts.map(([px, py], i) => dot(NAMES4[i], px, py)) }),
              explain: `좌표가 ${pt(x, y)}인 점은 ${XC}가 ${iq(x)}, ${YC}가 ${iq(y)}인 점이다. 원점에서 ${x > 0 ? '오른쪽' : '왼쪽'}으로 ${Math.abs(x)}칸, ${y > 0 ? '위쪽' : '아래쪽'}으로 ${Math.abs(y)}칸 간 곳에 있는 점 ${NAMES4[at]}이다.`,
              facts: { truth: pts.map((p, i) => i === at), want: true }
            });
          }),
          T('point-letters', '좌표를 차례로 따라가며 점에 적힌 글자 읽기', '심4', (d) => {
            // 그림에는 좌표의 자리를 바꾼 곳과 부호를 바꾼 곳에도 글자가 있다. 틀린 보기는 한 좌표를 그렇게 잘못 읽은 것이다.
            const cand = () => [nz(d, -4, 4), nz(d, -4, 4)];
            const pts = d.until(() => { const t = [cand(), cand(), cand()]; return t.concat([[t[0][1], t[0][0]], [-t[1][0], t[1][1]], [t[2][1], t[2][0]]]); }, (list) => allFar(list));
            const marks = d.shuffle(['가', '나', '다', '라', '마', '바', '사', '아']).slice(0, 6), word = (list) => list.map((i) => marks[i]).join('');
            const rows = d.shuffle([[0, 1, 2], [3, 1, 2], [0, 4, 2], [0, 1, 5]]), at = rows.findIndex((r) => r.join() === '0,1,2');
            return C('다음 좌표가 나타내는 점에 적힌 글자를 차례로 읽으면?', rows.map(word), at, {
              figure: lines([pts.slice(0, 3).map(([x, y]) => pt(x, y)).join(' → ')]) + plane({ points: pts.map(([x, y], i) => dot(marks[i], x, y)) }),
              explain: `좌표는 ${XC}를 먼저, ${YC}를 나중에 적는다. 좌표가 ${pts.slice(0, 3).map(([x, y], i) => `${pt(x, y)}인 점에는 「${marks[i]}」`).join(', ')}가 적혀 있다.`,
              facts: { truth: rows.map((r, i) => i === at), want: true }
            });
          }),
          T('point-clue', '단서에 맞는 점을 좌표평면에서 찾기', '①14', (d) => {
            // 틀린 점: 차는 맞지만 x좌표가 더 작은 곳(자리를 바꾼 곳), 차는 맞지만 합이 양수인 곳, 합은 음수이지만 차가 다른 곳.
            const k = d.int(2, 5), ok = ([x, y]) => x + y < 0 && x - y === k;
            const pts = d.until(() => { const x = d.int(-3, 2), y = x - k, other = [d.int(-4, 4), d.int(-4, 4)]; return [[x, y], [y, x], [-y, -x], other]; },
              (list) => list.every(([x, y]) => Math.abs(x) <= 4 && Math.abs(y) <= 4) && allFar(list) && ok(list[0]) && list.slice(1).every((p) => !ok(p)) && list[3][0] + list[3][1] < 0 && list[3][0] > list[3][1]);
            const rows = d.shuffle(pts), at = rows.findIndex(ok);
            return C(`좌표평면 위의 네 점 A, B, C, D 가운데 다음 단서에 맞는 점은?`, NAMES4, at, {
              figure: lines([`${XC}와 ${YC}의 합은 음수이고, ${XC}가 ${YC}보다 ${k}만큼 크다.`]) + plane({ points: rows.map(([x, y], i) => dot(NAMES4[i], x, y)) }),
              explain: `네 점의 좌표는 ${rows.map(([x, y], i) => P(NAMES4[i], x, y)).join(', ')}이다. 이 가운데 ${XC}와 ${YC}의 합이 음수이고 ${XC}가 ${YC}보다 ${k}만큼 큰 점은 ${P(NAMES4[at], rows[at][0], rows[at][1])}이다.`,
              facts: { truth: rows.map(ok), want: true }
            });
          }),
          T('point-rect', '직사각형의 나머지 꼭짓점의 좌표', '①15 심26', (d) => {
            const [x1, x2, y1, y2] = d.until(() => [nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5)], (v) => v[1] - v[0] >= 3 && v[3] - v[2] >= 3 && v[1] - v[0] !== v[3] - v[2]);
            return pointAns(`네 점 ${P('A', x2, y2)}, ${P('B', x1, y2)}, ${P('C', x1, y1)}, D를 꼭짓점으로 하는 사각형 ABCD가 직사각형일 때, 점 D의 좌표는?`, x2, y1, {
              explain: `두 점 A, B는 ${YC}가 같으므로 변 AB는 ${XA}에 평행하고, 두 점 B, C는 ${XC}가 같으므로 변 BC는 ${YA}에 평행하다. 점 D는 점 A와 ${XC}가 같고 점 C와 ${YC}가 같으므로 ${P('D', x2, y1)}이다.`,
              facts: { calc: [[jx(x2), 0], [jx(y1), 1]] }
            });
          })
        ]
      },
      {
        id: 'axis', title: '축 위의 점', standard: STD5,
        types: [
          T('axis-say', '말로 준 좌표축 위의 점의 좌표 쓰기', '①16', (d) => {
            const onX = d.bool(), k = nz(d, -8, 8), on = onX ? vx : vy, off = onX ? vy : vx;
            return pointAns(`${on}축 위에 있고 ${on}좌표가 ${iq(k)}인 점의 좌표는?`, onX ? k : 0, onX ? 0 : k, {
              explain: `${on}축 위의 점은 ${off}좌표가 0이다. ${on}좌표가 ${iq(k)}이므로 이 점의 좌표는 ${onX ? pt(k, 0) : pt(0, k)}이다.`,
              facts: { calc: [[onX ? jx(k) : '0', 0], [onX ? '0' : jx(k), 1]], unseen: [0] }
            });
          }),
          T('axis-letter', '좌표축 위의 점의 좌표에 든 문자의 값 구하기(한 좌표에만 문자)', '①17', (d) => {
            const p = nz(d, -6, 6), q = nz(d, -6, 6), s = nz(d, -6, 6), t = nz(d, -6, 6), minusB = d.bool();
            // P(p, a + s)는 x축 위, Q(t − b, q) 또는 Q(b + t, q)는 y축 위
            const qx = minusB ? poly([[-1, vb], [t, '']]) : lin(1, t, vb), b = minusB ? t : -t;
            return M(`점 ${nb('P(' + iq(p) + ', ' + lin(1, s, va) + ')')}${tail(Math.abs(s), '은/는')} ${XA} 위의 점이고 점 ${nb('Q(' + qx + ', ' + iq(q) + ')')}${tail(Math.abs(q), '은/는')} ${YA} 위의 점일 때, ${va}, ${vb}의 값은?`, [{ label: 'a', answer: -s, signed: true }, { label: 'b', answer: b, signed: true }], {
              explain: `${XA} 위의 점은 ${YC}가 0이므로 ${lin(1, s, va)} = 0, ${va} = ${iq(-s)}이다. ${YA} 위의 점은 ${XC}가 0이므로 ${qx} = 0, ${vb} = ${iq(b)}이다.`,
              facts: { calc: [[`0-${jx(s)}`, 0], [minusB ? jx(t) : `0-${jx(t)}`, 1]], unseen: [0] }
            });
          }),
          T('axis-both', '두 좌표에 모두 문자가 든 점이 좌표축 위에 있을 때', '①17 심8', (d, n) => {
            // 어느 좌표를 0으로 둘지 가려야 한다. 첫째는 문자의 값을, 둘째는 그 점의 좌표를 묻는다.
            if (n === 0) {
              const onX = d.bool(), a = nz(d, -5, 5), m = d.int(2, 4), p = nz(d, -7, 7), on = onX ? vx : vy, off = onX ? vy : vx;
              // 0이 되어야 하는 좌표가 a − a0, 다른 좌표가 ma + p
              const zero = lin(1, -a, va), other = lin(m, p, va);
              return N(`점 ${nb('A(' + (onX ? other : zero) + ', ' + (onX ? zero : other) + ')')}${tail(Math.abs(onX ? a : p), '이/가')} ${on}축 위의 점일 때, ${va}의 값은?`, a, {
                signed: true,
                explain: `${on}축 위의 점은 ${off}좌표가 0이다. ${zero} = 0이므로 ${va} = ${iq(a)}이다.`,
                facts: { value: `0-${jx(-a)}`, unseen: [0], rule: 'axis-value' }
              });
            }
            const onX = d.bool(), m = d.int(2, 3), b = nz(d, -4, 4), u = d.until(() => nz(d, -6, 6), (v) => b + v !== 0), on = onX ? vx : vy, off = onX ? vy : vx;
            // 0이 되어야 하는 좌표가 mb − mb0, 다른 좌표가 b + u
            const zero = lin(m, -m * b, vb), other = lin(1, u, vb), k = b + u;
            return pointAns(`점 ${nb('B(' + (onX ? other : zero) + ', ' + (onX ? zero : other) + ')')}${tail(Math.abs(onX ? m * b : u), '이/가')} ${on}축 위의 점일 때, 점 B의 좌표는?`, onX ? k : 0, onX ? 0 : k, {
              explain: `${on}축 위의 점은 ${off}좌표가 0이다. ${zero} = 0에서 ${vb} = ${iq(b)}이다. 이때 ${on}좌표는 ${other} = ${iq(k)}이므로 ${onX ? P('B', k, 0) : P('B', 0, k)}이다.`,
              facts: { calc: [[onX ? `${jx(m * b)}/${m}+${jx(u)}` : '0', 0], [onX ? '0' : `${jx(m * b)}/${m}+${jx(u)}`, 1]], unseen: [0], rule: 'axis-point' }
            });
          }, { count: 2 })
        ]
      },
      {
        id: 'quad', title: '사분면', standard: STD5,
        types: [
          T('quad-name', '수로 된 점이 속하는 사분면 말하기', '①18 교116', (d, n) => {
            // 첫째는 사분면 위의 점(좌표에 소수나 분수가 낀다), 둘째는 좌표축 위의 점. 보기는 두 문항 모두 다섯 개다.
            const options = QN.concat([NONE]), ask = (h, last) => `점 ${nb(h)}${tail(last, '은/는')} 어느 사분면 위의 점인가?`;
            if (n === 0) {
              const q = d.int(0, 3), num = () => (d.bool() ? Q(d.int(1, 6)) : d.bool() ? dc(d.until(() => d.int(11, 59), (t) => t % 10 !== 0)) : Q(d.pick([1, 3, 5, 7]), d.pick([2, 4])));
              const [x, y] = d.until(() => [num(), num()], ([p, r]) => p.q !== 1 || r.q !== 1 || p.d || r.d).map((v, i) => (QS[q][i] < 0 ? Object.assign(Q(-v.p, v.q), v.d ? { d: v.d } : {}) : v));
              return C(ask('(' + tx(x) + ', ' + tx(y) + ')', lastOf(y)), options, q, {
                explain: `${XC}가 ${signWord(QS[q][0])}, ${YC}가 ${signWord(QS[q][1])}이므로 ${QN[q]} 위의 점이다.`,
                facts: { truth: options.map((_, i) => i === q), want: true, rule: 'quad-inside' }
              });
            }
            const onX = d.bool(), k = nz(d, -7, 7), [x, y] = onX ? [k, 0] : [0, k];
            return C(ask('(' + iq(x) + ', ' + iq(y) + ')', Math.abs(y)), options, 4, {
              explain: `${onX ? YC : XC}가 0이므로 ${onX ? XA : YA} 위의 점이다. 좌표축 위의 점은 어느 사분면에도 속하지 않는다.`,
              facts: { truth: options.map((_, i) => i === 4), want: true, rule: 'quad-on-axis' }
            });
          }, { count: 2 }),
          T('quad-pick', '정해진 사분면 위의 점 고르기', '①19', (d, n) => {
            // 첫째는 좌표로, 둘째는 좌표평면의 그림으로 준다.
            // 틀린 보기: 그 사분면에 닿아 있는 좌표축 위의 점, 다른 사분면 위의 점.
            const q = d.int(0, 3), [sx, sy] = QS[q], right = [sx * d.int(1, 6), sy * d.int(1, 6)];
            if (n === 1) {
              const rest = d.shuffle([0, 1, 2, 3].filter((v) => v !== q)), pts = d.shuffle(d.until(() => [inQuad(d, q), inQuad(d, rest[0]), inQuad(d, rest[1]), d.bool() ? [sx * d.int(1, 4), 0] : [0, sy * d.int(1, 4)]], allFar)), at = pts.findIndex(([x, y]) => quadOf(x, y) === q);
              return C(`좌표평면 위의 네 점 A, B, C, D 가운데 ${QN[q]} 위의 점은?`, NAMES4, at, {
                figure: plane({ points: pts.map(([x, y], i) => dot(NAMES4[i], x, y)) }),
                explain: `네 점의 좌표는 ${pts.map(([x, y], i) => P(NAMES4[i], x, y)).join(', ')}이다. ${QN[q]} 위의 점은 ${XC}가 ${signWord(sx)}이고 ${YC}가 ${signWord(sy)}인 점 ${NAMES4[at]}이다. 좌표축 위의 점은 어느 사분면에도 속하지 않는다.`,
                facts: { truth: pts.map(([x, y]) => quadOf(x, y) === q), want: true }
              });
            }
            const other = d.until(() => [d.pick([-1, 1]) * d.int(1, 6), d.pick([-1, 1]) * d.int(1, 6)], ([x, y]) => quadOf(x, y) !== q);
            const rows = d.shuffle([right, [sx * d.int(1, 6), 0], [0, sy * d.int(1, 6)], other]);
            return C(`다음 중 ${QN[q]} 위의 점은?`, rows.map(([x, y]) => pt(x, y)), rows.indexOf(right), {
              explain: `${QN[q]} 위의 점은 ${XC}가 ${signWord(sx)}이고 ${YC}가 ${signWord(sy)}이다. ${XC}나 ${YC}가 0인 점은 좌표축 위의 점이므로 어느 사분면에도 속하지 않는다. ${QN[q]} 위의 점은 ${pt(right[0], right[1])}이다.`,
              facts: { truth: rows.map(([x, y]) => quadOf(x, y) === q), want: true }
            });
          }, { count: 2 }),
          T('quad-none-count', '어느 사분면에도 속하지 않는 점의 개수', '①20', (d) => {
            const k = d.int(2, 4), inside = () => [nz(d, -7, 7), nz(d, -7, 7)], axis = () => [[0, 0], [nz(d, -7, 7), 0], [0, nz(d, -7, 7)], [nz(d, -7, 7), 0]].slice(0, k);
            const list = d.until(() => d.shuffle(axis().concat(Array.from({ length: 6 - k }, inside))), (rows) => new Set(rows.map(String)).size === 6), flags = list.map(([x, y]) => quadOf(x, y) === 4);
            return N('다음 점 가운데 어느 사분면에도 속하지 않는 점은 모두 몇 개인가?', k, {
              unit: '개', figure: numbers(list.map(([x, y]) => pt(x, y))),
              explain: `좌표축 위의 점은 어느 사분면에도 속하지 않는다. ${XC}나 ${YC}가 0인 점은 ${list.filter((p, i) => flags[i]).map(([x, y]) => pt(x, y)).join(', ')}의 ${k}개이다.`,
              facts: { count: flags }
            });
          }),
          T('quad-cannot', '사분면 조건에서 좌표가 될 수 없는 값 고르기', '①21', (d) => {
            // 0이 양수도 음수도 아님을 놓치는 아이가 걸린다(0이면 그 점은 좌표축 위에 있다).
            const q = d.int(0, 3), freeY = d.bool(), s = QS[q][freeY ? 1 : 0], p = QS[q][freeY ? 0 : 1] * d.int(1, 6);
            const vals = d.shuffle([Q(s * d.int(1, 8)), dc(s * d.until(() => d.int(3, 49), (t) => t % 10 !== 0)), Q(s * d.pick([1, 3, 5]), 2), Q(0)]), h = freeY ? `(${iq(p)}, ${va})` : `(${va}, ${iq(p)})`;
            return C(`점 ${nb(h)}${freeY ? '가' : tail(Math.abs(p), '이/가')} ${QN[q]} 위의 점일 때, 다음 중 ${va}의 값이 될 수 없는 것은?`, vals.map(tx), vals.findIndex((v) => v.p === 0), {
              explain: `${QN[q]} 위의 점은 ${freeY ? YC : XC}가 ${signWord(s)}이다. 0은 ${signWord(s)}가 아니므로 ${va}의 값이 될 수 없다. ${va} = 0이면 이 점은 ${freeY ? XA : YA} 위의 점이 되어 어느 사분면에도 속하지 않는다.`,
              facts: { truth: vals.map((v) => Math.sign(v.p) === s), want: false }
            });
          }),
          T('quad-abs', '절댓값과 사분면으로 점의 좌표 정하기', '①22', (d) => {
            const q = d.int(1, 3), A = d.int(2, 9), Bv = d.until(() => d.int(2, 9), (v) => v !== A), [sx, sy] = QS[q];
            return M(`|${va}| = ${A}, |${vb}| = ${Bv}이고 점 ${nb('(' + va + ', ' + vb + ')')}가 ${QN[q]} 위의 점일 때, ${va}, ${vb}의 값은?`, [{ label: 'a', answer: sx * A, signed: true }, { label: 'b', answer: sy * Bv, signed: true }], {
              explain: `${QN[q]} 위의 점은 ${XC}가 ${signWord(sx)}, ${YC}가 ${signWord(sy)}이다. |${va}| = ${A}이고 ${cmp0(va, sx)}이므로 ${va} = ${iq(sx * A)}, |${vb}| = ${Bv}이고 ${cmp0(vb, sy)}이므로 ${vb} = ${iq(sy * Bv)}이다.`,
              facts: { calc: [[(sx < 0 ? '-' : '') + A, 0], [(sy < 0 ? '-' : '') + Bv, 1]] }
            });
          }),
          T('quad-sign', '두 문자의 부호를 알 때 식으로 된 점의 사분면', '①23', (d) => {
            const sa = pm(d), sb = pm(d), viaMinus = d.bool(), cond = `${cmp0(va, sa)}, ${viaMinus ? cmp0(MINUS + vb, -sb) : cmp0(vb, sb)}`;
            const [k1, k2] = d.pick(exPairs(sa, sb).filter(([x, y]) => [x, y].some((k) => k === 'ab' || k === 'nab') && ![x, y].some((k) => /amb|bma|apb/.test(k))));
            return quadQ(`${cond}일 때, 점 ${nb('P' + exPoint(k1, k2))}는 제몇 사분면 위의 점인가?`, exQuad(k1, k2, sa, sb), `${viaMinus ? `${cmp0(MINUS + vb, -sb)}이므로 ${cmp0(vb, sb)}이다. ` : ''}${cmp0(va, sa)}, ${cmp0(vb, sb)}이다. ${exTold(k1, k2, sa, sb, 'P')}`);
          }),
          T('quad-swap', '점 (a, b)의 사분면을 알 때 자리나 부호를 바꾼 점의 사분면', '①24 교124', (d) => {
            const q = d.int(0, 3), [sa, sb] = QS[q], [k1, k2] = d.pick([['b', 'a'], ['na', 'b'], ['a', 'nb'], ['na', 'nb'], ['b', 'na'], ['nb', 'a']]);
            return quadQ(`점 ${nb('P(' + va + ', ' + vb + ')')}가 ${QN[q]} 위의 점일 때, 점 ${nb('Q' + exPoint(k1, k2))}는 제몇 사분면 위의 점인가?`, exQuad(k1, k2, sa, sb), `점 P가 ${QN[q]} 위의 점이므로 ${cmp0(va, sa)}, ${cmp0(vb, sb)}이다. ${exTold(k1, k2, sa, sb, 'Q')}`);
          }),
          T('quad-expr', '점 (a, b)의 사분면을 알 때 합·차·곱으로 된 점의 사분면', '①25', (d) => {
            // 부호가 정해지는 식만 쓴다: 부호가 다르면 차 a − b, b − a, 부호가 같으면 합 a + b.
            const q = d.int(0, 3), [sa, sb] = QS[q];
            const [k1, k2] = d.pick(exPairs(sa, sb).filter(([x, y]) => [x, y].some((k) => /amb|bma|apb/.test(k)) && [x, y].every((k) => /amb|bma|apb|ab|^a$|^b$/.test(k))));
            return quadQ(`점 ${nb('P(' + va + ', ' + vb + ')')}가 ${QN[q]} 위의 점일 때, 점 ${nb('R' + exPoint(k1, k2))}는 제몇 사분면 위의 점인가?`, exQuad(k1, k2, sa, sb), `점 P가 ${QN[q]} 위의 점이므로 ${cmp0(va, sa)}, ${cmp0(vb, sb)}이다. ${sa !== sb ? `양수에서 음수를 빼면 양수이고, 음수에서 양수를 빼면 음수이다. ` : `부호가 같은 두 수의 합의 부호는 두 수의 부호와 같다. `}${exTold(k1, k2, sa, sb, 'R')}`);
          }),
          T('quad-expr-pick', '식으로 된 여러 점 가운데 정해진 사분면 위의 점 고르기', '심13 ①26', (d) => {
            const q = d.int(0, 3), [sa, sb] = QS[q], all = exPairs(sa, sb), want = d.pick([0, 1, 2, 3].filter((v) => all.some(([x, y]) => exQuad(x, y, sa, sb) === v)));
            const right = d.pick(all.filter(([x, y]) => exQuad(x, y, sa, sb) === want)), rows = d.shuffle([right].concat(d.shuffle(all.filter(([x, y]) => exQuad(x, y, sa, sb) !== want)).slice(0, 3)));
            return C(`점 ${nb('(' + va + ', ' + vb + ')')}가 ${QN[q]} 위의 점일 때, 다음 중 ${QN[want]} 위의 점은?`, rows.map(([x, y]) => exPoint(x, y)), rows.indexOf(right), {
              explain: `${cmp0(va, sa)}, ${cmp0(vb, sb)}이다. ${rows.map(([x, y]) => `${exPoint(x, y)}는 ${QN[exQuad(x, y, sa, sb)]}`).join(', ')} 위의 점이다.`,
              facts: { truth: rows.map(([x, y]) => exQuad(x, y, sa, sb) === want), want: true }
            });
          }),
          T('quad-same', '식으로 된 점과 같은 사분면 위에 있는 점 고르기', '심12', (d) => {
            // 틀린 보기: 그 사분면에 닿아 있는 좌표축 위의 점, 점 (a, b)가 있는 사분면 위의 점(식의 부호를 따지지 않은 것), 그 밖의 사분면 위의 점.
            const q = d.int(0, 3), [sa, sb] = QS[q];
            const [k1, k2] = d.pick(exPairs(sa, sb).filter(([x, y]) => [x, y].some((k) => k === 'ab' || k === 'nab') && ![x, y].some((k) => /amb|bma|apb/.test(k)) && exQuad(x, y, sa, sb) !== q)), w = exQuad(k1, k2, sa, sb);
            const third = d.pick([0, 1, 2, 3].filter((v) => v !== q && v !== w)), onX = d.bool();
            const rows = d.shuffle([inQuad(d, w, 1, 7), inQuad(d, q, 1, 7), inQuad(d, third, 1, 7), onX ? [QS[w][0] * d.int(1, 7), 0] : [0, QS[w][1] * d.int(1, 7)]]);
            return C(`점 ${nb('P(' + va + ', ' + vb + ')')}가 ${QN[q]} 위의 점일 때, 다음 중 점 ${nb('A' + exPoint(k1, k2))}와 같은 사분면 위에 있는 점은?`, rows.map(([x, y]) => pt(x, y)), rows.findIndex(([x, y]) => quadOf(x, y) === w), {
              explain: `${cmp0(va, sa)}, ${cmp0(vb, sb)}이다. ${exTold(k1, k2, sa, sb, 'A')} 보기 가운데 ${QN[w]} 위의 점은 ${rows.filter(([x, y]) => quadOf(x, y) === w).map(([x, y]) => pt(x, y))[0]}이다.`,
              facts: { truth: rows.map(([x, y]) => quadOf(x, y) === w), want: true }
            });
          }),
          T('quad-from-axis', '좌표축 위의 점 조건으로 문자의 값을 구해 만든 점의 사분면', '①17 심1', (d) => {
            const a = nz(d, -6, 6), b = nz(d, -6, 6), p = nz(d, -6, 6), q = nz(d, -6, 6);
            return quadQ(`점 ${nb('A(' + lin(1, -a, va) + ', ' + iq(p) + ')')}${tail(Math.abs(p), '은/는')} ${YA} 위의 점이고 점 ${nb('B(' + iq(q) + ', ' + lin(1, -b, vb) + ')')}${tail(Math.abs(b), '은/는')} ${XA} 위의 점일 때, 점 ${nb('(' + va + ', ' + vb + ')')}는 제몇 사분면 위의 점인가?`, quadOf(a, b),
              `${YA} 위의 점은 ${XC}가 0이므로 ${lin(1, -a, va)} = 0, ${va} = ${iq(a)}이다. ${XA} 위의 점은 ${YC}가 0이므로 ${lin(1, -b, vb)} = 0, ${vb} = ${iq(b)}이다. 점 ${ptj(a, b, '은/는')} ${XC}가 ${signWord(a)}, ${YC}가 ${signWord(b)}이므로 ${QN[quadOf(a, b)]} 위의 점이다.`);
          }),
          T('quad-facts', '좌표축과 사분면에 대한 설명의 참·거짓', '①13 심6·11', (d, n) => {
            // 첫째는 좌표축 위의 점과 순서쌍(옳은 것 고르기), 둘째는 사분면(옳지 않은 것 고르기)
            return n === 0 ? claimQ(d, '좌표평면 위의 점에 대한 설명으로 옳은 것은?', AXIS_TRUE, AXIS_FALSE, true) : claimQ(d, '사분면에 대한 설명으로 옳지 않은 것은?', QUAD_TRUE, QUAD_FALSE, false);
          }, { count: 2 })
        ]
      },
      {
        id: 'area', title: '좌표평면 위의 도형의 넓이', standard: STD5,
        types: [
          T('area-right', '두 변이 좌표축에 평행한 직각삼각형의 넓이', '①32', (d) => {
            const [xl, xr, yb, yt] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6), nz(d, -6, 6), nz(d, -6, 6)], (v) => v[1] - v[0] >= 2 && v[3] - v[2] >= 2 && ((v[1] - v[0]) * (v[3] - v[2])) % 2 === 0 && v[1] - v[0] !== v[3] - v[2]);
            const bx = d.pick([xl, xr]), by = d.pick([yb, yt]), ax = bx === xl ? xr : xl, cy = by === yb ? yt : yb, w = xr - xl, h = yt - yb;
            return N(`세 점 ${P('A', ax, by)}, ${P('B', bx, by)}, ${Pj('C', bx, cy, '을/를')} 꼭짓점으로 하는 삼각형 ABC의 넓이는?`, w * h / 2, {
              explain: `두 점 A, B는 ${YC}가 같으므로 변 AB는 ${XA}에 평행하고 길이는 ${minus(xr, xl)} = ${w}이다. 두 점 B, C는 ${XC}가 같으므로 변 BC는 ${YA}에 평행하고 길이는 ${minus(yt, yb)} = ${h}이다. 삼각형 ABC는 직각삼각형이므로 넓이는 ${frac(1, 2)} × ${w} × ${h} = ${w * h / 2}이다.`,
              facts: { value: `(${jx(xr)}-${jx(xl)})*(${jx(yt)}-${jx(yb)})/2`, unseen: [2] }
            });
          }),
          T('area-tri', '한 변만 좌표축에 평행한 삼각형의 넓이', '①33 심24', (d) => {
            // 밑변은 좌표축에 평행한 변, 높이는 나머지 꼭짓점에서 그 변까지의 거리(좌표의 차)이다. 그림에서 읽는다. 꼭짓점은 좌표축 위나 좌표가 −1인 곳에 두지 않는다(이름이 눈금 수와 겹친다).
            const upright = d.bool();
            const [c, lo, hi, far0, mid] = d.until(() => [nz(d, -4, 4), d.int(-4, -2), d.int(1, 4), nz(d, -4, 4), nz(d, -3, 3)], (v) => !v.includes(-1) && v[2] - v[1] >= 4 && Math.abs(v[3] - v[0]) >= 3 && v[4] > v[1] && v[4] < v[2] && ((v[2] - v[1]) * Math.abs(v[3] - v[0])) % 2 === 0);
            // 세로 밑변: B(c, lo), C(c, hi), A(far0, mid). 가로 밑변이면 x, y 를 바꾼다.
            const sw = ([x, y]) => (upright ? [x, y] : [y, x]), A = sw([far0, mid]), Bp = sw([c, lo]), Cp = sw([c, hi]), base = span(lo, hi), high = span(far0, c), area = base.len * high.len / 2;
            const cen = [(A[0] + Bp[0] + Cp[0]) / 3, (A[1] + Bp[1] + Cp[1]) / 3], side = ([x, y]) => (y >= cen[1] ? 'u' : 'd') + (x >= cen[0] ? 'r' : 'l');
            return N('그림과 같이 좌표평면 위의 세 점 A, B, C를 꼭짓점으로 하는 삼각형 ABC의 넓이는?', area, {
              figure: plane({ poly: [A, Bp, Cp], points: [['A', A], ['B', Bp], ['C', Cp]].map(([name, p]) => ({ x: p[0], y: p[1], name, side: side(p) })) }),
              explain: `세 점의 좌표는 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}, ${P('C', Cp[0], Cp[1])}이다. 변 BC는 ${upright ? YA : XA}에 평행하고 길이는 ${minus(hi, lo)} = ${base.len}이다. 점 A에서 변 BC까지의 거리는 ${minus(Math.max(far0, c), Math.min(far0, c))} = ${high.len}이므로 넓이는 ${frac(1, 2)} × ${base.len} × ${high.len} = ${area}이다.`,
              facts: { value: `${base.ex}*${high.ex}/2`, unseen: [0, 2], rule: 'tri-one-side' }
            });
          }),
          T('area-rect', '네 변이 좌표축에 평행한 직사각형의 넓이', '①34', (d) => {
            const [xl, xr, yb, yt] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6), nz(d, -6, 6), nz(d, -6, 6)], (v) => v[1] - v[0] >= 2 && v[3] - v[2] >= 2 && v[1] - v[0] !== v[3] - v[2]), w = xr - xl, h = yt - yb;
            return N(`네 점 ${P('A', xl, yt)}, ${P('B', xl, yb)}, ${P('C', xr, yb)}, ${Pj('D', xr, yt, '을/를')} 꼭짓점으로 하는 사각형 ABCD의 넓이는?`, w * h, {
              explain: `변 AB는 ${YA}에 평행하고 길이는 ${minus(yt, yb)} = ${h}, 변 BC는 ${XA}에 평행하고 길이는 ${minus(xr, xl)} = ${w}이다. 사각형 ABCD는 직사각형이므로 넓이는 ${w} × ${h} = ${w * h}이다.`,
              facts: { value: `(${jx(xr)}-${jx(xl)})*(${jx(yt)}-${jx(yb)})`, rule: 'rect' }
            });
          }),
          T('area-trap', '한 쌍의 변이 좌표축에 평행한 사다리꼴의 넓이', '①35 심27', (d) => {
            const upright = d.bool();
            // 평행한 두 변이 가로일 때: 윗변 A(t1, yt) ~ D(t2, yt), 아랫변 B(b1, yb) ~ C(b2, yb). 세로이면 x, y 를 바꾼다.
            const [t1, t2, b1, b2, yb, yt] = d.until(() => [nz(d, -4, 3), nz(d, -3, 4), nz(d, -4, 3), nz(d, -3, 4), d.int(-4, -2), d.int(1, 4)],
              (v) => !v.includes(-1) && v[1] - v[0] >= 2 && v[3] - v[2] >= 2 && v[1] - v[0] !== v[3] - v[2] && v[5] - v[4] >= 3 && ((v[1] - v[0] + v[3] - v[2]) * (v[5] - v[4])) % 2 === 0 && v[0] < v[3] && v[2] < v[1]);
            const sw = ([x, y]) => (upright ? [x, y] : [y, x]), pts = [[t1, yt], [b1, yb], [b2, yb], [t2, yt]].map(sw), top = span(t1, t2), low = span(b1, b2), high = span(yb, yt), area = (top.len + low.len) * high.len / 2;
            const cen = [pts.reduce((s, p) => s + p[0], 0) / 4, pts.reduce((s, p) => s + p[1], 0) / 4], side = ([x, y]) => (y >= cen[1] ? 'u' : 'd') + (x >= cen[0] ? 'r' : 'l');
            return N('그림과 같이 좌표평면 위의 네 점 A, B, C, D를 꼭짓점으로 하는 사각형 ABCD의 넓이는?', area, {
              figure: plane({ poly: pts, points: pts.map((p, i) => ({ x: p[0], y: p[1], name: NAMES4[i], side: side(p) })) }),
              explain: `네 점의 좌표는 ${pts.map((p, i) => P(NAMES4[i], p[0], p[1])).join(', ')}이다. 두 변 AD, BC는 ${upright ? XA : YA}에 평행하므로 사각형 ABCD는 사다리꼴이다. 변 AD의 길이는 ${top.len}, 변 BC의 길이는 ${low.len}, 높이는 ${high.len}이므로 넓이는 ${frac(1, 2)} × (${top.len} + ${low.len}) × ${high.len} = ${area}이다.`,
              facts: { value: `(${top.ex}+${low.ex})*${high.ex}/2`, unseen: [0, 2] }
            });
          })
        ]
      },
      { id: 'match', title: '상황에 맞는 그래프', standard: STD6, types: [] },
      { id: 'read', title: '그래프에서 값과 변화 읽기', standard: STD6, types: [] },
      { id: 'two', title: '두 그래프 견주기와 되풀이되는 변화', standard: STD6, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(7-1-5b.js, 7-1-5c.js)이 함께 쓰는 도구
  B.kit.m715 = {
    UNIT, STD5, STD6, sourceOf, T, va, vb, vx, vy, XA, YA, XC, YC, iq, jx, pt, P, ptj, Pj, minus, span, QN, NONE, quadOf, QS, signWord, cmp0, quadQ, EX, exPoint, exQuad, exWhy, exTold, exPairs,
    sideOf, dot, far, allFar, inQuad, NAMES4, figOpt, figChoice, mini, curve, r2, vessels, fillPts, drainPts, curved, heightOf, fillMini, flat, cone, dotPlot
  };
})(typeof window !== 'undefined' ? window : globalThis);
