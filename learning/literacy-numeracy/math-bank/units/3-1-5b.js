// 3학년 1학기 5단원 길이와 시간 — 실력 문항.
// 수집해 둔 평가 자료 가운데 심화·실력 단원평가, 차시별 심화 문제, 수학익힘 심화, 서술형 평가(42개 문서)에 나온
// 문제 꼴 72개를 하나씩 따져 고른 것이다. 꼴과 조건은 그 문제를 따르고 수와 문장만 바꾼다.
//
// 고른 기준
//  - 단위를 한 번 바꾸거나 시간 계산을 한 번 하면 끝나는 문제는 기본 문항으로 보냈다(3-1-5a.js).
//  - 숫자만 다르거나 말만 다른 꼴은 한 번만 싣는다. 방향만 뒤집은 꼴도 한 번만 싣는다
//    (가장 긴 것과 가장 짧은 것의 차는 길이로만, 걸린 시간 둘을 견주는 꼴은 뺄셈으로만, 「몇 초 뒤」와 「초바늘이 몇 바퀴 돈 뒤」는 앞의 것으로만).
//  - 서술형(틀린 까닭 쓰기, 계산 방법 설명하기, 「초」를 넣어 문장 짓기)은 싣지 않는다.
//  - 아래는 뺐다.
//      뒤 단원·뒤 학년 것이 있어야 풀리는 것: 길이를 소수로 나타내기, 400m씩 여러 바퀴·1100m를 4번((세 자리 수)×(한 자리 수)),
//        한 걸음 50cm로 30m 가기(큰 수의 나눗셈), 1km를 1000m로 받아내리는 km·m 뺄셈, 오후 7시를 19시로 바꾸어야 하는 계산
//      길이·시간 계산보다 조건 풀이가 어려움의 대부분인 것: 빨라지거나 늦어지는 시계, 교시 시간표, 쓰이지 않는 시각이 섞인 글,
//        한 시간 안에 드는 활동 고르기, 가장 짧은 두 길 고르기, 격자 지도의 가장 빠른 길,
//        단위가 다른 빈칸의 수끼리 더하기(cm의 수와 mm의 수를 뜻 없이 더함)
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, tagged, ruler, timeColumn, N, M, C } = B.kit;
  const UNIT = '4수03-16', MEASURE = '4수03-15', SECOND = '4수03-13', TIME = '4수03-14';
  const H = (id, title, source, make, more) => Object.assign({ id, level: '실력', title, source, make }, more || {});
  const SIGNS = ['&gt;', '=', '&lt;'];
  const secs = ([h, m, s]) => h * 3600 + m * 60 + s;
  const hms = (t) => [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60];
  const S = ([h, m, s]) => '(' + [h ? h + '*3600' : '', m ? m + '*60' : '', s ? String(s) : ''].filter(Boolean).join('+') + ')';
  const say = (hour) => ([h, m, s]) => [h ? h + hour : '', m ? m + '분' : '', s ? s + '초' : ''].filter(Boolean).join(' ');
  const at = say('시'), span = say('시간');
  const ask = (units, t) => units.map((unit, i) => ({ answer: t[t.length - units.length + i], unit }));
  const clock = (d, lo, hi) => [d.int(lo, hi), d.int(11, 56), d.int(11, 56)];

  B.addGroup('3-1-5', {
    id: 'hard', title: '실력 문제', standard: TIME,
    types: [
      H('h-zero', '0이 아닌 눈금에서 잰 길이', '천재 단원평가 심화', (d) => {
        // 왼쪽 끝을 눈금 2에 맞추고 잰 길이
        const from = d.int(1, 2) * 10, length = d.until(() => d.int(23, 38), (v) => v % 10 !== 0 && v % 10 !== 5), to = from + length;
        return M(`물건의 왼쪽 끝을 자의 눈금 ${from / 10}에 맞추어 길이를 재었다. 물건의 길이는 몇 cm 몇 mm인가?`, [{ answer: Math.floor(length / 10), unit: 'cm' }, { answer: length % 10, unit: 'mm' }], {
          figure: ruler(from, to, Math.floor(to / 10) + 1), explain: `오른쪽 끝은 ${Math.floor(to / 10)}cm ${to % 10}mm인 곳에 있다. 눈금 ${from / 10}부터 재었으므로 ${Math.floor(to / 10)}cm ${to % 10}mm에서 ${from / 10}cm를 뺀 ${Math.floor(length / 10)}cm ${length % 10}mm이다.`,
          facts: { ruler: true }
        });
      }, { standard: MEASURE }),
      H('h-gap', '가장 긴 것과 가장 짧은 것의 차', 'YBM 수학익힘 심화', (d) => {
        // 215mm, 21cm 3mm, 236mm, 22cm 7mm … 가운데 가장 긴 것과 가장 짧은 것의 차
        const base = d.int(13, 26) * 10;
        const list = d.until(() => [base + d.int(-18, 28), base + d.int(-18, 28), base + d.int(-18, 28), base + d.int(-18, 28)], (v) => new Set(v).size === 4 && v.every((x) => x % 10 !== 0) && new Set(v.map((x) => Math.floor(x / 10))).size >= 3);
        const said = list.map((v, i) => (i % 2 === 0 ? `${v}mm` : `${Math.floor(v / 10)}cm ${v % 10}mm`)), big = Math.max(...list), small = Math.min(...list);
        return N('네 사람의 발 길이이다. 가장 긴 것과 가장 짧은 것의 차는 몇 mm인가?', big - small, {
          unit: 'mm', figure: tagged(said), explain: `mm로 나타내면 ${list.map((v) => v + 'mm').join(', ')}이다. 가장 긴 것은 ${big}mm, 가장 짧은 것은 ${small}mm이므로 차는 ${big - small}mm이다.`,
          facts: { pairs: { numbers: list, want: 'maxDiff' } }
        });
      }, { standard: UNIT }),
      H('h-lap', '같은 거리를 두 번 간 거리', '천재 수학익힘 · YBM 수학익힘 심화', (d) => {
        // 둘레가 860m인 공원을 2바퀴 → 1km 720m
        const a = d.until(() => d.int(52, 97) * 10, (v) => v % 100 !== 0 && (v * 2) % 1000 !== 0), total = a * 2;
        return M(`둘레가 ${a}m인 호수의 둘레를 따라 2바퀴 걸었다. 걸은 거리는 모두 몇 km 몇 m인가?`, [{ answer: Math.floor(total / 1000), unit: 'km' }, { answer: total % 1000, unit: 'm' }], {
          explain: `${a}m + ${a}m = ${total}m이다. 1000m는 1km이므로 ${Math.floor(total / 1000)}km ${total % 1000}m이다.`, facts: { unit: [{ expr: `${a}+${a}`, base: 1000, at: [0, 1] }] }
        });
      }, { standard: UNIT }),
      H('h-routes', '구간 거리를 더해 견주기', 'YBM 서술형평가 · 아이스크림 단원평가 심화', (d) => {
        // 500m+800m 와 1km+200m → 누가 얼마나 더
        const [one, two] = d.shuffle(NAMES).slice(0, 2);
        const [a, b, c] = d.until(() => [d.int(4, 9) * 100, d.int(4, 9) * 100, d.int(1, 8) * 100], ([x, y, z]) => x !== y && z !== x && z !== y && x + y >= 1100 && x + y !== 1000 + z && Math.abs(x + y - 1000 - z) <= 400);
        const flip = d.bool(), values = flip ? [1000 + c, a + b] : [a + b, 1000 + c], winner = values[0] > values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]);
        const parts = flip ? [`1km를 걸은 뒤 ${c}m를 더 걸었고`, `${a}m를 걸은 뒤 ${b}m를 더 걸었다`] : [`${a}m를 걸은 뒤 ${b}m를 더 걸었고`, `1km를 걸은 뒤 ${c}m를 더 걸었다`];
        const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, gap + 100], [1 - winner, gap + 100]]);
        return C(`${name(one, '은/는')} ${parts[0]}, ${name(two, '은/는')} ${parts[1]}. 누가 몇 m 더 많이 걸었는가?`, list.map(([who, n]) => `${[one, two][who]}, ${n}m`), list.findIndex(([who, n]) => who === winner && n === gap), {
          explain: `${name(one, '은/는')} ${values[0]}m, ${name(two, '은/는')} ${values[1]}m를 걸었다. ${name([one, two][winner], '이/가')} ${gap}m 더 많이 걸었다.`,
          facts: { who: { values, options: list, exprs: flip ? [`1*1000+${c}`, `${a}+${b}`] : [`${a}+${b}`, `1*1000+${c}`] }, unseen: [1000] }
        });
      }, { standard: UNIT }),
      H('h-fast', '표기가 다른 두 기록의 차', 'YBM·동아·아이스크림 단원평가 심화', (d) => {
        // 2분 30초와 143초 → 누가 몇 초 더 빨리
        const [one, two] = d.shuffle(NAMES).slice(0, 2), m = d.int(2, 6), s = d.int(8, 52);
        const other = d.until(() => m * 60 + s + d.int(-25, 25), (v) => v !== m * 60 + s && v % 60 !== 0);
        const flip = d.bool(), values = flip ? [other, m * 60 + s] : [m * 60 + s, other], winner = values[0] < values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]);
        const said = flip ? [`${other}초`, `${m}분 ${s}초`] : [`${m}분 ${s}초`, `${other}초`];
        const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, gap + 10], [1 - winner, gap + 10]]);
        return C(`수영 기록이 ${name(one, '은/는')} ${said[0]}, ${name(two, '은/는')} ${said[1]}이다. 누가 몇 초 더 빨리 들어왔는가?`, list.map(([who, n]) => `${[one, two][who]}, ${n}초`), list.findIndex(([who, n]) => who === winner && n === gap), {
          explain: `${m}분 ${s}초는 ${m * 60 + s}초이다. 걸린 시간이 짧은 ${name([one, two][winner], '이/가')} ${gap}초 더 빨리 들어왔다.`,
          facts: { who: { values, options: list, exprs: flip ? [String(other), `${m}*60+${s}`] : [`${m}*60+${s}`, String(other)], smaller: true }, unseen: [60] }
        });
      }, { standard: SECOND }),
      H('h-after', '초로만 나타낸 시간 뒤의 시각', '미래엔·아이스크림·지학사·천재 단원평가 심화', (d) => {
        // 3시 30분 30초에서 400초 후 → 3시 37분 10초
        const [start, n] = d.until(() => [clock(d, 1, 10), d.int(13, 47) * 10], ([t, v]) => v % 60 !== 0 && t[1] + Math.floor(v / 60) + 1 < 59 && t[2] + (v % 60) >= 61), end = hms(secs(start) + n);
        return M(`${at(start)}에서 ${n}초가 지난 시각은 몇 시 몇 분 몇 초인가?`, ask(['시', '분', '초'], end), {
          explain: `${n}초는 ${Math.floor(n / 60)}분 ${n % 60}초이다. ${at(start)}에서 ${Math.floor(n / 60)}분 ${n % 60}초가 지난 시각은 ${at(end)}이다.`,
          facts: { clock: [{ expr: `${S(start)}+${n}`, parts: 'hms', at: 0 }] }
        });
      }),
      H('h-box', '□가 있는 시간의 덧셈식', '미래엔·지학사 단원평가 심화 · YBM 수학익힘 심화', (d) => {
        // □+25분 35초=40분 55초
        const total = [0, d.int(31, 56), d.int(8, 40)], part = d.until(() => [0, d.int(11, 28), d.int(15, 56)], (v) => v[2] > total[2] + 1 && total[1] - 1 > v[1]), rest = hms(secs(total) - secs(part));
        return M('□ 안에 알맞은 시간은 몇 분 몇 초인가?', ask(['분', '초'], rest), {
          figure: `<div class="mb-lines"><div>${box()} + ${span(part)} = ${span(total)}</div></div>`, explain: `□는 ${span(total)}에서 ${span(part)}를 뺀 시간이다. 1분을 60초로 받아내림하여 계산하면 ${span(rest)}이다.`,
          facts: { clock: [{ expr: `${S(total)}-${S(part)}`, parts: 'ms', at: 0 }] }
        });
      }),
      H('h-blanks', '빈칸이 있는 시간의 뺄셈', '천재·아이스크림·지학사 단원평가 심화 · YBM 단원심화평가', (d) => {
        // 6시간 □분 50초 − □시간 15분 □초 = 2시간 24분 32초
        const [a, b] = d.until(() => [[d.int(5, 9), d.int(12, 55), d.int(8, 40)], [d.int(1, 3), d.int(11, 56), d.int(15, 56)]], ([x, y]) => x[2] < y[2] - 1 && x[1] - 1 < y[1] - 1), r = hms(secs(a) - secs(b));
        return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a[1] }, { label: LABELS[1], answer: b[0] }, { label: LABELS[2], answer: b[2] }], {
          figure: timeColumn([a[0] + '시간', box(LABELS[0]) + '분', a[2] + '초'], '-', [box(LABELS[1]) + '시간', b[1] + '분', box(LABELS[2]) + '초'], [r[0] + '시간', r[1] + '분', r[2] + '초']),
          explain: `초: ${a[2]}초에 받아내림한 60초를 더한 ${a[2] + 60}초에서 ㉢을 빼면 ${r[2]}초이므로 ㉢은 ${b[2]}이다. 분: ㉠에서 1을 빼고 받아내림한 60을 더한 뒤 ${josa(b[1], '을/를')} 빼면 ${r[1]}이므로 ㉠은 ${a[1]}이다. 시간: ${a[0]} − 1 − ㉡ = ${r[0]}이므로 ㉡은 ${b[0]}이다.`,
          facts: { timeMasks: { op: '-', a: [a[0], null, a[2]], b: [null, b[1], null], r } }
        });
      }),
      H('h-longer', '걸린 시간 둘을 구해 견주기', '미래엔 서술형 · 디딤돌 서술형 · 비상 차시별 심화 · 천재 수학독해', (d) => {
        // 4시 20분 15초~5시 10분 54초 와 3시 5분 43초~3시 52분 50초 → 누가 얼마나 더
        const [one, two] = d.shuffle(NAMES).slice(0, 2);
        const [s1, t1, s2, t2] = d.until(() => { const a = clock(d, 1, 9), b = clock(d, 1, 9); return [a, d.int(1500, 4300), b, d.int(1500, 4300)]; },
          ([a, x, b, y]) => x !== y && Math.abs(x - y) >= 45 && Math.abs(x - y) <= 420 && a[0] !== b[0] && hms(secs(a) + x)[2] !== 0 && hms(secs(b) + y)[2] !== 0 && hms(secs(a) + x)[1] !== 0 && hms(secs(b) + y)[1] !== 0 && hms(secs(a) + x)[2] < a[2] && hms(secs(b) + y)[2] !== b[2]);
        const e1 = hms(secs(s1) + t1), e2 = hms(secs(s2) + t2), values = [t1, t2], winner = t1 > t2 ? 0 : 1, gap = Math.abs(t1 - t2);
        const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, gap + 60], [1 - winner, gap + 60]]);
        return C(`${name(one, '은/는')} ${at(s1)}부터 ${at(e1)}까지, ${name(two, '은/는')} ${at(s2)}부터 ${at(e2)}까지 책을 읽었다. 누가 얼마나 더 오래 읽었는가?`, list.map(([who, n]) => `${[one, two][who]}, ${span(hms(n))}`), list.findIndex(([who, n]) => who === winner && n === gap), {
          explain: `${name(one, '은/는')} ${span(hms(t1))}, ${name(two, '은/는')} ${span(hms(t2))} 동안 읽었다. ${name([one, two][winner], '이/가')} ${span(hms(gap))} 더 오래 읽었다.`,
          facts: { who: { values, options: list, exprs: [`${S(e1)}-${S(s1)}`, `${S(e2)}-${S(s2)}`] }, clockExprs: true }
        });
      }),
      H('h-round', '한쪽 시간과 차로 둘의 합 구하기', '미래엔 단원평가 심화 · 천재 서술형 평가', (d) => {
        // 갈 때 2시간 25분 10초, 올 때는 5분 더 → 왕복 4시간 55분 20초
        const go = [d.int(1, 2), d.int(12, 24), d.int(8, 26)], more = d.int(3, 9), total = hms(secs(go) * 2 + more * 60);
        return M(`할머니 댁에 갈 때는 ${span(go)}이 걸렸고, 돌아올 때는 갈 때보다 ${more}분이 더 걸렸다. 할머니 댁에 다녀오는 데 걸린 시간은 모두 몇 시간 몇 분 몇 초인가?`.replace('초이 걸렸고', '초가 걸렸고'), ask(['시간', '분', '초'], total), {
          explain: `돌아올 때 걸린 시간은 ${span(hms(secs(go) + more * 60))}이다. 갈 때와 돌아올 때 걸린 시간을 더하면 ${span(total)}이다.`,
          facts: { clock: [{ expr: `${S(go)}+${S(go)}+${more}*60`, parts: 'hms', at: 0 }] }
        });
      }),
      H('h-night', '낮의 길이로 밤의 길이 구하기', '디딤돌·미래엔·아이스크림 단원평가 심화 · 지학사 서술형', (d) => {
        // 낮 9시간 35분 55초 → 밤 14시간 24분 5초
        const day = [d.int(10, 13), d.int(11, 52), d.int(11, 52)], night = hms(24 * 3600 - secs(day));
        return M(`어느 날 낮의 길이가 ${span(day)}였다. 이날 밤의 길이는 몇 시간 몇 분 몇 초인가?`, ask(['시간', '분', '초'], night), {
          explain: `하루는 24시간이다. 24시간을 23시간 59분 60초로 생각하여 ${span(day)}를 빼면 ${span(night)}이다.`,
          facts: { clock: [{ expr: `24*3600-${S(day)}`, parts: 'hms', at: 0 }], unseen: [24] }
        });
      }),
      H('h-compare', '두 계산 결과의 비교', '미래엔·지학사 단원평가 심화 · YBM 단원심화평가', (d) => {
        // ㉠ 1시간 14분 50초+5시간 8분 20초 ㉡ 3시간 40분 10초+2시간 44분 5초 (화면 폭에 맞춰 분과 초로만 낸다)
        const one = () => [0, d.int(11, 38), d.int(11, 56)];
        const [a, b, c, e] = d.until(() => [one(), one(), one(), one()], ([p, q, r, s]) => {
          const x = secs(p) + secs(q), y = secs(r) + secs(s);
          return Math.abs(x - y) <= 150 && x !== y && p[2] + q[2] >= 61 && r[2] + s[2] >= 61 && Math.abs(p[1] + q[1] - r[1] - s[1]) <= 1 && p[1] !== r[1] && q[1] !== s[1];
        });
        const x = secs(a) + secs(b), y = secs(c) + secs(e);
        return C('㉠과 ㉡의 계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, x > y ? 0 : x === y ? 1 : 2, {
          figure: tagged([`${span(a)} + ${span(b)}`, `${span(c)} + ${span(e)}`]) + '<div class="mb-versus"><span class="mb-expr">㉠</span><span class="mb-ring"></span><span class="mb-expr">㉡</span></div>',
          explain: `㉠은 ${span(hms(x))}, ㉡은 ${span(hms(y))}이다.`, facts: { choose: { exprs: [`${S(a)}+${S(b)}`, `${S(c)}+${S(e)}`], rule: 'compare' }, clockExprs: true }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
