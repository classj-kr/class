"use strict";

// 학급 대시보드와 학생 화면이 함께 보는 반 시간표.
// 기본은 학교 기초시간표(과목)·시정표(시각)·특별실 배정(장소)이고, 담임이 바꾼 칸만
// 그 반·학년도의 예외로 덮는다. 학교 기초시간표가 아직 없는 반은 담임이 대시보드에
// 저장해 둔 시간표를 그대로 쓴다. 지어낸 예시 시간표는 어디에도 없다.
const timetableRules = require("./school-timetable-rules");

const DAYS = ["월", "화", "수", "목", "금"];
const MAX_TEXT = 50;

const text = value => String(value ?? "").trim().slice(0, MAX_TEXT);
function clock(value) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value ?? "").trim());
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return "";
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function cleanItem(item, period = item?.p) {
  const p = Number(period);
  if (!Number.isInteger(p) || p < 1 || p > 8) return null;
  return { p, sub: text(item?.sub), place: text(item?.place), s: clock(item?.s), e: clock(item?.e) };
}

const byPeriod = (a, b) => a.p - b.p;

// 예전부터 대시보드에 저장된 요일별 목록.
function cleanDays(value) {
  const timetable = {};
  for (const day of DAYS) {
    if (!Array.isArray(value?.[day])) continue;
    const items = value[day].map(item => cleanItem(item)).filter(item => item && (item.sub || item.place));
    if (items.length) timetable[day] = items.sort(byPeriod);
  }
  return timetable;
}

function bellTimes(periodTimes) {
  const times = {};
  for (let p = 1; p <= 8; p++) {
    const slot = periodTimes?.[p] ?? periodTimes?.[String(p)];
    times[p] = { s: clock(slot?.start), e: clock(slot?.end) };
  }
  return times;
}

function schoolBase(rows, periodTimes) {
  const times = bellTimes(periodTimes);
  const days = {};
  for (const row of rows) {
    if (!timetableRules.isLesson(row)) continue;
    const day = DAYS[Number(row.day_of_week) - 1];
    const p = Number(row.period);
    if (!day || !(p >= 1 && p <= 8)) continue;
    const subject = String(row.subject_name || "").trim();
    (days[day] ||= []).push({ p, sub: subject === "-" ? "" : subject, place: text(row.room_name), ...times[p] });
  }
  for (const day of Object.keys(days)) days[day].sort(byPeriod);
  return days;
}

function applyOverrides(base, overrides) {
  const timetable = {};
  for (const day of DAYS) {
    const items = new Map((base[day] || []).map(item => [item.p, item]));
    for (const [period, change] of Object.entries(overrides?.[day] || {})) {
      const p = Number(period);
      if (change?.removed) items.delete(p);
      else {
        const item = cleanItem(change, p);
        if (item) items.set(p, { ...item, changed: true });
      }
    }
    if (items.size) timetable[day] = [...items.values()].sort(byPeriod);
  }
  return timetable;
}

const sameItem = (a, b) => a.sub === b.sub && a.place === b.place && a.s === b.s && a.e === b.e;

// 저장할 것은 학교 시간표와 다른 칸뿐이다. 같아진 칸은 예외에서 빠진다.
function diffDay(baseItems, periods) {
  const base = new Map((baseItems || []).map(item => [item.p, item]));
  const wanted = new Map();
  for (const item of periods) {
    const clean = cleanItem(item);
    if (clean && (clean.sub || clean.place)) wanted.set(clean.p, clean);
  }
  const changes = {};
  for (let p = 1; p <= 8; p++) {
    const before = base.get(p);
    const after = wanted.get(p);
    if (before && !after) changes[p] = { removed: true };
    else if (after && (!before || !sameItem(before, after))) {
      const { sub, place, s, e } = after;
      changes[p] = { sub, place, s, e };
    }
  }
  return changes;
}

async function schoolRows(pool, { schoolId, year, grade, classNumber }) {
  const [lessons, bell] = await Promise.all([
    pool.query(
      `SELECT day_of_week, period, subject_name, teacher_user_id, room_name
       FROM school_master_timetable
       WHERE school_id = $1 AND academic_year = $2 AND grade = $3 AND class_number = $4`,
      [schoolId, year, grade, classNumber]),
    pool.query(
      `SELECT period_times FROM school_bell_schedule WHERE school_id = $1 AND academic_year = $2 AND grade = $3`,
      [schoolId, year, grade])
  ]);
  const rows = lessons.rows.filter(row => timetableRules.isLesson(row));
  return { rows, base: schoolBase(rows, bell.rows[0]?.period_times) };
}

async function teacherTimetable(pool, userId) {
  if (!userId) return {};
  const { rows } = await pool.query(
    "SELECT timetable FROM classroom_teacher_dashboard_settings WHERE user_id = $1", [userId]);
  return cleanDays(rows[0]?.timetable);
}

async function loadClassTimetable(pool, place) {
  const { rows, base } = await schoolRows(pool, place);
  if (rows.length) {
    const saved = await pool.query(
      `SELECT overrides FROM classroom_class_timetable_overrides
       WHERE school_id = $1 AND academic_year = $2 AND grade = $3 AND class_number = $4`,
      [place.schoolId, place.year, place.grade, place.classNumber]);
    return { timetable: applyOverrides(base, saved.rows[0]?.overrides), source: "school" };
  }
  const timetable = await teacherTimetable(pool, place.legacyUserId);
  return { timetable, source: Object.keys(timetable).length ? "teacher" : "none" };
}

async function saveTeacherDay(pool, userId, day, periods) {
  const { rows } = await pool.query(
    "SELECT timetable FROM classroom_teacher_dashboard_settings WHERE user_id = $1", [userId]);
  const timetable = cleanDays(rows[0]?.timetable);
  const items = periods.map(item => cleanItem(item)).filter(item => item && (item.sub || item.place)).sort(byPeriod);
  if (items.length) timetable[day] = items;
  else delete timetable[day];
  await pool.query(
    `INSERT INTO classroom_teacher_dashboard_settings (user_id, timetable, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (user_id) DO UPDATE SET timetable = EXCLUDED.timetable, updated_at = NOW()`,
    [userId, JSON.stringify(timetable)]);
}

// 학교 기초시간표가 있으면 그 반의 예외로, 없으면 담임의 시간표로 저장한다.
async function saveClassDay(pool, place, { day, periods = [], reset = false, userId }) {
  if (!DAYS.includes(day) || !Array.isArray(periods) || periods.length > 8) return false;
  const { rows, base } = await schoolRows(pool, place);
  if (!rows.length) {
    await saveTeacherDay(pool, place.legacyUserId || userId, day, reset ? [] : periods);
    return true;
  }
  const saved = await pool.query(
    `SELECT overrides FROM classroom_class_timetable_overrides
     WHERE school_id = $1 AND academic_year = $2 AND grade = $3 AND class_number = $4`,
    [place.schoolId, place.year, place.grade, place.classNumber]);
  const overrides = { ...(saved.rows[0]?.overrides || {}) };
  const changes = reset ? {} : diffDay(base[day], periods);
  if (Object.keys(changes).length) overrides[day] = changes;
  else delete overrides[day];
  await pool.query(
    `INSERT INTO classroom_class_timetable_overrides (school_id, academic_year, grade, class_number, overrides, updated_by, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (school_id, academic_year, grade, class_number)
     DO UPDATE SET overrides = EXCLUDED.overrides, updated_by = EXCLUDED.updated_by, updated_at = NOW()`,
    [place.schoolId, place.year, place.grade, place.classNumber, JSON.stringify(overrides), userId]);
  return true;
}

// 맡은 반이 없는 교사(전담 등)는 교사별 시간표에 배정된 수업을 본다.
async function assignedLessons(pool, { schoolId, year, userId }) {
  const [lessons, bells] = await Promise.all([
    pool.query(
      `SELECT grade, class_number, day_of_week, period, subject_name, room_name
       FROM school_master_timetable
       WHERE school_id = $1 AND academic_year = $2 AND teacher_user_id = $3`,
      [schoolId, year, userId]),
    pool.query(
      `SELECT grade, period_times FROM school_bell_schedule WHERE school_id = $1 AND academic_year = $2`,
      [schoolId, year])
  ]);
  const bellByGrade = new Map(bells.rows.map(row => [Number(row.grade), bellTimes(row.period_times)]));
  const timetable = {};
  for (const row of lessons.rows) {
    const day = DAYS[Number(row.day_of_week) - 1];
    const p = Number(row.period);
    if (!day || !(p >= 1 && p <= 8)) continue;
    const times = bellByGrade.get(Number(row.grade))?.[p] || { s: "", e: "" };
    const room = text(row.room_name);
    (timetable[day] ||= []).push({
      p, sub: text(row.subject_name), place: `${row.grade}학년 ${row.class_number}반${room ? ` · ${room}` : ""}`, ...times
    });
  }
  for (const day of Object.keys(timetable)) timetable[day].sort(byPeriod);
  return timetable;
}

module.exports = {
  DAYS,
  applyOverrides,
  assignedLessons,
  cleanDays,
  diffDay,
  loadClassTimetable,
  saveClassDay,
  saveTeacherDay,
  schoolBase,
  teacherTimetable
};
