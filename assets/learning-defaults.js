(function (root) {
  'use strict';
  // 수업 준비용 기본 학기. 기기의 시간대와 관계없이 한국 날짜로 판단한다.
  function term(now = new Date()) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Seoul', year: 'numeric', month: 'numeric', day: 'numeric'
    }).formatToParts(now).map(part => [part.type, part.value]));
    const year = Number(parts.year), day = Number(parts.month) * 100 + Number(parts.day);
    return { year: day < 215 ? year - 1 : year, semester: day >= 215 && day < 815 ? 1 : 2 };
  }
  function highestGrade(grades, max = 6) {
    const valid = grades.map(Number).filter(g => Number.isInteger(g) && g >= 1 && g <= max);
    return valid.length ? Math.max(...valid) : null;
  }
  function mathTerm(level, grade, available, now) {
    const offset = { elementary: 0, middle: 6, high: 9 }[level];
    const valid = highestGrade([grade], level === 'elementary' ? 6 : 3);
    if (offset === undefined || !valid) return null;
    const semester = term(now).semester;
    const wanted = `${offset + valid}-${semester}`;
    if (available.includes(wanted)) return wanted;
    // 해당 학년 자료가 없으면 같은 학교급의 가장 가까운 학년을 보여 준다.
    const candidates = available.filter(value => {
      const [g, s] = value.split('-').map(Number);
      return s === semester && g > offset && g <= offset + (level === 'elementary' ? 6 : 3);
    });
    return candidates.sort((a, b) => Math.abs(Number(a.split('-')[0]) - offset - valid) -
      Math.abs(Number(b.split('-')[0]) - offset - valid))[0] || null;
  }
  const api = { term, highestGrade, mathTerm };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LearningDefaults = api;
})(typeof window === 'undefined' ? globalThis : window);
