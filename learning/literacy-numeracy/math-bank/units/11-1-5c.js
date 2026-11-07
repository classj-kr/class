// 고등학교 대수 Ⅲ-1 「등차수열과 등비수열」 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 11-1-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 두 수 사이에 n개의 수를 넣으면 끝의 수가 제(n + 2)항인데, 제(n + 1)항으로 센다.
//  - aₙ = Sₙ − Sₙ₋₁ 이 n = 1 에서도 맞는다고 여긴다(Sₙ 에 상수항이 있으면 a₁ = S₁ 만 맞다). S₂ₙ₋₁·S₂ₙ 처럼 홀짝으로 준 합에서 항을 뺄셈으로 구하지 못한다.
//  - 떨어뜨린 높이를 첫째항으로 센다(첫 번째로 튀어 오른 높이가 첫째항이다).
//  - |aₖ| = aₖ₊₁ 같은 절댓값 조건에서 aₖ₊₁ ≥ 0 을 따지지 않는다. 항의 절댓값의 합을 부호가 바뀌는 항에서 나누지 않는다.
//  - Sₙ₊₃ − Sₙ, S₃ − S₂ 가 항(또는 연속한 항의 합)이라는 것을 쓰지 못한다. 등비수열의 공비 r 의 제곱만 알 때 부호를 조건으로 가르지 않는다.
//
// 실력에는 ① 문제의 식·그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 수집본 기본 문서에 여러 번 나오는 꼴(두 합으로 첫째항·공차, 묶음 합의 비로 공비 따위)은 기본 묶음에 두었다.
// 「꼬여 있다」「경우를 따져야 한다」는 까닭으로 빼지 않은 것: 절댓값 조건이 있는 등차수열(①19), 부분합이 0이 되게 하는 공차의 개수(①38), 가로·세로가 모두 등차수열인 표(①24).
// 묻는 말: 수나 값은 「~은?/~는?」, 항 번호는 「제몇 항인가?」, 개수는 「몇 개인가?」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, M, C, inline } = B.kit;
  const { MINUS, gcd, range, Q, qsub, qmul, isInt, nb, tail, V, sup, nz, poly, lin } = B.kit.mid;
  const { ms, jh, svgm } = B.kit.hs;
  const {
    UNIT, S1, S2, S3, H, iq, qq, jn, nj, A, SS, NV, AN, SN, SEQ, eq, NOTEF, ar, arS, geoQ, geoSQ,
    iA, nA, termA, choose, valsQ, namedQ, josa2, pq, dPick
  } = B.kit.u1115;
  const RV = V('r'), DV = V('d'), AV = V('a');
  const cv = (c, v) => (c === 1 ? v : c === -1 ? MINUS + v : iq(c) + v);          // 계수가 1, −1이면 숫자를 적지 않는다

  // ── 그림: 9등분 하여 한가운데를 칠하기를 되풀이한 정사각형(1단계, 2단계) ──
  function carpet(side) {
    const S = 96, gap = 44, x0 = 26, y0 = 8, cell = S / 3, sub = cell / 3, ink = 'stroke:#1f2933;stroke-width:1.2;fill:none', dash = 'stroke:#7b8794;stroke-width:0.7;stroke-dasharray:3 2', paint = 'fill:#93c5fd;stroke:none';
    const square = (x, y, s, depth) => {
      let out = '';
      const c = s / 3;
      out += `<rect x="${x + c}" y="${y + c}" width="${c}" height="${c}" style="${paint}"/>`;
      if (depth > 1) for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) if (i !== 1 || j !== 1) out += `<rect x="${(x + i * c + c / 3).toFixed(2)}" y="${(y + j * c + c / 3).toFixed(2)}" width="${(c / 3).toFixed(2)}" height="${(c / 3).toFixed(2)}" style="${paint}"/>`;
      for (const k of [1, 2]) out += `<line x1="${(x + k * c).toFixed(2)}" y1="${y}" x2="${(x + k * c).toFixed(2)}" y2="${y + s}" style="${dash}"/><line x1="${x}" y1="${(y + k * c).toFixed(2)}" x2="${x + s}" y2="${(y + k * c).toFixed(2)}" style="${dash}"/>`;
      return out + `<rect x="${x}" y="${y}" width="${s}" height="${s}" style="${ink}"/>`;
    };
    const x1 = x0 + S + gap;
    const body = square(x0, y0, S, 1) + square(x1, y0, S, 2)
      + `<text x="${x0 - 8}" y="${y0 + S / 2 + 5}" text-anchor="end" style="font-size:13px">${side}</text>`
      + `<text x="${x0 + S / 2}" y="${y0 + S + 18}" text-anchor="middle" style="font-size:12.5px">[1단계]</text><text x="${x1 + S / 2}" y="${y0 + S + 18}" text-anchor="middle" style="font-size:12.5px">[2단계]</text>`;
    const w = x1 + S + 6, h = y0 + S + 26;
    void sub;
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="[1단계] 한 변의 길이가 ${side}인 정사각형을 9등분 하여 한가운데 정사각형을 칠한 그림. [2단계] 1단계에서 칠하지 않은 정사각형 8개를 각각 9등분 하여 한가운데 정사각형을 칠한 그림">${body}</svg>`;
  }
  // ── 그림: 한 점 O에서 만나는 두 직선 l, m에 접하는 원 C₁, C₂, C₃(원 Cₙ₊₁은 원 Cₙ의 중심을 지난다) ──
  function circles() {
    const s = 0.3, k = 2.25, ox = 12, r1 = 8.2, list = [];
    let r = r1;
    for (let i = 0; i < 3; i += 1) { list.push({ x: r / s, r }); r /= 1 - s; }
    const L = (list[2].x + list[2].r) * 1.08, th = Math.asin(s), tn = Math.tan(th), ex = L * Math.cos(th), ey = L * Math.sin(th), cy = 30 + ey * k;
    const X = (v) => (ox + v * k).toFixed(1), Yd = (v) => v.toFixed(1), upY = (v) => cy - v * tn * k;
    let out = `<line x1="${X(0)}" y1="${Yd(cy)}" x2="${X(ex)}" y2="${Yd(cy - ey * k)}" style="stroke:#1f2933;stroke-width:1.3"/><line x1="${X(0)}" y1="${Yd(cy)}" x2="${X(ex)}" y2="${Yd(cy + ey * k)}" style="stroke:#1f2933;stroke-width:1.3"/>`;
    list.forEach((c) => { out += `<circle cx="${X(c.x)}" cy="${Yd(cy)}" r="${(c.r * k).toFixed(1)}" style="fill:none;stroke:#1d4ed8;stroke-width:1.3"/><circle cx="${X(c.x)}" cy="${Yd(cy)}" r="1.8" style="fill:#1d4ed8"/>`; });
    // 원의 이름은 직선 l 의 바깥(위)에 적는다: 원끼리 겹치고 아래는 직선 m 이라 원 둘레 곁에 둘 자리가 없다.
    list.forEach((c, i) => { out += `<text x="${X(c.x)}" y="${Yd(upY(c.x) - 9)}" text-anchor="middle" style="font-size:13px">${svgm('C_' + (i + 1))}</text>`; });
    out += `<text x="${(Number(X(ex)) + 4).toFixed(1)}" y="${Yd(cy - ey * k + 4)}" style="font-size:13px">${svgm('l')}</text><text x="${(Number(X(ex)) + 4).toFixed(1)}" y="${Yd(cy + ey * k + 4)}" style="font-size:13px">${svgm('m')}</text>`;
    out += `<text x="${Number(X(0)) - 4}" y="${Yd(cy + 17)}" style="font-size:12.5px">O</text>`;
    const w = Math.ceil(ox + ex * k + 18), h = Math.ceil(cy + ey * k + 12);
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="한 점 O에서 만나는 두 직선 l, m과, 두 직선에 동시에 접하는 원 C₁, C₂, C₃. 원 C₂는 원 C₁의 중심을, 원 C₃는 원 C₂의 중심을 지나고, 뒤의 원일수록 반지름이 길다">${out}</svg>`;
  }

  // ── 표: 가로·세로가 모두 같은 칸인 판(첫째 열도 다른 칸과 같은 모양 — .mb-table 의 첫 열 머리 꾸밈을 지운다) ──
  const ORD = ['첫째', '둘째', '셋째', '넷째', '다섯째'];
  function gridTable(rows, said) {
    const cell = (c) => `<td style="background:transparent;font-weight:400;min-width:1.7em">${c}</td>`;
    return `<div class="mb-table-wrap"><table class="mb-table" aria-label="가로 ${rows[0].length}칸, 세로 ${rows.length}칸의 표. ${said}"><tbody>` + rows.map((r) => '<tr>' + r.map(cell).join('') + '</tr>').join('') + '</tbody></table></div>';
  }

  B.addGroup(UNIT, {
    id: 'hard', title: '단원 종합', standard: S2,
    types: [
      // ── ① 식·그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-insert', '두 수 사이에 n개를 넣은 등차수열', '①17', (d) => {
        // 함정: 끝의 수를 제(n + 1)항으로 세는 아이(앞뒤 두 수까지 n + 2개의 항이다)
        const a = d.int(-10, 20), dd = d.int(2, 9), n0 = d.int(6, 25), b = a + (n0 + 1) * dd, X = (i) => ms('x_' + i);
        return nA(`두 수 ${nj(a, '과/와')} ${b} 사이에 ${NV}개의 수 ${X(1)}, ${X(2)}, ${X(3)}, …, ${jh(X('n'), '을/를')} 넣어 ${nb(`${iq(a)}, ${X(1)}, ${X(2)}, …, ${X('n')}, ${josa2(b, '이/가')}`)} 이 순서대로 등차수열을 이루도록 하였다. 이 등차수열의 공차가 ${dd}일 때, ${NV}의 값은?`, n0, {
          explain: `첫째항이 ${iq(a)}이고 ${jh(String(b), '은/는')} 제${nb(`(${NV} + 2)`)}항이다. ${eq(nb(`${iq(a)} + (${NV} + 1) × ${dd}`), String(b))}에서 ${eq(nb(`${NV} + 1`), String(n0 + 1))}, ${eq(NV, String(n0))}이다.`,
          facts: { calc: [[`(${b}-${jn(a)})/${dd}-1`, 0]] }
        });
      }, { standard: S2 }),
      H('hard-abs-ar', '절댓값 조건이 있는 등차수열', '①19', (d) => {
        // 함정: |aₚ| = aₚ₊₁ 의 두 경우 가운데 d = 0 을 버리지 않는 아이(aₚ₊₁ 은 절댓값과 같으므로 0 이상이어야 한다)
        const p = d.int(2, 4), t = d.int(1, 5), Aa = (2 * p - 1) * t, dd = 2 * t, k = d.int(p + 3, p + 9), v = -Aa + (k - 1) * dd;
        return iA(`등차수열 ${SEQ}에서 ${eq(A(1), iq(-Aa))}, ${eq(nb(`|${A(p)}|`), A(p + 1))}일 때, ${A(k)}의 값은?`, v, {
          explain: `공차를 ${DV}라고 하면 ${eq(nb(`|${iq(-Aa)} + ${cv(p - 1, DV)}|`), nb(`${iq(-Aa)} + ${p}${DV}`))}이다. 좌변이 0 이상이므로 ${nb(`${iq(-Aa)} + ${p}${DV} ≥ 0`)}이어야 하고, ${eq(nb(`${iq(-Aa)} + ${cv(p - 1, DV)}`), nb(`${iq(-Aa)} + ${p}${DV}`))}에서 나오는 ${eq(DV, '0')}은 이를 만족시키지 않는다. ${eq(nb(`${iq(-Aa)} + ${cv(p - 1, DV)}`), nb(`${Aa} − ${p}${DV}`))}에서 ${eq(DV, String(dd))}이므로 ${eq(A(k), nb(`${iq(-Aa)} + ${k - 1} × ${dd}`))} = ${iq(v)}이다.`,
          facts: { calc: [[`(${k}-1)*2*${Aa}/(2*${p}-1)-${Aa}`, 0]], derived: [2] }
        });
      }, { standard: S2 }),
      H('hard-abs-sum', '절댓값을 씌운 항들의 합', '①36', (d) => {
        // 함정: 절댓값을 씌우기 전의 합을 구하거나 부호가 바뀌는 항을 따지지 않는 아이
        const dd = d.int(2, 5), Aa = d.int(12, 40), m = d.int(15, 25), terms = range(1, m).map((i) => -Aa + (i - 1) * dd), K = terms.filter((v) => v <= 0).length;
        if (K < 3 || K > m - 3) return null;
        const v = terms.reduce((s, x) => s + Math.abs(x), 0), neg = -terms.slice(0, K).reduce((s, x) => s + x, 0), pos = v - neg;
        if (v > 9999) return null;
        return nA(`첫째항이 ${iq(-Aa)}, 공차가 ${dd}인 등차수열 ${SEQ}에 대하여 ${nb(`|${A(1)}| + |${A(2)}| + |${A(3)}| + … + |${A(m)}|`)}의 값은?`, v, {
          explain: `${eq(AN, lin(dd, -Aa - dd, NV))}이므로 제${K}항까지는 0 이하, 제${K + 1}항부터는 양수이다. 제${K}항까지의 절댓값의 합은 ${neg}, 제${K + 1}항부터 제${m}항까지의 합은 ${pos}이므로 구하는 값은 ${v}이다.`,
          facts: { calc: [[`${m}*(2*(0-${Aa})+(${m}-1)*${dd})/2-2*(${K}*(2*(0-${Aa})+(${K}-1)*${dd})/2)`, 0]], derived: [K, 2] }
        });
      }, { standard: S2 }),
      H('hard-bounce', '튀어 오르는 공의 높이', '②14', (d) => {
        const [u, w] = d.pick([[3, 5], [2, 3], [3, 4], [4, 5], [1, 2]]), h = d.pick([2, 3, 4, 5, 10]), k = d.int(5, 9);
        const ht = (e) => nb(`${h} × (${frac(u, w)})${sup(e)} m`);
        // 맞는 보기 h·rᵏ / 떨어뜨린 높이를 첫째항으로 센 아이 h·rᵏ⁻¹ / 하나 더 곱한 아이 h·rᵏ⁺¹ / 떨어지는 거리까지 첫째항에 넣은 아이 2h·rᵏ
        const rows = [[ht(k), true], [ht(k - 1), false], [ht(k + 1), false], [nb(`${2 * h} × (${frac(u, w)})${sup(k)} m`), false]];
        return choose(d, `떨어진 높이의 ${frac(u, w)}만큼 다시 튀어 오르는 공이 있다. 이 공을 ${h} m의 높이에서 떨어뜨렸을 때, 공이 ${k}번째로 튀어 오른 높이는?`, rows, {
          explain: `첫 번째로 튀어 오른 높이는 ${h} × ${frac(u, w)} m이고, 그다음부터는 ${frac(u, w)}배씩 된다. 따라서 ${NV}번째로 튀어 오른 높이는 ${nb(`${h} × (${frac(u, w)})${sup(NV)} m`)}이고, ${k}번째는 ${ht(k)}이다.`
        });
      }, { standard: S3 }),
      H('hard-sign-sum', '합의 크기로 공비의 부호를 가르기', '②20', (d) => {
        // 함정: r² = 4 에서 r = 2 만 생각하거나, Sₙ₊₂ < Sₙ 이 r 의 부호를 정한다는 것을 놓치는 아이
        const R0 = d.pick([2, 3]), r = -R0, a = d.int(1, 5), n0 = d.pick([8, 10, 12]), k = d.int(3, 6), v = a * r ** (k - 1);
        if (Math.abs(v) > 9999) return null;
        return iA(`첫째항이 ${a}인 등비수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합 ${jh(SN, '이/가')} 다음 조건을 모두 만족시킬 때, ${A(k)}의 값은?`, v, {
          figure: B.kit.lines([`(가) ${eq(nb(`${SS(n0 + 2)} − ${SS(2)}`), nb(`${R0 * R0}${SS(n0)}`))}`, `(나) ${nb(`${SS(n0 + 2)} &lt; ${SS(n0)}`)}`]),
          explain: `${eq(nb(`${SS(n0 + 2)} − ${SS(2)}`), nb(`${A(3)} + ${A(4)} + … + ${A(n0 + 2)}`))} = ${nb(`${RV}${sup(2)}${SS(n0)}`)}이므로 ${eq(RV + sup(2), String(R0 * R0))}이다. ${eq(RV, String(R0))}이면 모든 항이 양수라 ${jh(nb(`${SS(n0 + 2)} &gt; ${SS(n0)}`), '이/가')} 되어 (나)에 맞지 않으므로 ${eq(RV, iq(r))}이다. 따라서 ${eq(A(k), nb(`${a} × (${iq(r)})${sup(k - 1)}`))} = ${iq(v)}이다.`,
          facts: { calc: [[`${a}*(0-${R0})**(${k}-1)`, 0]], derived: [R0] }
        });
      }, { standard: S3 }),
      H('hard-const-sn', '상수항이 있는 Sₙ에서 첫째항과 항', '②27', (d) => {
        // 함정: aₙ = Sₙ − Sₙ₋₁ 로 구한 식에 n = 1 을 넣어 a₁ 을 구하는 아이(상수항이 있으면 a₁ = S₁ 이 다르다)
        const p = d.int(1, 3), q = d.int(-5, 5), c = nz(d, -6, 6), k = d.int(5, 12), a1 = p + q + c, ak = p * (2 * k - 1) + q;
        return M(`수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합 ${jh(SN, '이/가')} ${eq(SN, poly([[p, NV + sup(2)], [q, NV], [c, '']]))}일 때, ${A(1)}과 ${A(k)}의 값은?`, [{ answer: a1, signed: true, lead: A(1) + ' =' }, { answer: ak, signed: true, lead: A(k) + ' =' }], {
          shown: `${eq(A(1), iq(a1))}, ${eq(A(k), iq(ak))}`,
          explain: `${NV} ≥ 2일 때 ${eq(AN, nb(`${SN} − ${SS('n-1')}`))} = ${lin(2 * p, q - p, NV)}이다. 이 식은 ${NV} ≥ 2에서만 맞고, ${eq(A(1), SS(1))} = ${nj(a1, '은/는')} 식에 1을 넣은 값 ${nj(p + q, '과/와')} 다르다. ${eq(A(k), iq(ak))}이다.`,
          facts: { calc: [[`${p}+${jn(q)}+${jn(c)}`, 0], [`${p}*(2*${k}-1)+${jn(q)}`, 1]], derived: [2] }
        });
      }, { standard: S3 }),
      H('hard-parity-sn', '홀짝으로 갈린 Sₙ에서 항', '②33', (d) => {
        // 함정: S₂ₙ₋₁, S₂ₙ 을 주면 항을 구할 수 없다고 여기는 아이(aₖ = Sₖ − Sₖ₋₁ 에 k 의 홀짝대로 넣는다)
        const P = nz(d, -6, 6), Qv = nz(d, -6, 6);
        if (P === Qv) return null;
        const ks = [3, 6, 9], vals = ks.map((k) => (k % 2 ? P - Qv : Qv - P));
        return M(`수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합 ${jh(SN, '이/가')} 모든 자연수 ${NV}에 대하여 ${eq(SS('2n-1'), iq(P))}, ${eq(SS('2n'), nj(Qv, '을/를'))} 만족시킬 때, ${A(3)}, ${A(6)}, ${A(9)}의 값은?`, ks.map((k, i) => ({ answer: vals[i], signed: true, lead: A(k) + ' =' })), {
          shown: ks.map((k, i) => eq(A(k), iq(vals[i]))).join(', '),
          explain: `홀수 번째까지의 합은 ${iq(P)}, 짝수 번째까지의 합은 ${iq(Qv)}이다. ${eq(A(3), nb(`${SS(3)} − ${SS(2)}`))} = ${iq(vals[0])}, ${eq(A(6), nb(`${SS(6)} − ${SS(5)}`))} = ${iq(vals[1])}, ${eq(A(9), nb(`${SS(9)} − ${SS(8)}`))} = ${iq(vals[2])}이다.`,
          facts: { calc: [[`${jn(P)}-${jn(Qv)}`, 0], [`${jn(Qv)}-${jn(P)}`, 1], [`${jn(P)}-${jn(Qv)}`, 2]] }
        });
      }, { standard: S3 }),
      H('hard-snk', 'Sₙ₊₃ − Sₙ으로 등비수열의 항', '심3', (d) => {
        // 함정: Sₙ₊₃ − Sₙ 이 연속한 세 항 aₙ₊₁ + aₙ₊₂ + aₙ₊₃ 이라는 것을 쓰지 못하는 아이
        const r = d.pick([2, 3]), u = d.int(1, 4), K = u * (1 + r + r * r), k = d.int(3, 7), v = u * r ** (k - 2);
        if (v > 9999) return null;
        return iA(`등비수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합을 ${SN}이라 하자. 모든 자연수 ${NV}에 대하여 ${eq(nb(`${SS('n+3')} − ${SN}`), nb(`${K} × ${r}${sup(ms('n-1'))}`))}일 때, ${A(k)}의 값은?`, v, {
          explain: `${eq(nb(`${SS('n+3')} − ${SN}`), nb(`${A('n+1')} + ${A('n+2')} + ${A('n+3')}`))} = ${nb(`${AV}${RV}(1 + ${RV} + ${RV}${sup(2)}) × ${RV}${sup(ms('n-1'))}`)}이다. 모든 ${NV}에 대하여 ${nb(`${K} × ${r}${sup(ms('n-1'))}`)}과 같으므로 ${eq(RV, String(r))}, ${eq(nb(`${AV}${RV}(1 + ${RV} + ${RV}${sup(2)})`), String(K))}에서 ${eq(AV, qq(Q(u, r)))}이다. 따라서 ${eq(A(k), nb(`${qq(Q(u, r))} × ${r}${sup(k - 1)}`))} = ${v}이다.`,
          facts: { calc: [[`${K}/(1+${r}+${r}*${r})*${r}**(${k}-2)`, 0]], derived: [2] }
        });
      }, { standard: S3 }),
      H('hard-s3s2', 'Sₖ − Sₖ₋₁ = aₖ로 등차수열의 공차', '심4', (d) => {
        // 함정: S₃ − S₂ 를 S₁ 이나 a₁ + a₂ + a₃ 으로 여기는 아이(S₃ − S₂ = a₃)
        const a = d.int(1, 6), m = d.pick([2, 3]), s = d.int(5, 8), t = d.int(2, 4), num = (m - 1) * a, den = (s - 1) - m * (t - 1);
        if (den === 0 || num % den !== 0 || num / den === 0) return null;
        const dd = num / den, n0 = d.int(8, 12), S = arS(a, dd, n0);
        if (Math.abs(S) > 9999 || S === 0) return null;
        return iA(`첫째항이 ${a}인 등차수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합을 ${SN}이라 하자. ${eq(A(s), nb(`${m}(${SS(t)} − ${SS(t - 1)})`))}일 때, ${SS(n0)}의 값은?`, S, {
          explain: `${eq(nb(`${SS(t)} − ${SS(t - 1)}`), A(t))}이므로 ${eq(A(s), nb(`${m}${A(t)}`))}이다. 공차를 ${DV}라고 하면 ${eq(nb(`${a} + ${s - 1}${DV}`), nb(`${m}(${a} + ${t - 1}${DV})`))}에서 ${eq(DV, iq(dd))}이므로 ${eq(SS(n0), frac(nb(`${n0}{2 × ${a} + ${n0 - 1} × ${pq(dd)}}`), 2))} = ${iq(S)}이다.`,
          facts: { calc: [[`${n0}*(2*${a}+(${n0}-1)*(${m}-1)*${a}/((${s}-1)-${m}*(${t}-1)))/2`, 0]], derived: [2] }
        });
      }, { standard: S2 }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-vieta-ar', '근과 계수의 관계와 등차중항으로 상수', '①21', (d) => {
        const c = d.int(1, 4), s = d.int(1, 5), t = d.int(2, 6), X = V('x'), al = V('α'), be = V('β');
        // 2α² − (c + 3t)α + t(c + s) = 0 의 근 가운데 α > c 인 것이 하나뿐이어야 한다(β = 2α − c 가 α 보다 크다)
        const B2 = c + 3 * t, C2 = t * (c + s), disc = B2 * B2 - 8 * C2;
        if (disc <= 0) return null;
        const sq = Math.round(Math.sqrt(disc));
        if (sq * sq !== disc || (B2 + sq) % 4 !== 0) return null;
        const roots = [(B2 - sq) / 4, (B2 + sq) / 4], ok = roots.filter((x) => x > c);
        if (ok.length !== 1 || !Number.isInteger(ok[0])) return null;
        const alpha = ok[0], n0 = 3 * alpha - c - s, beta = 2 * alpha - c, Nv = V('k');
        if (n0 === 0) return null;
        return iA(`${X}에 대한 이차방정식 ${nb(`${X}${sup(2)} − (${Nv} + ${s})${X} + ${t}${Nv} = 0`)}의 두 실근 ${al}, ${be}(${nb(`${al} &lt; ${be}`)})에 대하여 세 수 ${c}, ${al}, ${jh(be, '이/가')} 이 순서대로 등차수열의 연속한 세 항일 때, 상수 ${Nv}의 값은?`, n0, {
          explain: `근과 계수의 관계에 의하여 ${eq(nb(`${al} + ${be}`), nb(`${Nv} + ${s}`))}, ${eq(nb(`${al}${be}`), nb(`${t}${Nv}`))}이다. ${al}는 ${josa2(c, '과/와')} ${be}의 등차중항이므로 ${eq(be, nb(`2${al} − ${c}`))}이다. 두 식에 넣어 ${Nv}를 지우면 ${eq(nb(`2${al}${sup(2)} − ${B2}${al} + ${C2}`), '0')}이고 ${eq(al, qq(Q(B2 - sq, 4)))} 또는 ${eq(al, qq(Q(B2 + sq, 4)))}이다. ${nb(`${al} &lt; ${be}`)}이려면 ${nb(`${al} &gt; ${c}`)}이어야 하므로 ${eq(al, String(alpha))}, ${eq(be, String(beta))}이고 ${eq(Nv, iq(n0))}이다.`,
          facts: { calc: [[`3*${alpha}-${c}-${s}`, 0]], derived: [3, alpha] }
        });
      }, { standard: S2 }),
      H('hard-grid', '가로·세로 줄이 모두 등차수열인 표', '①24', (d) => {
        // 칸 (i, j)의 수 = A + iP + jQ + ijR 꼴이면 가로줄·세로줄이 모두 등차수열이다.
        const A0 = d.int(-5, 8), P = d.int(-3, 4), Qq = d.int(1, 4), R = d.int(-1, 1), cell = (i, j) => A0 + i * P + j * Qq + i * j * R;
        const G = [cell(0, 1), cell(0, 4), cell(3, 0), cell(4, 3)], av = cell(1, 1), bv = cell(2, 2);
        if (new Set(G).size < 4 || av === bv || range(0, 4).some((i) => Qq + i * R === 0 || P + i * R === 0)) return null;
        const rows = range(0, 4).map((i) => range(0, 4).map((j) => (i === 0 && j === 1 ? iq(G[0]) : i === 0 && j === 4 ? iq(G[1]) : i === 3 && j === 0 ? iq(G[2]) : i === 4 && j === 3 ? iq(G[3]) : i === 1 && j === 1 ? V('a') : i === 2 && j === 2 ? V('b') : '')));
        const Qe = `(${jn(G[1])}-${jn(G[0])})/3`, c00 = `(${jn(G[0])}-${Qe})`, c03 = `(${jn(G[0])}+2*${Qe})`, Pe = `((${jn(G[2])}-${c00})/3)`, S3e = `((${jn(G[3])}-${c03})/4)`;
        const ci0 = (i) => `(${c00}+${i}*${Pe})`, ci3 = (i) => `(${c03}+${i}*${S3e})`, cij = (i, j) => `(${ci0(i)}+${j}*(${ci3(i)}-${ci0(i)})/3)`;
        return valsQ(`다음 표에서 각각의 가로줄과 세로줄에 놓인 수가 왼쪽에서 오른쪽으로, 위에서 아래로 차례로 등차수열의 연속한 항이 되도록 빈칸을 채울 때, ${V('a')}, ${V('b')}의 값은?`, [[V('a'), av], [V('b'), bv]], {
          figure: gridTable(rows, [[0, 1, G[0]], [0, 4, G[1]], [3, 0, G[2]], [4, 3, G[3]]].map(([i, j, v]) => `${ORD[i]} 줄 ${ORD[j]} 칸 ${iq(v)}`).join(', ') + `, ${ORD[1]} 줄 ${ORD[1]} 칸 a, ${ORD[2]} 줄 ${ORD[2]} 칸 b`),
          explain: `첫째 줄은 ${nj(G[0], '과/와')} ${iq(G[1])}에서 공차가 ${iq(Qq)}이므로 ${range(0, 4).map((j) => iq(cell(0, j))).join(', ')}이다. 넷째 열은 ${iq(cell(0, 3))}에서 ${iq(G[3])}까지, 첫째 열은 ${iq(cell(0, 0))}에서 ${iq(G[2])}까지이므로 둘째 줄은 ${range(0, 4).map((j) => iq(cell(1, j))).join(', ')}, 셋째 줄은 ${range(0, 4).map((j) => iq(cell(2, j))).join(', ')}이다. 따라서 ${eq(V('a'), iq(av))}, ${eq(V('b'), iq(bv))}이다.`,
          facts: { calc: [[cij(1, 1), 0], [cij(2, 2), 1]], derived: [2, 3, 4] }
        });
      }, { standard: S2 }),
      H('hard-prod-ar', '두 등차수열의 곱으로 두 수열 찾기', '①25', (d) => {
        const p = nz(d, -4, 4), q = nz(d, -4, 4), A1 = nz(d, -5, 5), B1 = nz(d, -5, 5), c2 = p * q, c1 = A1 * q + B1 * p - 2 * p * q, c0 = (A1 - p) * (B1 - q);
        // 공차가 정수라는 조건으로 (p, q)가 하나로 정해져야 한다
        const sols = [];
        for (let x = -30; x <= 30; x += 1) for (let y = -30; y <= 30; y += 1) if (x * y === c2 && A1 * y + B1 * x - 2 * x * y === c1 && (A1 - x) * (B1 - y) === c0) sols.push([x, y]);
        if (sols.length !== 1) return null;
        const m = d.int(6, 10), S = arS(B1, q, m);
        if (Math.abs(S) > 9999 || S === 0) return null;
        return iA(`두 등차수열 ${SEQ}, ${nb('{' + ms('b_n') + '}')}의 공차가 모두 정수이고 ${eq(A(1), iq(A1))}, ${eq(ms('b_1'), iq(B1))}이다. 모든 자연수 ${NV}에 대하여 ${jh(eq(nb(`${AN}${ms('b_n')}`), poly([[c2, NV + sup(2)], [c1, NV], [c0, '']])), '이/가')} 성립할 때, 수열 ${nb('{' + ms('b_n') + '}')}의 첫째항부터 제${m}항까지의 합은?`, S, {
          explain: `두 공차를 ${V('p')}, ${V('q')}라고 하면 ${eq(nb(`${AN}${ms('b_n')}`), nb(`{${iq(A1)} + (${NV} − 1)${V('p')}}{${iq(B1)} + (${NV} − 1)${V('q')}}`))}이다. 계수를 비교하면 ${eq(nb(`${V('p')}${V('q')}`), iq(c2))}, ${eq(poly([[B1, V('p')], [A1, V('q')]]), iq(c1 + 2 * c2))}이고, 두 식을 함께 만족시키는 정수 ${V('p')}, ${jh(V('q'), '은/는')} ${eq(V('p'), iq(p))}, ${eq(V('q'), iq(q))}뿐이다. 따라서 ${eq(ms('b_n'), lin(q, B1 - q, NV))}이고 합은 ${frac(nb(`${m}{2 × ${pq(B1)} + ${m - 1} × ${pq(q)}}`), 2)} = ${iq(S)}이다.`,
          facts: { calc: [[`${m}*(2*${jn(B1)}+(${m}-1)*${jn(q)})/2`, 0]], derived: [2, Math.abs(q)] }
        });
      }, { standard: S2 }),
      H('hard-zero-count', '부분합이 0이 되게 하는 공차의 개수', '①38', (d) => {
        const Aa = d.int(8, 36), K = V('k'), MV = V('m'), flags = range(1, 2 * Aa).map((x) => (2 * Aa) % x === 0), cnt = flags.filter(Boolean).length;
        return nA(`첫째항이 ${Aa}이고 공차가 ${nb(MINUS + DV)}인 등차수열 ${SEQ}의 제${MV}항부터 제${nb(`(${MV} + ${K})`)}항까지의 합이 0이 되게 하는 두 자연수 ${MV}, ${jh(K, '이/가')} 있을 때, 자연수 ${DV}의 개수는?`, cnt, {
          unit: '개',
          explain: `제${MV}항부터 제${nb(`(${MV} + ${K})`)}항까지의 합은 ${frac(nb(`(${K} + 1)(${A(MV)} + ${A(nb(`${MV} + ${K}`))})`), 2)}이므로 ${eq(nb(`${A(MV)} + ${A(nb(`${MV} + ${K}`))}`), '0')}, 곧 ${eq(nb(`(2${MV} + ${K} − 2)${DV}`), String(2 * Aa))}이다. ${eq(MV, '1')}로 두면 ${eq(K, frac(String(2 * Aa), DV))}이므로 ${2 * Aa}의 양의 약수인 ${DV}는 모두 된다. 그 개수는 ${cnt}이다.`,
          facts: { count: flags }
        });
      }, { standard: S2 }),
      H('hard-area', '되풀이해 칠한 도형의 넓이의 합', '②23', (d) => {
        const s = d.pick([3, 6, 9, 12]), N0 = d.int(5, 9), S2v = s * s;
        // 맞는 보기 s²{1 − (8/9)ⁿ} / 단계를 하나 덜 센 아이 / 첫째 단계의 넓이 s²/9 를 곱하는 것을 빠뜨린 아이(9배) / 칠하지 않은 넓이를 구한 아이
        const sh = (k, e, plus) => nb(`${k}{1 ${plus ? '+' : MINUS} (${frac(8, 9)})${sup(e)}}`);
        const rows = [[sh(S2v, N0), true], [sh(S2v, N0 - 1), false], [sh(9 * S2v, N0), false], [nb(`${S2v} × (${frac(8, 9)})${sup(N0)}`), false]];
        return choose(d, `한 변의 길이가 ${s}인 정사각형 모양의 종이가 있다. [1단계]에서 정사각형을 9등분 하여 한가운데 정사각형을 칠하고, [2단계]에서 [1단계]에서 칠하지 않은 정사각형 8개를 각각 9등분 하여 한가운데 정사각형을 칠한다. 이와 같은 방법으로 [${N0}단계]까지 칠한 정사각형의 넓이의 합은?`, rows, {
          figure: carpet(s),
          explain: `[1단계]에서 칠한 넓이는 ${frac(S2v, 9)}이다. 다음 단계에서는 칠하는 정사각형의 수가 8배, 한 정사각형의 넓이가 ${frac(1, 9)}배가 되므로 [${NV}단계]에서 칠한 넓이는 첫째항이 ${frac(S2v, 9)}, 공비가 ${frac(8, 9)}인 등비수열이다. 합은 ${frac(nb(`${frac(S2v, 9)}{1 − (${frac(8, 9)})${sup(N0)}}`), nb(`1 − ${frac(8, 9)}`))} = ${sh(S2v, N0)}이다.`
        });
      }, { standard: S3 }),
      H('hard-circles', '넓이가 등비수열인 원들', '②24', (d) => {
        const R = d.pick([2, 3]), a = d.int(1, 6), p = d.pick([1, 3]), q = p + d.pick([4, 6]), Tp = a * R ** ((p - 1) / 2), Tq = a * R ** ((q - 1) / 2), Nn = d.int(4, 8), S = (a * (R ** Nn - 1)) / (R - 1);
        if (S > 9999 || Tq > 9999) return null;
        const Tn = (k) => ms('T_{' + k + '}'), list = range(1, Nn).map((i) => Tn(2 * i - 1));
        return iA(`그림과 같이 한 점 O에서 만나는 두 직선 ${V('l')}, ${V('m')}에 동시에 접하는 원 ${ms('C_1')}이 있다. 원 ${ms('C_1')}의 중심을 지나고 두 직선 ${V('l')}, ${V('m')}에 동시에 접하면서 원 ${ms('C_1')}보다 반지름의 길이가 긴 원을 ${ms('C_2')}라 하자. 이와 같은 방법으로 원 ${ms('C_n')}의 중심을 지나고 두 직선에 동시에 접하면서 원 ${ms('C_n')}보다 반지름의 길이가 긴 원을 ${ms('C_{n+1}')}이라 하자. 원 ${ms('C_n')}의 넓이를 ${ms('T_n')}이라 할 때, ${eq(Tn(p), String(Tp))}, ${eq(Tn(q), String(Tq))}이다. ${nb(`${list[0]} + ${list[1]} + … + ${list[Nn - 1]}`)}의 값은?`, S, {
          figure: circles(),
          explain: `원의 중심은 모두 두 직선이 이루는 각의 이등분선 위에 있고, 한 원과 다음 원은 O를 닮음의 중심으로 하여 닮았으며 닮음비가 늘 같다. 따라서 반지름의 길이와 넓이 ${ms('T_n')}은 등비수열을 이룬다. ${jh(Tn(q), '은/는')} ${Tn(p)}의 ${R ** ((q - p) / 2)}배이므로 공비의 제곱은 ${R}이고 ${eq(Tn(1), String(a))}이다. 홀수째 항만 모은 ${list[0]}, ${list[1]}, …은 첫째항이 ${a}, 공비가 ${R}인 등비수열이므로 합은 ${frac(nb(`${a}(${R}${sup(Nn)} − 1)`), `${R} − 1`)} = ${S}이다.`,
          facts: { calc: [[`${a}*(${R}**${Nn}-1)/(${R}-1)`, 0]], derived: [a, R, Nn] }
        });
      }, { standard: S3 }),
      H('hard-ar-geo', '등차수열의 세 항이 등비수열도 이룸', '②36', (d) => {
        const D = d.int(2, 6), p = d.int(2, 3), q = p + d.int(5, 10), k = 2 * q - p, s = d.int(p + 2, q - 1);
        const Nn = (p - 1) * (k - 1) - (s - 1) * (s - 1), Den = 2 * (s - 1) - (p + k - 2);
        if (Den === 0) return null;
        const a1 = Q(D * Nn, Den);
        if (isInt(a1) || a1.p <= 0 || a1.q > 20 || a1.p > 120) return null;
        const NE = `(${p}-1)*(2*${q}-${p}-1)-(${s}-1)*(${s}-1)`, DE = `2*(${s}-1)-(2*${q}-2)`;
        return inline(`공차가 ${D}인 등차수열 ${SEQ}에 대하여 세 항 ${A(p)}, ${A(q)}, ${jh(A('k'), '은/는')} 이 순서대로 등차수열의 연속한 세 항이고, 세 항 ${A(p)}, ${A(s)}, ${jh(A('k'), '은/는')} 이 순서대로 등비수열의 연속한 세 항이다. ${V('k')}와 ${A(1)}의 값은?` + NOTEF, `${V('k')} = {0}, ${A(1)} = ${frac('{1}', '{2}')}`, [{ answer: k }, { answer: a1.p, signed: true }, { answer: a1.q }], {
          shown: `${eq(V('k'), String(k))}, ${eq(A(1), qq(a1))}`,
          explain: `${eq(nb(`2${A(q)}`), nb(`${A(p)} + ${A('k')}`))}에서 ${eq(nb(`2(${q} − 1)`), nb(`(${p} − 1) + (${V('k')} − 1)`))}, ${eq(V('k'), String(k))}이다. ${eq(nb(`${A(s)}${sup(2)}`), nb(`${A(p)}${A(k)}`))}에서 ${eq(nb(`(${A(1)} + ${(s - 1) * D})${sup(2)}`), nb(`(${A(1)} + ${(p - 1) * D})(${A(1)} + ${(k - 1) * D})`))}이고, 정리하면 ${eq(A(1), qq(a1))}이다.`,
          facts: { calc: [[`2*${q}-${p}`, 0], [`${D}*(${NE})*${a1.q}/(${DE})`, 1], [String(a1.q), 2]], derived: [2, a1.q] }
        });
      }, { standard: S3 }),
      H('hard-recip-sum', '분수식 Sₙ에서 일반항, 그 역수들의 합', '심5', (d) => {
        const p = d.int(1, 3), m = d.int(4, 7), inv = (k) => (p * k + 1) * (p * k - p + 1), v = range(1, m).reduce((s, k) => s + inv(k), 0);
        if (v > 9999) return null;
        const recip = (k) => frac(1, A(k)), prodH = (v) => (p === 1 ? nb(`${v}(${v} + 1)`) : nb(`(${p}${v} + 1)(${p}${v} − ${p - 1})`));
        return iA(`수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합을 ${SN}이라 하자. 모든 자연수 ${NV}에 대하여 ${eq(SN, frac(NV, nb(`${p === 1 ? '' : p}${NV} + 1`)))}일 때, ${nb(`${recip(1)} + ${recip(2)} + … + ${recip(m)}`)}의 값은?`, v, {
          explain: `${eq(A(1), SS(1))} = ${frac(1, p + 1)}이고, ${NV} ≥ 2일 때 ${eq(AN, nb(`${SN} − ${SS('n-1')}`))} = ${frac(1, prodH(NV))}이며 이 식은 ${eq(NV, '1')}에서도 맞는다. 따라서 ${eq(frac(1, A('k')), prodH(V('k')))}이고, ${V('k')} = 1, 2, …, ${josa2(m, '을/를')} 넣은 ${range(1, m).map(inv).join(', ')}의 합은 ${v}이다.`,
          facts: { calc: [[range(1, m).map((k) => `(${p}*${k}+1)*(${p}*${k}-${p}+1)`).join('+'), 0]], derived: range(1, m) }
        });
      }, { standard: S3 })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
