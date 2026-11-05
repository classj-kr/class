// 타자 레이스: 서버와 화면이 같은 규칙으로 타수·점수를 센다.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TypingRaceCore = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const INITIAL = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split('');
  const MEDIAL = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅗㅏ', 'ㅗㅐ', 'ㅗㅣ', 'ㅛ', 'ㅜ', 'ㅜㅓ', 'ㅜㅔ', 'ㅜㅣ', 'ㅠ', 'ㅡ', 'ㅡㅣ', 'ㅣ'];
  const FINAL = ['', 'ㄱ', 'ㄲ', 'ㄱㅅ', 'ㄴ', 'ㄴㅈ', 'ㄴㅎ', 'ㄷ', 'ㄹ', 'ㄹㄱ', 'ㄹㅁ', 'ㄹㅂ', 'ㄹㅅ', 'ㄹㅌ', 'ㄹㅍ', 'ㄹㅎ', 'ㅁ', 'ㅂ', 'ㅂㅅ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  // 조합 중에 낱자로 보이는 겹자모도 실제로 누른 키로 풀어 둔다.
  const COMPAT = { ㄳ: 'ㄱㅅ', ㄵ: 'ㄴㅈ', ㄶ: 'ㄴㅎ', ㄺ: 'ㄹㄱ', ㄻ: 'ㄹㅁ', ㄼ: 'ㄹㅂ', ㄽ: 'ㄹㅅ', ㄾ: 'ㄹㅌ', ㄿ: 'ㄹㅍ', ㅀ: 'ㄹㅎ', ㅄ: 'ㅂㅅ', ㅘ: 'ㅗㅏ', ㅙ: 'ㅗㅐ', ㅚ: 'ㅗㅣ', ㅝ: 'ㅜㅓ', ㅞ: 'ㅜㅔ', ㅟ: 'ㅜㅣ', ㅢ: 'ㅡㅣ' };
  const MODES = {
    'ko-words': { label: '한글 낱말', short: '낱말', lang: 'ko', sentence: false },
    'ko-sentences': { label: '한글 속담', short: '속담', lang: 'ko', sentence: true },
    'en-words': { label: '영어 단어', short: 'Words', lang: 'en', sentence: false },
  };
  const DURATIONS = [60, 90, 120, 180];
  const RACERS = ['🚀', '🏎️', '🐆', '🦄', '🐉', '🦖', '🐬', '🦅', '🐝', '🦊', '🐯', '🐧', '🛸', '🚁', '🐎', '🦈', '🐙', '🦉', '🐼', '🐸', '🦁', '🐳', '🦋', '🐢'];
  const COMBO_CAP = 10;
  // 팀전: 팀마다 1~5명. 인원이 달라도 되고, 점수는 합계나 평균으로 겨룬다.
  const TEAM_MAX = 5;
  const TEAM_COUNTS = [2, 3, 4, 5, 6];
  const TEAM_SCORING = { sum: '합계', avg: '평균' };
  const TEAMS = [
    { name: '레드', emoji: '🔴', hue: 352 },
    { name: '블루', emoji: '🔵', hue: 212 },
    { name: '그린', emoji: '🟢', hue: 140 },
    { name: '옐로', emoji: '🟡', hue: 48 },
    { name: '퍼플', emoji: '🟣', hue: 275 },
    { name: '오렌지', emoji: '🟠', hue: 26 },
  ];
  function teamBoard(rows, teamCount, scoring) {
    const teams = TEAMS.slice(0, teamCount).map((t, index) => {
      const members = rows.filter((r) => r.team === index);
      const total = members.reduce((s, r) => s + (r.score || 0), 0);
      const value = scoring === 'avg' ? (members.length ? Math.round(total / members.length) : 0) : total;
      const reached = Math.max(0, ...members.map((r) => r.scoredAt || 0)) || null;
      return { index, name: t.name, emoji: t.emoji, hue: t.hue, size: members.length, total, value, reached };
    });
    const ranked = teams
      .filter((t) => t.size)
      .sort((a, b) => b.value - a.value || (a.reached ?? Infinity) - (b.reached ?? Infinity) || a.index - b.index);
    ranked.forEach((t, i) => (t.rank = i + 1));
    return teams;
  }

  function keys(text) {
    let out = '';
    for (const char of String(text || '')) {
      const code = char.charCodeAt(0);
      if (code >= 0xac00 && code <= 0xd7a3) {
        const offset = code - 0xac00;
        out += INITIAL[Math.floor(offset / 588)] + MEDIAL[Math.floor((offset % 588) / 28)] + FINAL[offset % 28];
      } else out += COMPAT[char] || char;
    }
    return out;
  }
  const strokes = (text) => [...keys(text)].length;
  // 받침이 다음 글자로 옮겨 가는 중간 모양(사→삭→사과)도 맞게 치는 중으로 본다.
  function onTrack(typed, target) {
    const a = keys(typed), b = keys(target);
    return a.length <= b.length && b.startsWith(a);
  }
  const multiplier = (combo) => 1 + Math.min(Math.max(combo, 0), COMBO_CAP) / COMBO_CAP;
  const itemScore = (text, combo) => Math.round(strokes(text) * multiplier(combo));
  const accuracy = (good, mistakes) => (good + mistakes ? Math.round((good / (good + mistakes)) * 100) : 100);
  function rank(rows) {
    return [...rows].sort(
      (a, b) =>
        (b.score || 0) - (a.score || 0) ||
        (b.accuracy ?? 100) - (a.accuracy ?? 100) ||
        (a.scoredAt ?? Infinity) - (b.scoredAt ?? Infinity) ||
        String(a.name).localeCompare(String(b.name), 'ko'),
    );
  }
  return { MODES, DURATIONS, RACERS, COMBO_CAP, TEAM_MAX, TEAM_COUNTS, TEAM_SCORING, TEAMS, teamBoard, keys, strokes, onTrack, multiplier, itemScore, accuracy, rank };
});
