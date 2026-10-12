// 중학교 1학년 2학기 5단원 자료의 정리와 해석 — 뒤쪽 묶음(히스토그램, 도수분포다각형, 상대도수와 그 분포표, 상대도수의 그래프와 두 집단의 비교).
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 7-2-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 그래프는 7-2-5a.js 의 chart 하나로 그린다(히스토그램 histFig, 도수분포다각형 polyFig, 둘을 겹친 bothFig, 상대도수 그래프 relFig, 두 집단 relFig2).
// 도수분포다각형을 바르게 그린 것을 고르는 문항의 작은 그림 넷은 이 파일의 miniPoly 로 그린다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, N, M, C, D } = B.kit;
  const { LAB, range, V, claimQ, f1 } = B.kit.mid;
  const { STD3, T, sum, fx, nj, amt, amtj, wj, pctOf, GC, freqs, grp, frameOf, newGrp, inside, introG, classOptions, ftab, chart, histFig, polyFig, bothFig, relFig, relFig2, rels, r2, pickClaim } = B.kit.m725;
  const uniqueMax = (f) => f.filter((v) => v === Math.max(...f)).length === 1, uniqueMin = (f) => f.filter((v) => v === Math.min(...f)).length === 1;
  // 둘째 분포가 첫째 분포보다 오른쪽으로 치우쳐 있는가: 어느 경계에서 끊어도 그 아래쪽의 비율이 첫째 분포에서 작지 않고, 두 곳 넘게 더 크다.
  const shifted = (a, b) => { const ta = sum(a), tb = sum(b); let more = 0; for (let j = 1; j < a.length; j += 1) { const x = sum(a.slice(0, j)) / ta, y = sum(b.slice(0, j)) / tb; if (x < y - 1e-9) return false; if (x > y + 1e-9) more += 1; } return more >= 2; };
  // 범위의 비율(%)이 자연수가 되는 총합
  const TOTALS = [20, 25, 40, 50];
  // 두 집단의 이름: 「1반 학생」「1반의 학생 수」처럼 쓴다. 학생 수가 서른 명 안팎이면 반·동아리(PAIRS), 쉰 명까지이면 동아리·마을(MID_PAIRS), 수백 명이면 학교·학년(BIG_PAIRS).
  const PAIRS = [['1반', '2반'], ['A 동아리', 'B 동아리']], MID_PAIRS = [['A 동아리', 'B 동아리'], ['가 마을', '나 마을']], BIG_PAIRS = [['A 중학교', 'B 중학교'], ['1학년', '2학년']];
  const WHERE = { '1반': '어느 학교 ', '1학년': '어느 중학교 ' };
  const pairLead = (names) => `${WHERE[names[0]] || ''}${wj(names[0], '과/와')} ${names[1]} 학생들`;
  // 학생 수를 밝혀 이끄는 말: 「어느 중학교 1학년 학생 200명과 2학년 학생 300명」
  const pairCount = (names, ta, tb) => `${WHERE[names[0]] || ''}${names[0]} 학생 ${ta}명과 ${names[1]} 학생 ${tb}명`;

  // 히스토그램 위에 꺾은선을 그린 작은 그림(바르게 그린 것 고르기). kind: good 윗변의 가운데 점을 잇고 양 끝을 한 계급 바깥의 가로축 위 점(바깥 계급의 가운데)에 이음 /
  //  edge 양 끝을 첫 막대의 왼쪽 아래 끝·마지막 막대의 오른쪽 아래 끝에 이음 / corner 윗변의 오른쪽 끝 점을 이음 / float 가로축에 잇지 않음
  function miniPoly(f, kind, label) {
    const k = f.length, cw = 19, L = 8, gap = 14, top = 18, gh = 8.5, n = Math.max(...f) + 1, base = top + n * gh, W = L + gap + k * cw + cw + 6, H = base + 8;
    const xb = (i) => L + gap + i * cw, xm = (i) => xb(i) + cw / 2, Y = (v) => base - v * gh;
    let out = '';
    for (let t = 0; t <= n; t += 1) out += `<line class="mb-gridline" x1="${L}" y1="${f1(base - t * gh)}" x2="${W - 4}" y2="${f1(base - t * gh)}"/>`;
    f.forEach((v, i) => { out += `<rect x="${f1(xb(i))}" y="${f1(Y(v))}" width="${cw}" height="${f1(v * gh)}" style="fill:#e6edf5;stroke:#1f2933;stroke-width:1"/>`; });
    out += `<line class="mb-axis" x1="${L}" y1="${top - 4}" x2="${L}" y2="${base}"/><line class="mb-axis" x1="${L}" y1="${base}" x2="${W - 4}" y2="${base}"/>`;
    const mids = f.map((v, i) => [xm(i), Y(v)]);
    const pts = kind === 'good' ? [[xm(-1), base]].concat(mids, [[xm(k), base]]) : kind === 'edge' ? [[xb(0), base]].concat(mids, [[xb(k), base]]) : kind === 'corner' ? [[xb(0), base]].concat(f.map((v, i) => [xb(i + 1), Y(v)]), [[xb(k) + cw, base]]) : mids;
    out += `<path d="M${pts.map((p) => f1(p[0]) + ' ' + f1(p[1])).join('L')}" style="fill:none;stroke:#1d4ed8;stroke-width:1.8;stroke-linejoin:round"/>` + pts.map((p) => `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="2.4" style="fill:#1d4ed8"/>`).join('');
    out += `<text x="${L + 4}" y="12" style="font-size:12.5px;font-weight:700;fill:#1f2933">${label}</text>`;
    const said = { good: '직사각형의 윗변의 가운데 점을 차례로 잇고, 양 끝은 한 계급만큼 바깥에 있는 도수가 0인 계급의 가운데 점(가로축 위)에 이었다', edge: '직사각형의 윗변의 가운데 점을 차례로 잇고, 양 끝은 첫 직사각형의 왼쪽 아래 꼭짓점과 마지막 직사각형의 오른쪽 아래 꼭짓점에 이었다', corner: '직사각형의 윗변의 오른쪽 끝 점을 차례로 이었다', float: '직사각형의 윗변의 가운데 점만 차례로 잇고 가로축에는 잇지 않았다' }[kind];
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${f1(H)}" width="${W}" role="img" aria-label="${label}: 히스토그램 위에 그린 꺾은선. ${said}">${out}</svg>`;
  }

  // ═══ 히스토그램 ═══
  B.addTypes('7-2-5', 'hist', [
    T('hist-from-table', '도수분포표를 히스토그램으로 나타낼 때 직사각형의 가로와 세로', '①38 ②51', (d) => {
      const g = newGrp(d, { total: d.pick([24, 26, 28, 30]) }), j = d.until(() => d.int(1, g.k - 2), (i) => g.f[i] !== g.size);
      return M(`${introG(g, '도수분포표')} 이 표를 히스토그램으로 나타낼 때, ${g.cls(j)}인 계급을 나타내는 직사각형의 가로의 길이와 세로의 길이가 나타내는 값은?`, [{ label: '가로', answer: g.size, unit: g.u }, { label: '세로', answer: g.f[j], unit: g.c.cnt }], {
        figure: ftab(g), explain: `히스토그램에서 직사각형의 가로의 길이는 계급의 크기를, 세로의 길이는 그 계급의 도수를 나타낸다. 계급의 크기는 ${g.at(j + 1)} − ${g.at(j)} = ${amt(g.size, g.u)}이고 도수는 ${g.f[j]}${g.c.cnt}이다.`,
        facts: { calc: [[`${g.at(j + 1)}-${g.at(j)}`, 0], [String(g.f[j]), 1]] }
      });
    }),
    T('hist-size-total', '히스토그램에서 계급의 크기와 전체 도수', '①39 ②52', (d) => {
      const g = newGrp(d, { total: d.pick([24, 27, 30, 33]), hi: 11 });
      return M(`${introG(g, '히스토그램', { noTotal: true })} 계급의 크기와 조사한 전체 학생 수는?`, [{ label: '계급의 크기', answer: g.size, unit: g.u }, { label: '전체 학생 수', answer: g.total, unit: '명' }], {
        figure: histFig(g), explain: `계급의 크기는 직사각형의 가로의 길이이므로 ${g.at(1)} − ${g.at(0)} = ${amt(g.size, g.u)}이다. 전체 학생 수는 도수의 총합이므로 ${g.f.join(' + ')} = ${g.total}(명)이다.`,
        facts: { calc: [[`${g.at(1)}-${g.at(0)}`, 0], [g.f.join('+'), 1]] }
      });
    }),
    T('hist-read', '히스토그램에서 계급과 도수 읽기', '①40 ②53 ②54', (d, n) => {
      // 차례 0: 도수가 가장 큰 계급. 차례 1: 한 계급의 도수. 차례 2: 기준 이상(미만)인 수.
      const g = newGrp(d, { total: d.pick([25, 28, 30, 32]), hi: 11, ok: (f) => uniqueMax(f) && new Set(f).size >= f.length - 1 }), c = g.c, u = g.u, fig = histFig(g), what = wj(c.what, '이/가');
      if (n === 0) { const at = g.f.indexOf(Math.max(...g.f)); return C(`${introG(g, '히스토그램')} 도수가 가장 큰 계급은?`, classOptions(g), at, { figure: fig, explain: `직사각형의 높이가 가장 높은 계급은 ${g.cls(at)}이고 그 도수는 ${g.f[at]}명이다.`, facts: { choose: { exprs: g.f.map(String), rule: 'max' } } }); }
      if (n === 1) { const j = d.int(1, g.k - 2); return N(`${introG(g, '히스토그램')} ${what} ${g.cls(j)}인 학생은 몇 명인가?`, g.f[j], { unit: '명', figure: fig, explain: `${g.cls(j)}인 계급의 직사각형의 높이가 ${g.f[j]}이므로 ${g.f[j]}명이다.`, facts: { calc: [[String(g.f[j]), 0]] } }); }
      const under = d.bool(), j = under ? 2 : g.k - 2, part = under ? g.f.slice(0, j) : g.f.slice(j);
      return N(`${introG(g, '히스토그램')} ${what} ${amt(g.at(j), u)} ${under ? '미만' : '이상'}인 학생은 모두 몇 명인가?`, sum(part), { unit: '명', figure: fig, explain: `${amt(g.at(j), u)} ${under ? '미만' : '이상'}인 계급의 도수를 모두 더하면 ${part.join(' + ')} = ${sum(part)}(명)이다.`, facts: { calc: [[part.join('+'), 0]] } });
    }, { count: 3 }),
    T('hist-percent', '히스토그램에서 범위에 드는 비율', '①41 ②55 심33', (d) => {
      // 도수가 0인 계급이 하나 끼어 있다(그 계급도 계급이고, 비율을 구할 때 총합에는 영향이 없다).
      const total = d.pick(TOTALS), zero = d.int(1, 3), g = newGrp(d, { total, k: 6, lo: 0, hi: Math.min(12, total / 2), flat: true, ok: (f) => f.filter((v) => v === 0).length === 1 && f[zero] === 0 && f[0] > 0 && f[5] > 0 && Number.isInteger(pctOf(f[4] + f[5], total)) && Math.max(...f) <= 12 });
      const part = g.f.slice(4), p = pctOf(sum(part), total);
      return N(`${introG(g, '히스토그램', { noTotal: true })} ${wj(g.c.what, '이/가')} ${amt(g.at(4), g.u)} 이상인 학생은 전체의 몇 %인가?`, p, { unit: ' %', figure: histFig(g), explain: `전체 학생은 ${g.f.filter((v) => v > 0).join(' + ')} = ${total}(명)이고 ${amt(g.at(4), g.u)} 이상인 학생은 ${part.join(' + ')} = ${sum(part)}(명)이므로 ${sum(part)} ÷ ${total} × 100 = ${p}(%)이다.`, facts: { calc: [[`100*(${part.join('+')})/(${g.f.join('+')})`, 0]], unseen: [100] } });
    }),
    T('hist-claims', '히스토그램에 대한 설명 가리기', '①44 ②60', (d) => {
      const total = d.pick([20, 25]), g = newGrp(d, { total, k: 5, hi: 10, ok: (f) => uniqueMax(f) && f[1] !== f[2] && Number.isInteger(pctOf(f[3] + f[4], total)) }), c = g.c, u = g.u, wantTrue = d.bool(), what = wj(c.what, '이/가');
      const top = g.f.indexOf(Math.max(...g.f)), v = inside(g, 1), p = pctOf(g.f[3] + g.f[4], total);
      const rows = [
        [`계급의 크기는 ${amt(g.size, u)}이다.`, `계급의 크기는 ${amt(g.at(0), u)}이다.`, `계급의 크기는 ${g.at(1)} − ${g.at(0)} = ${amt(g.size, u)}이다.`],
        [`조사한 학생은 모두 ${total}명이다.`, `조사한 학생은 모두 ${Math.max(...g.f)}명이다.`, `전체 학생 수는 도수의 총합이므로 ${g.f.join(' + ')} = ${total}(명)이다.`],
        [`도수가 가장 큰 계급은 ${g.cls(top)}이다.`, `도수가 가장 큰 계급은 ${g.cls(top === g.k - 1 ? 0 : g.k - 1)}이다.`, `도수가 가장 큰 계급은 도수가 ${g.f[top]}명인 ${g.cls(top)}이다.`],
        [`${what} ${amt(v, u)}인 학생이 속하는 계급의 도수는 ${g.f[1]}명이다.`, `${what} ${amt(v, u)}인 학생이 속하는 계급의 도수는 ${g.f[2]}명이다.`, `${amtj(v, u, '은/는')} ${g.cls(1)}인 계급에 속하고 그 도수는 ${g.f[1]}명이다.`],
        [`${what} ${amt(g.at(3), u)} 이상인 학생은 전체의 ${p} %이다.`, `${what} ${amt(g.at(3), u)} 이상인 학생은 전체의 ${g.f[3] + g.f[4]} %이다.`, `${amt(g.at(3), u)} 이상인 학생은 ${g.f[3] + g.f[4]}명이므로 전체의 ${g.f[3] + g.f[4]} ÷ ${total} × 100 = ${p}(%)이다.`]
      ].filter((r) => r[0] !== r[1]);
      return pickClaim(d, `${introG(g, '히스토그램', { noTotal: true })} 이 히스토그램에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows, wantTrue, { figure: histFig(g) });
    }),
    T('hist-talk', '히스토그램의 성질', '①45', (d) => { const wantTrue = d.bool(); return claimQ(d, `히스토그램에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, [
      '각 직사각형의 가로의 길이는 계급의 크기와 같다.', '각 직사각형의 세로의 길이는 그 계급의 도수를 나타낸다.', '각 직사각형의 넓이는 그 계급의 도수에 정비례한다.', '도수가 가장 큰 계급의 직사각형의 넓이가 가장 크다.',
      '직사각형의 가로의 길이는 모두 같다.', '가로축에는 계급의 양 끝 값을, 세로축에는 도수를 적는다.', '자료의 분포 상태를 한눈에 알아볼 수 있다.'
    ], [
      ['각 직사각형의 가로의 길이는 그 계급의 도수를 나타낸다.', '가로의 길이는 계급의 크기를, 세로의 길이는 도수를 나타낸다.', '각 직사각형의 세로의 길이는 그 계급의 도수를 나타낸다.'],
      ['도수가 큰 계급일수록 직사각형의 가로의 길이가 길다.', '가로의 길이는 계급의 크기와 같으므로 모두 같다.', '직사각형의 가로의 길이는 모두 같다.'],
      ['직사각형의 넓이는 모두 같다.', '넓이는 도수에 정비례하므로 도수가 다르면 넓이도 다르다.', '각 직사각형의 넓이는 그 계급의 도수에 정비례한다.'],
      ['직사각형을 서로 떨어뜨려 그린다.', '계급이 이어져 있으므로 직사각형을 서로 붙여 그린다.'],
      ['가로축에는 도수를, 세로축에는 계급의 양 끝 값을 적는다.', '가로축에는 계급의 양 끝 값을, 세로축에는 도수를 적는다.', '가로축에는 계급의 양 끝 값을, 세로축에는 도수를 적는다.'],
      ['각 직사각형의 세로의 길이는 계급의 크기와 같다.', '세로의 길이는 그 계급의 도수를 나타낸다.', '각 직사각형의 가로의 길이는 계급의 크기와 같다.']
    ], wantTrue); }),
    T('hist-torn-one', '일부가 찢어진 히스토그램에서 보이지 않는 도수 구하기', '①54 ②57', (d) => {
      const g = newGrp(d, { total: d.pick([25, 30, 32, 35]), hi: 11 }), j = d.until(() => d.int(1, g.k - 2), (i) => g.f[i] >= 4), rest = g.f.filter((v, i) => i !== j);
      return N(`${introG(g, '히스토그램')} 그림의 일부가 찢어져 ${g.cls(j)}인 계급의 도수가 보이지 않는다. 이 계급의 도수는?`, g.f[j], { unit: g.c.cnt, figure: histFig(g, { torn: [j] }), explain: `도수의 총합이 ${g.total}이고 보이는 계급의 도수의 합이 ${rest.join(' + ')} = ${sum(rest)}이므로 보이지 않는 도수는 ${g.total} − ${sum(rest)} = ${g.f[j]}(명)이다.`, facts: { calc: [[`${g.total}-(${rest.join('+')})`, 0]] } });
    })
  ]);

  // ═══ 도수분포다각형 ═══
  B.addTypes('7-2-5', 'poly', [
    T('poly-draw-pick', '도수분포다각형을 바르게 그린 것 고르기', '①48 ②61 ②95', (d) => {
      const f = d.until(() => Array.from({ length: 4 }, () => d.int(1, 6)), (v) => new Set(v).size >= 3 && v[0] !== v[1] && v[2] !== v[3] && Math.max(...v) >= 4), kinds = d.shuffle(['good', 'edge', 'corner', 'float']), at = kinds.indexOf('good');
      return C('다음은 같은 히스토그램 위에 도수분포다각형을 그리려고 한 것이다. ㉠~㉣ 가운데 바르게 그린 것은?', LAB.slice(0, 4), at, { figure: kinds.map((kind, i) => miniPoly(f, kind, LAB[i])).join(''), explain: `도수분포다각형은 히스토그램의 각 직사각형의 윗변의 가운데 점을 차례로 선분으로 잇고, 양 끝에는 도수가 0인 계급이 하나씩 더 있는 것으로 보아 그 가운데 점(가로축 위)과 이어서 그린다. 바르게 그린 것은 ${LAB[at]}이다.`, facts: { truth: kinds.map((kind) => kind === 'good'), want: true } });
    }),
    T('poly-read', '도수분포다각형에서 전체 도수·계급·범위의 수 읽기', '①49 ②63 ②64', (d, n) => {
      // 차례 0: 전체 도수. 차례 1: 도수가 가장 작은 계급. 차례 2: 기준 미만(이상)인 수.
      const g = newGrp(d, { total: d.pick([26, 28, 30, 34]), hi: 11, ok: (f) => uniqueMin(f) }), c = g.c, u = g.u, fig = polyFig(g), what = wj(c.what, '이/가');
      if (n === 0) return N(`${introG(g, '도수분포다각형', { noTotal: true })} 조사한 학생은 모두 몇 명인가?`, g.total, { unit: '명', figure: fig, explain: `각 계급의 도수는 점의 높이이다. 도수의 총합은 ${g.f.join(' + ')} = ${g.total}(명)이다. 양 끝의 가로축 위의 점은 도수가 0이다.`, facts: { calc: [[g.f.join('+'), 0]] } });
      if (n === 1) { const at = g.f.indexOf(Math.min(...g.f)); return C(`${introG(g, '도수분포다각형')} 도수가 가장 작은 계급은?`, classOptions(g), at, { figure: fig, explain: `점의 높이가 가장 낮은 계급은 ${g.cls(at)}이고 그 도수는 ${g.f[at]}명이다. 가로축 위에 있는 양 끝의 두 점은 그림을 그리려고 더한 것이므로 계급으로 세지 않는다.`, facts: { choose: { exprs: g.f.map(String), rule: 'min' } } }); }
      const under = d.bool(), j = under ? 3 : g.k - 3, part = under ? g.f.slice(0, j) : g.f.slice(j);
      return N(`${introG(g, '도수분포다각형')} ${what} ${amt(g.at(j), u)} ${under ? '미만' : '이상'}인 학생은 모두 몇 명인가?`, sum(part), { unit: '명', figure: fig, explain: `${amt(g.at(j), u)} ${under ? '미만' : '이상'}인 계급의 도수를 모두 더하면 ${part.join(' + ')} = ${sum(part)}(명)이다.`, facts: { calc: [[part.join('+'), 0]] } });
    }, { count: 3 }),
    T('poly-percent', '도수분포다각형에서 범위에 드는 비율', '①50 ②65', (d) => {
      const total = d.pick(TOTALS), g = newGrp(d, { total, k: 5, hi: 14, ok: (f) => Number.isInteger(pctOf(f[0] + f[1], total)) }), part = g.f.slice(0, 2), p = pctOf(sum(part), total);
      return N(`${introG(g, '도수분포다각형', { noTotal: true })} ${wj(g.c.what, '이/가')} ${amt(g.at(2), g.u)} 미만인 학생은 전체의 몇 %인가?`, p, { unit: ' %', figure: polyFig(g), explain: `전체 학생은 ${g.f.join(' + ')} = ${total}(명)이고 ${amt(g.at(2), g.u)} 미만인 학생은 ${part.join(' + ')} = ${sum(part)}(명)이므로 ${sum(part)} ÷ ${total} × 100 = ${p}(%)이다.`, facts: { calc: [[`100*(${part.join('+')})/(${g.f.join('+')})`, 0]], unseen: [100] } });
    }),
    T('poly-claims', '히스토그램과 도수분포다각형을 겹친 그래프에 대한 설명 가리기', '①52 ①53 ②70', (d) => {
      const total = d.pick([20, 25]), g = newGrp(d, { total, k: 5, hi: 10, ok: (f) => uniqueMax(f) && f[1] !== f[2] && Number.isInteger(pctOf(f[3] + f[4], total)) }), c = g.c, u = g.u, wantTrue = d.bool(), what = wj(c.what, '이/가');
      const top = g.f.indexOf(Math.max(...g.f)), p = pctOf(g.f[3] + g.f[4], total);
      const rows = [
        [`계급의 크기는 ${amt(g.size, u)}이다.`, `계급의 크기는 ${amt(2 * g.size, u)}이다.`, `계급의 크기는 ${g.at(1)} − ${g.at(0)} = ${amt(g.size, u)}이다.`],
        [`조사한 학생은 모두 ${total}명이다.`, `조사한 학생은 모두 ${total + g.f[top]}명이다.`, `도수의 총합은 ${g.f.join(' + ')} = ${total}(명)이다.`],
        [`${what} ${amt(g.at(2), u)} 미만인 학생은 ${g.f[0] + g.f[1]}명이다.`, `${what} ${amt(g.at(2), u)} 미만인 학생은 ${g.f[1]}명이다.`, `${amt(g.at(2), u)} 미만인 학생은 ${g.f[0]} + ${g.f[1]} = ${g.f[0] + g.f[1]}(명)이다.`],
        [`${what} ${amt(g.at(3), u)} 이상인 학생은 전체의 ${p} %이다.`, `${what} ${amt(g.at(3), u)} 이상인 학생은 전체의 ${p + (p >= 50 ? -10 : 10)} %이다.`, `${amt(g.at(3), u)} 이상인 학생은 ${g.f[3] + g.f[4]}명이므로 전체의 ${g.f[3] + g.f[4]} ÷ ${total} × 100 = ${p}(%)이다.`],
        ['히스토그램의 직사각형의 넓이의 합은 도수분포다각형과 가로축으로 둘러싸인 부분의 넓이와 같다.', '히스토그램의 직사각형의 넓이의 합은 도수분포다각형과 가로축으로 둘러싸인 부분의 넓이보다 크다.', '도수분포다각형이 잘라 낸 삼각형과 새로 생긴 삼각형의 넓이가 서로 같으므로 두 넓이는 같다.']
      ];
      return pickClaim(d, `${introG(g, '히스토그램과 도수분포다각형', { noTotal: true })} 이 그래프에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows, wantTrue, { figure: bothFig(g) });
    }),
    T('poly-to-table', '도수분포다각형을 도수분포표로 옮기기', '①55 ①58 ②62', (d) => {
      const g = newGrp(d, { total: d.pick([24, 25, 28, 30]), k: 5, hi: 11 }), i = d.int(0, 1), j = d.int(2, 4);
      return M(`${introG(g, '도수분포다각형', { noTotal: true })} 이 그래프를 도수분포표로 나타낼 때, ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: '㉠', answer: g.f[i] }, { label: '㉡', answer: g.f[j] }, { label: '㉢', answer: g.total }], {
        figure: polyFig(g) + ftab(g, { cells: g.f.map((v, r) => (r === i ? box('㉠') : r === j ? box('㉡') : v)), total: box('㉢') }),
        explain: `각 계급의 도수는 그 계급의 가운데에 찍힌 점의 높이이다. ㉠ = ${g.f[i]}, ㉡ = ${g.f[j]}이고, ㉢ = ${g.f.join(' + ')} = ${g.total}이다.`,
        facts: { calc: [[String(g.f[i]), 0], [String(g.f[j]), 1], [g.f.join('+'), 2]] }
      });
    }),
    T('poly-two-claims', '두 도수분포다각형 비교하기', '①59 심49', (d) => {
      // 둘째 집단의 그래프가 오른쪽으로 치우쳐 있다(값이 큰 쪽에 더 많이 몰려 있다). 두 집단의 총합은 서로 다르다.
      const c = d.pick(GC.filter((x) => x.unit !== 'kg')), k = 5, [lo, size] = frameOf(d, c, k), names = d.pick(PAIRS);
      const two = d.until(() => [freqs(d, k, d.pick([20, 22, 24]), null, { hi: 9 }), freqs(d, k, d.pick([25, 26, 28]), null, { hi: 10 })], ([a, b]) => uniqueMax(a) && uniqueMax(b) && a.indexOf(Math.max(...a)) < b.indexOf(Math.max(...b)) && shifted(a, b) && b[3] + b[4] > a[3] + a[4] + 2 && a[2] !== b[2]);
      const [a, b] = two, g = grp(c, lo, size, a), u = c.unit, [A, Bn] = names, wantTrue = d.bool(), topA = a.indexOf(Math.max(...a)), overA = a[3] + a[4], overB = b[3] + b[4];
      const rows = [
        [`${Bn}의 학생 수가 ${A}의 학생 수보다 ${sum(b) - sum(a)}명 더 많다.`, `${A}의 학생 수와 ${Bn}의 학생 수는 같다.`, `${A}의 학생 수는 ${a.join(' + ')} = ${sum(a)}(명), ${Bn}의 학생 수는 ${b.join(' + ')} = ${sum(b)}(명)이다.`],
        [`${A}에서 도수가 가장 큰 계급은 ${g.cls(topA)}이다.`, `${A}에서 도수가 가장 큰 계급은 ${g.cls(b.indexOf(Math.max(...b)))}이다.`, `${A}에서 도수가 가장 큰 계급은 도수가 ${a[topA]}명인 ${g.cls(topA)}이다.`],
        [`${wj(c.what, '이/가')} ${g.cls(2)}인 학생은 ${a[2] > b[2] ? A : Bn}에 더 많다.`, `${wj(c.what, '이/가')} ${g.cls(2)}인 학생은 ${a[2] > b[2] ? Bn : A}에 더 많다.`, `${g.cls(2)}인 학생은 ${A}에 ${a[2]}명, ${Bn}에 ${b[2]}명이다.`],
        [`${wj(c.what, '이/가')} ${amt(g.at(3), u)} 이상인 학생은 ${Bn}에 ${overB - overA}명 더 많다.`, `${wj(c.what, '이/가')} ${amt(g.at(3), u)} 이상인 학생은 ${A}에 ${overB - overA}명 더 많다.`, `${amt(g.at(3), u)} 이상인 학생은 ${A}에 ${overA}명, ${Bn}에 ${overB}명이다.`],
        [`${Bn}의 그래프가 ${A}의 그래프보다 오른쪽으로 치우쳐 있으므로 ${Bn} 학생들의 ${wj(c.what, '이/가')} ${c.big} 편이다.`, `${A}의 그래프가 ${Bn}의 그래프보다 오른쪽으로 치우쳐 있으므로 ${A} 학생들의 ${wj(c.what, '이/가')} ${c.big} 편이다.`, `${Bn}의 그래프가 ${A}의 그래프보다 오른쪽으로 치우쳐 있으므로 ${Bn} 학생들의 ${wj(c.what, '이/가')} ${c.big} 편이다.`]
      ];
      return pickClaim(d, `다음은 ${pairLead(names)}의 ${wj(c.what, '을/를')} 조사하여 나타낸 도수분포다각형이다. 이 그래프에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows, wantTrue, { figure: chart({ g, lines: [{ values: a, name: A }, { values: b, name: Bn }] }) });
    })
  ]);

  // ═══ 상대도수와 그 분포표 ═══
  // 상대도수의 분포표에 쓸 것: 총합 total 과 상대도수(백분의 몇) r. 도수는 total × r ÷ 100.
  const relGrp = (d, o) => {
    const total = o.total || d.pick([20, 40, 50, 200]), step = total === 50 ? 2 : total === 25 ? 4 : 5, c = o.c || d.pick(GC), k = o.k || 5, [lo, size] = frameOf(d, c, k);
    const r = rels(d, k, step, o.ok, { hi: Math.floor(40 / step) }), g = grp(c, lo, size, r.map((v) => total * v / 100));
    return Object.assign(g, { r });
  };
  // 상대도수의 분포표(도수 열 없이). cells: 상대도수 칸의 글.
  const relTab = (g, cells, total) => ftab(g, { noCount: true, more: [{ head: '상대도수', cells: cells || g.r.map(r2), total: total == null ? '1' : total }] });
  // 도수와 상대도수를 함께 적은 표.
  const fullTab = (g, fcells, rcells, o) => ftab(g, { cells: fcells || g.f, total: o && o.total != null ? o.total : g.total, more: [{ head: '상대도수', cells: rcells || g.r.map(r2), total: o && o.relTotal != null ? o.relTotal : '1' }] });
  const introR = (g, kind, noTotal) => `다음은 어느 중학교 학생${noTotal ? '들' : ' ' + g.total + '명'}의 ${wj(g.c.what, '을/를')} 조사하여 ${kind === '상대도수의 분포표' ? '나타낸 상대도수의 분포표' : '상대도수의 분포를 나타낸 그래프'}이다.`;

  B.addTypes('7-2-5', 'rel', [
    T('rel-talk', '상대도수의 뜻과 성질', '①60 ②72', (d, n) => claimQ(d, `상대도수에 대한 설명으로 ${n === 0 ? '옳은' : '옳지 않은'} 것은?`, [
      '어떤 계급의 상대도수는 그 계급의 도수를 도수의 총합으로 나눈 값이다.', '상대도수의 총합은 항상 1이다.', '상대도수는 0 이상 1 이하의 수이다.', '도수의 총합과 어떤 계급의 상대도수를 알면 그 계급의 도수를 구할 수 있다.',
      '한 도수분포표에서 도수가 큰 계급일수록 상대도수도 크다.', '도수의 총합이 다른 두 집단의 분포를 비교할 때에는 도수보다 상대도수를 비교하는 것이 알맞다.', '상대도수에 100을 곱하면 그 계급의 도수가 전체에서 차지하는 백분율이 된다.'
    ], [
      ['상대도수의 총합은 도수의 총합과 같다.', '상대도수의 총합은 항상 1이다.', '상대도수의 총합은 항상 1이다.'],
      ['어떤 계급의 상대도수는 도수의 총합을 그 계급의 도수로 나눈 값이다.', '상대도수는 그 계급의 도수를 도수의 총합으로 나눈 값이다.', '어떤 계급의 상대도수는 그 계급의 도수를 도수의 총합으로 나눈 값이다.'],
      ['상대도수가 큰 계급일수록 계급의 크기도 크다.', '한 도수분포표에서 계급의 크기는 모두 같다.'],
      ['상대도수는 1보다 클 수도 있다.', '도수는 도수의 총합보다 클 수 없으므로 상대도수는 1 이하이다.', '상대도수는 0 이상 1 이하의 수이다.'],
      ['도수의 총합이 50이고 도수가 14인 계급의 상대도수는 0.7이다.', '14 ÷ 50 = 0.28이다.'],
      ['두 집단에서 도수가 같은 계급은 상대도수도 항상 같다.', '도수의 총합이 다르면 도수가 같아도 상대도수는 다르다.'],
      ['도수의 총합이 다른 두 집단의 분포를 비교할 때에는 도수를 그대로 비교하는 것이 알맞다.', '도수의 총합이 다르면 전체에 대한 비율인 상대도수를 비교하여야 한다.', '도수의 총합이 다른 두 집단의 분포를 비교할 때에는 도수보다 상대도수를 비교하는 것이 알맞다.']
    ], n === 0), { count: 2, standard: STD3 }),
    T('rel-to-freq', '도수의 총합과 상대도수로 도수 구하기', '①61', (d) => {
      const total = d.pick([20, 25, 40, 50, 200]), f = d.until(() => d.int(2, Math.round(total * 0.4)), (v) => Number.isInteger(v * 100 / total) && v * 100 / total !== 50), r = f * 100 / total;
      return N(`도수의 총합이 ${total}인 도수분포표에서 상대도수가 ${r2(r)}인 계급의 도수는?`, f, { explain: `(도수) = (도수의 총합) × (상대도수)이므로 ${total} × ${r2(r)} = ${f}이다.`, facts: { value: `${total}*${r2(r)}` } });
    }),
    T('rel-to-total', '도수와 상대도수로 도수의 총합 구하기', '①62 심52', (d) => {
      const total = d.pick([20, 25, 40, 50, 80]), f = d.until(() => d.int(2, Math.round(total * 0.4)), (v) => Number.isInteger(v * 100 / total) && v * 100 / total !== 50 && v * 100 / total !== 10), r = f * 100 / total;
      return N(`어떤 도수분포표에서 도수가 ${f}인 계급의 상대도수가 ${r2(r)}이다. 이 도수분포표의 도수의 총합은?`, total, { explain: `(상대도수) = (도수) ÷ (도수의 총합)이므로 (도수의 총합) = (도수) ÷ (상대도수) = ${f} ÷ ${r2(r)} = ${total}이다.`, facts: { value: `${f}/${r2(r)}` } });
    }),
    T('rel-fill', '도수분포표에 상대도수 채우기', '①63 ②73 ②81', (d) => {
      const g = relGrp(d, { total: d.pick([20, 40, 50]), ok: (r) => new Set(r).size >= 4 }), [i, j] = d.shuffle(range(0, g.k - 1)).slice(0, 2).sort((x, y) => x - y);
      return M(`${introR(g, '상대도수의 분포표')} ㉠, ㉡에 알맞은 수는?`, [{ label: '㉠', answer: g.r[i] / 100, decimal: true }, { label: '㉡', answer: g.r[j] / 100, decimal: true }], {
        figure: fullTab(g, null, g.r.map((v, x) => (x === i ? box('㉠') : x === j ? box('㉡') : r2(v)))),
        explain: `(상대도수) = (그 계급의 도수) ÷ (도수의 총합)이므로 ㉠ = ${g.f[i]} ÷ ${g.total} = ${r2(g.r[i])}, ㉡ = ${g.f[j]} ÷ ${g.total} = ${r2(g.r[j])}이다.`,
        facts: { calc: [[`${g.f[i]}/${g.total}`, 0], [`${g.f[j]}/${g.total}`, 1]] }
      });
    }),
    T('rel-one', '한 계급의 상대도수 구하기', '①64', (d, n) => {
      // 차례 0: 도수분포표에서. 차례 1: 히스토그램에서(도수의 총합부터 구한다).
      const g = relGrp(d, { total: n === 0 ? d.pick([20, 40, 50]) : d.pick([20, 25]), k: 5, ok: (r) => new Set(r).size >= 4 && Math.max(...r) <= 40 }), j = d.int(1, 3);
      if (n === 0) return D(`${introG(g, '도수분포표')} ${g.cls(j)}인 계급의 상대도수는?`, g.r[j] / 100, { figure: ftab(g), explain: `(상대도수) = (그 계급의 도수) ÷ (도수의 총합)이므로 ${g.f[j]} ÷ ${g.total} = ${r2(g.r[j])}이다.`, facts: { value: `${g.f[j]}/${g.total}` } });
      return D(`${introG(g, '히스토그램', { noTotal: true })} ${g.cls(j)}인 계급의 상대도수는?`, g.r[j] / 100, { figure: histFig(g), explain: `도수의 총합은 ${g.f.join(' + ')} = ${g.total}이고 ${g.cls(j)}인 계급의 도수는 ${g.f[j]}이므로 상대도수는 ${g.f[j]} ÷ ${g.total} = ${r2(g.r[j])}이다.`, facts: { value: `${g.f[j]}/(${g.f.join('+')})` } });
    }, { count: 2 }),
    T('rel-blank', '상대도수의 분포표의 빈칸', '①65 ①66 ①80 심53', (d, n) => {
      // 차례 0: 상대도수의 총합이 1임을 써서 빈칸의 상대도수 구하기. 차례 1: 빈칸의 상대도수를 구한 뒤 그 계급의 도수 구하기.
      const g = relGrp(d, { total: d.pick([20, 40, 200]), ok: (r) => new Set(r).size >= 4 }), j = d.int(1, 3), rest = g.r.filter((v, i) => i !== j).map(r2), cells = g.r.map((v, i) => (i === j ? V('A') : r2(v)));
      const how = `상대도수의 총합은 1이므로 ${V('A')} = 1 − (${rest.join(' + ')}) = ${r2(g.r[j])}이다.`;
      if (n === 0) return D(`${introR(g, '상대도수의 분포표', true)} ${V('A')}의 값은?`, g.r[j] / 100, { figure: relTab(g, cells), explain: how, facts: { value: `1-(${rest.join('+')})` } });
      return N(`${introR(g, '상대도수의 분포표')} 상대도수가 ${V('A')}인 계급의 도수는?`, g.f[j], { unit: g.c.cnt, figure: relTab(g, cells), explain: `${how} 이 계급의 도수는 ${g.total} × ${r2(g.r[j])} = ${g.f[j]}(명)이다.`, facts: { value: `${g.total}*(1-(${rest.join('+')}))` } });
    }, { count: 2 }),
    T('rel-table-freq', '상대도수의 분포표와 도수의 총합으로 범위의 도수 구하기', '①66', (d) => {
      const g = relGrp(d, { total: d.pick([40, 50, 200]) }), under = d.bool(), j = under ? 2 : g.k - 2, part = under ? g.r.slice(0, 2) : g.r.slice(-2), k = g.total * sum(part) / 100;
      return N(`${introR(g, '상대도수의 분포표')} ${wj(g.c.what, '이/가')} ${amt(g.at(j), g.u)} ${under ? '미만' : '이상'}인 학생은 모두 몇 명인가?`, k, { unit: '명', figure: relTab(g), explain: `${amt(g.at(j), g.u)} ${under ? '미만' : '이상'}인 계급의 상대도수의 합은 ${part.map(r2).join(' + ')} = ${r2(sum(part))}이므로 학생 수는 ${g.total} × ${r2(sum(part))} = ${k}(명)이다.`, facts: { value: `${g.total}*(${part.map(r2).join('+')})` } });
    }),
    T('rel-table-read', '상대도수의 분포표 읽기', '①67 ②76', (d, n) => {
      // 차례 0: 범위에 드는 비율(%). 차례 1: 상대도수가 가장 큰 계급.
      const g = relGrp(d, { total: 50, ok: (r) => r.filter((v) => v === Math.max(...r)).length === 1 });
      if (n === 0) { const part = g.r.slice(-2); return N(`${introR(g, '상대도수의 분포표', true)} ${wj(g.c.what, '이/가')} ${amt(g.at(g.k - 2), g.u)} 이상인 학생은 전체의 몇 %인가?`, sum(part), { unit: ' %', figure: relTab(g), explain: `${amt(g.at(g.k - 2), g.u)} 이상인 계급의 상대도수의 합은 ${part.map(r2).join(' + ')} = ${r2(sum(part))}이므로 전체의 ${r2(sum(part))} × 100 = ${sum(part)}(%)이다.`, facts: { value: `100*(${part.map(r2).join('+')})`, unseen: [100] } }); }
      const at = g.r.indexOf(Math.max(...g.r));
      return C(`${introR(g, '상대도수의 분포표', true)} 도수가 가장 큰 계급은?`, classOptions(g), at, { figure: relTab(g), explain: `한 표에서 상대도수는 도수에 정비례하므로 상대도수가 가장 큰 계급의 도수가 가장 크다. 상대도수가 ${nj(g.r[at] / 100, '으로/로')} 가장 큰 계급은 ${g.cls(at)}이다.`, facts: { choose: { exprs: g.r.map(r2), rule: 'max' } } });
    }, { count: 2 }),
    T('rel-mixed-blanks', '도수와 상대도수가 섞여 빈 분포표 채우기', '②74 ②75 심54', (d) => {
      const g = relGrp(d, { total: d.pick([20, 40, 50]), ok: (r) => new Set(r).size >= 4 }), [i, j] = d.shuffle(range(0, g.k - 1)).slice(0, 2);
      return M(`${introR(g, '상대도수의 분포표')} ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: '㉠', answer: g.r[i] / 100, decimal: true }, { label: '㉡', answer: g.f[j] }, { label: '㉢', answer: 1 }], {
        figure: fullTab(g, g.f.map((v, x) => (x === j ? box('㉡') : v)), g.r.map((v, x) => (x === i ? box('㉠') : r2(v))), { relTotal: box('㉢') }),
        explain: `㉠ = ${g.f[i]} ÷ ${g.total} = ${r2(g.r[i])}이다. ㉡ = ${g.total} × ${r2(g.r[j])} = ${g.f[j]}이다. 상대도수의 총합은 항상 1이므로 ㉢ = 1이다.`,
        facts: { calc: [[`${g.f[i]}/${g.total}`, 0], [`${g.total}*${g.r[j]}/100`, 1], ['1', 2]], unseen: [100, g.r[j], 1] }
      });
    }),
    T('rel-compare-two', '전체 수가 다른 두 집단에서 비율 비교하기', '①69', (d) => {
      // 해당하는 학생 수는 한쪽이 더 많지만 전체에 대한 비율은 다른 쪽이 더 높다.
      const what = d.pick(['안경을 쓴 학생', '동아리 활동을 하는 학생', '걸어서 등교하는 학생', '아침 식사를 하는 학생']);
      const [ta, tb, a, b] = d.until(() => { const x = d.pick([200, 250, 400]), y = d.pick([100, 150, 160]); return [x, y, d.int(20, 90), d.int(15, 60)]; }, ([x, y, p, q]) => p > q && p / x < q / y && Number.isInteger(p * 100 / x) && Number.isInteger(q * 100 / y));
      // 학생 수가 많은 학교를 A 로 할지 B 로 할지 섞는다.
      const big = d.int(0, 1), names = ['A 중학교', 'B 중학교'], rows = big === 0 ? [[ta, a], [tb, b]] : [[tb, b], [ta, a]], ratios = rows.map((r) => r[1] / r[0]), at = ratios[0] > ratios[1] ? 0 : 1;
      return C(`A 중학교는 전체 학생 ${rows[0][0]}명 가운데 ${rows[0][1]}명이, B 중학교는 전체 학생 ${rows[1][0]}명 가운데 ${rows[1][1]}명이 ${what}이다. 전체 학생 수에 대한 ${what} 수의 비율이 더 높은 학교는?`, names, at, {
        explain: `전체 학생 수가 다르므로 상대도수를 비교한다. A 중학교는 ${rows[0][1]} ÷ ${rows[0][0]} = ${fx(ratios[0])}, B 중학교는 ${rows[1][1]} ÷ ${rows[1][0]} = ${fx(ratios[1])}이므로 ${names[at]}의 비율이 더 높다. ${what} 수는 ${names[1 - at]}가 더 많지만 비율은 그렇지 않다.`,
        facts: { choose: { exprs: rows.map((r) => `${r[1]}/${r[0]}`), rule: 'max' } }
      });
    })
  ]);

  // ═══ 상대도수의 그래프와 두 집단의 비교 ═══
  // 두 집단의 상대도수(백분의 몇): 둘째 집단이 오른쪽으로 치우쳐 있다(shifted). step: 눈금 한 칸(2 → 0.02, 5 → 0.05).
  const twoRels = (d, k, step, ok) => d.until(() => [rels(d, k, step), rels(d, k, step)], ([a, b]) => uniqueMax(a) && uniqueMax(b) && a.indexOf(Math.max(...a)) <= b.indexOf(Math.max(...b)) && shifted(a, b) && a[0] + a[1] > b[0] + b[1] && a[k - 1] + a[k - 2] < b[k - 1] + b[k - 2] && (!ok || ok(a, b)));
  B.kit.m725.relGrp = relGrp; B.kit.m725.relTab = relTab; B.kit.m725.fullTab = fullTab; B.kit.m725.introR = introR; B.kit.m725.twoRels = twoRels; B.kit.m725.PAIRS = PAIRS; B.kit.m725.BIG_PAIRS = BIG_PAIRS; B.kit.m725.pairCount = pairCount; B.kit.m725.pairLead = pairLead; B.kit.m725.uniqueMax = uniqueMax; B.kit.m725.TOTALS = TOTALS;

  B.addTypes('7-2-5', 'relg', [
    T('relg-read', '상대도수의 분포를 나타낸 그래프 읽기', '①70 ②82', (d, n) => {
      // 차례 0: 상대도수가 가장 큰 계급. 차례 1: 한 계급의 학생이 전체의 몇 %인가.
      const g = relGrp(d, { total: 50, k: 6, ok: (r) => uniqueMax(r) }), fig = relFig(g, g.r);
      if (n === 0) { const at = g.r.indexOf(Math.max(...g.r)); return C(`${introR(g, '그래프', true)} 상대도수가 가장 큰 계급은?`, classOptions(g), at, { figure: fig, explain: `점의 높이가 가장 높은 계급은 ${g.cls(at)}이고 그 상대도수는 ${r2(g.r[at])}이다.`, facts: { choose: { exprs: g.r.map(r2), rule: 'max' } } }); }
      const j = d.until(() => d.int(1, 4), (i) => g.r[i] % 10 !== 0);
      return N(`${introR(g, '그래프', true)} ${wj(g.c.what, '이/가')} ${g.cls(j)}인 학생은 전체의 몇 %인가?`, g.r[j], { unit: ' %', figure: fig, explain: `${g.cls(j)}인 계급의 상대도수는 ${r2(g.r[j])}이므로 전체의 ${r2(g.r[j])} × 100 = ${g.r[j]}(%)이다.`, facts: { value: `100*${r2(g.r[j])}`, unseen: [100] } });
    }, { count: 2 }),
    T('relg-freq', '상대도수의 그래프와 도수의 총합으로 도수 구하기', '①71 ①82 ②83', (d, n) => {
      // 차례 0: 상대도수가 가장 큰 계급의 도수. 차례 1: 기준 이상인 도수(두 계급).
      const g = relGrp(d, { total: d.pick([50, 100, 200]), k: 6, ok: (r) => uniqueMax(r) }), fig = relFig(g, g.r);
      if (n === 0) { const at = g.r.indexOf(Math.max(...g.r)); return N(`${introR(g, '그래프')} 상대도수가 가장 큰 계급에 속하는 학생은 몇 명인가?`, g.total * g.r[at] / 100, { unit: '명', figure: fig, explain: `상대도수가 가장 큰 계급은 ${g.cls(at)}이고 그 상대도수는 ${r2(g.r[at])}이다. 따라서 학생 수는 ${g.total} × ${r2(g.r[at])} = ${g.total * g.r[at] / 100}(명)이다.`, facts: { value: `${g.total}*${r2(g.r[at])}` } }); }
      const part = g.r.slice(-2), k = g.total * sum(part) / 100;
      return N(`${introR(g, '그래프')} ${wj(g.c.what, '이/가')} ${amt(g.at(g.k - 2), g.u)} 이상인 학생은 모두 몇 명인가?`, k, { unit: '명', figure: fig, explain: `${amt(g.at(g.k - 2), g.u)} 이상인 계급의 상대도수의 합은 ${part.map(r2).join(' + ')} = ${r2(sum(part))}이므로 학생 수는 ${g.total} × ${r2(sum(part))} = ${k}(명)이다.`, facts: { value: `${g.total}*(${part.map(r2).join('+')})` } });
    }, { count: 2 }),
    T('relg-percent', '상대도수의 그래프에서 범위에 드는 비율', '①72 ②84', (d) => {
      const g = relGrp(d, { total: 50, k: 6 }), part = g.r.slice(0, 2), rest = 100 - sum(part);
      return N(`${introR(g, '그래프', true)} ${wj(g.c.what, '이/가')} ${amt(g.at(2), g.u)} 이상인 학생은 전체의 몇 %인가?`, rest, { unit: ' %', figure: relFig(g, g.r), explain: `상대도수의 총합은 1이다. ${amt(g.at(2), g.u)} 미만인 계급의 상대도수의 합이 ${part.map(r2).join(' + ')} = ${r2(sum(part))}이므로 ${amt(g.at(2), g.u)} 이상인 계급의 상대도수의 합은 1 − ${r2(sum(part))} = ${r2(rest)}이고, 전체의 ${rest} %이다.`, facts: { value: `100*(${g.r.slice(2).map(r2).join('+')})`, unseen: [100] } });
    }),
    T('relg-claims', '상대도수의 그래프에 대한 설명 가리기', '①75', (d) => {
      const g = relGrp(d, { total: d.pick([50, 100, 200]), k: 6, ok: (r) => uniqueMax(r) && r[1] !== r[2] }), c = g.c, u = g.u, wantTrue = d.bool(), what = wj(c.what, '이/가');
      const top = g.r.indexOf(Math.max(...g.r)), part = g.r.slice(-2), v = inside(g, 1);
      const rows = [
        [`계급의 크기는 ${amt(g.size, u)}이다.`, `계급의 크기는 ${amt(g.k, u)}이다.`, `계급의 크기는 ${g.at(1)} − ${g.at(0)} = ${amt(g.size, u)}이다.`],
        [`${what} ${amt(g.at(g.k - 2), u)} 이상인 학생은 전체의 ${sum(part)} %이다.`, `${what} ${amt(g.at(g.k - 2), u)} 이상인 학생은 전체의 ${part[0]} %이다.`, `${amt(g.at(g.k - 2), u)} 이상인 계급의 상대도수의 합은 ${part.map(r2).join(' + ')} = ${r2(sum(part))}이므로 전체의 ${sum(part)} %이다.`],
        [`${what} ${amt(v, u)}인 학생이 속하는 계급의 도수는 ${g.f[1]}명이다.`, `${what} ${amt(v, u)}인 학생이 속하는 계급의 도수는 ${g.r[1]}명이다.`, `${amtj(v, u, '은/는')} ${g.cls(1)}인 계급에 속하고 그 도수는 ${g.total} × ${r2(g.r[1])} = ${g.f[1]}(명)이다.`],
        [`도수가 가장 큰 계급의 도수는 ${g.f[top]}명이다.`, `도수가 가장 큰 계급의 도수는 ${g.f[top] + (g.total === 50 ? 5 : 10)}명이다.`, `상대도수가 가장 큰 계급은 ${g.cls(top)}이고 그 도수는 ${g.total} × ${r2(g.r[top])} = ${g.f[top]}(명)이다.`],
        [`상대도수가 가장 작은 계급의 상대도수는 ${r2(Math.min(...g.r))}이다.`, `상대도수가 가장 작은 계급의 상대도수는 ${r2(Math.min(...g.r) + (g.total === 50 ? 2 : 5))}이다.`, `점의 높이가 가장 낮은 계급의 상대도수는 ${r2(Math.min(...g.r))}이다.`]
      ].filter((r) => r[0] !== r[1]);
      return pickClaim(d, `${introR(g, '그래프')} 이 그래프에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows, wantTrue, { figure: relFig(g, g.r) });
    }),
    T('two-rel-both', '총합이 다른 두 집단의 도수분포표에서 상대도수 구하기', '①78 ②88', (d) => {
      const c = d.pick(GC), [lo, size] = frameOf(d, c, 5), names = d.pick(MID_PAIRS), [ta, tb] = d.pick([[20, 40], [25, 50], [20, 50], [40, 50]]);
      const a = freqs(d, 5, ta, null, { step: ta === 40 ? 2 : 1 }), b = freqs(d, 5, tb, null, { step: tb === 40 ? 2 : 1 }), g = grp(c, lo, size, a), j = d.until(() => d.int(1, 3), (i) => a[i] / ta !== b[i] / tb);
      return M(`다음은 ${pairLead(names)}의 ${wj(c.what, '을/를')} 조사하여 나타낸 도수분포표이다. ${g.cls(j)}인 계급의 상대도수를 각각 구하면?`, [{ label: names[0], answer: a[j] / ta, decimal: true }, { label: names[1], answer: b[j] / tb, decimal: true }], {
        figure: ftab(g, { head: names[0], more: [{ head: names[1], cells: b, total: tb }], note: '명' }),
        explain: `${names[0]}: ${a[j]} ÷ ${ta} = ${fx(a[j] / ta)}, ${names[1]}: ${b[j]} ÷ ${tb} = ${fx(b[j] / tb)}이다. 도수의 총합이 다르므로 도수가 아니라 상대도수로 비교한다.`,
        facts: { calc: [[`${a[j]}/${ta}`, 0], [`${b[j]}/${tb}`, 1]] }
      });
    }),
    T('two-table-claims', '총합이 다른 두 집단의 도수분포표에 대한 설명 가리기', '②89', (d) => {
      const c = d.pick(GC), [lo, size] = frameOf(d, c, 5), names = d.pick(MID_PAIRS), [A, Bn] = names, [ta, tb] = d.pick([[20, 40], [25, 50], [20, 50]]), wantTrue = d.bool();
      const [a, b] = d.until(() => [freqs(d, 5, ta, null, { step: 1 }), freqs(d, 5, tb, null, { step: tb === 40 ? 2 : 1 })], ([x, y]) => x[1] < y[1] && x[1] / ta > y[1] / tb && (x[3] + x[4]) / ta !== (y[3] + y[4]) / tb && uniqueMax(x) && x[2] !== y[2]), g = grp(c, lo, size, a);
      const topA = a.indexOf(Math.max(...a)), overA = (a[3] + a[4]) * 100 / ta, overB = (b[3] + b[4]) * 100 / tb, what = wj(c.what, '이/가');
      const rows = [
        [`${g.cls(1)}인 학생 수는 ${wj(Bn, '이/가')} 더 많다.`, `${g.cls(1)}인 학생 수는 ${wj(A, '이/가')} 더 많다.`, `${g.cls(1)}인 학생은 ${A}에 ${a[1]}명, ${Bn}에 ${b[1]}명이다.`],
        [`${g.cls(1)}인 계급의 상대도수는 ${wj(A, '이/가')} 더 크다.`, `${g.cls(1)}인 계급의 상대도수는 ${wj(Bn, '이/가')} 더 크다.`, `${g.cls(1)}인 계급의 상대도수는 ${wj(A, '이/가')} ${a[1]} ÷ ${ta} = ${fx(a[1] / ta)}, ${wj(Bn, '이/가')} ${b[1]} ÷ ${tb} = ${fx(b[1] / tb)}이다.`],
        [`${what} ${amt(g.at(3), c.unit)} 이상인 학생의 비율은 ${wj(overA > overB ? A : Bn, '이/가')} 더 높다.`, `${what} ${amt(g.at(3), c.unit)} 이상인 학생의 비율은 ${wj(overA > overB ? Bn : A, '이/가')} 더 높다.`, `${amt(g.at(3), c.unit)} 이상인 학생은 ${A}에서 ${fx(overA)} %, ${Bn}에서 ${fx(overB)} %이다.`],
        [`${A}에서 도수가 가장 큰 계급의 상대도수는 ${fx(a[topA] / ta)}이다.`, `${A}에서 도수가 가장 큰 계급의 상대도수는 ${fx(a[topA] / tb)}이다.`, `${A}에서 도수가 가장 큰 계급의 상대도수는 ${a[topA]} ÷ ${ta} = ${fx(a[topA] / ta)}이다.`]
      ];
      return pickClaim(d, `다음은 ${pairLead(names)}의 ${wj(c.what, '을/를')} 조사하여 나타낸 도수분포표이다. 이 표에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows, wantTrue, { figure: ftab(g, { head: A, more: [{ head: Bn, cells: b, total: tb }], note: '명' }) });
    }),
    T('two-rel-table-freq', '두 집단의 상대도수의 분포표에서 도수 구하기', '①79 ②91 심65', (d) => {
      // 상대도수가 같은 계급이라도 도수의 총합이 다르면 도수는 다르다.
      const c = d.pick(GC), k = 5, [lo, size] = frameOf(d, c, k), names = d.pick(BIG_PAIRS), [ta, tb] = d.pick([[200, 300], [100, 200], [200, 400], [100, 300]]);
      const [a, b] = d.until(() => [rels(d, k, 5, null, {}), rels(d, k, 5, null, {})], ([x, y]) => x.filter((v, i) => v === y[i]).length === 1), j = a.findIndex((v, i) => v === b[i]), g = grp(c, lo, size, a);
      return M(`다음은 ${pairCount(names, ta, tb)}의 ${wj(c.what, '을/를')} 조사하여 나타낸 상대도수의 분포표이다. 두 집단의 상대도수가 같은 계급에 속하는 학생 수를 각각 구하면?`, [{ label: names[0], answer: ta * a[j] / 100, unit: '명' }, { label: names[1], answer: tb * b[j] / 100, unit: '명' }], {
        figure: ftab(g, { noCount: true, more: [{ head: names[0], cells: a.map(r2), total: '1' }, { head: names[1], cells: b.map(r2), total: '1' }] }),
        explain: `상대도수가 같은 계급은 ${g.cls(j)}이고 그 상대도수는 ${r2(a[j])}이다. ${names[0]}: ${ta} × ${r2(a[j])} = ${ta * a[j] / 100}(명), ${names[1]}: ${tb} × ${r2(b[j])} = ${tb * b[j] / 100}(명)이다. 상대도수가 같아도 도수의 총합이 다르면 도수는 다르다.`,
        facts: { calc: [[`${ta}*${a[j]}/100`, 0], [`${tb}*${b[j]}/100`, 1]], unseen: [100, a[j]] }
      });
    }),
    T('two-graph-compare', '두 집단의 상대도수 그래프에서 비율 비교하기', '①81', (d) => {
      const c = d.pick(GC), k = 5, [lo, size] = frameOf(d, c, k), names = d.pick(PAIRS.concat(BIG_PAIRS)), [a, b] = twoRels(d, k, 2, (x, y) => x[0] + x[1] !== y[0] + y[1]), g = grp(c, lo, size, a);
      const sa = a[0] + a[1], sb = b[0] + b[1], at = sa > sb ? 0 : 1;
      return C(`다음은 ${pairLead(names)}의 ${wj(c.what, '을/를')} 조사하여 상대도수의 분포를 나타낸 그래프이다. ${wj(c.what, '이/가')} ${amt(g.at(2), c.unit)} 미만인 학생의 비율이 더 높은 쪽은?`, names, at, {
        figure: relFig2(g, a, b, names), explain: `${amt(g.at(2), c.unit)} 미만인 계급의 상대도수의 합은 ${names[0]}: ${r2(a[0])} + ${r2(a[1])} = ${r2(sa)}, ${names[1]}: ${r2(b[0])} + ${r2(b[1])} = ${r2(sb)}이므로 ${names[at]} 쪽의 비율이 더 높다.`,
        facts: { choose: { exprs: [`${r2(a[0])}+${r2(a[1])}`, `${r2(b[0])}+${r2(b[1])}`], rule: 'max' } }
      });
    }),
    T('two-graph-claims', '도수의 총합을 모르는 두 집단의 상대도수 그래프에서 알 수 있는 것', '①83 ②90', (d) => {
      const c = d.pick(GC), k = 5, [lo, size] = frameOf(d, c, k), names = d.pick(PAIRS.concat(BIG_PAIRS)), [A, Bn] = names, [a, b] = twoRels(d, k, 2, (x, y) => x[2] !== y[2]), g = grp(c, lo, size, a), u = c.unit;
      const more = a[2] > b[2] ? A : Bn, less = a[2] > b[2] ? Bn : A, over = b[k - 1] + b[k - 2];
      // 옳은 문장은 하나만 싣는다. 나머지는 도수의 총합을 몰라 알 수 없는 것이거나 그래프와 어긋나는 것이다(옳은 문장과 맞서는 문장은 함께 싣지 않는다).
      const yesAt = d.int(0, 2), yes = [
        `${g.cls(2)}인 학생의 비율은 ${more} 쪽이 더 높다.`,
        `${Bn}의 그래프가 ${A}의 그래프보다 오른쪽으로 치우쳐 있으므로 ${Bn} 학생들의 ${wj(c.what, '이/가')} 상대적으로 ${c.big} 편이다.`,
        `${Bn}에서 ${wj(c.what, '이/가')} ${amt(g.at(k - 2), u)} 이상인 학생은 ${Bn} 학생 전체의 ${over} %이다.`
      ][yesAt];
      const no = d.shuffle([
        [`${g.cls(2)}인 학생 수는 ${more} 쪽이 더 많다.`, '도수의 총합을 알 수 없으므로 학생 수는 비교할 수 없다.', -1],
        [`${A}의 학생 수와 ${Bn}의 학생 수는 같다.`, '상대도수의 그래프만으로는 도수의 총합을 알 수 없다.', -1],
        [`${g.cls(2)}인 학생의 비율은 ${less} 쪽이 더 높다.`, `${g.cls(2)}인 계급의 상대도수는 ${wj(A, '이/가')} ${r2(a[2])}, ${wj(Bn, '이/가')} ${r2(b[2])}이다.`, 0],
        [`${A}의 그래프가 ${Bn}의 그래프보다 오른쪽으로 치우쳐 있으므로 ${A} 학생들의 ${wj(c.what, '이/가')} 상대적으로 ${c.big} 편이다.`, `오른쪽으로 치우친 것은 ${Bn}의 그래프이다.`, 1],
        [`${Bn}에서 ${wj(c.what, '이/가')} ${amt(g.at(k - 2), u)} 이상인 학생은 ${over}명이다.`, '도수의 총합을 알 수 없으므로 학생 수는 구할 수 없다.', -1]
      ].filter((r) => r[2] !== yesAt)).slice(0, 3);
      const rows = d.shuffle([[yes, true, '']].concat(no.map((r) => [r[0], false, r[1]]))), at = rows.findIndex((r) => r[1]);
      return C(`다음은 ${pairLead(names)}의 ${wj(c.what, '을/를')} 조사하여 상대도수의 분포를 나타낸 그래프이다. 이 그래프에서 알 수 있는 것으로 옳은 것은?`, rows.map((r) => r[0]), at, { figure: relFig2(g, a, b, names), explain: rows.filter((r) => !r[1]).map((r) => r[2]).filter((s, i, all) => all.indexOf(s) === i).join(' '), facts: { truth: rows.map((r) => r[1]), want: true } });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
