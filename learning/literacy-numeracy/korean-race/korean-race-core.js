// 국어 순위전: 서버와 화면이 같은 규칙으로 점수·순위·팀 점수를 센다.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KoreanRaceCore = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // 각 콘텐츠의 원래 학습 화면 주소는 전체 잠금 확인과 "돌아가기"에 쓴다.
  const SETS = {
    spelling: { label: '맞춤법', emoji: '✏️', app: '/learning/literacy-numeracy/spelling', choices: 2 },
    idioms: { label: '한자성어', emoji: '📜', app: '/learning/literacy-numeracy/classical-chinese-idioms', choices: 4, levels: [['all', '전체'], ['초급', '초급'], ['중급', '중급'], ['고급', '고급']] },
    proverbs: { label: '속담', emoji: '🐯', app: '/learning/literacy-numeracy/proverbs', choices: 3 },
    expressions: { label: '관용어', emoji: '👄', app: '/learning/literacy-numeracy/idiomatic-expressions', choices: 3 },
    mixed: { label: '국어 종합', emoji: '🎲', app: '', choices: 0 },
    vocabulary: { label: '영단어', emoji: '🔤', app: '/learning/literacy-numeracy/vocabulary', choices: 4, levels: [['elementary', '초등'], ['middle_common', '중학'], ['advanced', '고등']] },
  };
  // 국어 종합은 국어 네 가지를 섞는다(영단어는 빼 둔다).
  const MIXED_PARTS = ['spelling', 'idioms', 'proverbs', 'expressions'];
  const DURATIONS = [60, 90, 120, 180];
  const RACERS = ['🐯', '🦊', '🐰', '🐻', '🐼', '🐧', '🦉', '🐸', '🐨', '🦁', '🐳', '🦄', '🐢', '🐙', '🦋', '🐝', '🐬', '🦔', '🐿️', '🦦', '🐤', '🐮', '🐹', '🐺'];
  // 연산 순위전처럼 연속으로 맞히면 한 문제의 값이 오른다.
  const COMBO_STEPS = [[10, 3], [5, 2]];
  const WRONG_PENALTY = 1;
  // 틀리면 정답과 풀이를 잠깐 보여 준다. 그동안은 다음 답을 받지 않는다.
  const REVEAL_MS = 1500;
  // 팀전: 해·달·별… 팀마다 1~6명. 모두가 모은 점수를 합쳐 겨룬다.
  const TEAM_MAX = 6;
  const TEAM_COUNTS = [2, 3, 4, 5, 6];
  const TEAMS = [
    { name: '해', emoji: '☀️', hue: 30 },
    { name: '달', emoji: '🌙', hue: 225 },
    { name: '별', emoji: '⭐', hue: 48 },
    { name: '구름', emoji: '☁️', hue: 195 },
    { name: '꽃', emoji: '🌸', hue: 330 },
    { name: '숲', emoji: '🌲', hue: 140 },
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
  return { SETS, MIXED_PARTS, DURATIONS, RACERS, COMBO_STEPS, WRONG_PENALTY, REVEAL_MS, TEAM_MAX, TEAM_COUNTS, TEAMS, FLOOR, points, accuracy, rank, teamBoard, levelsOf, validLevel };
});
