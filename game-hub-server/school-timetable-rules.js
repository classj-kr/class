"use strict";

// 학교 시간표 저장·집계가 함께 쓰는 규칙. 칸의 뜻이 화면마다 달라지지 않게 한곳에 둔다.
const NOT_A_LESSON = new Set(["", "-", "수업없음"]);
const SUBJECT_MAX_LENGTH = 50;

const inRange = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;

// 학년도는 3월에 시작하므로 한국 시각으로 1~2월은 앞 학년도다.
function currentAcademicYear(now = new Date()) {
  const korea = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return korea.getUTCFullYear() - (korea.getUTCMonth() < 2 ? 1 : 0);
}

function parseYear(raw, now) {
  if (raw === undefined || raw === null || raw === "") return currentAcademicYear(now);
  const year = Number(raw);
  return inRange(year, 2000, 2200) ? year : null;
}

function parseClass(rawGrade, rawClass) {
  if (rawGrade === "" || rawGrade === null || rawClass === "" || rawClass === null) return null;
  const grade = Number(rawGrade);
  const classNumber = Number(rawClass);
  return inRange(grade, 1, 12) && inRange(classNumber, 1, 30) ? { grade, classNumber } : null;
}

function parseSlot(cell) {
  const dayOfWeek = Number(cell?.dayOfWeek);
  const period = Number(cell?.period);
  return inRange(dayOfWeek, 1, 5) && inRange(period, 1, 8) ? { dayOfWeek, period } : null;
}

function cleanSubject(value) {
  const subject = String(value ?? "").trim().slice(0, SUBJECT_MAX_LENGTH);
  return subject === "-" ? "" : subject;
}

function isLesson(row) {
  return !NOT_A_LESSON.has(String(row?.subject_name ?? "").trim())
    || row?.teacher_user_id != null
    || row?.room_name != null;
}

// 요일별 실제 수업 칸 수. 가장 늦은 교시를 쓰면 중간에 빈 칸이 있을 때 시수가 부풀려진다.
function dailyLessonCounts(rows) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const row of rows) {
    if (isLesson(row) && counts[row.day_of_week] !== undefined) counts[row.day_of_week] += 1;
  }
  return counts;
}

module.exports = {
  cleanSubject,
  currentAcademicYear,
  dailyLessonCounts,
  isLesson,
  parseClass,
  parseSlot,
  parseYear
};
