// 6학년 1학기 5단원 여러 가지 그래프 — 실력 문항.
// 심화꼴(64꼴)과 기본꼴의 어려운 꼴을 번호마다 따져 실었다. 꼴마다의 판정은 수집본의 _분석/6-1-5/싣기_대조표.md 에 있다.
//
// 실력 문항의 잣대: 기본에서 이미 하는 일(값 하나 읽기, 백분율 한 번 구하기, 전체에 백분율 한 번 곱하기)을 고르기로 바꾸고 틀린 보기에 흔한 실수 답을 넣은 것은 실력이 아니다. 둘만 싣는다.
//   ① 문제의 상황·그림에 장치가 있어 뜻을 정확히 대야 풀리는 문제
//      이 단원에서 아이들이 흔히 잘못 아는 것:
//       - 비율이 높으면 수도 많다고 본다(전체 수가 다른 두 그래프) / 비율이 2배이면 수도 2배라고 본다(전체가 다를 때) / 비율이 같으면 수도 같다고 본다
//       - 백분율을 그대로 사람 수로 읽는다(35 %를 35명으로) / 눈금의 칸 수를 백분율로 읽는다(눈금 한 칸이 5 %인 원에서 7칸을 7 %로)
//       - 비율이 낮아지면 수도 줄었다고 본다(전체 수가 늘었을 때)
//       - 「기타」를 한 가지 항목으로 본다 / 백분율이 지워진 항목을 빼고 차례를 센다
//       - 띠그래프에서 길이가 긴 쪽이 비율도 높다고 본다(전체 길이가 다른 두 띠) / 막대의 길이가 2배이면 수도 2배라고 본다(세로 눈금을 물결선으로 줄인 그래프)
//       - 백분율의 합계가 100 %이기만 하면 띠그래프·원그래프로 나타내도 된다고 본다(더한 값이 전체가 되지 않는 자료)
//   ② 두 번 넘게 생각해야 풀리는 문제(한 항목을 다시 나눈 그래프, 지워진 두 항목, 전체 수를 거꾸로 구하기, 두 해의 수 비교, 엇갈려 빈 표, 두 집단 합치기, 자료가 바뀐 뒤의 백분율)
//   그림에서 고르는 문항은 정답이 한눈에 드러나지 않게 했다: 두 원그래프의 칸은 놓인 자리가 다르고 크기 차이는 눈금 한두 칸이며, 세기 쉬운 칸 수로는 가릴 수 없다(칸 수가 많은 쪽의 비율이 더 낮다).
//
// 싣지 않은 것(판정)
//  - 서로 몇 배인 두 빈 항목(심15·39, 기본 ②49 ③31): 남은 비율을 1 : 2로 가르는 비례배분(6학년 2학기).
//  - 자연수 배가 아닌 배로 다른 항목의 수 구하기(심26·28, 기본 ①40), 두 항목의 합으로 다른 항목의 수 구하기(기본 ①43): 비례식의 얼개.
//  - 전체 수를 거꾸로 구하는 것은 10 %·20 %·25 %·50 %일 때만 실었다(그 백분율의 10배·5배·4배·2배가 전체). 30 %처럼 (자연수) ÷ (소수)가 드는 것(기본 ②47의 뒷부분 ②48)은 싣지 않았다.
//  - 띠의 길이를 여러 단계로 셈하기(심32), 조건 넷을 차례로 푸는 것(기본 ②50), 다섯 단계 넘게 이어지는 것(심45의 변형)은 길이 셈·조건 풀이가 일의 대부분이다.
// 묻는 말: 수나 값을 물으면 "~은?/~는?", 양을 물으면 "몇 ~인가?", 시키는 말은 "~구하시오."로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, table, N, M, C } = B.kit;
  const { RATIO, KIND, sum, top, distinct, truthOf, SETS, pc, lead, nth, parts, make, desc, band, pie, cap, cells, tw, word, rule, INK } = B.kit.g615;
  const U = '6-1-5';
  const H = (id, title, ref, make2, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make: make2 }, more || {});
  // 합이 total 인 서로 다른 수 n개(step 의 배수, lo 이상). skip 에 든 수는 쓰지 않는다.
  const fill = (d, n, total, o) => {
    const opt = o || {}, step = opt.step || 5, lo = opt.lo || 10, hi = Math.min(opt.hi || 45, total - lo * (n - 1)), skip = opt.skip || [];
    return d.until(() => { const v = Array.from({ length: n - 1 }, () => d.int(Math.ceil(lo / step), Math.floor(hi / step)) * step); v.push(total - sum(v)); return v; }, (v) => v[n - 1] >= lo && v[n - 1] <= hi && distinct(v.concat(skip)));
  };
  const rowsOf = (tags, names, list, how) => tags.map((tag, r) => ({ tag, cells: names.map((n, i) => Object.assign({ name: n, pct: list[r][i] }, how ? how(r, i) : {})) }));

  // ── 그림 ────────────────────────────────────────────────────
  // 세로 눈금의 아래쪽을 물결선으로 줄인 막대그래프. o: { from: 물결선 위 첫 눈금, step: 눈금 한 칸의 크기, top: 맨 위 눈금, unit: 단위 }
  function cutBars(names, values, o) {
    const ticks = (o.top - o.from) / o.step, hh = 16, W = 64, left = 36, topPad = 24, gap = 24, n = names.length;
    const y = (v) => topPad + (o.top - v) / o.step * hh, cut = topPad + ticks * hh, base = cut + gap, right = left + n * W, width = right + 12, height = base + 24;
    const label = (x, yy, anchor, text) => `<text class="mb-axis-label" style="font-size:11px;font-weight:600" x="${x.toFixed(1)}" y="${yy.toFixed(1)}" text-anchor="${anchor}">${text}</text>`;
    let out = '';
    for (let t = 0; t <= ticks; t += 1) out += `<line class="mb-gridline" x1="${left}" y1="${y(o.from + t * o.step).toFixed(1)}" x2="${right}" y2="${y(o.from + t * o.step).toFixed(1)}"/>` + label(left - 5, y(o.from + t * o.step) + 4, 'end', o.from + t * o.step);
    out += label(left - 5, base + 4, 'end', 0) + label(left - 4, topPad - 10, 'end', `(${o.unit})`);
    values.forEach((v, i) => { out += `<rect x="${(left + i * W + W * 0.29).toFixed(1)}" y="${y(v).toFixed(1)}" width="${(W * 0.42).toFixed(1)}" height="${(base - y(v)).toFixed(1)}" style="fill:#93c5fd;stroke:#1e3a8a;stroke-width:1"/>` + label(left + i * W + W / 2, base + 15, 'middle', names[i]); });
    // 물결선: 0과 첫 눈금 사이를 줄였다는 표시(막대 위에 흰 띠를 두고 물결 두 줄을 긋는다)
    const waves = Math.round((right - left + 8) / 12), half = (right - left + 8) / waves / 2;
    let wave = `M${left - 4} ${(cut + gap / 2).toFixed(1)}`;
    for (let w = 0; w < waves; w += 1) wave += ` q${(half / 2).toFixed(2)} -4 ${half.toFixed(2)} 0 t${half.toFixed(2)} 0`;
    out += `<path d="${wave}" style="fill:none;stroke:#ffffff;stroke-width:7"/><path d="${wave}" transform="translate(0,-3.2)" style="fill:none;stroke:#475569;stroke-width:1.1"/><path d="${wave}" transform="translate(0,3.2)" style="fill:none;stroke:#475569;stroke-width:1.1"/>`;
    out += `<line class="mb-axis" x1="${left}" y1="${topPad}" x2="${left}" y2="${(cut + gap / 2 - 5).toFixed(1)}"/><line class="mb-axis" x1="${left}" y1="${(cut + gap / 2 + 5).toFixed(1)}" x2="${left}" y2="${base}"/><line class="mb-axis" x1="${left}" y1="${base}" x2="${right}" y2="${base}"/>`;
    const said = `막대그래프: 세로 눈금은 물결선으로 0과 ${o.from} 사이를 줄였고, 눈금 한 칸은 ${o.step}${o.unit}. ${names.map((x, i) => `${x} ${values[i]}${o.unit}`).join(', ')}`;
    return `<svg class="mb-geo" viewBox="0 0 ${width} ${height}" width="${width}" role="img" aria-label="${said}">${out}</svg>`;
  }
  // 전체 길이가 다른 띠 둘에서 한 항목이 차지하는 부분의 길이(cm)를 적은 그림. rows: [{ tag, len: 전체 길이, at: 항목이 시작하는 곳, size: 항목의 길이 }], item: 항목 이름
  function lenBars(rows, item) {
    const W = 288, x0 = 34, s = (W - x0 - 8) / Math.max(...rows.map((r) => r.len)), hh = 26;
    const dim = (xa, xb, yy, text, up) => rule(xa, yy, xb, yy, '#475569', 0.9) + rule(xa, yy - 3.5, xa, yy + 3.5, '#475569', 0.9) + rule(xb, yy - 3.5, xb, yy + 3.5, '#475569', 0.9) + word((xa + xb) / 2, yy + (up ? -5 : 13), text, 11);
    let out = '', y = 22;
    rows.forEach((r) => {
      const xa = x0 + r.at * s, xb = xa + r.size * s;
      out += word(3, y + 17.5, r.tag, 12, 'start') + `<rect x="${x0}" y="${y}" width="${(r.len * s).toFixed(1)}" height="${hh}" style="fill:#f8fafc;stroke:#334155;stroke-width:1"/><rect x="${xa.toFixed(1)}" y="${y}" width="${(r.size * s).toFixed(1)}" height="${hh}" style="fill:${INK[1]};stroke:#334155;stroke-width:1"/>`;
      if (tw(item, 11) + 3 <= r.size * s) out += word((xa + xb) / 2, y + 17.5, item, 11);
      out += dim(xa, xb, y - 7, `${r.size} cm`, true) + dim(x0, x0 + r.len * s, y + hh + 8, `전체 ${r.len} cm`, false);
      y += hh + 58;
    });
    const said = `전체 길이가 다른 두 띠그래프에서 ${item}의 길이: ${rows.map((r) => `${r.tag}는 전체 ${r.len} cm 가운데 ${r.size} cm`).join(', ')}`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${y - 30}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  B.addGroup(U, {
    id: 'hard', title: '단원 종합', standard: RATIO,
    types: [
      // ── ① 장치가 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('h-duo-more', '전체 수가 다른 두 원그래프에서 수가 더 많은 쪽 찾기', '50, 기본 ②41 ③41', (d) => {
        // 장치: 비율이 더 높은 학년의 학생 수가 오히려 적다. 비율만 비교하면 틀리고, 학년마다 (전체 수) × (백분율)로 수를 구해야 한다.
        // 보기: [수가 많은 학년, 바른 차] 정답 / [비율이 높은 학년, 바른 차] 비율이 높으면 수도 많다고 보는 아이 / [어느 학년, 백분율의 차] 백분율의 차를 학생 수의 차로 읽는 아이
        const c = SETS.sport, names = d.shuffle(c.names).slice(0, 4), k = d.int(0, 3), x = names[k];
        const [ta, tb, pa, pb] = d.until(() => [d.pick([200, 300, 400]), d.pick([300, 400, 500]), d.int(4, 8) * 5, d.int(3, 7) * 5], ([a, b, p, q]) => a < b && p > q && a * p < b * q && (b * q - a * p) / 100 !== p - q);
        const flip = d.bool(), T2 = flip ? [tb, ta] : [ta, tb], P = flip ? [pb, pa] : [pa, pb], n = [T2[0] * P[0] / 100, T2[1] * P[1] / 100], win = n[0] > n[1] ? 0 : 1, gap = Math.abs(n[0] - n[1]), alt = Math.abs(P[0] - P[1]), grades = ['5학년', '6학년'];
        const data = P.map((p) => { const rest = fill(d, 3, 100 - p, { skip: [p] }), v = rest.slice(); v.splice(k, 0, p); return v; });
        const rows = d.shuffle([[win, gap], [1 - win, gap], [win, alt], [1 - win, alt]]);
        return C(`어느 학교 5학년 학생 ${T2[0]}명과 6학년 학생 ${T2[1]}명이 좋아하는 운동을 조사하여 나타낸 원그래프이다. ${josa(x, '을/를')} 좋아하는 학생이 더 많은 학년과, 두 학년의 ${josa(x, '을/를')} 좋아하는 학생 수의 차를 바르게 짝 지은 것은?`, rows.map(([w, g]) => `${grades[w]}, ${g}명`), rows.findIndex(([w, g]) => w === win && g === gap), {
          figure: data.map((v, r) => cap(`${grades[r]}(${T2[r]}명)`, pie(names.map((nm, i) => ({ name: nm, pct: v[i] })), { r: 70 }))).join(''),
          explain: `5학년은 ${T2[0]} × ${frac(P[0], 100)} = ${n[0]}(명), 6학년은 ${T2[1]} × ${frac(P[1], 100)} = ${n[1]}(명)이다. ${grades[win]}이 ${gap}명 더 많다. 비율은 ${grades[1 - win]}이 더 높지만 전체 학생 수가 다르므로 비율만으로는 학생 수를 비교할 수 없다.`,
          facts: { who: { exprs: [`${T2[0]}*${P[0]}/100`, `${T2[1]}*${P[1]}/100`], values: n, options: rows }, unseen: [100] }
        });
      }),
      H('h-twice-which', '비율이 2배일 때 수도 2배인지 판단하기', '49·50, 기본 ③41', (d) => {
        // 장치: 한 그래프 안에서는 비율이 2배이면 수도 2배이지만(같은 전체), 전체 수가 다른 두 그래프 사이에서는 비율이 2배여도 수는 2배가 아니고, 비율이 같아도 수는 같지 않다.
        // 보기: 한 학교 안에서 2배(옳다) / 두 학교 사이에서 2배(비율의 배를 수의 배로 보는 아이) / 비율이 같으니 수도 같다(전체 수를 보지 않는 아이) / 백분율을 그대로 명으로(35 %를 35명으로 읽는 아이)
        const c = SETS.subject, names = d.shuffle(c.names).slice(0, 4), [a, b, e, f] = names, [t1, t2] = d.pick([[200, 300], [200, 500], [300, 400], [300, 500], [400, 500]]), same = d.pick([25, 30]);
        const rest = d.until(() => { const u = d.int(2, 5) * 5; return [u, 60 - same - u]; }, (v) => v[1] >= 10 && distinct(v.concat([40, same]))), P = [[20, 10, same, 70 - same], [40, rest[0], same, rest[1]]], n = (r, i) => [t1, t2][r] * P[r][i] / 100;
        const rows = d.shuffle([
          [`가 학교에서 ${josa(a, '을/를')} 좋아하는 학생 수는 ${josa(b, '을/를')} 좋아하는 학생 수의 2배이다.`, n(0, 0) === 2 * n(0, 1)],
          [`${josa(a, '을/를')} 좋아하는 학생 수는 나 학교가 가 학교의 2배이다.`, n(1, 0) === 2 * n(0, 0)],
          [`${josa(e, '을/를')} 좋아하는 학생 수는 두 학교가 같다.`, n(0, 2) === n(1, 2)],
          [`가 학교에서 ${josa(e, '을/를')} 좋아하는 학생은 ${same}명이다.`, n(0, 2) === same]
        ]);
        return C(`가 학교 학생 ${t1}명과 나 학교 학생 ${t2}명이 좋아하는 과목을 조사하여 나타낸 띠그래프이다. 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
          figure: cap(c.title, band(rowsOf(['가 학교', '나 학교'], names, P))),
          explain: `가 학교 안에서는 같은 전체에 대한 비율이므로 ${a}(20 %)는 ${b}(10 %)의 2배이다. ${josa(a, '은/는')} 가 학교 ${t1} × ${frac(20, 100)} = ${n(0, 0)}(명), 나 학교 ${t2} × ${frac(40, 100)} = ${n(1, 0)}(명)으로 2배가 아니다. ${josa(e, '은/는')} 두 학교 모두 ${same} %이지만 ${n(0, 2)}명과 ${n(1, 2)}명으로 다르다. 전체 수가 다르면 비율로 수를 비교할 수 없다.`,
          facts: truthOf(rows, true)
        });
      }),
      H('h-tick-compare', '눈금 한 칸의 크기가 다른 두 원그래프 비교하기', '43, 기본 ②3·18', (d) => {
        // 장치: 가 반의 원은 눈금 한 칸이 10 %, 나 반의 원은 5 %이다. 나 반 쪽이 눈금의 칸 수는 더 많지만 비율은 더 낮다. 칸 수를 세어 비교하면 틀린다.
        // 보기: [비율이 높은 반, 바른 차] 정답 / [칸 수가 많은 반, 바른 차] 칸 수를 비율로 보는 아이 / [어느 반, 칸 수의 차를 백분율로 읽은 값] 눈금 한 칸의 크기를 하나로 보고 셈한 아이
        const c = SETS.fruit, names = d.shuffle(c.names).slice(0, 4), [k1, k2] = d.pick([[3, 5], [4, 7], [4, 6], [2, 3], [3, 4]]), p10 = 10 * k1, p5 = 5 * k2, gap = p10 - p5, alt = 5 * (k2 - k1) === gap ? 10 * (k2 - k1) : 5 * (k2 - k1), x = d.int(1, 2);
        const a = fill(d, 3, 100 - p10, { step: 10, skip: [p10] }), b = d.until(() => fill(d, 3, 100 - p5, { lo: 15, skip: [p5] }), (v) => v.some((t) => t % 10 !== 0) || p5 % 10 !== 0), flip = d.bool();
        a.splice(x, 0, p10); b.splice(3 - x, 0, p5);
        // 두 원에서 항목이 놓인 자리가 다르다(같은 이름을 다른 차례로 놓는다).
        const namesB = names.slice(), item = names[x]; namesB.splice(x, 1); namesB.splice(3 - x, 0, item);
        const figs = [pie(names.map((nm, i) => ({ name: nm, pct: a[i], show: 'name' })), { tick: 10, r: 70 }), pie(namesB.map((nm, i) => ({ name: nm, pct: b[i], show: 'name' })), { tick: 5, r: 70 })];
        const vals = flip ? [p5, p10] : [p10, p5], win = flip ? 1 : 0, classes = ['가 반', '나 반'], rows = d.shuffle([[win, gap], [1 - win, gap], [win, alt], [1 - win, alt]]);
        return C(`어느 학교 6학년 가 반과 나 반 학생들이 좋아하는 과일을 조사하여 나타낸 원그래프이다. ${josa(item, '을/를')} 좋아하는 학생 수의 비율이 더 높은 반과, 두 반의 그 비율의 차를 바르게 짝 지은 것은?`, rows.map(([w, g]) => `${classes[w]}, ${pc(g)}`), rows.findIndex(([w, g]) => w === win && g === gap), {
          figure: cap('가 반', figs[flip ? 1 : 0]) + cap('나 반', figs[flip ? 0 : 1]),
          explain: `${classes[win]}의 원은 눈금 0과 50 사이가 5칸이므로 한 칸이 10 %이고, ${josa(item, '은/는')} ${k1}칸이므로 ${pc(p10)}이다. ${classes[1 - win]}의 원은 눈금 0과 25 사이가 5칸이므로 한 칸이 5 %이고, ${josa(item, '은/는')} ${k2}칸이므로 ${pc(p5)}이다. ${classes[win]}이 ${p10} - ${p5} = ${gap}(%) 더 높다. 칸 수는 ${classes[1 - win]} 쪽이 많지만 한 칸의 크기가 다르다.`,
          facts: { who: { exprs: vals.map(String), values: vals, options: rows } }
        });
      }),
      H('h-etc-rank', '기타가 있는 띠그래프에서 몇 번째로 많은 항목 찾기', '37, 기본 ②20', (d) => {
        // 장치: 「기타」의 칸이 이름 있는 칸보다 넓다. 기타는 한 가지 항목이 아니라 수가 적은 여러 항목을 모은 것이므로 차례를 셀 때 넣지 않는다.
        // 보기: 바른 항목 / 기타(기타를 한 항목으로 세는 아이) / 한 칸 앞의 항목 / 한 칸 뒤의 항목(기타를 넣어 세어 한 칸 밀린 아이)
        const c = SETS.sport, r = d.pick([2, 3]), v = d.until(() => parts(d, 5, { lo: 5, hi: 40, ok: distinct }), (x) => { const s = x.slice().sort((p, q) => q - p); return s[r - 1] <= 25 && s[4] >= 10; }).sort((p, q) => q - p);
        const etc = v[r - 1], named = v.filter((_, i) => i !== r - 1), names = d.shuffle(c.names).slice(0, 4), g = { c, names: names.concat(['기타']), p: named.concat([etc]) };
        const rows = d.shuffle([[names[r - 1], true], ['기타', false], [names[r - 2], false], [names[r], false]]);
        return C(`${lead(c, '띠그래프')} 「기타」는 좋아하는 학생이 ${names[3]}보다 적은 운동 여러 가지를 모은 것이다. 좋아하는 학생 수가 ${r === 2 ? '두' : '세'} 번째로 많은 운동은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
          figure: cap(c.title, band(cells(g))),
          explain: `「기타」는 한 가지 운동이 아니라 여러 운동을 모은 것이고, 그 운동 하나하나는 ${names[3]}보다 적다. 운동만 놓고 많은 것부터 쓰면 ${names.map((x, i) => `${x}(${pc(named[i])})`).join(', ')}이므로 ${r === 2 ? '두' : '세'} 번째는 ${names[r - 1]}이다.`,
          facts: truthOf(rows, true)
        });
      }),
      H('h-band-lengths', '전체 길이가 다른 두 띠그래프에서 비율 비교하기', '31·53', (d) => {
        // 장치: 띠의 전체 길이가 다르다. 차지하는 길이가 긴 쪽의 비율이 더 낮다. 길이가 아니라 (차지하는 길이) ÷ (전체 길이)를 비교해야 한다.
        // 보기: [비율이 높은 쪽, 바른 차] 정답 / [길이가 긴 쪽, 바른 차] 길이가 길면 비율도 높다고 보는 아이 / [어느 쪽, 길이의 차] 길이의 차(cm)를 백분율의 차로 읽는 아이
        const item = d.pick(SETS.fruit.names.slice(0, 5));
        const [la, xa, lb, xb] = d.until(() => { const a = d.pick([20, 25, 40, 50]), b = d.pick([10, 20, 25]); return [a, d.int(4, Math.floor(a / 2)), b, d.int(2, b - 3)]; }, ([a, x, b, y]) => a > b && x > y && (x * 100) % a === 0 && (y * 100) % b === 0 && x * 100 / a < y * 100 / b && x * 100 / a >= 15 && y * 100 / b <= 60 && y * 100 / b - x * 100 / a !== x - y);
        const flip = d.bool(), rowA = { len: la, size: xa, at: d.int(1, la - xa - 1) }, rowB = { len: lb, size: xb, at: d.int(1, lb - xb - 1) }, rows2 = (flip ? [rowB, rowA] : [rowA, rowB]).map((r, i) => Object.assign({ tag: ['(가)', '(나)'][i] }, r));
        const vals = rows2.map((r) => r.size * 100 / r.len), win = vals[0] > vals[1] ? 0 : 1, gap = Math.abs(vals[0] - vals[1]), alt = Math.abs(xa - xb), rows = d.shuffle([[win, gap], [1 - win, gap], [win, alt], [1 - win, alt]]);
        return C(`어느 학교 5학년과 6학년 학생들이 좋아하는 과일을 조사하여 전체 길이가 다른 두 띠그래프 (가), (나)로 나타내었다. 그림은 두 띠그래프에서 ${josa(item, '이/가')} 차지하는 부분의 길이를 잰 것이다. ${item}의 비율이 더 높은 그래프와, 두 그래프에서 ${item}의 비율의 차를 바르게 짝 지은 것은?`, rows.map(([w, g]) => `${['(가)', '(나)'][w]}, ${pc(g)}`), rows.findIndex(([w, g]) => w === win && g === gap), {
          figure: lenBars(rows2, item),
          explain: `(가)에서 ${josa(item, '은/는')} ${frac(rows2[0].size, rows2[0].len)} × 100 = ${vals[0]}(%), (나)에서는 ${frac(rows2[1].size, rows2[1].len)} × 100 = ${vals[1]}(%)이다. ${['(가)', '(나)'][win]}가 ${gap} % 더 높다. 차지하는 길이는 ${['(가)', '(나)'][1 - win]} 쪽이 길지만 띠의 전체 길이가 다르므로 길이만으로는 비율을 비교할 수 없다.`,
          facts: { who: { exprs: rows2.map((r) => `${r.size}*100/${r.len}`), values: vals, options: rows }, unseen: [100] }
        });
      }),
      H('h-down-but-up', '비율은 낮아졌지만 수는 늘어난 항목 찾기', '48, 22의 변형', (d) => {
        // 장치: 전체 학생 수가 늘었다. 비율이 낮아진 운동이 둘인데, 하나는 학생 수가 줄었고 하나는 오히려 늘었다. 비율이 낮아졌다고 수가 줄었다고 볼 수 없다.
        // 보기(운동 넷): 비율↓·수↑(정답) / 비율↓·수↓(비율이 낮아진 것만 보고 고르는 아이) / 비율↑(수가 늘어난 것만 보고 고르는 아이) 둘
        const c = SETS.sport, names = d.shuffle(c.names).slice(0, 4), [t1, t2] = d.pick([[200, 300], [200, 400], [300, 500], [400, 500]]);
        const kind = (a, b, i) => (b[i] < a[i] ? (t2 * b[i] > t1 * a[i] ? 'hit' : t2 * b[i] < t1 * a[i] ? 'down' : 'tie') : b[i] > a[i] ? 'up' : 'same');
        const [a, b] = d.until(() => [parts(d, 4, { lo: 15, hi: 45 }), parts(d, 4, { lo: 15, hi: 45 })], ([x, y]) => { const ks = [0, 1, 2, 3].map((i) => kind(x, y, i)); return ks.filter((t) => t === 'hit').length === 1 && ks.filter((t) => t === 'down').length === 1 && ks.filter((t) => t === 'up').length === 2; });
        const ks = [0, 1, 2, 3].map((i) => kind(a, b, i)), hit = ks.indexOf('hit'), down = ks.indexOf('down'), n1 = a.map((p) => t1 * p / 100), n2 = b.map((p) => t2 * p / 100);
        return C(`어느 학교 학생들이 좋아하는 운동을 2020년과 2025년에 조사하여 나타낸 띠그래프이다. 조사한 학생은 2020년에 ${t1}명, 2025년에 ${t2}명이다. 2020년보다 비율은 낮아졌지만 좋아하는 학생 수는 늘어난 운동은?`, names, hit, {
          figure: cap(c.title, band(rowsOf(['2020년', '2025년'], names, [a, b]))),
          explain: `비율이 낮아진 운동은 ${josa(names[Math.min(hit, down)], '과/와')} ${names[Math.max(hit, down)]}이다. ${josa(names[hit], '은/는')} ${t1} × ${frac(a[hit], 100)} = ${n1[hit]}(명)에서 ${t2} × ${frac(b[hit], 100)} = ${n2[hit]}(명)으로 늘었고, ${josa(names[down], '은/는')} ${n1[down]}명에서 ${n2[down]}명으로 줄었다. 전체 학생 수가 늘었으므로 비율이 낮아져도 학생 수는 늘 수 있다.`,
          facts: { truth: ks.map((t) => t === 'hit'), want: true }
        });
      }),
      H('h-cut-axis', '세로 눈금을 줄인 막대그래프의 자료를 띠그래프로 나타내기', '기본 ③49, 교육과정의 「정보를 왜곡하는 오류」', (d) => {
        // 장치: 세로 눈금이 0이 아닌 수에서 시작하여 막대의 길이가 실제 수의 비를 나타내지 않는다. 막대의 길이(칸 수)로 비율을 어림하면 틀리고, 눈금에서 수를 읽어 전체에 대한 비율을 구해야 한다.
        const [total, yes, from, step, roof] = d.pick([[25, 13, 10, 1, 15], [25, 14, 10, 1, 15], [20, 11, 8, 1, 12], [20, 12, 6, 2, 12], [25, 16, 8, 1, 16]]), no = total - yes, askYes = d.bool(), asked = askYes ? yes : no, word2 = askYes ? '찬성' : '반대';
        return N(`어느 반 학생 모두에게 체험 학습을 과학관으로 가는 것에 찬성하는지 반대하는지 물어 나타낸 막대그래프이다. 이 자료를 띠그래프로 나타내면 ${josa(word2, '은/는')} 전체의 몇 %를 차지하는가?`, asked * 100 / total, {
          unit: '%', figure: cutBars(['찬성', '반대'], [yes, no], { from, step, top: roof, unit: '명' }),
          explain: `세로 눈금은 물결선으로 0과 ${from} 사이를 줄였다. 눈금을 읽으면 찬성 ${yes}명, 반대 ${no}명이고 모두 ${yes} + ${no} = ${total}(명)이다. ${josa(word2, '은/는')} ${frac(asked, total)} × 100 = ${asked * 100 / total}(%)이다. 막대의 길이는 ${(yes - from) / step}칸과 ${(no - from) / step}칸이지만, 눈금이 0에서 시작하지 않으므로 막대의 길이로 비율을 어림하면 안 된다.`,
          facts: { calc: [[`${asked}*100/(${yes}+${no})`, 0]], unseen: [100] }
        });
      }, { standard: KIND }),
      H('h-kind-temp', '원그래프로 나타내기에 알맞지 않은 자료 알아채기', '57, 기본 ②54·56', (d) => {
        // 장치: 기온을 더한 값이 마침 100이라 백분율이 깔끔하게 나온다. 그러나 기온은 더해서 전체가 되는 양이 아니므로 「전체에 대한 부분의 비율」이 뜻을 갖지 못한다.
        // 보기: 알맞지 않다(옳다) / 합계가 100 %이니 알맞다(합계만 보는 아이) / 넓은 부분부터 보면 변화를 안다(원그래프로 변화를 읽으려는 아이) / 변하는 값은 그래프로 못 나타낸다(알맞지 않다는 말만 보고 고르는 아이 — 꺾은선그래프를 잊었다)
        // 보기의 길이를 비슷하게 맞추고, 「알맞지 않다」 쪽 말도 둘을 두어 말투로는 고를 수 없게 했다.
        const days = ['월', '화', '수', '목'], t = d.until(() => Array.from({ length: 4 }, () => d.int(20, 30)), (v) => sum(v) === 100 && distinct(v)), who = d.pick(NAMES);
        const rows = d.shuffle([
          ['기온을 더한 값은 전체가 되는 양이 아니므로, 전체에 대한 비율을 나타내는 원그래프는 알맞지 않다.', true],
          ['백분율의 합계가 100 %가 되었으므로, 자료에 알맞게 나타낸 원그래프이다.', false],
          ['원그래프에서 넓은 부분부터 차례로 보면, 기온이 변한 모습을 한눈에 알 수 있다.', false],
          ['기온처럼 날마다 변하는 값은 표로 나타낼 수는 있어도 그래프로는 나타낼 수 없다.', false]
        ]);
        return C(`${name(who, '이/가')} 요일별 낮 기온을 조사한 표를 보고, 네 날의 기온을 모두 더한 값을 전체로 하여 원그래프로 나타내었다. 이 원그래프에 대한 설명으로 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
          figure: table(['요일', '낮 기온(°C)'], days.map((x, i) => [x, t[i]])) + cap('요일별 낮 기온', pie(days.map((x, i) => ({ name: x, pct: t[i] })), { tick: 1 })),
          explain: '띠그래프와 원그래프는 전체를 여러 부분으로 나눈 자료에서 전체에 대한 각 부분의 비율을 나타낸다. 네 날의 기온을 더한 값은 무엇의 전체도 아니므로 비율을 구해도 뜻이 없다. 기온이 요일에 따라 변한 모습은 꺾은선그래프로 나타낸다.',
          facts: truthOf(rows, true)
        });
      }, { standard: KIND }),
      H('h-miss-rank', '지워진 백분율을 구해 몇 번째로 많은 항목 찾기', '12', (d) => {
        // 장치: 지워진 칸의 항목이 찾는 차례보다 앞선다. 지워진 칸을 빼고 차례를 세면 한 칸 밀린 항목을 고르게 된다.
        const r = d.pick([2, 3]), g = make(d, 'job', 5, { lo: 5, hi: 40, ok: distinct }), c = g.c, order = desc(g.p), blank = order[d.int(0, r - 2)], others = g.p.filter((_, i) => i !== blank);
        return C(`${c.intro} 조사하여 백분율로 나타낸 표인데 한 칸이 지워졌다. ${josa(nth(c, r), '은/는')}?`, g.names, order[r - 1], {
          figure: table([c.noun, '백분율(%)'], g.names.map((x, i) => [x, i === blank ? box('') : g.p[i]]).concat([['합계', 100]])),
          explain: `지워진 ${josa(g.names[blank], '은/는')} 100 - ${others.join(' - ')} = ${g.p[blank]}(%)이다. 백분율이 큰 것부터 쓰면 ${order.slice(0, r).map((i) => `${g.names[i]}(${pc(g.p[i])})`).join(', ')}이므로 ${r === 2 ? '두' : '세'} 번째는 ${g.names[order[r - 1]]}이다. 지워진 칸을 빼고 세면 안 된다.`,
          facts: { rank: { values: g.p, nth: r } }
        });
      }),
      H('h-tick-people', '눈금으로 읽은 두 항목의 수의 차', '53, 기본 ②18', (d) => {
        // 장치: 백분율이 적혀 있지 않고, 눈금 한 칸은 5 %이며, 전체는 100명이 아니다. 칸 수의 차(3칸)나 백분율의 차(15 %)를 그대로 명으로 읽으면 틀린다. 눈금 한 칸이 학생 몇 명인지 따져야 한다.
        const g = make(d, 'pet', 4, { lo: 15, hi: 40, ok: (v) => distinct(v) && v.some((x, i) => v.some((y, j) => i !== j && x - y >= 10)) }), c = g.c, total = d.pick([200, 300, 400, 500]);
        const [i, j] = d.pick(g.p.flatMap((x, a) => g.p.map((y, b) => [a, b]).filter(([p, q]) => g.p[p] - g.p[q] >= 10))), per = total * 5 / 100, gap = g.p[i] - g.p[j];
        return N(`${lead(c, '띠그래프')} 조사한 학생이 ${total}명일 때, ${josa(c.one(g.names[i]), '은/는')} ${c.one(g.names[j])}보다 몇 명 더 많은가?`, total * gap / 100, {
          unit: '명', figure: cap(c.title, band(cells(g, { show: 'name' }))),
          explain: `작은 눈금 한 칸은 5 %이고, 전체가 ${total}명이므로 한 칸은 ${total} × ${frac(5, 100)} = ${per}(명)을 나타낸다. ${josa(g.names[i], '은/는')} ${g.p[i] / 5}칸(${pc(g.p[i])}), ${josa(g.names[j], '은/는')} ${g.p[j] / 5}칸(${pc(g.p[j])})이므로 ${gap / 5}칸 차이이고, ${per} × ${gap / 5} = ${total * gap / 100}(명)이다.`,
          facts: { calc: [[`${total}*(${g.p[i]}-${g.p[j]})/100`, 0]], unseen: [100] }
        });
      }),
      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('h-nested-count', '한 항목을 다시 나눈 그래프에서 수 구하기', '51, 기본 ①44 ②46 ③43', (d) => {
        // 둘째 그래프의 전체는 첫째 그래프의 한 항목이다. 전체 학생 수에 둘째 그래프의 백분율을 바로 곱하면 틀린다.
        const total = d.pick([400, 800]), grades = ['4학년', '5학년', '6학년'], pg = parts(d, 3, { lo: 25, hi: 45, ok: distinct }), k = d.int(0, 2), c = SETS.sport, names = d.shuffle(c.names).slice(0, 4), q = parts(d, 4, { lo: 15, hi: 40, ok: distinct }), m = d.int(0, 3), part = total * pg[k] / 100, ans = part * q[m] / 100;
        return N(`어느 학교 4, 5, 6학년 학생 ${total}명의 학년별 학생 수를 나타낸 띠그래프와, 그 가운데 ${grades[k]} 학생들이 좋아하는 운동을 조사하여 나타낸 원그래프이다. ${josa(names[m], '을/를')} 좋아하는 ${grades[k]} 학생은 몇 명인가?`, ans, {
          unit: '명', figure: cap('학년별 학생 수', band(grades.map((x, i) => ({ name: x, pct: pg[i] })))) + cap(`${grades[k]} 학생들이 좋아하는 운동`, pie(names.map((x, i) => ({ name: x, pct: q[i] })))),
          explain: `${grades[k]} 학생은 ${total} × ${frac(pg[k], 100)} = ${part}(명)이다. 원그래프의 전체는 ${grades[k]} 학생 ${part}명이므로 ${josa(names[m], '을/를')} 좋아하는 ${grades[k]} 학생은 ${part} × ${frac(q[m], 100)} = ${ans}(명)이다.`,
          facts: { calc: [[`${total}*${pg[k]}/100*${q[m]}/100`, 0]], unseen: [100] }
        });
      }),
      H('h-nested-percent', '부분의 부분이 전체의 몇 %인지 구하기', '51의 변형, 기본 ②47의 앞부분', (d) => {
        const land = ['논', '밭', '산', '기타'], p = d.pick([20, 40]), others = d.until(() => { const a = d.int(4, 9) * 5; return [a, 90 - p - a]; }, (v) => v[1] >= 15 && distinct(v.concat([p]))), pl = [others[0], p, others[1], 10];
        const c = SETS.field, names = d.shuffle(c.names).slice(0, 4), q = parts(d, 4, { lo: 15, hi: 40, ok: distinct }), m = d.int(0, 3), ans = p * q[m] / 100;
        return N(`어느 마을의 땅을 쓰임에 따라 나누어 나타낸 띠그래프와, 그 가운데 밭에 심은 채소별 넓이를 조사하여 나타낸 원그래프이다. ${josa(names[m], '을/를')} 심은 밭의 넓이는 마을 전체 땅의 넓이의 몇 %인가?`, ans, {
          unit: '%', figure: cap('쓰임별 땅의 넓이', band(land.map((x, i) => ({ name: x, pct: pl[i] })))) + cap('밭에 심은 채소별 넓이', pie(names.map((x, i) => ({ name: x, pct: q[i] })))),
          explain: `밭은 마을 전체 땅의 ${pc(p)}이고, ${josa(names[m], '을/를')} 심은 밭은 밭 전체의 ${pc(q[m])}이다. 마을 전체 땅을 100이라고 하면 밭은 ${p}이고, ${josa(names[m], '을/를')} 심은 밭은 ${p} × ${frac(q[m], 100)} = ${ans}이다. 따라서 마을 전체 땅의 ${pc(ans)}이다. 원그래프의 ${pc(q[m])}는 밭 전체에 대한 비율이지 마을 전체에 대한 비율이 아니다.`,
          facts: { calc: [[`${p}*${q[m]}/100`, 0]], unseen: [100] }
        });
      }),
      H('h-miss-same', '비율이 같은 지워진 두 항목의 백분율 구하기', '14·38, 기본 ①17 ②30', (d) => {
        const c = SETS.subject, names = d.shuffle(c.names).slice(0, 5), [same, known] = d.until(() => { const x = d.int(6, 12) * 2 + 1; return [x, fill(d, 3, 100 - 2 * x, { step: 2, lo: 12, skip: [x] })]; }, ([x, v]) => x >= 13 && top(v) <= 40);
        const at = d.shuffle([0, 1, 2, 3, 4]), p = []; p[at[0]] = same; p[at[1]] = same; known.forEach((v, i) => { p[at[i + 2]] = v; });
        const [i, j] = [at[0], at[1]].sort((x, y) => x - y), others = p.filter((_, k) => k !== i && k !== j);
        return N(`${c.intro} 조사하여 나타낸 원그래프인데 백분율 두 개가 지워졌다. ${josa(names[i], '과/와')} ${names[j]}의 비율이 같을 때, ${josa(c.one(names[i]), '은/는')} 전체의 몇 %인가?`, same, {
          unit: '%', figure: cap(c.title, pie(names.map((x, k) => ({ name: x, pct: p[k], show: k === i || k === j ? 'blank' : 'both' })), { tick: 10 })),
          explain: `${josa(names[i], '과/와')} ${names[j]}의 백분율의 합은 100 - ${others.join(' - ')} = ${2 * same}(%)이다. 두 비율이 같으므로 ${2 * same} ÷ 2 = ${same}(%)이다.`,
          facts: { calc: [[`(100-${others.join('-')})/2`, 0]], unseen: [2] }
        });
      }),
      H('h-back-total', '지워진 백분율을 구해 전체 수 구하기', '29, 기본 ①41 ②40 ③35', (d) => {
        // 전체 수를 거꾸로 구하는 것은 10 %·20 %·25 %·50 %일 때만(그 백분율의 10배·5배·4배·2배가 100 %).
        const c = SETS.place, names = d.shuffle(c.names).slice(0, 4), [x, times] = d.pick([[10, 10], [20, 5], [25, 4], [50, 2]]), total = d.pick([200, 400, 600, 800]), n = total * x / 100;
        // 지워진 칸의 금이 눈금(한 칸 10 %) 위에 놓이지 않게 한다. 눈금으로 읽을 수 없으므로 100에서 나머지를 빼어 구해야 한다.
        const [known, k] = d.until(() => [fill(d, 3, 100 - x, { step: 1, lo: 12, skip: [x] }), d.int(1, 3)], ([v, at]) => sum(v.slice(0, at)) % 5 !== 0 && v.every((y) => y % 5 !== 0)), p = known.slice(); p.splice(k, 0, x);
        return N(`${c.intro} 조사하여 나타낸 원그래프인데 백분율 하나가 지워졌다. ${josa(c.one(names[k]), '이/가')} ${n}명일 때, 조사한 학생은 모두 몇 명인가?`, total, {
          unit: '명', figure: cap(c.title, pie(names.map((nm, i) => ({ name: nm, pct: p[i], show: i === k ? 'blank' : 'both' })), { tick: 10 })),
          explain: `${josa(names[k], '은/는')} 100 - ${known.join(' - ')} = ${x}(%)이다. ${x} %의 ${times}배가 100 %이므로 조사한 학생은 ${n} × ${times} = ${total}(명)이다.`,
          facts: { calc: [[`${n}*(100/(100-${known.join('-')}))`, 0]] }
        });
      }),
      H('h-back-other', '한 항목의 수로 전체 수를 구한 뒤 다른 항목의 수 구하기', '30, 기본 ①42', (d) => {
        // 두 백분율이 자연수 배가 아니어서 「몇 배」로 바로 갈 수 없다. 전체 수를 거쳐야 한다.
        const c = SETS.place, names = d.shuffle(c.names).slice(0, 4), [x, times] = d.pick([[10, 10], [20, 5], [25, 4], [50, 2]]), total = d.pick([200, 400, 600, 800]);
        const rest = d.until(() => fill(d, 3, 100 - x, { lo: 5, skip: [x] }), (v) => v.some((y) => y % x !== 0 && y >= 15)), y = d.pick(rest.filter((v) => v % x !== 0 && v >= 15)), order = d.shuffle([x].concat(rest)), i = order.indexOf(x), j = order.indexOf(y), n = total * x / 100, ans = total * y / 100;
        return N(`${lead(c, '띠그래프')} ${josa(c.one(names[i]), '이/가')} ${n}명일 때, ${josa(c.one(names[j]), '은/는')} 몇 명인가?`, ans, {
          unit: '명', figure: cap(c.title, band(names.map((nm, k) => ({ name: nm, pct: order[k] })))),
          explain: `${josa(names[i], '은/는')} ${pc(x)}이고 ${x} %의 ${times}배가 100 %이므로 조사한 학생은 ${n} × ${times} = ${total}(명)이다. ${josa(names[j], '은/는')} ${pc(y)}이므로 ${total} × ${frac(y, 100)} = ${ans}(명)이다.`,
          facts: { calc: [[`${n}*(100/${x})*${y}/100`, 0]], unseen: [100] }
        });
      }),
      H('h-years-increase', '두 해의 그래프와 전체 양으로 늘어난 양 구하기', '22의 변형, 기본 ③41의 변형', (d) => {
        const names = d.shuffle(['사과', '배', '감', '포도', '자두']).slice(0, 4), [t1, t2] = d.pick([[400, 500], [500, 800], [200, 300], [300, 500]]);
        const [a, b] = d.until(() => [parts(d, 4, { lo: 15, hi: 45 }), parts(d, 4, { lo: 15, hi: 45 })], ([x, y]) => x.some((v, i) => y[i] > v)), k = d.pick([0, 1, 2, 3].filter((i) => b[i] > a[i])), n1 = t1 * a[k] / 100, n2 = t2 * b[k] / 100;
        return N(`어느 과수원의 과일 생산량을 2020년과 2025년에 종류별로 조사하여 나타낸 띠그래프이다. 전체 생산량은 2020년에 ${t1} kg, 2025년에 ${t2} kg이다. ${names[k]} 생산량은 2020년보다 2025년에 몇 kg 늘었는가?`, n2 - n1, {
          unit: 'kg', figure: cap('과일별 생산량', band(rowsOf(['2020년', '2025년'], names, [a, b]))),
          explain: `${names[k]} 생산량은 2020년에 ${t1} × ${frac(a[k], 100)} = ${n1}(kg), 2025년에 ${t2} × ${frac(b[k], 100)} = ${n2}(kg)이다. ${n2} - ${n1} = ${n2 - n1}(kg) 늘었다.`,
          facts: { calc: [[`${t2}*${b[k]}/100-${t1}*${a[k]}/100`, 0]], unseen: [100] }
        });
      }),
      H('h-rest-amount', '지워진 항목이 낀 두 항목을 합한 수 구하기', '23, 기본 ②38', (d) => {
        const c = SETS.color, names = d.shuffle(c.names).slice(0, 4), g = { c, names, p: parts(d, 4, { step: 2, lo: 14, hi: 40, ok: (v) => distinct(v) && v.filter((x) => x % 5 !== 0).length >= 3 }) }, total = d.pick([200, 400, 500]), [i, j] = d.until(() => d.shuffle([0, 1, 2, 3]).slice(0, 2), (v) => g.p[v[1]] % 5 !== 0), others = g.p.filter((_, k) => k !== i && k !== j), both = `${names[i]} 또는 ${names[j]}`, p = g.p[i] + g.p[j];
        return N(`${c.intro} 조사하여 나타낸 원그래프인데 백분율 하나가 지워졌다. 조사한 학생이 ${total}명일 때, ${josa(c.one(both), '은/는')} 모두 몇 명인가?`, total * p / 100, {
          unit: '명', figure: cap(c.title, pie(names.map((x, k) => ({ name: x, pct: g.p[k], show: k === j ? 'blank' : 'both' })), { tick: 10 })),
          explain: `${josa(c.one(both), '은/는')} 전체에서 나머지를 뺀 100 - ${others.join(' - ')} = ${p}(%)이다. ${total} × ${frac(p, 100)} = ${total * p / 100}(명)이다.`,
          facts: { calc: [[`${total}*(100-${others.join('-')})/100`, 0]] }
        });
      }),
      H('h-miss-times-count', '지워진 백분율을 구해 몇 배인지 알아낸 뒤 수 구하기', '27', (d) => {
        const c = SETS.snack, names = d.shuffle(c.names).slice(0, 4), [a, k, total] = d.until(() => [d.pick([8, 12, 14, 16, 18]), d.pick([2, 3]), d.pick([50, 150, 200, 250, 300, 400, 500])], ([x, m, t]) => x * m <= 48 && (t * x) % 100 === 0 && 100 - x - x * m >= 26);
        const known = fill(d, 2, 100 - a - a * k, { step: 2, lo: 12, skip: [a, a * k] }), order = d.shuffle([a, a * k].concat(known)), i = order.indexOf(a), j = order.indexOf(a * k), n = total * a / 100;
        return N(`${c.intro} 조사하여 나타낸 띠그래프인데 백분율 하나가 지워졌다. ${josa(c.one(names[i]), '이/가')} ${n}명일 때, ${josa(c.one(names[j]), '은/는')} 몇 명인가?`, n * k, {
          unit: '명', figure: cap(c.title, band(names.map((x, m) => ({ name: x, pct: order[m], show: m === j ? 'blank' : 'both' })), { tick: 10 })),
          explain: `${josa(names[j], '은/는')} 100 - ${order.filter((_, m) => m !== j).join(' - ')} = ${a * k}(%)이다. ${names[j]}의 비율은 ${names[i]}의 비율의 ${a * k} ÷ ${a} = ${k}(배)이므로 학생 수도 ${k}배이다. ${n} × ${k} = ${n * k}(명)이다.`,
          facts: { calc: [[`${n}*((100-${order.filter((_, m) => m !== j).join('-')})/${a})`, 0]] }
        });
      }),
      H('h-cross-table', '수와 백분율이 엇갈려 빈 표 채우기', '35, 기본 ②27', (d) => {
        // 칸마다 하는 일이 다르다: 백분율만 적힌 항목은 (전체) × (백분율)로, 아무것도 적히지 않은 항목은 합계에서 나머지를 빼어 구한다.
        const c = SETS.fruit, [total, step] = d.pick([[50, 2], [200, 5]]), g = make(d, 'fruit', 5, { etc: true, step, lo: step === 2 ? 6 : 5, hi: 40, ok: distinct }), n = g.p.map((p) => p * total / 100), k = d.int(0, 3), seen = n.filter((_, i) => i !== k && i !== 4);
        return M(`${c.intro} 조사하여 표로 나타내고 있다. ㉠, ㉡에 알맞은 수를 차례로 구하시오.`, [{ label: '㉠', answer: n[k], unit: '명' }, { label: '㉡', answer: n[4], unit: '명' }], {
          figure: table([c.noun, '학생 수(명)', '백분율(%)'], g.names.map((x, i) => [x, i === k ? box('㉠') : i === 4 ? box('㉡') : n[i], i === k ? g.p[k] : '']).concat([['합계', total, 100]])),
          explain: `${josa(g.names[k], '은/는')} 전체의 ${pc(g.p[k])}이므로 ㉠은 ${total} × ${frac(g.p[k], 100)} = ${n[k]}(명)이다. 기타는 합계에서 나머지를 빼어 ㉡은 ${total} - ${seen.join(' - ')} - ${n[k]} = ${n[4]}(명)이다.`,
          facts: { calc: [[`${total}*${g.p[k]}/100`, 0], [`${total}-${seen.join('-')}-${total}*${g.p[k]}/100`, 1]], unseen: [100] }
        });
      }),
      H('h-merge', '두 집단을 합친 뒤의 백분율 구하기', '기본 ③42', (d) => {
        // 두 반의 학생 수가 다르므로 두 백분율의 가운데 값이 답이 아니다. 반마다 학생 수를 구해 더한 뒤 전체에 대한 비율을 다시 구한다.
        const c = SETS.snack, names = d.shuffle(c.names).slice(0, 4), k = d.int(0, 3), [ta, tb] = d.pick([[20, 30], [40, 60]]);
        const [pa, pb] = d.until(() => [d.int(2, 8) * 5, d.int(1, 4) * 10], ([x, y]) => x !== y && (ta * x) % 100 === 0 && ((ta * x + tb * y) * 100) % ((ta + tb) * 100) === 0 && (ta * x + tb * y) / (ta + tb) !== (x + y) / 2);
        const a = fill(d, 3, 100 - pa, { skip: [pa] }), b = [10, 20, 30, 40].filter((v) => v !== pb); a.splice(k, 0, pa); const bb = d.shuffle(b); bb.splice(k, 0, pb);
        const na = ta * pa / 100, nb = tb * pb / 100, ans = (na + nb) * 100 / (ta + tb);
        return N(`어느 학교 6학년 가 반 학생 ${ta}명과 나 반 학생 ${tb}명이 좋아하는 간식을 조사하여 나타낸 원그래프이다. 두 반 학생을 합하면, ${josa(c.one(names[k]), '은/는')} 두 반 전체 학생의 몇 %인가?`, ans, {
          unit: '%', figure: cap(`가 반(${ta}명)`, pie(names.map((x, i) => ({ name: x, pct: a[i] })), { r: 70 })) + cap(`나 반(${tb}명)`, pie(names.map((x, i) => ({ name: x, pct: bb[i] })), { r: 70 })),
          explain: `가 반은 ${ta} × ${frac(pa, 100)} = ${na}(명), 나 반은 ${tb} × ${frac(pb, 100)} = ${nb}(명)이므로 모두 ${na + nb}명이다. 두 반 전체는 ${ta} + ${tb} = ${ta + tb}(명)이므로 ${frac(na + nb, ta + tb)} × 100 = ${ans}(%)이다. 두 반의 학생 수가 다르므로 ${pa} %와 ${pb} %의 가운데 값이 되지 않는다.`,
          facts: { calc: [[`(${ta}*${pa}/100+${tb}*${pb}/100)*100/(${ta}+${tb})`, 0]], unseen: [100] }
        });
      }),
      H('h-move', '자료가 바뀐 뒤의 백분율 구하기', '45', (d) => {
        // 답을 바꾼 학생이 있어도 전체 학생 수는 그대로이다. 백분율에 사람 수를 그대로 더하면 틀린다.
        const [total, step] = d.pick([[50, 2], [20, 5], [25, 4]]), g = make(d, 'pet', 4, { step, lo: step === 5 ? 15 : 16, hi: 40, ok: distinct }), c = g.c, k = d.int(2, 3), [i, j] = d.until(() => d.shuffle([0, 1, 2, 3]).slice(0, 2), (v) => total * g.p[v[0]] / 100 > k), nj = total * g.p[j] / 100, ans = (nj + k) * 100 / total;
        return N(`${lead(c, '띠그래프')} 조사한 학생은 ${total}명이다. ${josa(g.names[i], '을/를')} 고른 학생 가운데 ${k}명이 ${josa(g.names[j], '으로/로')} 답을 바꾸면, ${josa(c.one(g.names[j]), '은/는')} 전체의 몇 %가 되는가?`, ans, {
          unit: '%', figure: cap(c.title, band(cells(g), { tick: step === 5 ? 5 : 10 })),
          explain: `${josa(c.one(g.names[j]), '은/는')} ${total} × ${frac(g.p[j], 100)} = ${nj}(명)에서 ${nj} + ${k} = ${nj + k}(명)이 된다. 전체 학생 수는 그대로 ${total}명이므로 ${frac(nj + k, total)} × 100 = ${ans}(%)이다. ${g.p[j]} %에 ${josa(k, '을/를')} 그대로 더하면 안 된다.`,
          facts: { calc: [[`(${total}*${g.p[j]}/100+${k})*100/${total}`, 0]], unseen: [100] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
