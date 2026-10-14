// 6학년 2학기 2단원 공간과 입체 — 실력 문항.
// 단원 틀과 그림 도구(B.kit.blocks622)는 6-2-2a.js·6-2-2b.js 에 있다. 대조표는 수집본의 _분석/6-2-2/싣기_대조표.md.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 그림에 보이는 쌓기나무만 센다. 위에서 본 모양에는 칸이 있는데 그림에서는 앞의 쌓기나무에 가려진 자리가 있다는 것을 놓친다.
//  - 「쌓기나무 N개」라고 알려 주어도 보이는 것만으로 위에서 본 모양을 고른다(개수가 가려진 쌓기나무가 있음을 알려 준다는 것을 놓친다).
//  - 앞에서 본 모양을 맨 앞줄의 높이로, 옆에서 본 모양을 맨 오른쪽 줄의 높이로 안다(그 줄에서 가장 높이 쌓은 층이 보인다는 것을 놓친다).
//  - 옆에서 본 모양의 왼쪽과 오른쪽을 거꾸로 안다(오른쪽에서 보면 앞줄이 왼쪽에 온다).
//  - 쌓기나무를 빼거나 더하면 본 모양이 반드시 달라진다고 본다(같은 줄에 그만큼 높이 쌓은 자리가 있으면 그대로다).
//  - 층별 모양에서 위층의 칸이 아래층에 없는 자리에 놓여도 된다고 본다.
//  - 거울에 비친 모양은 돌리면 같아진다고 본다.
//
// 싣는 기준: 실력에는 두 가지만 둔다.
//  ① 그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제(가려진 자리가 있는 그림, 거울에 비친 모양)
//  ② 두 번 넘게 생각해야 풀리는 문제(개수를 구한 뒤 가려진 자리의 수·더 쌓을 수를 구하기, 본 모양 둘과 개수에서 나머지 본 모양 알기, 층별 모양을 칸마다의 수로 옮긴 뒤 본 모양 고르기,
//     빼낸 뒤에도 세 방향의 본 모양이 그대로인 자리 찾기)
//  기본에서 하는 일을 고르기로 바꾸고 틀린 보기에 흔한 실수 답을 넣은 것은 싣지 않는다. 그림에서 고르는 문항의 틀린 그림은 맞는 그림과 칸 하나·층 하나만 다르고, 칸 수로는 가릴 수 없게 맞추었다.
//
// 뺀 것과 까닭(심화꼴)
//  - 가장 많은·가장 적은 경우와 그 차(심42~44), 본 모양에 맞는 모양의 가지 수(심45), 개수·층 조건에 맞는 모양의 가지 수(심46), 조건에 맞게 수 쓰기(심47), 본 모양이 그대로이게 가장 많이 더 쌓기(심50): 경우 따지기·조건 풀이
//  - 겉넓이(심60), 부피(심61), 겉면을 칠한 정육면체(심62), 규칙에 따라 층을 늘린 모양(심63): 측정·경우 따지기·규칙 찾기
//  - 숨은 자리의 높이가 정해지지 않을 때의 적어도 몇 개·모양의 수(심12), 한 가지로 정해지는가(심41), 방향 이름이 없는 세 그림(심40): 경우 따지기. 가려진 자리의 수는 전체 개수를 알려 주어 하나로 정해지는 것만 실었다.
//  - 위에서 본 모양이 될 수 있는 것 모두(심9), 앞과 옆이 같은 모양(심26), 본 모양에서 보이는 쌓기나무의 수(심20), 개수를 정확히 알 수 있는 모양(심7): 기본 묶음에 실었다(뜻을 한 번 대거나 한 번 견주는 일이다).
//  - 그리기(심18·32·38·48·58), 까닭 쓰기(심8), 사진으로만 낼 수 있는 꼴(심4·6): 고르기로 바꿀 수 있는 것은 기본에 바꾸어 실었다.
//  - 붙여 만든 모양을 위에서 볼 때 보이는 수(심59): 조각을 놓는 방법에 따라 답이 달라진다. 쌓기나무 4개로 만들 수 있는 모양의 수(심55): 교과서 활동의 답을 외우는 문제다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M, C } = B.kit;
  const K = B.kit.blocks622;
  const { TAGS, MARKS, sum, same, distinct, pickTile, tiles, total, peak, copy, cellsOf, frontOf, sideOf, layerOf, footOf, layerCounts, mirrored, where, levels, plus,
    stackArt, sight, clear, readings, fixedByTop, fixedByCount, pile, SQ, topArt, viewArt, layerArt, threeViews, within, reversed, rowsSaid, fourViews, footArt, pair, viewOf, whyOf, nearFront, nearSide, hideouts,
    fits, solved, deduce, numArt, WROTE, floorsArt, inside, tower, freeKey, flipped, toCells, poses, FOUR, pieceArt } = K;
  const COUNT = K.COUNT, VIEW = K.VIEW;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const SMALL = [[2, 2], [2, 3], [3, 2], [3, 3]];
  // 그림에서 통째로 가려진 자리가 꼭 한 곳이고 나머지 자리는 윗면이 보이는 모양. 돌려주는 것: 가려진 자리 [r, c](아니면 null)
  function oneGone(h) {
    const s = sight(h), gone = cellsOf(h).filter(([r, c]) => s.gone(r, c));
    return gone.length === 1 && cellsOf(h).every(([r, c]) => s.gone(r, c) || s.top(r, c) >= 1) ? gone[0] : null;
  }

  B.addGroup('6-2-2', {
    id: 'hard', title: '실력 문제', standard: VIEW,
    types: [
      // ── ① 그림·상황에 함정이 있는 문제 ──
      H('hard-hidden-count', '가려진 자리가 있는 쌓은 모양의 개수', '11, 기본 ①24 ②11 ③11', (d, n) => {
        // 그림에 함정을 둔다: 위에서 본 모양에는 칸이 있는데 그림에서는 앞의 쌓기나무에 가려 보이지 않는 자리가 한 곳 있다. 그림에 보이는 것만 세는 아이는 1개 적게 답한다.
        if (n === 1) {
          // 같은 그림으로 보이는 두 모양: 위에서 본 모양이 달라 개수가 다르다.
          const made = d.until(() => {
            const a = K.nookPile(d, { sizes: SMALL, cells: [4, 7], tall: [2, 2] });
            if (!a || !within(a, 5, 10) || !clear(a) || !fixedByTop(a)) return null;
            const spots = hideouts(a, 2); if (!spots || spots.length !== 1) return null;
            const b = copy(a); b[spots[0][0]][spots[0][1]] = 1;
            return fixedByTop(b) ? { a, b, spot: spots[0] } : null;
          }, Boolean), { a, b, spot } = made, order = d.shuffle([a, b]), who = order.indexOf(b);
          return M('두 사람이 쌓기나무로 쌓은 모양을 비스듬히 내려다보면 둘 다 다음 그림과 같이 보인다. 두 모양을 위에서 본 모양이 각각 가, 나일 때, 가와 나를 쌓는 데 사용한 쌓기나무는 각각 몇 개인가?', order.map((h, i) => ({ label: TAGS[i], answer: total(h), unit: '개' })), {
            figure: stackArt(a, { said: '두 사람이 쌓은 모양의 그림(보이는 쌓기나무만 적는다)' }) + tiles(order.map((h) => topArt(h, { u: 20 }))),
            explain: `그림에 보이는 쌓기나무는 ${total(a)}개이다. ${TAGS[who]}를 보면 ${where(b, spot[0], spot[1])}에도 쌓기나무가 있는데, 그 자리의 쌓기나무는 앞에 높이 쌓은 쌓기나무에 가려져 그림에 보이지 않는다. 2개 이상 쌓였다면 그림에 보여야 하므로 1개이다. ${TAGS[who]}는 ${total(a)} + 1 = ${total(b)}(개), ${TAGS[1 - who]}는 ${total(a)}개이다.`,
            facts: { calc: order.map((h, i) => [h === b ? `${plus(a)}+1` : plus(a), i]), unseen: [1], b622: { kind: 'twins', a, b, order } }
          });
        }
        const made = d.until(() => { const h = pile(d, { sizes: SMALL, cells: [4, 7], peak: [2, 3] }), spot = within(h, 6, 12) ? oneGone(h) : null; return spot && h[spot[0]][spot[1]] === 1 && fixedByTop(h) ? { h, spot } : null; }, Boolean), { h, spot } = made;
        return N('쌓기나무로 쌓은 모양과 이 모양을 위에서 본 모양이다. 이 모양을 쌓는 데 사용한 쌓기나무는 모두 몇 개인가?', total(h), {
          unit: '개', figure: pair(h),
          explain: `위에서 본 모양을 보면 ${where(h, spot[0], spot[1])}에도 쌓기나무가 있는데, 쌓은 모양의 그림에서는 그 자리의 쌓기나무가 앞에 높이 쌓은 쌓기나무에 가려져 보이지 않는다. 2개 이상 쌓였다면 그림에 보여야 하므로 그 자리에는 1개가 있다. 그림에 보이는 ${total(h) - 1}개에 1개를 더하면 ${total(h)}개이다.`,
          facts: { calc: [[plus(h), 0]], b622: { kind: 'hiddenTotal', h, spot } }
        });
      }, { count: 2, standard: COUNT }),
      H('hard-top-by-count', '개수로 가려진 자리를 알아내어 위에서 본 모양 고르기', '10, 기본 ①25 ③9·32', (d) => {
        // 상황에 함정을 둔다: 그림에 보이는 쌓기나무는 N − 1개뿐이다. 「N개」라는 말을 흘려 읽는 아이는 보이는 대로 그린 위에서 본 모양을 고른다.
        // 틀린 보기는 보이는 대로 그린 것 하나와, 가려진 칸을 엉뚱한 자리에 둔 것 둘이다(칸 수는 맞는 것과 같다).
        const made = d.until(() => {
          // 2층이 넘는 기둥은 왼쪽 뒤 대각선 자리에 칸이 있는 곳에만 둔다(그렇지 않으면 그 뒤에 따로 떨어진 쌓기나무가 숨을 수 있다).
          const h = pile(d, { sizes: SMALL, cells: [4, 7], peak: [2, 3] });
          cellsOf(h).forEach(([r, c]) => { if (h[r][c] >= 2 && !(h[r - 1] && h[r - 1][c - 1])) h[r][c] = 1; });
          const spot = within(h, 6, 12) ? oneGone(h) : null;
          if (!spot || h[spot[0]][spot[1]] !== 1) return null;
          const foot = footOf(h), seen = foot.map((row) => row.slice()), empty = []; seen[spot[0]][spot[1]] = 0;
          seen.forEach((row, r) => row.forEach((v, c) => { if (!v && (r !== spot[0] || c !== spot[1])) empty.push([r, c]); }));
          // 가려진 칸을 엉뚱한 자리에 둔 것: 그 자리에 쌓기나무가 있다면 그림에 보여야 하는 자리만 쓴다.
          const shows = ([r, c]) => { const g = copy(h); g[spot[0]][spot[1]] = 0; g[r][c] = 1; return !sight(g).gone(r, c); };
          const wrong = d.shuffle(empty.filter(shows)).map(([r, c]) => { const m = seen.map((row) => row.slice()); m[r][c] = 1; return m; }), pool = distinct([seen].concat(wrong, [mirrored(foot)])).filter((m) => !same(m, foot));
          // 쌓기나무의 수를 알면 가려진 자리가 한 곳으로 정해지는 모양만 쓴다(따로 떨어져 숨는 자리까지 따진다).
          return pool.length >= 3 && readings(h, { total: total(h), loose: true, cap: 2 }).length === 1 ? { h, spot, foot, list: d.shuffle([foot].concat(pool.slice(0, 3))) } : null;
        }, Boolean), { h, spot, foot, list } = made;
        return pickTile(`쌓기나무 ${total(h)}개를 모두 사용하여 쌓은 모양이다. 이 모양을 위에서 본 모양으로 알맞은 것은?`, list.map((m) => same(m, foot)), {
          figure: stackArt(h, { u: 22 }) + tiles(list.map((m) => footArt(m))),
          explain: `그림에 보이는 대로 세면 ${total(h) - 1}개이므로 쌓기나무 1개가 다른 쌓기나무에 가려져 있다. 쌓기나무 1개가 가려질 수 있는 자리는 높이 쌓은 쌓기나무의 뒤인 ${where(h, spot[0], spot[1])}뿐이므로, 위에서 본 모양에는 그 자리에도 칸이 있다.`,
          facts: { b622: { kind: 'topByCount', h, list } }
        });
      }),
      H('hard-mirror', '돌려도 같아지지 않는 모양 찾기', '56·57, 기본 ②55 ③52', (d) => {
        // 그림에 함정을 둔다: 거울에 비친 모양을 하나 섞는다. 쌓기나무의 수와 꺾인 횟수만 보는 아이는 가리지 못한다.
        const base = d.pick(chirals()), mine = d.shuffle(poses(base).filter(low)).slice(0, 3), odd = d.pick(poses(flipped(base)).filter(low)), list = d.shuffle(mine.concat([odd]));
        const keys = list.map((h) => freeKey(toCells(h))), flags = keys.map((key) => keys.filter((x) => x === key).length === 1);
        return pickTile(`쌓기나무 ${base.length}개를 붙여 만든 모양 가, 나, 다, 라이다. 셋은 돌리거나 뒤집으면 서로 같은 모양이 된다. 나머지 하나는?`, flags, {
          figure: tiles(list.map((h) => pieceArt(h, { u: 18 }))), explain: `${TAGS[flags.indexOf(true)]}는 나머지 모양을 거울에 비친 것처럼 꺾이는 쪽이 반대이다. 이런 모양은 어떻게 돌리거나 뒤집어도 나머지와 같아지지 않는다.`,
          facts: { b622: { kind: 'oddShape', list } }
        });
      }),
      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-hidden-cell', '전체 개수로 가려진 자리에 쌓은 수 구하기', '13, 기본 ②16', (d) => {
        // 가려진 자리에는 1개가 있을 수도, 2개가 있을 수도 있다(앞의 쌓기나무가 3층이다). 나머지 자리를 세고(한 번) 전체에서 뺀다(두 번).
        const made = d.until(() => {
          const h = pile(d, { sizes: SMALL, cells: [4, 7], peak: [3, 3] }), spot = within(h, 7, 13) ? oneGone(h) : null;
          if (!spot) return null;
          const key = spot[1] + ',' + (h.length - 1 - spot[0]), list = readings(h, { top: true, cap: 3 });
          if (list.length !== 2 || !same(list.map((x) => x.cols[key]).sort(), [1, 2])) return null;
          h[spot[0]][spot[1]] = d.pick([1, 2]);
          return { h, spot };
        }, Boolean), { h, spot } = made, rest = cellsOf(h).filter((q) => q[0] !== spot[0] || q[1] !== spot[1]).map((q) => h[q[0]][q[1]]), v = h[spot[0]][spot[1]];
        return N(`쌓기나무 ${total(h)}개로 쌓은 모양과 위에서 본 모양이다. 위에서 본 모양의 ㉠ 자리에 쌓은 쌓기나무는 몇 개인가?`, v, {
          unit: '개', figure: tiles([stackArt(h), topArt(h, { text: [[spot[0], spot[1], '㉠']] })], ['쌓은 모양', '위에서 본 모양']),
          explain: `㉠ 자리의 쌓기나무는 앞에 높이 쌓은 쌓기나무에 가려져 그림에 보이지 않는다. 나머지 자리에 쌓은 쌓기나무는 ${rest.join(' + ')} = ${sum(rest)}(개)이므로 ㉠ 자리에는 ${total(h)} − ${sum(rest)} = ${v}(개)를 쌓았다.`,
          facts: { calc: [[`${total(h)}-(${rest.join('+')})`, 0]], b622: { kind: 'hiddenCell', h, spot } }
        });
      }, { standard: COUNT }),
      H('hard-keep-add', '본 모양이 달라지지 않게 더 쌓을 수 있는 개수', '기본 ②24', (d) => {
        // 그 줄에서 가장 높이 쌓은 층을 찾고(한 번) 색칠한 칸의 수를 뺀다(두 번). 다른 방향의 줄로 셈하면 답이 달라지게 고른다.
        const dir = d.pick(['앞', '옆']), made = d.until(() => {
          const h = pile(d, { sizes: SQ, cells: [6, 8], peak: [3, 3] }), found = cellsOf(h).map(([r, c]) => ({ r, c, v: h[r][c], col: Math.max(...h.map((row) => row[c])), row: Math.max(...h[r]) })).filter((x) => (dir === '앞' ? x.col : x.row) > x.v && x.col !== x.row);
          return found.length ? Object.assign({ h }, d.pick(found)) : null;
        }, Boolean), { h, r, c, v } = made, line = dir === '앞' ? made.col : made.row, lineName = dir === '앞' ? '세로줄' : '가로줄';
        return N(`${WROTE} 색칠한 칸에만 쌓기나무를 더 쌓으려고 한다. ${dir}에서 본 모양이 달라지지 않게 하려면 쌓기나무를 가장 많이 몇 개까지 더 쌓을 수 있는가?`, line - v, {
          unit: '개', figure: numArt(h, { tint: { [r + ',' + c]: '#cfe3ff' }, said: `위에서 본 모양에 쌓은 쌓기나무의 수를 쓴 것(${where(h, r, c)}을 색칠했다)` }),
          explain: `${dir}에서 본 모양은 ${lineName}마다 가장 큰 수로 정해진다. 색칠한 칸이 있는 ${lineName}에서 가장 큰 수는 ${line}이므로 색칠한 칸은 ${line}층까지 쌓아도 ${dir}에서 본 모양이 그대로이다. ${line} − ${v} = ${line - v}(개)까지 더 쌓을 수 있다.`,
          facts: { calc: [[`${line}-${v}`, 0]], b622: { kind: 'keepAdd', h, cell: [r, c], dir } }
        });
      }),
      H('hard-box', '더 쌓아서 직육면체·정육면체 모양 만들기', '53·54, 기본 ②62 ③58', (d, n) => {
        // 쌓은 개수를 세고(한 번), 꼭 들어가는 상자 모양의 쌓기나무 수를 구해(두 번) 뺀다(세 번). 정육면체는 가장 긴 쪽에 맞추어야 한다.
        const h = d.until(() => pile(d, n === 0 ? { sizes: SMALL, cells: [4, 7], peak: [2, 3] } : { sizes: [[2, 3], [3, 2], [2, 2], [3, 3]], cells: [4, 7], peak: [2, 3] }),
          (s) => within(s, 6, 13) && clear(s) && fixedByTop(s) && (n === 0 ? s.length * s[0].length * peak(s) - total(s) >= 3 : Math.max(s.length, s[0].length, peak(s)) === 3 && new Set([s.length, s[0].length, peak(s)]).size > 1));
        const R = h.length, Cn = h[0].length, P = peak(h), box = n === 0 ? R * Cn * P : 27;
        return N(`쌓기나무로 쌓은 모양과 위에서 본 모양이다. 여기에 쌓기나무를 더 쌓아 가장 작은 ${n === 0 ? '직육면체' : '정육면체'} 모양을 만들려고 한다. 쌓기나무는 몇 개 더 필요한가?`, box - total(h), {
          unit: '개', figure: pair(h),
          explain: `쌓은 모양의 쌓기나무는 ${total(h)}개이다. 이 모양은 가로로 ${Cn}칸, 세로로 ${R}칸, 높이는 ${P}층이다. ` + (n === 0 ? `이 모양이 꼭 들어가는 가장 작은 직육면체 모양은 쌓기나무 ${Cn} × ${R} × ${P} = ${box}(개)로 되어 있다.` : '정육면체는 가로, 세로, 높이가 모두 같아야 하므로 가장 긴 쪽인 3에 맞춘다. 가장 작은 정육면체 모양은 쌓기나무 3 × 3 × 3 = 27(개)로 되어 있다.') + ` ${box} − ${total(h)} = ${box - total(h)}(개)가 더 필요하다.`,
          facts: { calc: [[(n === 0 ? `${Cn}*${R}*${P}` : '3*3*3') + `-(${plus(h)})`, 0]], unseen: [Cn, R, P, 3], b622: { kind: 'box', h, cube: n === 1 } }
        });
      }, { count: 2, standard: COUNT }),
      H('hard-remove-keep', '빼내도 위, 앞, 옆에서 본 모양이 그대로인 자리', '49·51', (d) => {
        // 자리마다 세 방향을 따진다: 위(2층 이상인가), 앞(같은 세로줄에 그만큼 높은 자리가 또 있는가), 옆(같은 가로줄에 그만큼 높은 자리가 또 있는가).
        // 틀린 자리 셋 가운데 둘 이상은 2층 이상이어서 위에서 본 모양만 보고는 가릴 수 없다.
        const made = d.until(() => {
          const h = pile(d, { sizes: SQ, cells: [6, 8], peak: [2, 3] });
          if (!within(h, 9, 14) || !clear(h) || !fixedByTop(h)) return null;
          const s = sight(h), keeps = ([r, c]) => { const v = h[r][c]; return [v >= 2, h.some((row, rr) => rr !== r && row[c] >= v), h[r].some((x, cc) => cc !== c && x >= v)]; };
          const open = cellsOf(h).filter(([r, c]) => s.top(r, c) === 2), good = open.filter((q) => keeps(q).every(Boolean)), bad = d.shuffle(open.filter((q) => !keeps(q).every(Boolean))).sort((p, q) => h[q[0]][q[1]] - h[p[0]][p[1]]).slice(0, 3);
          if (!good.length || bad.length < 3 || bad.filter((q) => h[q[0]][q[1]] >= 2).length < 2) return null;
          return { h, keeps, spots: [d.pick(good)].concat(bad).sort((p, q) => p[0] - q[0] || p[1] - q[1]) };
        }, Boolean), { h, keeps, spots } = made, flags = spots.map((q) => keeps(q).every(Boolean)), marks = spots.map(([r, c], i) => [r, c, MARKS[i]]);
        return pickTile('쌓기나무로 쌓은 모양과 위에서 본 모양이다. ㉠, ㉡, ㉢, ㉣ 가운데 한 자리에서 맨 위의 쌓기나무 1개를 빼내려고 한다. 빼낸 뒤에도 위, 앞, 옆에서 본 모양이 모두 처음과 같은 자리는?', flags, {
          labels: MARKS, figure: tiles([stackArt(h, { marks }), topArt(h, { text: marks })], ['쌓은 모양', '위에서 본 모양']),
          explain: spots.map((q, i) => { const k = keeps(q); return k.every(Boolean) ? '' : `${MARKS[i]}에서 빼내면 ${['위', '앞', '옆'].filter((_, j) => !k[j]).join(', ')}에서 본 모양이 달라진다. `; }).join('') + `${MARKS[flags.indexOf(true)]} 자리는 빼내도 쌓기나무가 남고, 같은 세로줄과 같은 가로줄에 그만큼 높이 쌓은 자리가 또 있어서 세 방향에서 본 모양이 모두 그대로이다.`,
          facts: { b622: { kind: 'removeKeep', h, spots } }
        });
      }),
      H('hard-layers-view', '층별 모양으로 앞과 옆에서 본 모양 고르기', '32, 기본 ①36 ②48 ③49', (d) => {
        // 층별 모양을 칸마다 쌓은 수로 옮기고(한 번), 줄마다 가장 큰 수를 찾는다(두 번).
        const dir = d.pick(['앞', '옆']), h = tower(d, (s) => !same(viewOf(s, dir), reversed(viewOf(s, dir)))), right = viewOf(h, dir);
        const list = fourViews(d, right, [reversed(right), viewOf(h, dir === '앞' ? '옆' : '앞'), dir === '앞' ? nearFront(h) : nearSide(h)], 3);
        return pickTile(`쌓기나무로 쌓은 모양을 층별로 나타낸 것이다. 이 모양을 ${dir}에서 본 모양은?`, list.map((v) => same(v, right)), {
          figure: floorsArt(h) + tiles(list.map((v) => viewArt(v, { top: 3 }))), explain: `층별 모양을 위에서 본 모양의 칸마다 쌓은 수로 옮기면 ${rowsSaid(h)}이다. ${whyOf(h, dir)}`,
          facts: { b622: { kind: 'view', h, dir, list } }
        });
      }),
      H('hard-third-view', '개수와 두 방향의 본 모양으로 나머지 방향의 본 모양 알기', '39, 기본 ②28 ③27', (d) => {
        // 위와 앞(또는 위와 옆)에서 본 모양만으로는 쌓은 모양이 여러 가지인데, 쌓기나무의 수까지 알면 하나로 정해지는 것만 쓴다(모든 경우를 따져 본다).
        // 틀린 보기는 개수가 맞지 않는 다른 쌓기에서 나오는 본 모양이다.
        const made = d.until(() => {
          const flip = d.bool(), h = pile(d, { sizes: SQ, cells: [5, 7], peak: [2, 3] }), foot = footOf(h), known = flip ? sideOf(h) : frontOf(h), n = total(h);
          if (!within(h, 8, 13) || !cellsOf(h).every(([r, c]) => h[r][c] === (flip ? known[2 - r] : known[c]))) return null;
          const all = flip ? fits(foot, null, known, { cap: 60 }) : fits(foot, known, null, { cap: 60 });
          if (all.length < 3 || all.length >= 60 || all.filter((g) => total(g) === n).length !== 1) return null;
          const right = flip ? frontOf(h) : sideOf(h), others = distinct(all.map((g) => (flip ? frontOf(g) : sideOf(g)))).filter((v) => !same(v, right));
          return others.length >= 2 && !same(right, known) ? { flip, h, known, right, list: fourViews(d, right, d.shuffle(others).slice(0, 2).concat([reversed(right)]), peak(h)) } : null;
        }, Boolean), { flip, h, known, right, list } = made, give = flip ? '옆' : '앞', ask = flip ? '앞' : '옆';
        return pickTile(`쌓기나무 ${total(h)}개로 쌓은 모양을 위와 ${give}에서 본 모양이다. 이 모양을 ${ask}에서 본 모양은?`, list.map((v) => same(v, right)), {
          figure: tiles([topArt(h, { u: 20 }), viewArt(known, { top: peak(h), said: `${give}에서 본 모양` })], ['위', give]) + tiles(list.map((v) => viewArt(v, { top: peak(h) }))),
          explain: `${give}에서 본 모양에서 ${flip ? '가로줄마다 가장 높은 층은 앞줄부터' : '세로줄마다 가장 높은 층은 왼쪽부터'} ${levels(known)}이다. 위에서 본 모양의 칸마다 그 줄의 층수만큼 쌓으면 모두 ${total(h)}개이고, 한 칸이라도 덜 쌓으면 ${total(h)}개가 되지 않는다. 그러므로 칸마다 쌓은 수는 ${rowsSaid(h)}이고, ${ask}에서 본 모양은 왼쪽부터 ${levels(right)}이다.`,
          facts: { b622: { kind: 'thirdView', h, flip, list } }
        });
      }),
      H('hard-guess-layer', '위, 앞, 옆에서 본 모양으로 2층에 쌓은 개수 알기', '23, 기본 ③29', (d) => {
        // 본 모양 셋에서 칸마다 쌓은 수를 정하고(한 번), 2 이상인 칸을 센다(두 번). 앞에서 본 모양의 2층 칸 수와는 답이 다르게 고른다.
        const h = solved(d, (s) => { const n2 = layerCounts(s)[1] || 0; return n2 >= 1 && n2 < cellsOf(s).length && n2 !== frontOf(s).filter((v) => v >= 2).length; }), flags = cellsOf(h).map(([r, c]) => h[r][c] >= 2), n2 = flags.filter(Boolean).length;
        return N('쌓기나무로 쌓은 모양을 위, 앞, 옆에서 본 모양이다. 이 모양의 2층에 쌓은 쌓기나무는 몇 개인가?', n2, {
          unit: '개', figure: threeViews(h), explain: `${deduce(h)} 2층에는 2개 이상 쌓은 자리마다 쌓기나무가 1개씩 있으므로 ${n2}개이다.`, facts: { count: flags, b622: { kind: 'layerByViews', h } }
        });
      }, { standard: COUNT }),
      H('hard-layer-missing', '개수와 1층·3층 모양으로 2층 모양 알기', '34, 기본 ①39', (d) => {
        // 전체 개수에서 2층의 개수를 구하고(한 번), 2층은 3층을 받치면서 1층 위에만 놓인다는 것을 댄다(두 번).
        // 보기는 3층 모양, 1층 모양, 그 사이의 모양, 칸 수는 맞지만 놓일 수 없는 모양이다.
        const made = d.until(() => {
          const foot = Array.from({ length: 3 }, () => [0, 0, 0]); K.footprint(d, 3, 3, d.int(5, 7)).forEach(([r, c]) => { foot[r][c] = 1; });
          const on = cellsOf(foot), off = [], shape = (cells) => { const m = Array.from({ length: 3 }, () => [0, 0, 0]); cells.forEach(([r, c]) => { m[r][c] = 1; }); return m; };
          foot.forEach((row, r) => row.forEach((v, c) => { if (!v) off.push([r, c]); }));
          const core = d.shuffle(on).slice(0, d.int(1, 2)), rest = on.filter((q) => !core.includes(q)), third = shape(core), low = d.bool(), size = low ? core.length : on.length;
          const between = shape(core.concat(d.shuffle(rest).slice(0, 1))), decoy = low ? shape(core.slice(1).concat(d.shuffle(rest).slice(0, 1))) : shape(d.shuffle(on).slice(1).concat([d.pick(off)]));
          const list = d.shuffle([third, foot, between, decoy]);
          return distinct(list).length === 4 ? { foot, third, size, low, list } : null;
        }, Boolean), { foot, third, size, low, list } = made, n = total(foot) + size + total(third), ok = (m) => inside(third, m) && inside(m, foot) && total(m) === size, flags = list.map(ok);
        return pickTile(`쌓기나무 ${n}개로 3층까지 쌓은 모양의 1층과 3층 모양이다. 가, 나, 다, 라 가운데 이 모양의 2층 모양은?`, flags, {
          figure: tiles([layerArt(foot, { said: '1층 모양' }), layerArt(third, { said: '3층 모양' })], ['1층', '3층']) + tiles(list.map((m) => layerArt(m))),
          explain: `1층에 ${total(foot)}개, 3층에 ${total(third)}개이므로 2층에는 ${n} − ${total(foot)} − ${total(third)} = ${size}(개)를 쌓았다. ` + (low ? `3층의 쌓기나무 밑에는 2층의 쌓기나무가 꼭 있어야 하는데 2층도 ${size}개이므로, 2층 모양은 3층 모양과 같다.` : `2층의 쌓기나무는 1층의 쌓기나무 위에만 놓이는데 2층도 ${size}개이므로, 2층 모양은 1층 모양과 같다.`),
          facts: { b622: { kind: 'missingFloor', foot, third, n, list } }
        });
      })
    ]
  });

  // 거울에 비친 모양이 돌려서는 같아지지 않는 모양들: 쌓기나무 4개짜리 하나와, 거기에 1개를 더 붙인 5개짜리들. 그림으로 그릴 놓음새가 넉넉한 것만 쓴다.
  const low = (h) => peak(h) <= 3 && h.length <= 3 && h[0].length <= 3;
  let chiralMemo = null;
  function chirals() {
    if (chiralMemo) return chiralMemo;
    const seen = new Map();
    Object.keys(FOUR).forEach((name) => FOUR[name].forEach((p) => [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].forEach((w) => {
      const q = [p[0] + w[0], p[1] + w[1], p[2] + w[2]];
      if (FOUR[name].some((x) => x.join() === q.join())) return;
      const five = FOUR[name].concat([q]); if (!seen.has(freeKey(five))) seen.set(freeKey(five), five);
    })));
    const usable = (cells) => freeKey(flipped(cells)) !== freeKey(cells) && poses(cells).filter(low).length >= 3 && poses(flipped(cells)).filter(low).length >= 1;
    chiralMemo = [FOUR.twist, FOUR.twist2].concat([...seen.values()]).filter(usable);
    return chiralMemo;
  }
  Object.assign(K, { chirals, oneGone });

  B.addTypes('6-2-2', 'hard', [
    H('hard-add-where', '본 모양이 한 방향에서만 달라지게 더 쌓은 자리', '51', (d) => {
      // 자리마다 1개를 더 쌓았을 때 앞에서 본 모양과 옆에서 본 모양이 달라지는지를 따진다(자리마다 두 번씩). 네 자리는 「앞만」「옆만」「둘 다」「둘 다 그대로」가 섞이게 고른다.
      const made = d.until(() => {
        const h = pile(d, { sizes: SQ, cells: [6, 8], peak: [2, 3] });
        if (!within(h, 9, 14) || !clear(h) || !fixedByTop(h)) return null;
        const s = sight(h), moves = ([r, c]) => { const g = copy(h); g[r][c] += 1; return [!same(frontOf(g), frontOf(h)), !same(sideOf(g), sideOf(h))]; }, key = (q) => moves(q).join();
        const open = d.shuffle(cellsOf(h).filter(([r, c]) => s.top(r, c) === 2 && h[r][c] < 3)), want = d.pick(['true,false', 'false,true']), right = open.find((q) => key(q) === want), rest = [];
        for (const q of open) if (key(q) !== want && rest.length < 3 && (rest.filter((p) => key(p) === key(q)).length < 2)) rest.push(q);
        return right && rest.length === 3 && new Set(rest.map(key)).size >= 2 ? { h, moves, want, spots: [right].concat(rest).sort((p, q) => p[0] - q[0] || p[1] - q[1]) } : null;
      }, Boolean), { h, moves, want, spots } = made, flags = spots.map((q) => moves(q).join() === want), marks = spots.map(([r, c], i) => [r, c, MARKS[i]]), keep = want === 'true,false' ? '옆' : '앞', change = want === 'true,false' ? '앞' : '옆';
      return pickTile(`쌓기나무로 쌓은 모양과 위에서 본 모양이다. ㉠, ㉡, ㉢, ㉣ 가운데 한 자리에 쌓기나무 1개를 더 쌓았더니 ${keep}에서 본 모양은 그대로이고 ${change}에서 본 모양만 달라졌다. 쌓기나무를 더 쌓은 자리는?`, flags, {
        labels: MARKS, figure: tiles([stackArt(h, { marks }), topArt(h, { text: marks })], ['쌓은 모양', '위에서 본 모양']),
        explain: '더 쌓은 자리가 그 줄에서 가장 높아지면 본 모양이 달라진다. ' + spots.map((q, i) => { const m = moves(q); return `${MARKS[i]}에 쌓으면 ${m[0] && m[1] ? '앞과 옆에서 본 모양이 모두 달라진다' : !m[0] && !m[1] ? '앞과 옆에서 본 모양이 모두 그대로이다' : `${m[0] ? '앞' : '옆'}에서 본 모양만 달라진다`}. `; }).join('').trim(),
        facts: { b622: { kind: 'addWhere', h, spots, want: want === 'true,false' ? [true, false] : [false, true] } }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
