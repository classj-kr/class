'use strict';
// 전담이 맡은 (학년, 교과) 짝. 교직원 명단의 「담당 학년」「담당 과목」 칸을 읽어 만들고, 다시 그 칸에 보여 줄 글로 돌린다.
// 한 사람이 "3·4학년 음악 + 5·6학년 영어"처럼 학년마다 다른 과목을 맡을 수 있어서 학년과 과목을 곱하지 않고 짝으로 둔다.
//   담당 학년 "3,4,5,6" + 담당 과목 "음악, 영어"        → 두 과목 다 3~6학년
//   담당 과목 "음악(3,4), 영어(5,6)"                     → 과목마다 괄호 안 학년
//   담당 과목 "음악(3,4), 영어" + 담당 학년 "5,6"        → 괄호 없는 과목만 담당 학년을 따른다

const MAX_PAIRS = 60;

// "3,4,5,6" "3·4" "3~6" "3 4 5" "3학년, 4학년" → [3, 4, 5, 6]
function parseGrades(text) {
  const out = new Set();
  const cleaned = String(text == null ? '' : text).replace(/학년/g, '');
  for (const part of cleaned.split(/[,\s·/]+/)) {
    if (!part) continue;
    const range = /^(\d+)\s*[~\-–]\s*(\d+)$/.exec(part);
    if (range) {
      const from = Number(range[1]), to = Number(range[2]);
      for (let g = Math.min(from, to); g <= Math.max(from, to); g += 1) if (g >= 1 && g <= 12) out.add(g);
      continue;
    }
    const n = Number(part);
    if (Number.isInteger(n) && n >= 1 && n <= 12) out.add(n);
  }
  return [...out].sort((a, b) => a - b);
}

const cleanSubject = (text) => String(text == null ? '' : text).replace(/\s+/g, ' ').trim().slice(0, 30);
const subjectKey = (text) => cleanSubject(text).replace(/\s+/g, '');

// 담당 학년·담당 과목 칸 → { pairs: [{ grade, subject }], subjects: ['음악', '영어'] }
function parseTeachingScope(gradeText, subjectText) {
  const defaultGrades = parseGrades(gradeText);
  const pairs = [];
  const subjects = [];
  const seen = new Set();
  // 괄호 안의 쉼표는 과목 구분이 아니다: "음악(3,4), 영어(5,6)" 는 과목 둘.
  const entries = String(subjectText == null ? '' : subjectText).split(/[,，;/]+(?![^()（）]*[)）])/);
  for (const entry of entries) {
    const m = /^\s*([^()（）]+?)\s*(?:[(（]([^()（）]*)[)）])?\s*$/.exec(entry);
    if (!m) continue;
    const subject = cleanSubject(m[1]);
    if (!subject) continue;
    if (!seen.has(subjectKey(subject))) { seen.add(subjectKey(subject)); subjects.push(subject); }
    const grades = m[2] != null && parseGrades(m[2]).length ? parseGrades(m[2]) : defaultGrades;
    for (const grade of grades) {
      if (pairs.length >= MAX_PAIRS) break;
      if (!pairs.some((p) => p.grade === grade && subjectKey(p.subject) === subjectKey(subject))) pairs.push({ grade, subject });
    }
  }
  return { pairs, subjects };
}

// 저장된 짝 → 명단 칸에 보여 줄 글. 과목마다 학년이 같으면 학년 칸에 한 번만, 다르면 과목 뒤 괄호에 적는다.
function formatTeachingScope(pairs) {
  const list = normalizePairs(pairs);
  const bySubject = new Map();
  for (const p of list) {
    if (!bySubject.has(p.subject)) bySubject.set(p.subject, []);
    bySubject.get(p.subject).push(p.grade);
  }
  const subjects = [...bySubject.keys()];
  const gradeSets = subjects.map((s) => bySubject.get(s).sort((a, b) => a - b).join(','));
  const allSame = gradeSets.every((g) => g === gradeSets[0]);
  if (allSame) return { gradeText: gradeSets[0] || '', subjectText: subjects.join(', ') };
  const union = [...new Set(list.map((p) => p.grade))].sort((a, b) => a - b);
  return { gradeText: union.join(','), subjectText: subjects.map((s, i) => s + '(' + gradeSets[i] + ')').join(', ') };
}

// DB 에서 읽은 것(JSON 글이든 배열이든)을 깨끗한 짝 배열로.
function normalizePairs(raw) {
  let list = raw;
  if (typeof list === 'string') { try { list = JSON.parse(list); } catch (_) { list = []; } }
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const p of list) {
    const grade = Number(p?.grade), subject = cleanSubject(p?.subject);
    if (!Number.isInteger(grade) || grade < 1 || grade > 12 || !subject) continue;
    if (!out.some((q) => q.grade === grade && subjectKey(q.subject) === subjectKey(subject))) out.push({ grade, subject });
    if (out.length >= MAX_PAIRS) break;
  }
  return out;
}

// 이 짝 목록이 (학년, 교과)를 품는가. 과목 이름은 띄어쓰기를 무시하고 견준다.
function coversPair(pairs, grade, subject) {
  const key = subjectKey(subject);
  return normalizePairs(pairs).some((p) => p.grade === Number(grade) && subjectKey(p.subject) === key);
}

module.exports = { parseGrades, parseTeachingScope, formatTeachingScope, normalizePairs, coversPair, subjectKey };
