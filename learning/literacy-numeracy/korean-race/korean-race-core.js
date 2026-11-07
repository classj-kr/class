// 문해력 순위전(맞춤법·한자성어·속담·관용어·영단어·한자): 서버와 화면이 같은 규칙으로 점수·순위·팀 점수를 센다.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KoreanRaceCore = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // 각 콘텐츠의 원래 학습 화면 주소는 전체 잠금 확인과 "돌아가기"에 쓴다.
  const SETS = {
    spelling: { label: '맞춤법', emoji: '✏️', app: '/learning/literacy-numeracy/spelling', choices: 2 },
    idioms: { label: '한자성어', emoji: '🀄', app: '/learning/literacy-numeracy/classical-chinese-idioms', choices: 4, levels: [['all', '전체'], ['초급', '초급'], ['중급', '중급'], ['고급', '고급']] },
    proverbs: { label: '속담', emoji: '📜', app: '/learning/literacy-numeracy/proverbs', choices: 3 },
    expressions: { label: '관용어', emoji: '👄', app: '/learning/literacy-numeracy/idiomatic-expressions', choices: 3 },
    mixed: { label: '국어 종합', emoji: '🎲', app: '', choices: 0 },
    vocabulary: { label: '영단어', emoji: '🔤', app: '/learning/literacy-numeracy/vocabulary', choices: 4, levels: [['elementary', '초'], ['middle_common', '중'], ['advanced', '고']] },
    // 한자는 진도표 25단계를 범위(RANGE_SETS)로 고른다.
    hanja: { label: '한자', emoji: '字', app: '/learning/literacy-numeracy/hanja-meaning', choices: 4 },
    // 문장 고르기는 차시마다 있는 고르기 문제만 낸다(①~⑤ 문장 번호를 고르는 문제는 보기가 다섯).
    sentences: { label: '문장 고르기', emoji: '🧩', app: '/learning/literacy-numeracy/sentence-building', choices: 4 },
  };
  // 국어 종합은 국어 네 가지를 섞는다(영단어·한자는 단계가 따로 있어 빼 둔다).
  const MIXED_PARTS = ['spelling', 'idioms', 'proverbs', 'expressions'];
  const DURATIONS = [60, 90, 120, 180];
  const RACERS = ['🐯', '🦊', '🐰', '🐻', '🐼', '🐧', '🦉', '🐸', '🐨', '🦁', '🐳', '🦄', '🐢', '🐙', '🦋', '🐝', '🐬', '🦔', '🐿️', '🦦', '🐤', '🐮', '🐹', '🐺'];
  // 연산 순위전처럼 연속으로 맞히면 한 문제의 값이 오른다.
  const COMBO_STEPS = [[10, 3], [5, 2]];
  // 연산 순위전처럼 틀리면 1점을 잃고 같은 문제를 맞힐 때까지 다시 고른다(정답은 알려 주지 않는다).
  const WRONG_PENALTY = 1;
  // 틀린 뒤 잠깐은 다시 고를 수 없다. 보기가 둘인 문제를 마구 찍으면 평균 +0.5점이 남으므로,
  // 찍는 쪽이 꼼꼼히 읽고 푸는 쪽보다 빨리 점수를 모으지 못하게 넉넉히 기다리게 한다.
  const RETRY_LOCK_MS = 1500;
  // 새 문제가 뜬 뒤 이보다 빨리 고르면 읽지 않은 것으로 본다.
  const MIN_ANSWER_MS = 800;
  // 여러 번 만에 맞히면 풀이를 잠깐 보여 준다.
  const REVEAL_MS = 1500;
  // 팀전: 해·달·별… 팀마다 1~6명, 팀은 여덟까지. 모두가 모은 점수를 합쳐 겨룬다.
  const TEAM_MAX = 6;
  const TEAM_COUNTS = [2, 3, 4, 5, 6, 7, 8];
  const TEAMS = [
    { name: '해', emoji: '☀️', hue: 30 },
    { name: '달', emoji: '🌙', hue: 225 },
    { name: '별', emoji: '⭐', hue: 48 },
    { name: '구름', emoji: '☁️', hue: 195 },
    { name: '꽃', emoji: '🌸', hue: 330 },
    { name: '숲', emoji: '🌲', hue: 140 },
    { name: '산', emoji: '⛰️', hue: 0 },
    { name: '바다', emoji: '🌊', hue: 265 },
  ];
  // 블록 열 개가 한 층이 된다(연산의 십 모형처럼).
  const FLOOR = 10;

  function points(combo) {
    for (const [from, value] of COMBO_STEPS) if (combo >= from) return value;
    return 1;
  }
  const accuracy = (correct, wrong) => (correct + wrong ? Math.round((correct / (correct + wrong)) * 100) : 100);
  function rank(rows) {
    return [...rows].sort(
      (a, b) =>
        (b.score || 0) - (a.score || 0) ||
        (b.correct || 0) - (a.correct || 0) ||
        (b.accuracy ?? 100) - (a.accuracy ?? 100) ||
        (a.scoredAt ?? Infinity) - (b.scoredAt ?? Infinity) ||
        String(a.name).localeCompare(String(b.name), 'ko'),
    );
  }
  function teamBoard(rows, teamCount) {
    const teams = TEAMS.slice(0, teamCount).map((t, index) => {
      const members = rows.filter((r) => r.team === index);
      const total = members.reduce((s, r) => s + (r.score || 0), 0);
      const correct = members.reduce((s, r) => s + (r.correct || 0), 0);
      return { index, name: t.name, emoji: t.emoji, hue: t.hue, size: members.length, total, value: total, correct };
    });
    // 점수와 맞힌 수가 같으면 같은 등수로 둔다.
    const ranked = teams.filter((t) => t.size).sort((a, b) => b.value - a.value || b.correct - a.correct || a.index - b.index);
    ranked.forEach((t, i) => {
      const prev = ranked[i - 1];
      t.rank = prev && prev.value === t.value && prev.correct === t.correct ? prev.rank : i + 1;
    });
    return teams;
  }
  function levelsOf(set) {
    return SETS[set]?.levels || null;
  }
  function validLevel(set, level) {
    const levels = levelsOf(set);
    if (!levels) return 'all';
    return levels.some(([value]) => value === level) ? level : levels[0][0];
  }
  // 학습 화면에서 보던 범위만 내는 순위전. 영단어는 "1"=Level 1(200단어), "1-4"=Level 1의 4차시(20단어),
  // 나머지는 "3"=3차시. 앞에 "~"를 붙이면 맨 처음 차시부터 그 자리까지 모두 낸다.
  // 한자는 "5"=5단계, "~5"=1~5단계. 순위전 화면에서 단계를 바로 고를 수 있다(pick).
  // 문장 고르기는 한 차시에 고르기 문제가 셋뿐이라 "처음부터 거기까지"만 낸다(uptoOnly). 1차시까지면 전체로 낸다.
  const RANGE_SETS = { vocabulary: { units: 15, lessons: 10 }, spelling: { lessons: 99 }, idioms: { lessons: 99 }, proverbs: { lessons: 99 }, expressions: { lessons: 99 }, hanja: { lessons: 25, name: '단계', pick: true }, sentences: { lessons: 24, uptoOnly: true } };
  function validRange(set, value) {
    const spec = RANGE_SETS[set];
    const match = spec && /^(~?)(\d{1,2})(?:-(\d{1,2}))?$/.exec(String(value ?? ''));
    if (!match) return null;
    const upto = match[1], first = Number(match[2]), second = match[3] ? Number(match[3]) : null;
    if (spec.uptoOnly) return second === null && first >= 2 && first <= spec.lessons ? '~' + first : null;
    if (!spec.units) return second === null && first >= 1 && first <= spec.lessons ? upto + first : null;
    if (first < 1 || first > spec.units || (second !== null && (second < 1 || second > spec.lessons))) return null;
    return upto + (second === null ? String(first) : `${first}-${second}`);
  }
  // 문항 자리가 범위에 드는가. 영단어는 unit(Level)·lesson, 나머지는 lesson만 본다.
  // 영단어 "1"처럼 차시 없이 Level만 고르면 그 Level 전체.
  function inRange(set, range, unit, lesson) {
    const text = String(range), upto = text.startsWith('~');
    const nums = text.replace('~', '').split('-').map(Number);
    if (!RANGE_SETS[set]?.units) return Boolean(lesson) && (upto ? lesson <= nums[0] : lesson === nums[0]);
    const [u, l] = nums;
    if (upto) return unit < u || (unit === u && (!l || lesson <= l));
    return unit === u && (!l || lesson === l);
  }
  function rangeLabel(set, range) {
    const text = String(range), upto = text.startsWith('~');
    const [first, second] = text.replace('~', '').split('-').map(Number);
    const spec = RANGE_SETS[set] || {}, units = spec.units;
    const at = units ? `Level ${first}${second ? ` · ${second}차시` : ''}` : `${first}${spec.name || '차시'}`;
    const isFirst = units ? first === 1 && second === 1 : first === 1;
    if (!upto || isFirst) return at;
    return spec.name ? `1~${at}` : `처음~${at}`;
  }
  return { SETS, MIXED_PARTS, RANGE_SETS, validRange, inRange, rangeLabel, DURATIONS, RACERS, COMBO_STEPS, WRONG_PENALTY, RETRY_LOCK_MS, MIN_ANSWER_MS, REVEAL_MS, TEAM_MAX, TEAM_COUNTS, TEAMS, FLOOR, points, accuracy, rank, teamBoard, levelsOf, validLevel };
});
